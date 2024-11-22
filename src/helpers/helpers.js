import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";
import InvoiceDocument from "../components/invoice/InvoiceDocument";
import { pdf } from "@react-pdf/renderer";
import { replacementEligibleServices } from "./defaultData";

export const calculateSubtotal = (services) => {
	return (
		services?.reduce(
			(acc, service) => acc + (parseInt(service.price) || 0),
			0
		) || 0
	);
};

export const calculateGST = (price) => {
	const gstRate = 0.05;
	const parsedPrice = parseFloat(price);

	if (isNaN(parsedPrice)) {
		return 0; // Return default value
	}

	return parsedPrice * gstRate;
};

export const calculateTotalPrice = (services) => {
	if (!services || services.length === 0) {
		return 0; // Ensure it returns 0 if there are no services
	}
	const subtotal = parseFloat(calculateSubtotal(services)) || 0;
	const gst = parseFloat(calculateGST(subtotal)) || 0;

	return subtotal + gst; // Always return a numeric value
};

export const getAvatar = async (file, folder = "odetail/avatars") => {
	try {
		const storageRef = ref(storage, `${folder}/${file}`);
		// Get and return the download URL
		const downloadURL = await getDownloadURL(storageRef);
		return downloadURL;
	} catch (error) {
		console.error("Error retrieving image:", error);
		throw error;
	}
};

export const saveInvoiceToFirebase = async (invoiceData, selectedCompany) => {
	try {
		const storageRef = ref(
			storage,
			`${selectedCompany}/invoices/${invoiceData.customerId}/${invoiceData.displayName}_invoice_${invoiceData.invoiceId}.pdf`
		);

		// Generate PDF Blob using @react-pdf/renderer
		const doc = (
			<InvoiceDocument
				invoiceData={invoiceData}
				selectedCompany={selectedCompany}
			/>
		);
		const pdfBlob = await pdf(doc).toBlob();

		// Upload the PDF blob to Firebase Storage
		await uploadBytes(storageRef, pdfBlob);

		// Get the download URL
		const pdfURL = await getDownloadURL(storageRef);
		return pdfURL; // Should return the URL if successful
	} catch (error) {
		console.error("Error fetching download URL:", error);
		return null;
	}
};

export const formatPhoneNumber = (phone) => {
	// Remove any non-digit characters (optional, in case input has dashes or spaces)
	const cleaned = ("" + phone).replace(/\D/g, "");

	// Check if the input is of correct length
	if (cleaned.length === 10) {
		const areaCode = cleaned.slice(0, 3);
		const centralOfficeCode = cleaned.slice(3, 6);
		const lineNumber = cleaned.slice(6);
		return `(${areaCode}) ${centralOfficeCode}-${lineNumber}`;
	}

	// Return the original phone if it's not 10 digits
	return phone;
};

export const generateServicesTable = (services) => {
	return services
		.map(
			(service) => `
      <tr>
        <td style="padding: 5px 0; border-bottom: 1px solid #e0e0e0;">${service.vtype.toUpperCase()} ${service.name.toUpperCase()} ${
				replacementEligibleServices.includes(service.name)
					? "REPLACEMENT"
					: ""
			}</td>
        <td style="text-align: right; border-bottom: 1px solid #e0e0e0;">$${
			service.price
		}</td>
      </tr>
    `
		)
		.join("");
};

export const formatDate = (date) => {
	const validDate = new Date(date); // Convert to Date object
	if (isNaN(validDate)) {
		throw new TypeError(
			"Invalid Date object or string passed to formatDate"
		);
	}

	const options = { year: "numeric", month: "long", day: "numeric" };
	return validDate.toLocaleDateString("en-US", options);
};
