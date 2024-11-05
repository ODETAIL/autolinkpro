// InvoiceDocument.js
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { formatPhoneNumber } from "../../helpers/helpers";

// Define styles
const styles = StyleSheet.create({
	page: { padding: 30, fontSize: 12 },
	divider: { height: 1, backgroundColor: "grey", marginVertical: 10 },
	section: { marginBottom: 10 },
	title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 5,
	},
	tableHeader: {
		fontWeight: "bold",
		borderBottomWidth: 1,
		borderBottomColor: "grey",
		paddingBottom: 5,
	},
	tableRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 5,
	},
	total: { marginTop: 10, fontSize: 14, fontWeight: "bold" },
	label: { fontWeight: "bold" },
	subSection: { fontStyle: "italic", fontSize: 12 },
	disclaimerPage: {
		padding: 30,
		fontSize: 12,
		color: "grey",
		textAlign: "center",
	},
	disclaimerSubtitle: {
		fontSize: 12,
		fontWeight: "bold",
		marginTop: 10,
	},
	disclaimerText: {
		fontSize: 10,
		color: "grey",
		marginTop: 5, // Adjust for spacing between subtitle and text
	},
});

const InvoiceDocument = ({ invoiceData }) => {
	// Calculate total amount and GST
	const totalAmount =
		invoiceData?.services?.reduce(
			(total, item) => total + parseFloat(item.price) * item.quantity,
			0
		) || 0;
	const gstAmount = totalAmount * 0.05; // assuming a 5% GST
	const grandTotal = totalAmount + gstAmount;

	return (
		<Document>
			<Page size="A4" style={styles.page}>
				{/* Title */}
				<View style={styles.section}>
					<Text style={styles.title}>
						Invoice #
						{String(invoiceData?.invoiceId).padStart(6, "0")}
					</Text>
					<View style={styles.divider} />
				</View>

				{/* Customer and Invoice Details */}
				<View style={styles.section}>
					<View style={styles.row}>
						<View>
							<Text style={styles.label}>Customer:</Text>
							<Text>{invoiceData?.displayName}</Text>
							<Text>{invoiceData?.email}</Text>
							<Text>{formatPhoneNumber(invoiceData?.phone)}</Text>
						</View>
						<View>
							<Text style={styles.label}>Invoice Details:</Text>
							<Text>
								PDF created{" "}
								{invoiceData?.timeStamp
									?.toDate()
									.toLocaleDateString()}
							</Text>
							<Text>${grandTotal.toFixed(2)}</Text>
						</View>
						<View>
							<Text style={styles.label}>Payment:</Text>
							<Text>
								{invoiceData?.payment || "Due on Receipt"}
							</Text>
						</View>
					</View>
					<View style={styles.divider} />
				</View>

				{/* Services Table */}
				<View style={styles.section}>
					<View style={[styles.row, styles.tableHeader]}>
						<Text>Item</Text>
						<Text>Quantity</Text>
						<Text>Price</Text>
						<Text>Amount</Text>
					</View>
					{invoiceData?.services &&
					invoiceData.services.length > 0 ? (
						invoiceData.services.map((item, index) => (
							<View key={index} style={styles.tableRow}>
								<View>
									<Text
										style={{
											fontWeight: "extrabold",
											textTransform: "uppercase",
										}}
									>
										{item.vtype} {item.name}
									</Text>
									<Text
										style={{
											fontStyle: "italic",
											fontSize: 10,
											color: "gray",
										}}
									>
										{item.code}({invoiceData?.invoiceType})
									</Text>
								</View>
								<Text>{item.quantity}</Text>
								<Text>
									${parseFloat(item.price).toFixed(2)}
								</Text>
								<Text>
									$
									{(
										parseFloat(item.price) * item.quantity
									).toFixed(2)}
								</Text>
							</View>
						))
					) : (
						<Text>No services available</Text>
					)}
					<View style={styles.divider} />
				</View>

				{/* Subtotal, GST, and Total */}
				<View style={styles.section}>
					<View style={styles.row}>
						<Text>Subtotal:</Text>
						<Text>${totalAmount.toFixed(2)}</Text>
					</View>
					<View style={styles.row}>
						<Text>GST (5%):</Text>
						<Text>${gstAmount.toFixed(2)}</Text>
					</View>
					<View style={styles.divider} />
					<View style={styles.row}>
						<Text style={styles.total}>Total:</Text>
						<Text style={styles.total}>
							${grandTotal.toFixed(2)}
						</Text>
					</View>
				</View>
			</Page>
			<Page size="A4" style={styles.disclaimerPage}>
				<View>
					<Text style={styles.title}>DISCLAIMER</Text>
					{/* Chip Repair Section */}
					<Text style={styles.disclaimerSubtitle}>Chip Repair:</Text>
					<Text style={styles.disclaimerText}>
						Chip repairs are meant to prevent further damage, but we
						cannot guarantee that the chip or crack will disappear
						completely. Some chips may still be visible after
						repair, and there is a small chance the windshield may
						crack during or after the process. O Detail is not
						responsible for additional damage resulting from the
						repair.
					</Text>

					{/* Warranty Section */}
					<Text style={styles.disclaimerSubtitle}>WARRANTY</Text>
					<Text style={styles.disclaimerText}>
						Lifetime Warranty for Leaks and Whistling Noises: We
						offer a lifetime warranty on any leaks or whistling
						noises related to windshield installation. If you
						experience these issues at any time after service, we
						will inspect and correct the problem at no additional
						cost.
					</Text>

					{/* Cracks within 24 Hours Section */}
					<Text style={styles.disclaimerSubtitle}>
						Cracks within 24 Hours:
					</Text>
					<Text style={styles.disclaimerText}>
						If your windshield cracks within 24 hours of
						replacement, please notify us immediately. We will
						assess the situation, and if the damage is related to
						installation, we will replace the windshield at no cost.
						Cracks caused by external factors (e.g., rocks, debris)
						are not covered.
					</Text>
				</View>
			</Page>
		</Document>
	);
};

export default InvoiceDocument;
