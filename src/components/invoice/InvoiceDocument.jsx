// InvoiceDocument.js
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { formatPhoneNumber } from "../../helpers/helpers";
import { useCompanyContext } from "../../context/CompanyContext";
// import * as fs from "fs";

// const imagePath = "odetail.jpeg";

// Define styles
const styles = StyleSheet.create({
	page: { padding: 30, fontSize: 12 },
	divider: { height: 1, backgroundColor: "grey", marginVertical: 10 },
	headerDivider: { height: 3, backgroundColor: "grey", marginVertical: 10 },
	section: { marginBottom: 10 },
	title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 10,
	},
	logo: { width: 30, height: 30 },
	companyInfo: { marginLeft: 10 },
	companyName: {
		fontSize: 16,
		fontWeight: "bold",
		textTransform: "capitalize",
	},
	contactInfo: { fontSize: 10, color: "grey" },
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 5,
	},
	// Define table styles with equal flex values for each column
	tableHeader: {
		fontWeight: "bold",
		borderBottomWidth: 1,
		borderBottomColor: "grey",
		paddingBottom: 5,
		flexDirection: "row",
	},
	tableRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		marginBottom: 5,
	},
	itemColumn: { flex: 2 },
	item: { textTransform: "uppercase" },
	quantityColumn: { flex: 1, textAlign: "center" },
	priceColumn: { flex: 1, textAlign: "center" },
	amountColumn: { flex: 1, textAlign: "center" },
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
		marginTop: 5,
	},
});

const InvoiceDocument = ({ invoiceData }) => {
	// const [base64ImageSrc, setBase64ImageSrc] = useState("");
	const { selectedCompany } = useCompanyContext();
	// Calculate total amount and GST
	const totalAmount =
		invoiceData?.services?.reduce(
			(total, item) => total + parseFloat(item.price) * item.quantity,
			0
		) || 0;
	const gstAmount = totalAmount * 0.05; // assuming a 5% GST
	const grandTotal = totalAmount + gstAmount;

	// useEffect(() => {
	// 	fs.readFile(imagePath, (err, data) => {
	// 		if (err) throw err;
	// 		const base64Image = `data:image/png;base64,${data.toString(
	// 			"base64"
	// 		)}`;
	// 		setBase64ImageSrc(base64Image);
	// 	});
	// }, []);
	return (
		<Document>
			<Page size="A4" style={styles.page}>
				<View style={styles.header}>
					<View style={styles.companyInfo}>
						{/* {selectedCompany === "odetail" ? (
							<Image src={base64ImageSrc} style={styles.logo} />
						) : (
							<Image src={base64ImageSrc} style={styles.logo} />
						)} */}
						<Text style={styles.companyName}>
							{selectedCompany === "odetail"
								? "O Detail"
								: "Aztec Auto Glass Ltd"}
						</Text>
						<Text style={styles.contactInfo}>
							{selectedCompany === "odetail"
								? ""
								: "aztecautoglassyyc@gmail.com"}
						</Text>
						<Text style={styles.contactInfo}>
							{selectedCompany === "odetail"
								? formatPhoneNumber("5873662254")
								: formatPhoneNumber("5879667636")}
						</Text>
						<Text style={styles.contactInfo}>
							GST/HST:{" "}
							{selectedCompany === "odetail"
								? "723288155RT0001"
								: "792765935RT0001"}
						</Text>
					</View>
				</View>

				{/* Divider */}
				<View style={styles.headerDivider} />
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
						<Text style={styles.itemColumn}>Item</Text>
						<Text style={styles.quantityColumn}>Quantity</Text>
						<Text style={styles.priceColumn}>Price</Text>
						<Text style={styles.amountColumn}>Amount</Text>
					</View>
					{invoiceData?.services &&
					invoiceData.services.length > 0 ? (
						invoiceData.services.map((item, index) => (
							<View key={index} style={styles.tableRow}>
								<Text style={styles.itemColumn}>
									<Text style={styles.item}>
										{item.vtype} {item.name}
									</Text>
									<Text style={styles.subSection}>
										{item.code} ({item.itype})
									</Text>
								</Text>
								<Text style={styles.quantityColumn}>
									{item.quantity}
								</Text>
								<Text style={styles.priceColumn}>
									${parseFloat(item.price).toFixed(2)}
								</Text>
								<Text style={styles.amountColumn}>
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
