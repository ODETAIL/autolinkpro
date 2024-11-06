import "./viewInvoice.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Link, useParams } from "react-router-dom";
import { Divider } from "@mui/material";
import { calculateGST, calculateSubtotal } from "../../helpers/helpers";
import { useCompanyContext } from "../../context/CompanyContext";
import InvoiceGenerator from "../../components/invoice/InvoiceGenerator";
import { PDFDownloadLink } from "@react-pdf/renderer";
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
						<PDFDownloadLink
							document={<InvoiceDocument invoiceData={data} />}
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

						<div className="item">
							<div className="details">
								<h1 className="itemTitle">Invoice Preview</h1>
								<div className="preview">
									{data ? (
										<InvoiceGenerator invoiceData={data} />
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
