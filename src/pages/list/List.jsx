import "./list.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Datatable from "../../components/datatable/Datatable";

const List = ({ collectionName, columns, customerId, isCustomerInvoice }) => {
  return (
    <div className="list">
      {!customerId && <Sidebar />}
      <div className="listContainer">
        {!customerId && <Navbar />}

        <Datatable
          collectionName={collectionName}
          columns={columns}
          customerId={customerId}
          isCustomerInvoice={isCustomerInvoice}
        />
      </div>
    </div>
  );
};

export default List;
