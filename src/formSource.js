export const employeeInputs = [
	{
		id: "displayName",
		label: "Name",
		type: "text",
		required: true,
	},
	{
		id: "email",
		label: "Email",
		type: "mail",
		required: true,
	},
	{
		id: "phone",
		label: "Phone",
		type: "text",
		required: true,
	},
	{
		id: "password",
		label: "Password",
		type: "password",
		required: true,
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
		required: true,
	},
	{
		id: "startDate",
		label: "Start Date",
		type: "date",
		required: false,
	},
	{
		id: "access",
		label: "Access",
		options: ["admin", "user", "manager"],
		type: "select",
		required: true,
	},
];

export const customerInputs = [
	{
		id: "displayName",
		label: "Customer Name",
		type: "text",
		required: true,
	},
	{
		id: "email",
		label: "Email",
		type: "text",
		required: true,
	},
	{
		id: "streetAddress1",
		label: "Street Address 1",
		type: "text",
		required: true,
	},
	{
		id: "streetAddress2",
		label: "Street Address 2",
		type: "text",
		required: false,
	},
	{
		id: "city",
		label: "City",
		type: "text",
		required: false,
	},
	{
		id: "postalCode",
		label: "Postal Code",
		type: "text",
		required: false,
	},
	{
		id: "phone",
		label: "Phone Number",
		type: "text",
		required: true,
	},
	{
		id: "companyName",
		label: "Company Name",
		type: "text",
		required: false,
	},
	{
		id: "notes",
		label: "Notes",
		type: "text",
		placeholder: "Customer notes...",
		required: false,
	},
];

export const invoiceInputs = [
	{
		id: "email",
		label: "Email",
		type: "text",
		required: true,
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
		required: true,
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
		required: true,
	},
	{
		id: "notes",
		label: "Notes",
		type: "text",
		required: false,
		placeholder: "Custom Notes",
	},
];
