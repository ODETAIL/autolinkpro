import React from "react";
import { Document, Image, Page, Text, View, Font } from "@react-pdf/renderer";
import { formatPhoneNumber } from "../../helpers/helpers";
import { styles } from "./InvoiceStyle";
import { excludedServiceNames } from "../../helpers/defaultData";

Font.register({
	family: "Nunito",
	fonts: [
		{ src: "/fonts/Nunito-Regular.ttf", fontWeight: "normal" },
		{ src: "/fonts/Nunito-Italic.ttf", fontStyle: "italic" },
		{ src: "/fonts/Nunito-Bold.ttf", fontWeight: "bold" },
		{
			src: "/fonts/Nunito-BoldItalic.ttf",
			fontStyle: "italic",
			fontWeight: "bold",
		},
	],
});

const InvoiceDocument = ({ selectedCompany, invoiceData }) => {
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
				<View style={styles.header}>
					{/* Logo on the left */}
					<Image
						src={
							selectedCompany === "odetail"
								? "/images/odetail.jpg"
								: "/images/aztec.jpg"
						}
						style={styles.logo}
					/>

					{/* Company info on the right */}
					<View style={styles.companyInfo}>
						<Text style={styles.companyName}>
							{selectedCompany === "odetail"
								? "O Detail"
								: "Aztec Auto Glass Ltd"}
						</Text>

						<Text style={styles.contactInfo}>
							{selectedCompany === "odetail"
								? formatPhoneNumber("5873662254")
								: formatPhoneNumber("5879667636")}{" "}
							|{" "}
							{selectedCompany === "odetail"
								? "invoices@odetail.ca"
								: "invoices@aztecautoglass.ca"}
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
								<View style={styles.itemColumn}>
									<Text style={styles.item}>
										{item.vtype} {item.name}{" "}
										{excludedServiceNames.includes(
											item.name
										)
											? ""
											: "replacement"}
									</Text>
									<Text style={styles.subSection}>
										{item.code} ({item.itype})
									</Text>
								</View>
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
						crack during or after the process.{" "}
						{selectedCompany === "odetail" ? "O Detail" : "Aztec"}{" "}
						is not responsible for additional damage resulting from
						the repair.
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
