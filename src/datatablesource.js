import {
	AdminPanelSettingsOutlined,
	LockOpenOutlined,
	SecurityOutlined,
} from "@mui/icons-material";

export const employeeColumns = [
	{
		field: "displayName",
		headerName: "User",
		width: 230,
		renderCell: (params) => {
			return (
				<div className="cellWithImg">
					<img
						className="cellImg"
						src={
							params.row.img
								? params.row.img
								: "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
						}
						alt="avatar"
					/>
					{params.row.displayName}
				</div>
			);
		},
	},
	{
		field: "email",
		headerName: "Email",
		width: 230,
	},
	{
		field: "phone",
		headerName: "Phone Number",
		width: 150,
		renderCell: (params) => {
			return params.value.replace(
				/^(\d{3})(\d{3})(\d{4})$/,
				"($1) $2-$3"
			);
		},
	},
	{
		field: "access",
		headerName: "Access",
		width: 150,
		renderCell: ({ row: { access } }) => {
			return (
				<div className={`cellWithAccess ${access}`}>
					{access === "admin" && <AdminPanelSettingsOutlined />}
					{access === "manager" && <SecurityOutlined />}
					{access === "user" && <LockOpenOutlined />}
					<span className="cellWithAccessTitle">{access}</span>
				</div>
			);
		},
	},
];

export const customerColumns = [
	{
		field: "customer",
		headerName: "Customer",
		width: 230,
		renderCell: (params) => {
			return <div className="cellWithImg">{params.row.displayName}</div>;
		},
	},
	{
		field: "email",
		headerName: "Email",
		width: 230,
	},
	{
		field: "phone",
		headerName: "Phone Number",
		width: 170,
		renderCell: (params) => {
			return params.value.replace(
				/^(\d{3})(\d{3})(\d{4})$/,
				"($1) $2-$3"
			);
		},
	},
	{
		field: "lastVisit",
		headerName: "Last Visit",
		width: 160,
	},
];

export const invoiceColumns = [
	{
		field: "invoiceId",
		headerName: "Invoice #",
		width: 85,
		renderCell: (params) => {
			return params.row.invoiceId;
		},
	},
	{
		field: "customer",
		headerName: "Customer",
		width: 230,
		renderCell: (params) => {
			return <div className="cellWithImg">{params.row.displayName}</div>;
		},
	},
	{
		field: "phone",
		headerName: "Phone Number",
		width: 150,
		renderCell: (params) => {
			return params.value.replace(
				/^\+1(\d{3})(\d{3})(\d{4})/,
				"($1) $2-$3"
			);
		},
	},
	{
		field: "status",
		headerName: "Status",
		width: 120,
		renderCell: (params) => {
			return (
				<div className={`cellWithStatus ${params.row.status}`}>
					{params.row.status}
				</div>
			);
		},
	},
	{
		field: "code",
		headerName: "Code",
		width: 100,
		renderCell: (params) => {
			return (
				<select className="cellCodeDropdown">
					{params.row.services?.map((service, index) => (
						<option key={index} value={service.code}>
							{service.code}
						</option>
					))}
				</select>
			);
		},
	},
	{
		field: "amount",
		headerName: "Amount",
		width: 100,
		renderCell: (params) => {
			// Calculate the subtotal of prices in the services array
			const subtotal =
				params.row.services?.reduce(
					(acc, service) => acc + (parseFloat(service.price) || 0),
					0
				) || 0;

			return <div className="cellAmount">${subtotal.toFixed(2)}</div>;
		},
	},
];

export const invoiceCustomerViewColumns = [
	{
		field: "invoiceId",
		headerName: "Invoice #",
		width: 85,
		renderCell: (params) => {
			return params.row.invoiceId;
		},
	},
	{
		field: "timeStamp",
		headerName: "Date",
		width: 150,
		renderCell: (params) => {
			return (
				<div className="cellDate">
					{params.row.timeStamp
						?.toDate()
						.toLocaleDateString("en-US", {
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
				</div>
			);
		},
	},
	// {
	// 	field: "code",
	// 	headerName: "Code",
	// 	width: 100,
	// },
	{
		field: "phone",
		headerName: "Phone Number",
		width: 150,
		renderCell: (params) => {
			return params.value.replace(
				/^\+1(\d{3})(\d{3})(\d{4})/,
				"($1) $2-$3"
			);
		},
	},
	{
		field: "status",
		headerName: "Status",
		width: 120,
		renderCell: (params) => {
			return (
				<div className={`cellWithStatus ${params.row.status}`}>
					{params.row.status}
				</div>
			);
		},
	},

	{
		field: "amount",
		headerName: "Amount",
		width: 100,
		renderCell: (params) => {
			return <div className={`cellAmount`}>{params.row.amount}</div>;
		},
	},
];
