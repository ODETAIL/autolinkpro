import "./list.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Datatable from "../../components/datatable/Datatable";

const List = ({ collectionName, columns, customerId }) => {
	return (
		<div className="list">
			{!customerId && <Sidebar />}
			<div className="listContainer">
				{!customerId && <Navbar />}

				<Datatable
					collectionName={collectionName}
					columns={columns}
					customerId={customerId}
				/>
			</div>
		</div>
	);
};

export default List;
