import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";
import InvoiceDocument from "../components/invoice/InvoiceDocument";
import { pdf } from "@react-pdf/renderer";

export const calculateSubtotal = (services) => {
	return services?.reduce(
		(acc, service) => acc + (parseInt(service.price) || 0),
		0
	);
};

export const calculateGST = (price) => {
	const gstRate = 0.05; // GST rate in Alberta is 5%
	const total = parseInt(price) * gstRate;
	return total.toFixed(2);
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
	const storageRef = ref(
		storage,
		`${selectedCompany}/invoices/${invoiceData.invoiceId}.pdf`
	);

	// Generate PDF Blob using @react-pdf/renderer
	const doc = <InvoiceDocument invoiceData={invoiceData} />;
	const pdfBlob = await pdf(doc).toBlob();

	// Upload the PDF blob to Firebase Storage
	await uploadBytes(storageRef, pdfBlob);
	const pdfURL = await getDownloadURL(storageRef);
	return pdfURL;
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
