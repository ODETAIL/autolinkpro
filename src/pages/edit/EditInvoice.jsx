import "./edit.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useEffect, useState } from "react";
import { doc, getDoc, serverTimestamp, writeBatch } from "firebase/firestore";
import { db, companyName } from "../../firebase";
import { useNavigate, useParams } from "react-router-dom";
import { Chip, IconButton } from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";

const EditInvoice = ({ inputs, title, collectionName }) => {
	const [data, setData] = useState({});
	const [customerName, setCustomerName] = useState(""); // Store customer name
	const [newService, setNewService] = useState({
		vtype: "",
		name: "",
		code: "",
		price: "",
	});
	const [services, setServices] = useState([]);
	const [isCustomService, setIsCustomService] = useState(false);
	const { invoiceUid } = useParams();
	const navigate = useNavigate();

	const vehicleType = ["Suv", "Truck", "Sedan", "Minivan", "Convertible"];
	const serviceType = [
		"Add Custom",
		"Windshield",
		"Door Glass",
		"Back Glass",
		"Sunroof",
		"Mirror",
		"Quarter Glass",
		"Chip Subscription",
		"Warranty",
	];

	useEffect(() => {
		const fetchData = async () => {
			try {
				const docRef = doc(
					db,
					companyName,
					"management",
					collectionName,
					invoiceUid
				);
				const docSnap = await getDoc(docRef);

				if (docSnap.exists()) {
					const currentInvoiceData = docSnap.data();
					setData(currentInvoiceData);
					setServices(currentInvoiceData.services);
					setCustomerName(currentInvoiceData.displayName);
				} else {
					setData({ error: "Document not found" });
				}
			} catch (error) {
				console.error("Error fetching document: ", error);
			}
		};

		fetchData();
	}, [collectionName, invoiceUid]);

	const handleInput = (e) => {
		const id = e.target.id;
		const value = e.target.value;

		setData((prevData) => ({
			...prevData,
			[id]: value,
		}));
	};

	const handleEdit = async (e) => {
		e.preventDefault();
		try {
			const docRef = doc(
				db,
				companyName,
				"management",
				collectionName,
				invoiceUid
			);

			// Fetch current invoice to get customerId
			const docSnap = await getDoc(docRef);
			if (!docSnap.exists()) {
				console.error("Invoice document not found");
				return;
			}
			const currentInvoiceData = docSnap.data();
			const customerId = currentInvoiceData.customerId; // Assuming customerId is stored in the document

			if (!customerId) {
				console.error("Customer ID not found in invoice document");
				return;
			}

			// Prepare batch update to apply changes to both documents
			const batch = writeBatch(db);

			// Reference for the global invoices collection document
			const globalInvoiceRef = doc(
				db,
				companyName,
				"management",
				collectionName,
				invoiceUid
			);

			// Reference for the customer-specific invoices subcollection document
			const customerInvoiceRef = doc(
				db,
				companyName,
				"management",
				"customers",
				customerId,
				collectionName,
				invoiceUid
			);

			// Updated invoice data
			const updatedInvoiceData = {
				...data,
				services,
				timeStamp: serverTimestamp(),
			};

			// Update both documents in batch
			batch.update(globalInvoiceRef, updatedInvoiceData);
			batch.update(customerInvoiceRef, updatedInvoiceData);

			// Commit the batch
			await batch.commit();

			navigate(-1);
		} catch (err) {
			console.error("Error updating document:", err);
		}
	};

	const handleServiceChange = (e, field) => {
		const selectedValue = e.target.value;
		if (selectedValue === "Add Custom") {
			setIsCustomService(true);
			setNewService({ ...newService, [field]: "" });
		} else {
			setIsCustomService(false);
			setNewService({ ...newService, [field]: selectedValue });
		}
	};

	const handleAddService = () => {
		if (newService.name && newService.code && newService.price) {
			setServices([...services, newService]);
			setNewService({ vtype: "", name: "", code: "", price: "" }); // Reset service input fields
			setIsCustomService(false); // Reset custom service option
		}
	};

	// Handle removing a service entry
	const handleDeleteService = (index) => {
		setServices(services.filter((_, i) => i !== index));
	};

	return (
		<div className="new">
			<Sidebar />
			<div className="newContainer">
				<Navbar />
				<div className="top">
					<h1>{title}</h1>
				</div>
				<div className="bottom">
					<div className="right">
						<form onSubmit={handleEdit}>
							<div className="formContent">
								{/* Customer Name Field */}
								<div className="formInput">
									<label>Customer</label>
									<input
										type="text"
										value={customerName}
										onChange={(e) =>
											setCustomerName(e.target.value)
										}
										placeholder="Customer name"
										required
									/>
								</div>

								{/* Render standard inputs */}
								{inputs.map((input) => (
									<div className="formInput" key={input.id}>
										<label>{input.label}</label>
										{input.type === "select" &&
											!input.multiSelect && (
												<select
													id={input.id}
													onChange={handleInput}
													value={data[input.id] || ""}
												>
													<option value="" disabled>
														{input.placeholder}
													</option>
													{input.options.map(
														(option, index) => (
															<option
																key={index}
																value={option}
															>
																{option}
															</option>
														)
													)}
												</select>
											)}
										{input.type !== "select" &&
											input.type !== "multi-select" && (
												<input
													id={input.id}
													type={input.type}
													placeholder={
														input.placeholder
													}
													onChange={handleInput}
													value={data[input.id] || ""}
												/>
											)}
									</div>
								))}

								{/* Service details input fields */}
								<div className="serviceInputGroup">
									<h3>Add Service</h3>
									<select
										value={newService.vtype}
										onChange={(e) =>
											handleServiceChange(e, "vtype")
										}
									>
										<option value="" disabled>
											Select Vehicle Type
										</option>
										{vehicleType.map((option, index) => (
											<option key={index} value={option}>
												{option}
											</option>
										))}
									</select>
									{!isCustomService ? (
										<select
											value={newService.name}
											onChange={(e) =>
												handleServiceChange(e, "name")
											}
										>
											<option value="" disabled>
												Select Service
											</option>
											{serviceType.map(
												(option, index) => (
													<option
														key={index}
														value={option}
													>
														{option}
													</option>
												)
											)}
										</select>
									) : (
										<input
											type="text"
											placeholder="Custom Service"
											value={newService.name}
											onChange={(e) =>
												setNewService({
													...newService,
													name: e.target.value,
												})
											}
										/>
									)}
									<input
										type="text"
										placeholder="Code"
										value={newService.code}
										onChange={(e) =>
											setNewService({
												...newService,
												code: e.target.value,
											})
										}
									/>
									<input
										type="number"
										placeholder="Price"
										value={newService.price}
										onChange={(e) =>
											setNewService({
												...newService,
												price: e.target.value,
											})
										}
									/>
									<IconButton onClick={handleAddService}>
										<AddCircleOutline />
									</IconButton>
								</div>

								{/* Display added services */}
								<div className="servicesList">
									{services.map((service, index) => (
										<div
											key={index}
											className="serviceItem"
										>
											<Chip
												label={`${service.name} - ${service.code} - $${service.price}`}
												onDelete={() =>
													handleDeleteService(index)
												}
												className="chipItem"
											/>
										</div>
									))}
								</div>
							</div>
							<button type="submit">Update</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EditInvoice;
