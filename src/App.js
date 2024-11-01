import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import {
	employeeColumns,
	customerColumns,
	invoiceColumns,
} from "./datatablesource";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
	appointmentInputs,
	customerInputs,
	employeeInputs,
	invoiceInputs,
} from "./formSource";
import "./style/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/AuthContext";
import NewCustomer from "./pages/new/NewCustomer";
import NewEmployee from "./pages/new/NewEmployee";
import View from "./pages/view/View";
import Edit from "./pages/edit/Edit";
import NewInvoice from "./pages/new/NewInvoice";
import EditInvoice from "./pages/edit/EditInvoice";
import ViewInvoice from "./pages/view/ViewInvoice";
import Calendar from "./pages/calendar/Calendar";
import NewAppointment from "./pages/new/NewAppointment";
import ViewCustomer from "./pages/view/ViewCustomer";
import EditCustomer from "./pages/edit/EditCustomer";

function App() {
	const { darkMode } = useContext(DarkModeContext);

	const { currentUser } = useContext(AuthContext);

	const RequireAuth = ({ children }) => {
		return currentUser ? children : <Navigate to="/login" />;
	};

	return (
		<div className={darkMode ? "app dark" : "app"}>
			<BrowserRouter>
				<Routes>
					<Route path="/">
						<Route path="login" element={<Login />} />
						<Route
							index
							element={
								<RequireAuth>
									<Home />
								</RequireAuth>
							}
						/>
						<Route path="employees">
							<Route
								index
								element={
									<RequireAuth>
										<List
											collectionName="employees"
											columns={employeeColumns}
										/>
									</RequireAuth>
								}
							/>
							<Route
								path="view/:employeeId"
								element={
									<RequireAuth>
										<View collectionName="employees" />
									</RequireAuth>
								}
							/>
							<Route
								path="edit/:userId"
								element={
									<RequireAuth>
										<Edit
											inputs={employeeInputs}
											title="Edit Employee"
											collectionName="employees"
										/>
									</RequireAuth>
								}
							/>
							<Route
								path="new"
								element={
									<RequireAuth>
										<NewEmployee
											inputs={employeeInputs}
											title="Add New Employee"
											collectionName="employees"
										/>
									</RequireAuth>
								}
							/>
						</Route>
						<Route path="appointments">
							<Route
								index
								element={
									<RequireAuth>
										<Calendar
											collectionName="appointments"
											title="Add New Appointment"
										/>
									</RequireAuth>
								}
							/>
							<Route
								path="new"
								element={
									<RequireAuth>
										<NewAppointment
											inputs={appointmentInputs}
											title="Add New Appointment"
											collectionName="appointments"
										/>
									</RequireAuth>
								}
							/>
						</Route>
						<Route path="customers">
							<Route
								index
								element={
									<RequireAuth>
										<List
											collectionName="customers"
											columns={customerColumns}
										/>
									</RequireAuth>
								}
							/>
							<Route
								path="view/:customerId"
								element={
									<RequireAuth>
										<ViewCustomer collectionName="customers" />
									</RequireAuth>
								}
							/>
							<Route
								path="edit/:customerId"
								element={
									<RequireAuth>
										<EditCustomer
											inputs={customerInputs}
											title="Edit Customer"
											collectionName="customers"
										/>
									</RequireAuth>
								}
							/>
							<Route
								path="new"
								element={
									<RequireAuth>
										<NewCustomer
											inputs={customerInputs}
											title="Add New Customer"
											collectionName="customers"
										/>
									</RequireAuth>
								}
							/>
						</Route>
						<Route path="invoices">
							<Route
								index
								element={
									<RequireAuth>
										<List
											collectionName="invoices"
											columns={invoiceColumns}
										/>
									</RequireAuth>
								}
							/>
							<Route
								path="view/:invoiceUid"
								element={
									<RequireAuth>
										<ViewInvoice collectionName="invoices" />
									</RequireAuth>
								}
							/>
							<Route
								path="edit/:invoiceUid"
								element={
									<RequireAuth>
										<EditInvoice
											inputs={invoiceInputs}
											title="Edit Invoice"
											collectionName="invoices"
										/>
									</RequireAuth>
								}
							/>
							<Route
								path="new"
								element={
									<RequireAuth>
										<NewInvoice
											inputs={invoiceInputs}
											title="Add New Invoice"
											collectionName="invoices"
										/>
									</RequireAuth>
								}
							/>
						</Route>
					</Route>
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
