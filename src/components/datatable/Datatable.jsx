import "./datatable.scss";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
	collection,
	doc,
	onSnapshot,
	writeBatch,
	getDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { invoiceCustomerViewColumns } from "../../datatablesource";
import { useCompanyContext } from "../../context/CompanyContext";

const Datatable = ({ collectionName, columns, customerId }) => {
	const [data, setData] = useState([]);
	const { selectedCompany } = useCompanyContext();

	useEffect(() => {
		// LISTEN (REALTIME)
		const isEmployeeCollection = collectionName === "employees"; // Assume "employees" is the global collection name
		const docRef = isEmployeeCollection
			? "employees" // Global path for employees
			: customerId
			? `${selectedCompany}/management/${collectionName}/${customerId}/invoices` // Company-specific path for customer invoices
			: `${selectedCompany}/management/${collectionName}`; // Company-specific path for other collections
		const unsub = onSnapshot(
			collection(db, docRef),
			(snapShot) => {
				let list = [];
				snapShot.docs.forEach((doc) => {
					list.push({ id: doc.id, ...doc.data() });
				});
				setData(list);
			},
			(error) => {
				console.log(error);
			}
		);

		return () => {
			unsub();
		};
	}, [collectionName, customerId, selectedCompany]);

	const handleDelete = async (id) => {
		try {
			const batch = writeBatch(db);

			// Reference to the document in the global collection
			const globalDocRef = doc(
				db,
				selectedCompany,
				"management",
				collectionName,
				id
			);

			// This condition is just for getting customerId using invoiceId
			if (collectionName !== "customers") {
				// Fetch the invoice to get the customerId
				const docSnap = await getDoc(globalDocRef);
				if (!docSnap.exists()) {
					console.error("Invoice document not found");
					return;
				}

				const { customerId } = docSnap.data();

				if (!customerId) {
					console.error("Customer ID not found in invoice document");
					return;
				}

				// Reference to the document in the customer's subcollection
				const customerDocRef = doc(
					db,
					selectedCompany,
					"management",
					"customers",
					customerId,
					collectionName,
					id
				);

				batch.delete(customerDocRef); // Delete from customer's subcollection
			}

			// Batch delete for both global dpcuments
			batch.delete(globalDocRef); // Delete from global collection

			// Commit the batch delete
			await batch.commit();

			// Update local state
			setData(data.filter((item) => item.id !== id));
		} catch (err) {
			console.error("Error deleting document:", err);
		}
	};

	const actionColumn = [
		{
			field: "action",
			headerName: "Action",
			width: 200,
			renderCell: (params) => {
				const currentUserAccessLevel = params.row.access;

				if (
					currentUserAccessLevel === "admin" ||
					currentUserAccessLevel === "manager" ||
					!currentUserAccessLevel
				) {
					return (
						<div className="cellAction">
							<Link
								to={`/${collectionName}/view/${params.row.id}`}
								style={{ textDecoration: "none" }}
							>
								<div className="viewButton">View</div>
							</Link>
							<Link
								to={`/${collectionName}/edit/${params.row.id}`}
								style={{ textDecoration: "none" }}
							>
								<div className="editButton">Edit</div>
							</Link>
							<div
								className="deleteButton"
								onClick={() => handleDelete(params.row.id)}
							>
								Delete
							</div>
						</div>
					);
				} else {
					<Link
						to={`/${collectionName}/view/${params.row.id}`}
						style={{ textDecoration: "none" }}
					>
						<div className="viewButton">View</div>
					</Link>;
				}
			},
		},
	];

	const customerViewColumns = customerId
		? invoiceCustomerViewColumns.concat(actionColumn)
		: columns.concat(actionColumn);
	return (
		<div className="datatable">
			{!customerId && (
				<div className="datatableTitle">
					Add New{" "}
					{collectionName.charAt(0).toUpperCase() +
						collectionName.slice(1)}
					<Link to={`/${collectionName}/new`} className="link">
						Add New
					</Link>
				</div>
			)}

			<DataGrid
				className="datagrid"
				rows={data}
				columns={customerViewColumns}
				pageSize={9}
				rowsPerPageOptions={[9]}
				checkboxSelection
				components={{
					Toolbar: GridToolbar,
				}}
				componentsProps={{
					toolbar: {
						sx: {
							// borderBottom: "1px solid #ddd",

							"& .MuiButtonBase-root": {
								color: "lightgray",
								fontWeight: "bold",
								// padding: "5px 10px",
								transition: "background-color 0.2s ease",
								"&:hover": {
									backgroundColor: "rgba(0, 0, 139, 0.2)",
								},
							},

							"& .MuiSvgIcon-root": {
								color: "lightgray",
							},

							"& .MuiInputBase-root": {
								color: "lightgray",
								padding: "6px",
								borderRadius: "5px",
								backgroundColor: "#ffffff",
								border: "1px solid #ddd",
								"&:hover": {
									borderColor: "green",
								},
							},
						},
					},
				}}
			/>
		</div>
	);
};

export default Datatable;
