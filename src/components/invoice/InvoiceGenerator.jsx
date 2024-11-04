// src/components/InvoiceGenerator.js
import React, { useState } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import InvoiceDocument from "./InvoiceDocument";
import { saveInvoiceToFirebase } from "../../helpers/helpers";

const InvoiceGenerator = ({ invoiceData }) => {
	const [pdfUrl, setPdfUrl] = useState(null);

	const handleSaveToFirebase = async () => {
		try {
			const url = await saveInvoiceToFirebase(invoiceData);
			setPdfUrl(url);
			alert("Invoice saved to Firebase!");
		} catch (error) {
			console.error("Error saving invoice to Firebase:", error);
		}
	};

	return (
		<div>
			{invoiceData && (
				<PDFViewer style={{ width: "100%", height: "500px" }}>
					<InvoiceDocument invoiceData={invoiceData} />
				</PDFViewer>
			)}

			{/* <button onClick={handleSaveToFirebase}>Save to Firebase</button> */}

			{/* {pdfUrl && (
				<p>
					Saved Invoice URL:{" "}
					<a href={pdfUrl} target="_blank" rel="noopener noreferrer">
						View Invoice
					</a>
				</p>
			)} */}
		</div>
	);
};

export default InvoiceGenerator;
