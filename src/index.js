import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";
import { DarkModeContextProvider } from "./context/darkModeContext";
import { CompanyContextProvider } from "./context/CompanyContext";

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);

root.render(
	<React.StrictMode>
		<DarkModeContextProvider>
			<AuthContextProvider>
				<CompanyContextProvider>
					<App />
				</CompanyContextProvider>
			</AuthContextProvider>
		</DarkModeContextProvider>
	</React.StrictMode>
);
