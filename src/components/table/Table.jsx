import "./table.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { toCamelCase } from "../../helpers/helpers";
import { useCompanyContext } from "../../context/CompanyContext";
import {
	replacementEligibleServices,
	vehicleType,
} from "../../helpers/defaultData";

const List = ({ listType }) => {
	const [data, setData] = useState([]);
	const { selectedCompany } = useCompanyContext();
	const types =
		listType === "vehicles" ? vehicleType : replacementEligibleServices;

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
				const dataList = await Promise.all(
					types.map(async (type) => {
						const thisMonthQuery = query(
							collection(
								db,
								`${selectedCompany}/management/invoices`
							),
							where("timeStamp", ">=", startOfThisMonth)
						);
						const lastMonthQuery = query(
							collection(
								db,
								`${selectedCompany}/management/invoices`
							),
							where("timeStamp", ">=", startOfLastMonth),
							where("timeStamp", "<=", endOfLastMonth)
						);

						const [thisMonthData, lastMonthData] =
							await Promise.all([
								getDocs(thisMonthQuery),
								getDocs(lastMonthQuery),
							]);

						const countItems = (snapshot) => {
							let count = 0;
							snapshot.forEach((doc) => {
								const invoice = doc.data();
								if (Array.isArray(invoice.services)) {
									invoice.services.forEach((service) => {
										if (
											listType === "vehicles" &&
											service.vtype?.toLowerCase() ===
												toCamelCase(type)
										) {
											count++;
										}

										if (
											listType === "job" &&
											service.name?.toLowerCase() ===
												toCamelCase(type)
										) {
											count++;
										}
									});
								}
							});
							return count;
						};

						const thisMonthCount = countItems(thisMonthData);
						const lastMonthCount = countItems(lastMonthData);

						return {
							type,
							amount: thisMonthCount,
							lastMonth: lastMonthCount,
							today: thisMonthCount,
						};
					})
				);

				setData(dataList);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, [selectedCompany, listType, types]);

	return (
		<TableContainer component={Paper} className="table">
			<div className="listTitle">
				{listType === "vehicles"
					? "Vehicle Types Overview"
					: "Job Types Overview"}
			</div>
			<Table sx={{ minWidth: 450 }} aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell className="tableHeaderCell">Type</TableCell>
						<TableCell className="tableHeaderCell">
							Amount
						</TableCell>
						<TableCell className="tableHeaderCell">Today</TableCell>
						<TableCell className="tableHeaderCell">
							Last Month
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{data.map((item) => (
						<TableRow key={item.type}>
							<TableCell className="tableCell">
								{item.type}
							</TableCell>
							<TableCell className="tableCell">
								{item.amount}
							</TableCell>
							<TableCell className="tableCell">
								{item.today}
							</TableCell>
							<TableCell className="tableCell">
								{item.lastMonth}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default List;
