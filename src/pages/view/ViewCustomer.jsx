import "./view.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { companyName, db } from "../../firebase";
import { Link, useParams } from "react-router-dom";
import List from "../list/List";
import { invoiceColumns } from "../../datatablesource";

const ViewCustomer = ({ collectionName }) => {
	const [data, setData] = useState({});
	const { customerId } = useParams();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const docSnap = await getDoc(
					doc(
						db,
						companyName,
						"management",
						collectionName,
						customerId
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
	}, [collectionName, customerId]);

	return (
		<div className="single">
			<Sidebar />
			<div className="singleContainer">
				<Navbar />
				<div className="top">
					<div className="left">
						<Link
							to={`/${collectionName}/edit/${customerId}`}
							style={{ textDecoration: "none" }}
						>
							<div className="editButton">Edit</div>
						</Link>
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
								<div className="titleWrapper">
									<h1 className="itemTitle">
										{data?.displayName}
									</h1>
									<span className="companyTitle">
										{data?.companyName}
									</span>
								</div>

								<div className="detailWrapper">
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
								</div>
								<div className="detailWrapper">
									<div className="detailItem">
										<span className="itemKey">
											Address:
										</span>
										<span className="itemValue">
											{data?.streetAddress1}
										</span>
									</div>
									<div className="detailItem">
										<span className="itemKey">City:</span>
										<span className="itemValue">
											{data?.city}
										</span>
									</div>
								</div>
								<div className="detailItem">
									<span className="itemKey">Notes:</span>
									<span className="itemValue">
										{data?.notes}
									</span>
								</div>
							</div>
						</div>
					</div>
					<div className="right">
						<Chart
							aspect={3 / 1}
							title="User Spending ( Last 6 Months)"
						/>
					</div>
				</div>
				<div className="bottom">
					<h1 className="title">Last Transactions</h1>
					{/* <List customerId={customerId} /> */}
					<List
						collectionName={collectionName}
						columns={invoiceColumns}
						customerId={customerId}
					/>
				</div>
			</div>
		</div>
	);
};

export default ViewCustomer;
