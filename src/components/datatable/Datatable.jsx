import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
	collection,
	doc,
	onSnapshot,
	writeBatch,
	getDoc,
} from "firebase/firestore";
import { db, companyName } from "../../firebase";
import { invoiceCustomerViewColumns } from "../../datatablesource";

const Datatable = ({ collectionName, columns, customerId }) => {
	const [data, setData] = useState([]);
	useEffect(() => {
		// LISTEN (REALTIME)
		const docRef = customerId
			? `${companyName}/management/${collectionName}/${customerId}/invoices`
			: `${companyName}/management/${collectionName}`;
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
	}, [collectionName, customerId]);

	const handleDelete = async (id) => {
		try {
			const batch = writeBatch(db);

			// Reference to the document in the global collection
			const globalDocRef = doc(
				db,
				companyName,
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
					companyName,
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
			/>
		</div>
	);
};

export default Datatable;
