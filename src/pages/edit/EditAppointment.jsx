import "./edit.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCustomerByName,
  getGlobalInvoiceDocument,
} from "../../helpers/queries";
import { serviceType, vehicleType } from "../../helpers/defaultData";
import { useCompanyContext } from "../../context/CompanyContext";
import { serviceInputs } from "../../formSource";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ServiceDetails from "../../components/services/ServiceDetails";

const EditAppointment = ({ inputs, title, collectionName }) => {
  const [data, setData] = useState({ start: null, end: null });
  const [customerName, setCustomerName] = useState(""); // Store customer name
  const [customerId, setCustomerId] = useState(""); // Store customer ID after creation or fetch
  const [globalInvoiceId, setGlobalInvoiceId] = useState("");
  const [customerData, setCustomerData] = useState({});
  const [services, setServices] = useState([]);
  const { appointmentId } = useParams();
  const { selectedCompany } = useCompanyContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(
          db,
          selectedCompany,
          "management",
          collectionName,
          appointmentId
        );
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const currentAppointmentData = docSnap.data();
          setData({
            ...currentAppointmentData,
            start: currentAppointmentData.start
              ? new Date(currentAppointmentData.start)
              : null,
            end: currentAppointmentData.end
              ? new Date(currentAppointmentData.end)
              : null,
          });
          setServices(currentAppointmentData.services);
          setCustomerName(currentAppointmentData.displayName);
        } else {
          setData({ error: "Document not found" });
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
      }
    };

    fetchData();
  }, [collectionName, appointmentId, selectedCompany]);

  const handleInput = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Fetch or create customer, then add invoice
  const handleEdit = async (e) => {
    e.preventDefault();

    const formattedData = {
      ...data,
      start: data.start ? data.start.toISOString() : null,
      end: data.end ? data.end.toISOString() : null,
    };

    try {
      let currentCustomerId = customerId;
      let currentCustomerData = customerData;
      let currentGlobalInvoiceId = globalInvoiceId;
      const batch = writeBatch(db);

      // Check if customer exists by name
      if (!currentCustomerId) {
        const getCustomerQuery = getCustomerByName({
          selectedCompany,
          customerName,
        });
        const querySnapshot = await getDocs(getCustomerQuery);

        if (!querySnapshot.empty) {
          const customerDoc = querySnapshot.docs[0];
          currentCustomerId = customerDoc.id;
          currentCustomerData = customerDoc.data();
        } else {
          const newCustomerRef = doc(
            collection(db, selectedCompany, "management", "customers")
          );
          currentCustomerId = newCustomerRef.id;
          currentCustomerData = { name: customerName }; // Add default data here
          batch.set(newCustomerRef, currentCustomerData);
        }

        setCustomerId(currentCustomerId);
        setCustomerData(currentCustomerData);
      }

      const getGlobalInvoiceDocQuery = getGlobalInvoiceDocument({
        selectedCompany,
        customerName,
      });
      const globalInvoiceDocQuerySnapshot = await getDocs(
        getGlobalInvoiceDocQuery
      );

      if (!globalInvoiceDocQuerySnapshot.empty) {
        const globalInvoiceDoc = globalInvoiceDocQuerySnapshot.docs[0];
        currentGlobalInvoiceId = globalInvoiceDoc.id;
        setGlobalInvoiceId(currentGlobalInvoiceId);
      } else {
        const newGlobalInvoiceRef = doc(
          collection(db, selectedCompany, "management", "invoices")
        );
        currentGlobalInvoiceId = newGlobalInvoiceRef.id;
        batch.set(newGlobalInvoiceRef, {
          ...formattedData,
          services,
          timeStamp: serverTimestamp(),
        });
      }

      const globalInvoiceRef = doc(
        db,
        selectedCompany,
        "management",
        "invoices",
        currentGlobalInvoiceId
      );
      const customerInvoiceRef = doc(
        collection(
          db,
          selectedCompany,
          "management",
          "customers",
          currentCustomerId,
          "invoices"
        ),
        currentGlobalInvoiceId
      );
      const appointmentRef = doc(
        db,
        selectedCompany,
        "management",
        collectionName,
        appointmentId
      );

      const customerRef = doc(
        db,
        selectedCompany,
        "management",
        "customers",
        currentCustomerId
      );

      const invoiceData = {
        ...formattedData,
        services,
        customerId: currentCustomerId,
        timeStamp: serverTimestamp(),
      };

      const updatedCustomerData = {
        ...customerData,
        email: formattedData.email || "",
        streetAddress1: formattedData.streetAddress1 || "",
        phone: formattedData.phone || "",
      };

      // Ensure documents exist or set them if not
      const globalInvoiceSnap = await getDoc(globalInvoiceRef);
      if (globalInvoiceSnap.exists()) {
        batch.update(globalInvoiceRef, invoiceData);
      } else {
        batch.set(globalInvoiceRef, invoiceData, { merge: true });
      }

      // Update customer invoice
      const customerInvoiceSnap = await getDoc(customerInvoiceRef);
      if (customerInvoiceSnap.exists()) {
        batch.update(customerInvoiceRef, invoiceData);
      } else {
        batch.set(customerInvoiceRef, invoiceData, { merge: true });
      }

      // Update appointment data with invoice data
      const appointmentSnap = await getDoc(appointmentRef);
      if (appointmentSnap.exists()) {
        batch.update(appointmentRef, invoiceData);
      } else {
        batch.set(appointmentRef, invoiceData, { merge: true });
      }

      // Update customer info if changed
      const customerSnap = await getDoc(customerRef);
      if (customerSnap.exists()) {
        batch.update(customerRef, updatedCustomerData);
      } else {
        batch.set(customerRef, updatedCustomerData, { merge: true });
      }

      // Commit the batch
      await batch.commit();
      console.log("Batch commit successful.");
      navigate(-1);
    } catch (err) {
      console.error("Error updating invoice:", err);
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
                    required
                  />
                </div>

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
              <button type="submit">Update</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAppointment;
