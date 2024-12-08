const CustomerReducer = (state, action) => {
	switch (action.type) {
		case "SET_ALL_CUSTOMERS":
			return {
				...state,
				allCustomers: action.payload,
			};
		case "SET_MATCHING_CUSTOMERS":
			return {
				...state,
				matchingCustomers: action.payload,
			};
		case "CLEAR_MATCHING_CUSTOMERS":
			return {
				...state,
				matchingCustomers: [],
			};
		default:
			return state;
	}
};

export default CustomerReducer;
