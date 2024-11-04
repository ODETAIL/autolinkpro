export const employeeInputs = [
	{
		id: "displayName",
		label: "Name",
		type: "text",
	},
	{
		id: "email",
		label: "Email",
		type: "mail",
	},
	{
		id: "phone",
		label: "Phone",
		type: "text",
	},
	{
		id: "password",
		label: "Password",
		type: "password",
	},
	// {
	// 	id: "streetAddress",
	// 	label: "Address",
	// 	type: "text",
	// },
	{
		id: "postalCode",
		label: "Postal Code",
		type: "text",
	},
	{
		id: "startDate",
		label: "Start Date",
		type: "date",
	},
	{
		id: "access",
		label: "Access",
		options: ["admin", "user", "manager"],
		type: "select",
	},
];

export const customerInputs = [
	{
		id: "displayName",
		label: "Customer Name",
		type: "text",
	},
	{
		id: "email",
		label: "Email",
		type: "text",
	},
	{
		id: "streetAddress1",
		label: "Street Address 1",
		type: "text",
	},
	{
		id: "streetAddress2",
		label: "Street Address 2",
		type: "text",
	},
	{
		id: "city",
		label: "City",
		type: "text",
	},
	{
		id: "postalCode",
		label: "Postal Code",
		type: "text",
	},
	{
		id: "phone",
		label: "Phone Number",
		type: "text",
	},
	{
		id: "companyName",
		label: "Company Name",
		type: "text",
	},
	{
		id: "notes",
		label: "Notes",
		type: "text",
		placeholder: "Customer notes...",
	},
];

export const invoiceInputs = [
	{
		id: "makemodel",
		label: "Make/Model",
		type: "text",
	},
	{
		id: "year",
		label: "Year",
		type: "text",
	},
	{
		id: "invoiceType",
		label: "Invoice Type",
		type: "select",
		placeholder: "Select Invoice Type",
		options: ["A", "M", "O"],
	},

	{
		id: "email",
		label: "Email",
		type: "text",
	},
	{
		id: "custom",
		label: "Custom",
		type: "text",
		placeholder: "Custom costs",
	},
	{
		id: "status",
		label: "Status",
		type: "select",
		options: ["draft", "pending", "paid", "overdue"],
		defaultValue: "draft",
	},
	{
		id: "payment",
		label: "Form Of Payment",
		type: "select",
		options: [
			"Debit",
			"Mastercard",
			"Cash",
			"Amex",
			"Visa",
			"Cheque",
			"E-transfer",
			"Other",
		],
	},
];

export const appointmentInputs = [
	{
		id: "title",
		label: "Title",
		type: "text",
		required: true,
	},

	{
		id: "start",
		label: "Start Time",
		required: true,
		type: "datetime-local",
	},
	{
		id: "end",
		label: "End Time",
		required: true,
		type: "datetime-local",
	},
	{
		id: "email",
		label: "Email",
		type: "text",
		required: false,
	},
	{
		id: "streetAdress1",
		label: "Address",
		type: "text",
		required: false,
	},
	{
		id: "phone",
		label: "Phone",
		type: "text",
		required: false,
	},
	{
		id: "notes",
		label: "Notes",
		type: "text",
		required: false,
		placeholder: "Custom Notes",
	},
];
