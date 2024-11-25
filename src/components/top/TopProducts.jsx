import React, { useEffect, useState } from "react";
import "./topProducts.scss";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useCompanyContext } from "../../context/CompanyContext";

const TopProducts = () => {
	const [dataList, setDataList] = useState([]);
	const { selectedCompany } = useCompanyContext();

	useEffect(() => {
		const fetchTopProducts = async () => {
			try {
				const invoicesQuery = query(
					collection(db, `${selectedCompany}/management/invoices`)
				);
				const querySnapshot = await getDocs(invoicesQuery);

				const productCounts = {};
				querySnapshot.forEach((doc) => {
					const invoice = doc.data();
					if (Array.isArray(invoice.services)) {
						invoice.services.forEach((service) => {
							if (service.name) {
								productCounts[service.name] =
									(productCounts[service.name] || 0) + 1;
							}
						});
					}
				});

				const totalSales = Object.values(productCounts).reduce(
					(acc, count) => acc + count,
					0
				);

				const sortedProducts = Object.entries(productCounts)
					.sort((a, b) => b[1] - a[1])
					.slice(0, 10)
					.map(([name, count]) => ({
						name,
						count,
						percentage: ((count / totalSales) * 100).toFixed(1),
					}));

				setDataList(sortedProducts);
			} catch (error) {
				console.error("Error fetching top products:", error);
			}
		};

		fetchTopProducts();
	}, [selectedCompany]);

	return (
		<div className="top-products">
			<h3 className="title">Top Products</h3>
			<table className="products-table">
				<thead>
					<tr>
						<th>#</th>
						<th>Name</th>
						<th>Popularity</th>
						<th>Sales</th>
					</tr>
				</thead>
				<tbody>
					{dataList.map((product, index) => (
						<tr key={index}>
							<td>{`0${index + 1}`}</td>
							<td>{product.name}</td>
							<td>
								<div className="popularity-bar">
									<div
										className="bar-fill"
										style={{
											width: `${product.percentage}%`,
											backgroundColor: getBarColor(index),
										}}
									/>
								</div>
							</td>
							<td>
								<span
									className="sales-percentage"
									style={{
										borderColor: getBarColor(index),
										color: getBarColor(index),
										backgroundColor: `${getBarColor(
											index
										)}20`, // Lighter background
									}}
								>
									{`${product.percentage}%`}
								</span>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

const getBarColor = (index) => {
	const colors = ["#FF9900", "#00BFFF", "#9370DB", "#FF69B4", "#32CD32"];
	return colors[index % colors.length];
};

export default TopProducts;
