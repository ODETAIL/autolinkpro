import "./viewInvoice.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { companyName, db } from "../../firebase";
import { Link, useParams } from "react-router-dom";
import { Divider } from "@mui/material";
import { calculateGST, calculateSubtotal } from "../../helpers/helpers";

const ViewInvoice = ({ collectionName }) => {
	const [data, setData] = useState({});
	const { invoiceUid } = useParams();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const docSnap = await getDoc(
					doc(
						db,
						companyName,
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
	}, [collectionName, invoiceUid]);

	return (
		<div className="single">
			<Sidebar />
			<div className="singleContainer">
				<Navbar />
				<div className="top">
					<div className="left">
						<h1 className="title">Information</h1>
						<div className="item">
							<img
								src={
									data?.img
										? data.img
										: "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
								}
								alt=""
								className="itemImg"
							/>
							<div className="details">
								<h1 className="itemTitle">
									{data?.displayName}
								</h1>
								<div className="detailItem">
									<span className="itemKey">Email:</span>
									<span className="itemValue">
										{data?.email}
									</span>
								</div>
								<div className="detailItem">
									<span className="itemKey">Phone:</span>
									<span className="itemValue">
										{data?.phone?.replace(
											/^(\d{3})(\d{3})(\d{4})$/,
											"($1) $2-$3"
										)}
									</span>
								</div>
								<div className="detailItem">
									<span className="itemKey">Address:</span>
									<span className="itemValue">
										{data?.streetAddress1 ||
											data?.streetAddress2}
									</span>
								</div>
								<div className="detailItem">
									<span className="itemKey">Warranty</span>
									<span className="itemValue">
										{data?.city}
									</span>
								</div>
							</div>
						</div>
					</div>
					<div className="right">
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
													{service.code} ()
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
				</div>
			</div>
		</div>
	);
};

export default ViewInvoice;
