import "./widget.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { DirectionsCarFilledOutlined } from "@mui/icons-material";
import { useCompanyContext } from "../../context/CompanyContext";

const VehicleWidget = ({ type }) => {
	const [amount, setAmount] = useState(0);
	const [diff, setDiff] = useState(0);
	const { selectedCompany } = useCompanyContext();
	let data;

	switch (type) {
		case "Suv":
			data = {
				title: "# OF SUVS",
				isMoney: false,
				query: `${selectedCompany}/management/invoices`,
				icon: (
					<DirectionsCarFilledOutlined
						className="icon"
						style={{
							backgroundColor: "rgba(218, 165, 32, 0.2)",
							color: "gray",
						}}
					/>
				),
			};
			break;

		case "Truck":
			data = {
				title: "# OF TRUCKS",
				isMoney: false,
				query: `${selectedCompany}/management/invoices`,
				icon: (
					<DirectionsCarFilledOutlined
						className="icon"
						style={{
							backgroundColor: "rgba(0, 128, 255, 0.2)",
							color: "gray",
						}}
					/>
				),
			};
			break;

		case "Sedan":
			data = {
				title: "# OF SEDANS",
				isMoney: false,
				query: `${selectedCompany}/management/invoices`,
				icon: (
					<DirectionsCarFilledOutlined
						className="icon"
						style={{
							backgroundColor: "rgba(0, 255, 128, 0.2)",
							color: "gray",
						}}
					/>
				),
			};
			break;

		case "Minivan":
			data = {
				title: "# OF MINIVANS",
				isMoney: false,
				query: `${selectedCompany}/management/invoices`,
				icon: (
					<DirectionsCarFilledOutlined
						className="icon"
						style={{
							backgroundColor: "rgba(255, 128, 0, 0.2)",
							color: "gray",
						}}
					/>
				),
			};
			break;

		case "Convertible":
			data = {
				title: "# OF CONVERTIBLES",
				isMoney: false,
				query: `${selectedCompany}/management/invoices`,
				icon: (
					<DirectionsCarFilledOutlined
						className="icon"
						style={{
							backgroundColor: "rgba(255, 0, 255, 0.2)",
							color: "gray",
						}}
					/>
				),
			};
			break;

		case "Hatchback":
			data = {
				title: "# OF HATCHBACKS",
				isMoney: false,
				query: `${selectedCompany}/management/invoices`,
				icon: (
					<DirectionsCarFilledOutlined
						className="icon"
						style={{
							backgroundColor: "rgba(128, 128, 128, 0.2)",
							color: "gray",
						}}
					/>
				),
			};
			break;

		default:
			break;
	}

	useEffect(() => {
		const fetchData = async () => {
			const today = new Date();
			const startOfThisMonth = new Date(
				today.getFullYear(),
				today.getMonth(),
				1
			);
			const startOfLastMonth = new Date(
				today.getFullYear(),
				today.getMonth() - 1,
				1
			);
			const endOfLastMonth = new Date(
				today.getFullYear(),
				today.getMonth(),
				0
			);

			try {
				// Query data for this month and last month
				const thisMonthQuery = query(
					collection(db, data.query),
					where("timeStamp", ">=", startOfThisMonth)
				);
				const lastMonthQuery = query(
					collection(db, data.query),
					where("timeStamp", ">=", startOfLastMonth),
					where("timeStamp", "<=", endOfLastMonth)
				);

				const [thisMonthData, lastMonthData] = await Promise.all([
					getDocs(thisMonthQuery),
					getDocs(lastMonthQuery),
				]);

				// Count the number of jobs for the selected type
				const countJobs = (snapshot) => {
					let count = 0;
					snapshot.forEach((doc) => {
						const invoice = doc.data();
						if (Array.isArray(invoice.services)) {
							invoice.services.forEach((service) => {
								if (
									service.vtype?.toLowerCase() ===
									type.toLowerCase()
								) {
									count++;
								}
							});
						}
					});
					return count;
				};

				const thisMonthCount = countJobs(thisMonthData);
				const lastMonthCount = countJobs(lastMonthData);

				setAmount(thisMonthCount);
				setDiff(
					lastMonthCount > 0
						? ((thisMonthCount - lastMonthCount) / lastMonthCount) *
								100
						: thisMonthCount > 0
						? 100
						: 0
				);
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

export default VehicleWidget;
