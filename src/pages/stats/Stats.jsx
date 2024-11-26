import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./stats.scss";

import TopProducts from "../../components/top/TopProducts";
import ChartStats from "../../components/stat-charts/ChartStats";
import List from "../../components/table/Table";

const Stats = () => {
	return (
		<div className="stats">
			<Sidebar />
			<div className="statsContainer">
				<Navbar />
				<div className="charts">
					<TopProducts collectionName="employees" />
					<ChartStats aspect={2 / 1} />
				</div>
				<div className="listContainerWrapper">
					<div className="listContainer">
						<List listType="vehicles" />
					</div>
					<div className="listContainer">
						<List listType="job" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Stats;
