const CompanyReducer = (state, action) => {
	switch (action.type) {
		case "SET_COMPANY":
			return {
				...state, // Ensure previous state properties are retained
				selectedCompany: action.payload,
			};
		case "CLEAR_COMPANY":
			return {
				...state, // Retain companies in the state
				selectedCompany: null,
			};
		default:
			return state;
	}
};

export default CompanyReducer;
