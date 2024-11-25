import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SettingsSystemDaydreamOutlinedIcon from "@mui/icons-material/SettingsSystemDaydreamOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { Link } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext } from "react";
import {
	CalendarMonthOutlined,
	SupervisorAccountOutlined,
} from "@mui/icons-material";
import { useCompanyContext } from "../../context/CompanyContext";
import { AuthContext } from "../../context/AuthContext";

const Sidebar = () => {
	const { dispatch } = useContext(DarkModeContext);
	const Auth = useContext(AuthContext);
	const { companies, selectedCompany, setCompany } = useCompanyContext();

	const handleCompanyChange = (e) => {
		const selectedCompanyName = e.target.value;

		const company = companies.find(
			(company) => company === selectedCompanyName
		);
		setCompany(company);
	};

	return (
		<div className="sidebar">
			<div className="top">
				<div style={{ textDecoration: "none" }}>
					<select
						onChange={handleCompanyChange}
						value={selectedCompany}
						className="company-dropdown"
					>
						{companies.map((company, index) => (
							<option key={index} value={company}>
								{company}
							</option>
						))}
					</select>
				</div>
			</div>
			<hr />
			<div className="center">
				<ul>
					<p className="title">MAIN</p>
					<Link to="/" style={{ textDecoration: "none" }}>
						<li>
							<DashboardIcon className="icon" />
							<span>Dashboard</span>
						</li>
					</Link>

					<p className="title">ADMIN</p>
					<Link to="/employees" style={{ textDecoration: "none" }}>
						<li>
							<SupervisorAccountOutlined className="icon" />
							<span>Employees</span>
						</li>
					</Link>
					<Link to="/customers" style={{ textDecoration: "none" }}>
						<li>
							<PersonOutlineIcon className="icon" />
							<span>Customers</span>
						</li>
					</Link>
					<Link to="/appointments" style={{ textDecoration: "none" }}>
						<li>
							<CalendarMonthOutlined className="icon" />
							<span>Appointments</span>
						</li>
					</Link>
					<Link to="/invoices" style={{ textDecoration: "none" }}>
						<li>
							<CreditCardIcon className="icon" />
							<span>Invoices</span>
						</li>
					</Link>

					<p className="title">USEFUL</p>
					<Link to="/stats" style={{ textDecoration: "none" }}>
						<li>
							<InsertChartIcon className="icon" />
							<span>Stats</span>
						</li>
					</Link>

					<p className="title">SERVICE</p>
					<li>
						<SettingsSystemDaydreamOutlinedIcon className="icon" />
						<span>System Health</span>
					</li>
					<li>
						<PsychologyOutlinedIcon className="icon" />
						<span>Logs</span>
					</li>
					<li>
						<SettingsApplicationsIcon className="icon" />
						<span>Settings</span>
					</li>
					<p className="title">USER</p>
					<li>
						<AccountCircleOutlinedIcon className="icon" />
						<span>Profile</span>
					</li>
					<li>
						<ExitToAppIcon
							className="icon"
							onClick={() => Auth.dispatch({ type: "LOGOUT" })}
						/>
						<span>Logout</span>
					</li>
				</ul>
			</div>
			<div className="bottom">
				<div
					className="colorOption"
					onClick={() => dispatch({ type: "LIGHT" })}
				></div>
				<div
					className="colorOption"
					onClick={() => dispatch({ type: "DARK" })}
				></div>
			</div>
		</div>
	);
};

export default Sidebar;
