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

export const invoiceCustomerViewColumns = [
	{
		field: "invoiceId",
		headerName: "ID",
		width: 50,
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
