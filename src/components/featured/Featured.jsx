import "./featured.scss";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase"; // Adjust path as needed
import { useCompanyContext } from "../../context/CompanyContext";

const Featured = () => {
	const [totalRevenue, setTotalRevenue] = useState(0);
	const [todaySales, setTodaySales] = useState(0);
	const [lastWeekRevenue, setLastWeekRevenue] = useState(0);
	const [lastMonthRevenue, setLastMonthRevenue] = useState(0);
	const { selectedCompany } = useCompanyContext();

	useEffect(() => {
		const fetchData = async () => {
			const today = new Date();
			const startOfToday = new Date(today.setHours(0, 0, 0, 0));
			const startOfLastWeek = new Date(
				today.setDate(today.getDate() - 7)
			);
			const startOfLastMonth = new Date(
				today.setMonth(today.getMonth() - 1)
			);

			// Query for all invoices in the selected company's management invoices collection
			const invoicesRef = collection(
				db,
				`${selectedCompany}/management/invoices`
			);
			const allInvoicesQuery = query(invoicesRef);
			const todayInvoicesQuery = query(
				invoicesRef,
				where("timeStamp", ">=", startOfToday)
			);
			const lastWeekInvoicesQuery = query(
				invoicesRef,
				where("timeStamp", ">=", startOfLastWeek)
			);
			const lastMonthInvoicesQuery = query(
				invoicesRef,
				where("timeStamp", ">=", startOfLastMonth)
			);

			try {
				// Fetch all invoices for total revenue calculation
				const allInvoicesSnapshot = await getDocs(allInvoicesQuery);
				const todayInvoicesSnapshot = await getDocs(todayInvoicesQuery);
				const lastWeekInvoicesSnapshot = await getDocs(
					lastWeekInvoicesQuery
				);
				const lastMonthInvoicesSnapshot = await getDocs(
					lastMonthInvoicesQuery
				);

				// Calculate total revenue
				let total = 0;
				allInvoicesSnapshot.forEach((doc) => {
					const invoice = doc.data();
					if (Array.isArray(invoice.services)) {
						invoice.services.forEach((service) => {
							if (service.price) total += parseInt(service.price);
						});
					}
				});
				setTotalRevenue(total);

				// Calculate today's sales
				let todayTotal = 0;
				todayInvoicesSnapshot.forEach((doc) => {
					const invoice = doc.data();
					if (Array.isArray(invoice.services)) {
						invoice.services.forEach((service) => {
							if (service.price)
								todayTotal += parseInt(service.price);
						});
					}
				});
				setTodaySales(todayTotal);

				// Calculate last week's revenue
				let lastWeekTotal = 0;
				lastWeekInvoicesSnapshot.forEach((doc) => {
					const invoice = doc.data();
					if (Array.isArray(invoice.services)) {
						invoice.services.forEach((service) => {
							if (service.price)
								lastWeekTotal += parseInt(service.price);
						});
					}
				});
				setLastWeekRevenue(lastWeekTotal);

				// Calculate last month's revenue
				let lastMonthTotal = 0;
				lastMonthInvoicesSnapshot.forEach((doc) => {
					const invoice = doc.data();
					if (Array.isArray(invoice.services)) {
						invoice.services.forEach((service) => {
							if (service.price)
								lastMonthTotal += parseInt(service.price);
						});
					}
				});
				setLastMonthRevenue(lastMonthTotal);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, [selectedCompany]);

	return (
		<div className="featured">
			<div className="top">
				<h1 className="title">Total Revenue</h1>
				<MoreVertIcon fontSize="small" />
			</div>
			<div className="bottom">
				<div className="featuredChart">
					<CircularProgressbar
						value={(todaySales / totalRevenue) * 100}
						text={`${(todaySales / totalRevenue) * 100}%`}
						strokeWidth={5}
					/>
				</div>
				<p className="title">Total sales made today</p>
				<p className="amount">${todaySales}</p>
				<p className="desc">
					Previous transactions processing. Last payments may not be
					included.
				</p>
				<div className="summary">
					<div className="item">
						<div className="itemTitle">Total Revenue</div>
						<div
							className={`itemResult ${
								totalRevenue >= lastMonthRevenue
									? "positive"
									: "negative"
							}`}
						>
							{totalRevenue >= lastMonthRevenue ? (
								<KeyboardArrowUpOutlinedIcon fontSize="small" />
							) : (
								<KeyboardArrowDownIcon fontSize="small" />
							)}
							<div className="resultAmount">${totalRevenue}</div>
						</div>
					</div>

					<div className="item">
						<div className="itemTitle">Last Week</div>
						<div
							className={`itemResult ${
								lastWeekRevenue >= lastMonthRevenue
									? "positive"
									: "negative"
							}`}
						>
							{lastWeekRevenue >= lastMonthRevenue ? (
								<KeyboardArrowUpOutlinedIcon fontSize="small" />
							) : (
								<KeyboardArrowDownIcon fontSize="small" />
							)}
							<div className="resultAmount">
								${lastWeekRevenue}
							</div>
						</div>
					</div>

					<div className="item">
						<div className="itemTitle">Last Month</div>
						<div
							className={`itemResult ${
								lastMonthRevenue >= totalRevenue
									? "positive"
									: "negative"
							}`}
						>
							{lastMonthRevenue >= totalRevenue ? (
								<KeyboardArrowUpOutlinedIcon fontSize="small" />
							) : (
								<KeyboardArrowDownIcon fontSize="small" />
							)}
							<div className="resultAmount">
								${lastMonthRevenue}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Featured;
