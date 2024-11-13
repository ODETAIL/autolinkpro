// Define styles
import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
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
