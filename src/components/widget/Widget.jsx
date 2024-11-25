import "./widget.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { CreditCardOutlined, SupervisorAccount } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useCompanyContext } from "../../context/CompanyContext";

const Widget = ({ type, collectionName }) => {
	const [amount, setAmount] = useState(0);
	const [diff, setDiff] = useState(0);
	const { selectedCompany } = useCompanyContext();
	let data;

	switch (type) {
		case "employee":
			data = {
				title: "EMPLOYEES",
				isMoney: false,
				link: (
					<Link
						to={`/${collectionName}`}
						style={{ textDecoration: "none" }}
					>
						View all employees
					</Link>
				),
				query: "employees",
				icon: (
					<SupervisorAccount
						className="icon"
						style={{
							color: "crimson",
							backgroundColor: "rgba(255, 0, 0, 0.2)",
						}}
					/>
				),
			};
			break;
		case "customer":
			data = {
				title: "CUSTOMERS",
				isMoney: false,
				link: (
					<Link
						to={`/${collectionName}`}
						style={{ textDecoration: "none" }}
					>
						View all customers
					</Link>
				),
				query: `${selectedCompany}/management/customers`,
				icon: (
					<PersonOutlinedIcon
						className="icon"
						style={{
							backgroundColor: "rgba(0, 128, 0, 0.2)",
							color: "green",
						}}
					/>
				),
			};
			break;
		case "invoice":
			data = {
				title: "INVOICES",
				isMoney: false,
				link: (
					<Link
						to={`/${collectionName}`}
						style={{ textDecoration: "none" }}
					>
						View all invoices
					</Link>
				),
				query: `${selectedCompany}/management/invoices`,
				icon: (
					<CreditCardOutlined
						className="icon"
						style={{
							backgroundColor: "rgba(218, 165, 32, 0.2)",
							color: "goldenrod",
						}}
					/>
				),
			};
			break;
		case "earning":
			data = {
				title: "EARNINGS",
				isMoney: true,
				link: "View net earnings",
				icon: (
					<MonetizationOnOutlinedIcon
						className="icon"
						style={{
							backgroundColor: "rgba(0, 128, 0, 0.2)",
							color: "green",
						}}
					/>
				),
				query: `${selectedCompany}/management/invoices`,
			};
			break;
		default:
			break;
	}

	useEffect(() => {
		const fetchData = async () => {
			const today = new Date();
			const lastMonth = new Date(
				new Date().setMonth(today.getMonth() - 1)
			);
			const prevMonth = new Date(
				new Date().setMonth(today.getMonth() - 2)
			);

			try {
				if (type === "earning") {
					// Calculate total earnings
					const earningsQuery = query(
						collection(db, data.query),
						where("timeStamp", "<=", today),
						where("timeStamp", ">", prevMonth)
					);
					const querySnapshot = await getDocs(earningsQuery);

					let totalEarnings = 0;
					querySnapshot.forEach((doc) => {
						const invoice = doc.data();
						if (Array.isArray(invoice.services)) {
							invoice.services.forEach((service) => {
								if (service.price)
									totalEarnings += parseInt(service.price);
							});
						}
					});

					setAmount(totalEarnings);
				} else {
					// Handle other types by counting documents
					const lastMonthQuery = query(
						collection(db, data.query),
						where("timeStamp", "<=", today),
						where("timeStamp", ">", lastMonth)
					);
					const prevMonthQuery = query(
						collection(db, data.query),
						where("timeStamp", "<=", lastMonth),
						where("timeStamp", ">", prevMonth)
					);

					const [lastMonthData, prevMonthData] = await Promise.all([
						getDocs(lastMonthQuery),
						getDocs(prevMonthQuery),
					]);

					setAmount(lastMonthData.docs.length);
					setDiff(
						prevMonthData.docs.length > 0
							? ((lastMonthData.docs.length -
									prevMonthData.docs.length) /
									prevMonthData.docs.length) *
									100
							: lastMonthData.docs.length > 0
							? 100
							: 0
					);
				}
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, [data.query, selectedCompany, type]);

	return (
		<div className="widget">
			<div className="left">
				<span className="title">{data.title}</span>
				<span className="counter">
					{data.isMoney && "$"} {amount}
				</span>
				<span className="link">{data.link}</span>
			</div>
			<div className="right">
				<div
					className={`percentage ${
						diff < 0 ? "negative" : "positive"
					}`}
				>
					{diff < 0 ? (
						<KeyboardArrowDownIcon />
					) : (
						<KeyboardArrowUpIcon />
					)}
					{diff}%
				</div>
				{data.icon}
			</div>
		</div>
	);
};

export default Widget;
