import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState } from "react";
import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import {
  getCustomerByName,
  initializeInvoiceCounter,
} from "../../helpers/queries";
import {
  defaultCustomerData,
  serviceType,
  vehicleType,
} from "../../helpers/defaultData";
import { useCompanyContext } from "../../context/CompanyContext";
import CustomerSearch from "../../components/search/CustomerSearch";
import { getNextInvoiceId } from "../../helpers/firebase-helper";
import { serviceInputs } from "../../formSource";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ServiceDetails from "../../components/services/ServiceDetails";

const NewInvoice = ({ inputs, title, collectionName }) => {
  const [data, setData] = useState({ start: null, end: null });
  const [customerName, setCustomerName] = useState(""); // Store customer name
  const [customerId, setCustomerId] = useState(""); // Store customer ID after creation or fetch
  const [customerData, setCustomerData] = useState({});
  const [services, setServices] = useState([]);
  const navigate = useNavigate();
  const { selectedCompany } = useCompanyContext();

  const handleCustomerSelect = async (customer) => {
    // Set customer name and populate data immediately
    setCustomerName(customer.displayName);
    const updatedData = {
      ...defaultCustomerData(customer), // Populate with default and customer data
      ...customer, // Overwrite with actual customer values
    };
    setCustomerData(customer);
    setData(updatedData); // Update 'data' as the single source of truth
  };

  const handleInput = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Fetch or create customer, then add invoice
  const handleAdd = async (e) => {
    e.preventDefault();
    const formattedData = {
      ...data,
      start: data.start ? data.start.toISOString() : null,
      end: data.end ? data.end.toISOString() : null,
    };
    await initializeInvoiceCounter({ selectedCompany });
    try {
      let currentCustomerId = customerId;
      let currentCustomerData = customerData;

      // Check if customer exists by name
      if (!currentCustomerId) {
        const getCustomerQuery = getCustomerByName({
          selectedCompany,
          customerName,
        });
        const querySnapshot = await getDocs(getCustomerQuery);

        if (!querySnapshot.empty) {
          // Customer exists, retrieve ID and details
          const customerDoc = querySnapshot.docs[0];
          currentCustomerId = customerDoc.id;
          currentCustomerData = customerDoc.data();
        } else {
          // Customer doesn't exist, create a new document with full details
          const newCustomerRef = doc(
            collection(db, `${selectedCompany}`, "management", "customers")
          );
          const newCustomerData = defaultCustomerData({
            ...formattedData,
            ...customerData,
          });

          await setDoc(newCustomerRef, newCustomerData);

          currentCustomerId = newCustomerRef.id;
          currentCustomerData = newCustomerData;
        }

        // Set state with fetched or created customer data
        setCustomerId(currentCustomerId);
        setCustomerData(currentCustomerData);
      }

      // Retrieve and increment the next invoice ID using a transaction
      const newInvoiceId = await getNextInvoiceId(selectedCompany);

      // Reference for the global invoices collection
      const globalInvoiceRef = doc(
        collection(db, selectedCompany, "management", collectionName)
      );
      // Reference for the customer's specific invoices subcollection
      const customerInvoiceRef = doc(
        collection(
          db,
          selectedCompany,
          "management",
          "customers",
          currentCustomerId,
          collectionName
        ),
        globalInvoiceRef.id // Use the same ID for both documents
      );

      // Prepare the invoice data
      const invoiceData = {
        ...formattedData,
        ...currentCustomerData,
        services,
        customerId: currentCustomerId, // For easier reference in global invoices
        invoiceId: newInvoiceId,
        timeStamp: serverTimestamp(),
      };

      const batch = writeBatch(db);
      batch.set(globalInvoiceRef, invoiceData); // Add to global invoices collection
      batch.set(customerInvoiceRef, invoiceData); // Add to customer-specific invoices subcollection

      // Commit the batch write
      await batch.commit();

      navigate(-1);
    } catch (err) {
      console.error("Error adding invoice:", err);
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form onSubmit={handleAdd}>
              <div className="formContent">
                {/* Customer Name Field */}
                <CustomerSearch onCustomerSelect={handleCustomerSelect} />

                {/* Render standard inputs */}
                {inputs.map((input) => (
                  <div className="formInput" key={input.id}>
                    <label>{input.label}</label>
                    {input.id === "start" || input.id === "end" ? (
                      <DatePicker
                        selected={data[input.id]} // Bind the DatePicker to the `data` state
                        className="datePicker"
                        onChange={(date) =>
                          setData((prevData) => ({
                            ...prevData,
                            [input.id]: date,
                          }))
                        }
                        showTimeSelect
                        dateFormat="Pp" // Example: 12/18/2024, 4:00 PM
                        timeIntervals={30} // Allow only 30-minute intervals
                        placeholderText={`Select ${input.label.toLowerCase()}`}
                      />
                    ) : input.type === "select" && !input.multiSelect ? (
                      <select
                        id={input.id}
                        onChange={handleInput}
                        value={data[input.id] || ""}
                      >
                        <option value="" disabled>
                          {input.placeholder}
                        </option>
                        {input.options.map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id={input.id}
                        type={input.type}
                        placeholder={input.placeholder}
                        onChange={handleInput}
                        value={data[input.id] || ""}
                        required={input.required || false}
                      />
                    )}
                  </div>
                ))}

                {/* Service details input fields */}
                <ServiceDetails
                  services={services}
                  setServices={setServices}
                  vehicleType={vehicleType}
                  serviceType={serviceType}
                  serviceInputs={serviceInputs}
                  companyName={selectedCompany}
                />
              </div>
              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewInvoice;
