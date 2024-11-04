import "./chart.scss";
import {
	AreaChart,
	Area,
	XAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase"; // Adjust this path based on your setup
import { useCompanyContext } from "../../context/CompanyContext";

const Chart = ({ aspect, title }) => {
	const [chartData, setChartData] = useState([]);
	const { selectedCompany } = useCompanyContext();

	useEffect(() => {
		const fetchChartData = async () => {
			const monthlyData = [
				{ name: "January", Total: 0 },
				{ name: "February", Total: 0 },
				{ name: "March", Total: 0 },
				{ name: "April", Total: 0 },
				{ name: "May", Total: 0 },
				{ name: "June", Total: 0 },
				{ name: "July", Total: 0 },
				{ name: "August", Total: 0 },
				{ name: "September", Total: 0 },
				{ name: "October", Total: 0 },
				{ name: "November", Total: 0 },
				{ name: "December", Total: 0 },
			];

			try {
				const invoicesRef = collection(
					db,
					`${selectedCompany}/management/invoices`
				);
				const currentYear = new Date().getFullYear();

				const q = query(
					invoicesRef,
					where("timeStamp", ">=", new Date(currentYear, 0, 1)),
					where("timeStamp", "<", new Date(currentYear + 1, 0, 1))
				);

				const querySnapshot = await getDocs(q);

				querySnapshot.forEach((doc) => {
					const invoice = doc.data();
					const timestamp = invoice.timeStamp?.toDate(); // Convert Firestore timestamp to JS Date
					const month = timestamp ? timestamp.getMonth() : null;

					if (month !== null && Array.isArray(invoice.services)) {
						let monthlyTotal = 0;
						invoice.services.forEach((service) => {
							if (service.price)
								monthlyTotal += parseInt(service.price);
						});
						monthlyData[month].Total += monthlyTotal;
					}
				});

				setChartData(monthlyData);
			} catch (error) {
				console.error("Error fetching chart data:", error);
			}
		};

		fetchChartData();
	}, [selectedCompany]);

	return (
		<div className="chart">
			<div className="title">{title}</div>
			<ResponsiveContainer width="100%" aspect={aspect}>
				<AreaChart
					data={chartData}
					margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
				>
					<defs>
						<linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
							<stop
								offset="5%"
								stopColor="#8884d8"
								stopOpacity={0.8}
							/>
							<stop
								offset="95%"
								stopColor="#8884d8"
								stopOpacity={0}
							/>
						</linearGradient>
					</defs>
					<XAxis dataKey="name" stroke="gray" />
					<CartesianGrid
						strokeDasharray="3 3"
						className="chartGrid"
					/>
					<Tooltip />
					<Area
						type="monotone"
						dataKey="Total"
						stroke="#8884d8"
						fillOpacity={1}
						fill="url(#total)"
					/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
};

export default Chart;
