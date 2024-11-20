import {
	collection,
	doc,
	getDoc,
	query,
	setDoc,
	where,
} from "firebase/firestore";
import { db } from "../firebase";

export const initializeInvoiceCounter = async ({ selectedCompany }) => {
	const counterRef = doc(
		db,
		selectedCompany,
		"admin",
		"invoiceCounters",
		"nextInvoiceNumber"
	);

	// Check if the counter document exists
	const counterDoc = await getDoc(counterRef);
	if (!counterDoc.exists()) {
		// Initialize counter if it does not exist
		await setDoc(counterRef, { nextInvoiceNumber: 1 });
		console.log("Invoice counter initialized.");
	}
};

export const getCustomerByName = ({ selectedCompany, customerName }) => {
	return query(
		collection(db, `${selectedCompany}`, "management", "customers"),
		where("displayName", "==", customerName)
	);
};

export const getGlobalInvoiceDocument = ({ selectedCompany, customerName }) => {
	return query(
		collection(db, `${selectedCompany}`, "management", "invoices"),
		where("displayName", "==", customerName)
	);
};
