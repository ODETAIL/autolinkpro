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
import { companyName, db } from "../../firebase";
import { calculateSubtotal } from "../../helpers/helpers";

const List = ({ customerId }) => {
	const [invoices, setInvoices] = useState([]);

	useEffect(() => {
		// Function to fetch invoices for a specific customer
		const fetchInvoices = async () => {
			try {
				// Reference to the global invoice collection
				const invoicesRef = collection(
					db,
					`${companyName}/management/invoices`
				);

				// Query invoices where customerId matches the provided customerId
				const q = query(
					invoicesRef,
					where("customerId", "==", customerId)
				);

				// Execute the query
				const querySnapshot = await getDocs(q);

				// Map over the results and store them in the invoices state
				const fetchedInvoices = querySnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));

				setInvoices(fetchedInvoices);
			} catch (error) {
				console.error("Error fetching invoices:", error);
			}
		};

		// Only fetch if customerId is provided
		if (customerId) {
			fetchInvoices();
		}
	}, [customerId]);
	return (
		<TableContainer component={Paper} className="table">
			<Table sx={{ minWidth: 650 }} aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell className="tableCell">Invoice ID</TableCell>
						<TableCell className="tableCell">Customer</TableCell>
						<TableCell className="tableCell">Date</TableCell>
						<TableCell className="tableCell">Amount</TableCell>
						<TableCell className="tableCell">
							Payment Method
						</TableCell>
						<TableCell className="tableCell">Status</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{invoices.map((row) => (
						<TableRow key={row.id}>
							<TableCell className="tableCell">
								{row.invoiceId}
							</TableCell>
							<TableCell className="tableCell">
								{row.displayName}
							</TableCell>
							<TableCell className="tableCell">
								{row.timeStamp
									?.toDate()
									.toLocaleDateString("en-US", {
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
							</TableCell>
							<TableCell className="tableCell">
								${calculateSubtotal(row.services)}
							</TableCell>
							<TableCell className="tableCell">
								{row.payment}
							</TableCell>
							<TableCell className="tableCell">
								<span className={`status ${row.status}`}>
									{row.status}
								</span>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default List;
