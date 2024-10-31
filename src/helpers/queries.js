import {
	collection,
	doc,
	getDoc,
	query,
	setDoc,
	where,
} from "firebase/firestore";
import { companyName, db } from "../firebase";

export const initializeInvoiceCounter = async () => {
	const counterRef = doc(
		db,
		companyName,
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

export const getCustomerByName = ({ companyName, customerName }) => {
	return query(
		collection(db, `${companyName}`, "management", "customers"),
		where("displayName", "==", customerName)
	);
};
