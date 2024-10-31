export const employeeInputs = [
	{
		id: "displayName",
		label: "Name",
		type: "text",
		placeholder: "John Doe",
	},
	{
		id: "email",
		label: "Email",
		type: "mail",
		placeholder: "john_doe@gmail.com",
	},
	{
		id: "phone",
		label: "Phone",
		type: "text",
		placeholder: "+1 403 123 4567",
	},
	{
		id: "password",
		label: "Password",
		type: "password",
	},
	{
		id: "streetAddress",
		label: "Address",
		type: "text",
		placeholder: "123 Applewood dr",
	},
	{
		id: "postalCode",
		label: "Postal Code",
		type: "text",
		placeholder: "T2A7E3",
	},
	{
		id: "startDate",
		label: "Start Date",
		type: "date",
		placeholder: "2024/10/27",
	},
];

export const customerInputs = [
	{
		id: "displayName",
		label: "Customer Name",
		type: "text",
		placeholder: "John Doe",
	},
	{
		id: "email",
		label: "Email",
		type: "text",
		placeholder: "john_doe@gmail.com",
	},
	{
		id: "streetAddress1",
		label: "Street Address 1",
		type: "text",
		placeholder: "123 Applewood dr",
	},
	{
		id: "streetAddress2",
		label: "Street Address 2",
		type: "text",
		placeholder: "123 Applewood dr",
	},
	{
		id: "city",
		label: "City",
		type: "text",
		placeholder: "Calgary",
	},
	{
		id: "postalCode",
		label: "Postal Code",
		type: "text",
		placeholder: "T2A7E3",
	},
	{
		id: "phone",
		label: "Phone Number",
		type: "text",
		placeholder: "+1 403 123 4567",
	},
	{
		id: "companyName",
		label: "Company Name",
		type: "text",
		placeholder: "Company Name",
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
		placeholder: "Toyoto Rav4",
	},
	{
		id: "year",
		label: "Year",
		type: "text",
		placeholder: "2010",
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
		placeholder: "Email",
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
		placeholder: "Draft",
		options: ["draft", "paid", "overdue"],
		defaultValue: "draft",
	},
	{
		id: "payment",
		label: "Form Of Payment",
		type: "select",
		placeholder: "Mastercard",
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
		placeholder: "Title Of Appointment",
	},
	{
		id: "start",
		label: "Start Time",
		type: "datetime-local",
	},
	{
		id: "end",
		label: "End Time",
		type: "datetime-local",
	},
	{
		id: "email",
		label: "Email",
		type: "text",
		placeholder: "john_doe@gmail.com",
	},
	{
		id: "notes",
		label: "Notes",
		type: "text",
		placeholder: "Custom Notes",
	},
];
