import { createContext, useContext, useReducer } from "react";
import CompanyReducer from "./CompanyReducer";

const INITIAL_STATE = {
	selectedCompany: "odetail",
	companies: ["odetail", "aztec"],
};

export const CompanyContext = createContext(INITIAL_STATE);
export const useCompanyContext = () => useContext(CompanyContext);

export const CompanyContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(CompanyReducer, INITIAL_STATE);

	const setCompany = (company) =>
		dispatch({ type: "SET_COMPANY", payload: company });
	const clearCompany = () => dispatch({ type: "CLEAR_COMPANY" });

	return (
		<CompanyContext.Provider
			value={{
				selectedCompany: state.selectedCompany,
				companies: state.companies,
				setCompany,
				clearCompany,
			}}
		>
			{children}
		</CompanyContext.Provider>
	);
};
