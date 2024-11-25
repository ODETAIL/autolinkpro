import React, { useEffect, useState } from "react";
import {
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	Area,
	AreaChart,
} from "recharts";
import "./chart-stats.scss";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useCompanyContext } from "../../context/CompanyContext";
import { calculateTotalPrice } from "../../helpers/helpers";

const ChartStats = ({ aspect }) => {
	const [chartData, setChartData] = useState([]);
	const [lastMonthTotal, setLastMonthTotal] = useState(0);
	const [thisMonthTotal, setThisMonthTotal] = useState(0);
	const { selectedCompany } = useCompanyContext();

	useEffect(() => {
		const processInvoices = (querySnapshot) => {
			const data = [];
			querySnapshot.forEach((doc) => {
				const invoice = doc.data();
				const date = new Date(invoice.timeStamp.toDate());
				const day = date.getDate();

				const serviceTotal = calculateTotalPrice(invoice.services);

				const existing = data.find((item) => item.day === day);
				if (existing) {
					existing.amount += serviceTotal;
				} else {
					data.push({ day, amount: serviceTotal });
				}
			});
			return data;
		};

		const fetchData = async () => {
			try {
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

				// Query for invoices with a "paid" status
				const thisMonthQuery = query(
					collection(db, `${selectedCompany}/management/invoices`),
					where("status", "==", "paid"),
					where("timeStamp", ">=", startOfThisMonth)
				);

				const lastMonthQuery = query(
					collection(db, `${selectedCompany}/management/invoices`),
					where("status", "==", "paid"),
					where("timeStamp", ">=", startOfLastMonth),
					where("timeStamp", "<=", endOfLastMonth)
				);

				const [thisMonthDocs, lastMonthDocs] = await Promise.all([
					getDocs(thisMonthQuery),
					getDocs(lastMonthQuery),
				]);

				const thisMonthData = processInvoices(thisMonthDocs);
				const lastMonthData = processInvoices(lastMonthDocs);

				setChartData(mergeData(thisMonthData, lastMonthData));

				// Calculate totals
				setThisMonthTotal(
					thisMonthDocs.docs.reduce(
						(total, doc) =>
							total + calculateTotalPrice(doc.data().services),
						0
					)
				);
				setLastMonthTotal(
					lastMonthDocs.docs.reduce(
						(total, doc) =>
							total + calculateTotalPrice(doc.data().services),
						0
					)
				);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, [selectedCompany]);

	const getHighestPoint = (data, key) => {
		let maxValue = 0;
		let maxDay = null;

		data.forEach((item) => {
			if (item[key] > maxValue) {
				maxValue = item[key];
				maxDay = item.day;
			}
		});

		return maxDay;
	};

	const mergeData = (thisMonth, lastMonth) => {
		const merged = [];
		for (let i = 1; i <= 31; i++) {
			const thisMonthEntry =
				thisMonth.find((item) => item.day === i) || {};
			const lastMonthEntry =
				lastMonth.find((item) => item.day === i) || {};

			merged.push({
				day: i,
				thisMonth: thisMonthEntry.amount || 0,
				lastMonth: lastMonthEntry.amount || 0,
			});
		}
		return merged;
	};

	return (
		<div className="customer-fulfillment-chart">
			<h3 className="title">Customer Fulfillment</h3>
			<div className="chart-container">
				<ResponsiveContainer width="100%" aspect={aspect}>
					<AreaChart
						data={chartData}
						margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
					>
						<XAxis
							dataKey="day"
							tickFormatter={(value) =>
								value % 3 === 1 ? value : ""
							}
						/>
						<YAxis />
						<Tooltip />
						<Area
							type="monotone"
							dataKey="lastMonth"
							stackId="1"
							stroke="#8884d8"
							fill="#8884d8"
							fillOpacity={0.3}
							dot={(dotProps) => {
								const highestPointDay = getHighestPoint(
									chartData,
									"lastMonth"
								);
								if (
									dotProps.payload.day % 3 === 1 ||
									dotProps.payload.day === highestPointDay
								) {
									return (
										<circle
											cx={dotProps.cx}
											cy={dotProps.cy}
											r={3}
											stroke="#8884d8"
											strokeWidth={1}
											fill="#8884d8"
										/>
									);
								}
								return null;
							}}
						/>
						<Area
							type="monotone"
							dataKey="thisMonth"
							stackId="2"
							stroke="#82ca9d"
							fill="#82ca9d"
							fillOpacity={0.3}
							dot={(dotProps) => {
								const highestPointDay = getHighestPoint(
									chartData,
									"thisMonth"
								);
								if (
									dotProps.payload.day % 3 === 1 ||
									dotProps.payload.day === highestPointDay
								) {
									return (
										<circle
											cx={dotProps.cx}
											cy={dotProps.cy}
											r={3}
											stroke="#82ca9d"
											strokeWidth={1}
											fill="#82ca9d"
										/>
									);
								}
								return null;
							}}
						/>
					</AreaChart>
				</ResponsiveContainer>
			</div>
			<div className="summary">
				<div className="summary-item">
					<span className="dot" style={{ background: "#8884d8" }} />
					<span>Last Month</span>
					<span>${lastMonthTotal.toLocaleString()}</span>
				</div>
				<div className="summary-item">
					<span className="dot" style={{ background: "#82ca9d" }} />
					<span>This Month</span>
					<span>${thisMonthTotal.toLocaleString()}</span>
				</div>
			</div>
		</div>
	);
};

export default ChartStats;
