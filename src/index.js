import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";
import { DarkModeContextProvider } from "./context/darkModeContext";
import { CompanyContextProvider } from "./context/CompanyContext";
import { CustomerContextProvider } from "./context/CustomerContext";

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);

root.render(
	<React.StrictMode>
		<DarkModeContextProvider>
			<AuthContextProvider>
				<CompanyContextProvider>
					<CustomerContextProvider>
						<App />
					</CustomerContextProvider>
				</CompanyContextProvider>
			</AuthContextProvider>
		</DarkModeContextProvider>
	</React.StrictMode>
);
