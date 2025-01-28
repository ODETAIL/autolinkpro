import "./edit.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate, useParams } from "react-router-dom";
import { useCompanyContext } from "../../context/CompanyContext";
import { serviceInputs } from "../../formSource";
import { serviceType, vehicleType } from "../../helpers/defaultData";
import ServiceDetails from "../../components/services/ServiceDetails";

const EditInvoice = ({ inputs, title, collectionName }) => {
  const [data, setData] = useState({ start: null, end: null });
  const [customerName, setCustomerName] = useState(""); // Store customer name
  const [services, setServices] = useState([]);
  const { invoiceUid } = useParams();
  const navigate = useNavigate();
  const { selectedCompany } = useCompanyContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(
          db,
          selectedCompany,
          "management",
          collectionName,
          invoiceUid
        );
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          setData({ error: "Document not found" });
          return;
        }

        const currentInvoiceData = docSnap.data();
        const invoiceId = currentInvoiceData.invoiceId;
        const displayName = currentInvoiceData.displayName;

        // Create queries for appointments and customers
        const appointmentsRef = collection(
          db,
          `${selectedCompany}/management/appointments`
        );
        const customerRef = collection(
          db,
          `${selectedCompany}/management/customers`
        );

        const [appointmentSnapshot, customerSnapshot] = await Promise.all([
          getDocs(query(appointmentsRef, where("invoiceId", "==", invoiceId))),
          getDocs(query(customerRef, where("displayName", "==", displayName))),
        ]);

        if (!appointmentSnapshot.empty) {
          const appointmentData = appointmentSnapshot.docs[0].data();
          setData({
            ...currentInvoiceData,
            ...appointmentData,
            start: appointmentData.start
              ? new Date(appointmentData.start)
              : null,
            end: appointmentData.end ? new Date(appointmentData.end) : null,
          });
        } else if (!customerSnapshot.empty) {
          const customerData = customerSnapshot.docs[0].data();
          setData({
            ...currentInvoiceData,
            ...customerData,
          });
        } else {
          console.log(
            "No matching appointment or customer found for this invoiceId."
          );
        }

        setServices(currentInvoiceData.services);
        setCustomerName(displayName);
      } catch (error) {
        console.error("Error fetching document: ", error);
      }
    };

    fetchData();
  }, [collectionName, invoiceUid, selectedCompany]);

  const handleInput = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(
        db,
        selectedCompany,
        "management",
        collectionName,
        invoiceUid
      );

      // Fetch current invoice to get customerId
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        console.error("Invoice document not found");
        return;
      }
      const currentInvoiceData = docSnap.data();
      const customerId = currentInvoiceData.customerId; // Assuming customerId is stored in the document

      if (!customerId) {
        console.error("Customer ID not found in invoice document");
        return;
      }

      const customerDataRef = doc(
        db,
        selectedCompany,
        "management",
        "customers",
        customerId
      );

      const customerSnapshot = await getDoc(customerDataRef);
      const currentCustomerData = customerSnapshot.data();

      // Prepare batch update to apply changes to both documents
      const batch = writeBatch(db);

      // Reference for the global invoices collection document
      const globalInvoiceRef = doc(
        db,
        selectedCompany,
        "management",
        collectionName,
        invoiceUid
      );

      // Reference for the customer-specific invoices subcollection document
      const customerInvoiceRef = doc(
        db,
        selectedCompany,
        "management",
        "customers",
        customerId,
        collectionName,
        invoiceUid
      );

      // Updated invoice data
      const updatedInvoiceData = {
        ...data,
        services,
        displayName: customerName,
        timeStamp: serverTimestamp(),
      };

      const updatedCustomerData = {
        ...currentCustomerData,
        ...data,
        displayName: customerName,
        timeStamp: serverTimestamp(),
      };

      // Update both documents in batch
      batch.update(globalInvoiceRef, updatedInvoiceData);
      batch.update(customerInvoiceRef, updatedInvoiceData);
      batch.update(customerDataRef, updatedCustomerData);

      // Commit the batch
      await batch.commit();

      navigate(-1);
    } catch (err) {
      console.error("Error updating document:", err);
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
            <form onSubmit={handleEdit}>
              <div className="formContent">
                {/* Customer Name Field */}
                <div className="formInput">
                  <label>Customer</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Customer name"
                    required={true}
                  />
                </div>

                {/* Render standard inputs */}
                {inputs.map((input) => (
                  <div className="formInput" key={input.id}>
                    <label>{input.label}</label>
                    {input.type === "select" && !input.multiSelect && (
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
                    )}
                    {input.type !== "select" &&
                      input.type !== "multi-select" && (
                        <input
                          id={input.id}
                          type={input.type}
                          placeholder={input.placeholder}
                          onChange={handleInput}
                          value={data[input.id] || ""}
                          required={input.required ? input.required : false}
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
              <button type="submit">Update</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditInvoice;
