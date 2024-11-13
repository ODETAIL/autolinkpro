export const vehicleType = [
	"Suv",
	"Truck",
	"Sedan",
	"Minivan",
	"Convertible",
	"Hatchback",
];
export const invoiceType = ["A", "M", "O"];
export const serviceType = [
	"Windshield",
	"Door Glass",
	"Back Glass",
	"Sunroof",
	"Mirror",
	"Quarter Glass",
	"Chip Subscription",
	"Warranty",
	"Add Custom",
];
export const excludedServiceNames = [
	"Chip Subscription",
	"Warranty",
	"Add Custom",
];
export const colors = [
	"#413c4d",
	"#212d40",
	"#19212e",
	"#1e1619",
	"#2a1716",
	"#522d2d",
	"#7a4343",
];

export const defaultCustomerData = ({ customerName }) => {
	return {
		displayName: customerName,
		city: "",
		email: "",
		phone: "",
		postalCode: "",
		streetAddress1: "",
		streetAddress2: "",
	};
};

export const defaultInvoiceData = ({ customerName }) => {
	return {
		displayName: customerName,
		city: "",
		email: "",
		phone: "",
		postalCode: "",
		streetAddress1: "",
		streetAddress2: "",
		makemodel: "",
		status: "",
		year: "",
		services: [],
	};
};
