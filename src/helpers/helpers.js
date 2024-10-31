export const calculateSubtotal = (services) => {
	return services?.reduce(
		(acc, service) => acc + (parseInt(service.price) || 0),
		0
	);
};

export const calculateGST = (price) => {
	const gstRate = 0.05; // GST rate in Alberta is 5%
	const total = parseInt(price) * gstRate;
	return total.toFixed(2);
};
