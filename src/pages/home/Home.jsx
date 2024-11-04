import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
import Widget from "../../components/widget/Widget";
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";

const Home = () => {
	return (
		<div className="home">
			<Sidebar />
			<div className="homeContainer">
				<Navbar />
				<div className="widgets">
					<Widget type="employee" collectionName="employees" />
					<Widget type="customer" collectionName="customers" />
					<Widget type="invoice" collectionName="invoices" />
					<Widget type="earning" collectionName="invoices" />
				</div>
				<div className="charts">
					<Featured />
					<Chart title="Last 6 Months (Revenue)" aspect={2 / 1} />
				</div>
			</div>
		</div>
	);
};

export default Home;
