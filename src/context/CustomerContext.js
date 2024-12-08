import { createContext, useContext, useReducer, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import CustomerReducer from "./CustomerReducer";
import { useCompanyContext } from "./CompanyContext"; // Import the CompanyContext

const INITIAL_STATE = {
	allCustomers: [], // Cached customer list
	matchingCustomers: [], // Customers that match the current search query
};

export const CustomerContext = createContext(INITIAL_STATE);
export const useCustomerContext = () => useContext(CustomerContext);

export const CustomerContextProvider = ({ children }) => {
	const { selectedCompany } = useCompanyContext(); // Get the selected company from CompanyContext
	const [state, dispatch] = useReducer(CustomerReducer, INITIAL_STATE);

	// Set all customers
	const setAllCustomers = (customers) =>
		dispatch({ type: "SET_ALL_CUSTOMERS", payload: customers });

	// Set matching customers (local search results)
	const setMatchingCustomers = (customers) =>
		dispatch({ type: "SET_MATCHING_CUSTOMERS", payload: customers });

	// Clear matching customers (reset search)
	const clearMatchingCustomers = () =>
		dispatch({ type: "CLEAR_MATCHING_CUSTOMERS" });

	// Local search function
	const searchCustomers = (name) => {
		if (!name.trim()) {
			clearMatchingCustomers(); // Clear results if input is empty
			return;
		}

		const matches = state.allCustomers.filter((customer) =>
			customer.displayName.toLowerCase().includes(name.toLowerCase())
		);
		setMatchingCustomers(matches);
	};

	// Fetch customers whenever the selected company changes
	useEffect(() => {
		if (!selectedCompany) return; // If no company is selected, skip fetching

		const fetchCustomers = async () => {
			try {
				const querySnapshot = await getDocs(
					collection(db, selectedCompany, "management", "customers")
				);
				const customers = querySnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setAllCustomers(customers); // Cache customers in the context
			} catch (error) {
				console.error(
					`Error fetching customers for ${selectedCompany}:`,
					error
				);
				setAllCustomers([]); // Clear customers if there's an error
			}
		};

		fetchCustomers();
	}, [selectedCompany]); // Runs whenever the selected company changes

	return (
		<CustomerContext.Provider
			value={{
				allCustomers: state.allCustomers,
				matchingCustomers: state.matchingCustomers,
				setAllCustomers,
				searchCustomers,
				clearMatchingCustomers,
			}}
		>
			{children}
		</CustomerContext.Provider>
	);
};
