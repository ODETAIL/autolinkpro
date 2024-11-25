import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./stats.scss";

import TopProducts from "../../components/top/TopProducts";
import ChartStats from "../../components/stat-charts/ChartStats";
import JobWidget from "../../components/widget/JobWidget";
import {
	replacementEligibleServices,
	vehicleType,
} from "../../helpers/defaultData";
import VehicleWidget from "../../components/widget/VehicleWidget";

const Stats = () => {
	return (
		<div className="stats">
			<Sidebar />
			<div className="statsContainer">
				<Navbar />
				<div className="widgets">
					{replacementEligibleServices.map((jobType) => (
						<JobWidget key={jobType} type={jobType} />
					))}
				</div>
				<div className="charts">
					<TopProducts collectionName="employees" />
					<ChartStats aspect={2 / 1} />
				</div>
				<div className="widgets">
					{vehicleType.map((vType) => (
						<VehicleWidget key={vType} type={vType} />
					))}
				</div>
			</div>
		</div>
	);
};

export default Stats;
