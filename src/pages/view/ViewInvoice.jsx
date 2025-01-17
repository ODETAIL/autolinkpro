import "./viewInvoice.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Link, useParams } from "react-router-dom";
import { Divider } from "@mui/material";
import emailjs from "@emailjs/browser";
import {
	calculateGST,
	calculateSubtotal,
	calculateTotalPrice,
	formatDate,
	formatPhoneNumber,
	generateServicesTable,
	saveInvoiceToFirebase,
} from "../../helpers/helpers";
import { useCompanyContext } from "../../context/CompanyContext";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import InvoiceDocument from "../../components/invoice/InvoiceDocument";

const ViewInvoice = ({ collectionName }) => {
	const [data, setData] = useState({});
	const { invoiceUid } = useParams();
	const { selectedCompany } = useCompanyContext();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const docSnap = await getDoc(
					doc(
						db,
						selectedCompany,
						"management",
						collectionName,
						invoiceUid
					)
				);
				if (docSnap.exists()) {
					setData(docSnap.data());
				} else {
					console.log("No such document!");
					setData({ error: "Document not found" });
				}
			} catch (error) {
				console.error("Error fetching document: ", error);
			}
		};

		fetchData();
	}, [collectionName, invoiceUid, selectedCompany]);

	const handleSaveToFirebase = async () => {
		try {
			const url = await saveInvoiceToFirebase(data, selectedCompany);
			return url;
		} catch (error) {
			console.error("Error saving invoice to Firebase:", error);
		}
	};

	const sendInvoiceEmail = async (pdfUrl) => {
		try {
			// Replace these with your EmailJS details
			const serviceID =
				selectedCompany === "odetail"
					? process.env.REACT_APP_ODETAIL_SERVICE_ID
					: process.env.REACT_APP_AZTEC_SERVICE_ID;
			const templateID = process.env.REACT_APP_TEMPLATE_ID;
			const userID = process.env.REACT_APP_EMAIL_PUBLIC_KEY;

			const servicesTable = generateServicesTable(data.services);
			const subtotal = calculateSubtotal(data?.services || []); // Ensure fallback for null services
			const gst = calculateGST(subtotal); // Pass subtotal to calculateGST

			// Prepare the data for EmailJS
			const emailParams = {
				date: formatDate(new Date()),
				due_date: formatDate(
					data?.timeStamp?.toDate().toLocaleDateString("en-US", {
						year: "numeric",
						month: "long",
						day: "numeric",
					})
				),
				customer_name: data.displayName,
				customer_email: data.email,
				to_email: data.email,
				company_name:
					selectedCompany === "odetail"
						? "O Detail"
						: "Aztec Auto Glass Ltd",
				company_email:
					selectedCompany === "odetail"
						? "invoices@odetail.ca"
						: "invoices@aztecautoglass.ca",
				company_phone:
					selectedCompany === "odetail"
						? formatPhoneNumber("5873662254")
						: formatPhoneNumber("5879667636"),
				invoice_number: String(data.invoiceId).padStart(6, "0"),
				services_table: servicesTable,
				total_due: calculateTotalPrice(data?.services).toFixed(2),
				subtotal: subtotal.toFixed(2),
				gst: gst,
				pdf_link: pdfUrl,
				gst_number:
					selectedCompany === "odetail"
						? "723288155RT0001"
						: "792765935RT0001",
			};

			// Send the email
			const result = await emailjs.send(
				serviceID,
				templateID,
				emailParams,
				userID
			);

			console.log("Email sent successfully:", result);
			alert("Invoice email sent successfully!");
		} catch (error) {
			console.error("Error sending email:", error);
			alert("Failed to send invoice email. Please try again.");
		}
	};

	const handleSendInvoiceEmail = async () => {
		try {
			const pdfUrl = await handleSaveToFirebase();
			if (data?.status !== "draft") {
				await sendInvoiceEmail(pdfUrl);
			}
		} catch (error) {
			console.error("Error fetching invoice data:", error);
		}
	};

	return (
		<div className="single">
			<Sidebar />
			<div className="singleContainer">
				<Navbar />
				<div className="top">
					<div className="left">
						<Link
							to={`/${collectionName}/edit/${invoiceUid}`}
							style={{ textDecoration: "none" }}
						>
							<div className="editButton">Edit</div>
						</Link>
						<div className="item">
							<div className="details">
								<h1 className="itemTitle">
									Invoice #
									{String(data?.invoiceId).padStart(6, "0")}
								</h1>
								<div className="detailItem">
									<span className="itemKey">
										Invoice date
									</span>
									<span className="itemValue">
										{data?.timeStamp
											?.toDate()
											.toLocaleDateString("en-US", {
												year: "numeric",
												month: "long",
												day: "numeric",
											})}
									</span>
								</div>
								<div className="detailItem">
									<span className="itemKey">Customer</span>
									<span className="itemValue">
										{data?.displayName}
									</span>
									<span className="itemValue">
										{data?.email}
									</span>
								</div>
								<Divider className="divider" />
								<div className="detailItem">
									{data?.services?.map((service, index) => (
										<div
											className="serviceContainer"
											key={index}
										>
											<div className="serviceNameContainer">
												<span className="serviceItemKey">
													{service.vtype}{" "}
													{service.name}
												</span>
												<span className="serviceItemValue">
													{service.code} (
													{service.itype})
												</span>
												<span className="serviceItemValue">
													{service.notes}
												</span>
											</div>

											<span className="itemKey">
												${service.price}
											</span>
										</div>
									))}
								</div>
								<Divider className="divider" />
								<div className="detailItem">
									<div className="serviceContainer">
										<span className="subtotalPrice">
											Subtotal
										</span>
										<span className="subtotalPrice">
											${calculateSubtotal(data?.services)}
										</span>
									</div>
									<div className="serviceContainer">
										<span className="subtotalPrice">
											GST
										</span>
										<span className="subtotalPrice">
											$
											{calculateGST(
												calculateSubtotal(
													data?.services
												)
											)}
										</span>
									</div>
								</div>

								<Divider className="divider" />
								<div className="detailItem">
									<div className="serviceContainer">
										<span className="totalPrice">
											Total
										</span>
										<span className="totalPrice">
											$
											{(
												parseFloat(
													calculateSubtotal(
														data?.services
													)
												) +
												parseFloat(
													calculateGST(
														calculateSubtotal(
															data?.services
														)
													)
												)
											).toFixed(2)}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="right">
						<div className="buttonsWrapper">
							<PDFDownloadLink
								document={
									<InvoiceDocument invoiceData={data} />
								}
								fileName={`invoice_${data.invoiceId}.pdf`}
							>
								{({ loading }) =>
									loading ? (
										"Preparing document..."
									) : (
										<div className="downloadButton">
											Download
										</div>
									)
								}
							</PDFDownloadLink>
							<div
								className="saveButton"
								onClick={handleSaveToFirebase}
							>
								Save
							</div>
							<div
								className="sendButton"
								onClick={handleSendInvoiceEmail}
							>
								Send
							</div>
						</div>

						<div className="item">
							<div className="details">
								<h1 className="itemTitle">Invoice Preview</h1>
								<div className="preview">
									{data ? (
										<PDFViewer
											style={{
												width: "100%",
												height: "500px",
											}}
										>
											<InvoiceDocument
												invoiceData={data}
												selectedCompany={
													selectedCompany
												}
											/>
										</PDFViewer>
									) : null}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ViewInvoice;
