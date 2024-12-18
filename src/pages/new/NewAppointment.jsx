import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useLocation, useNavigate } from "react-router-dom";
import { Chip, IconButton } from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";
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
import {
  getNextInvoiceId,
  incrementVisitCount,
} from "../../helpers/firebase-helper";
import { serviceInputs } from "../../formSource";

const NewAppointment = ({ inputs, title, collectionName }) => {
  const [data, setData] = useState({});
  const [customerName, setCustomerName] = useState(""); // Store customer name
  const [customerId, setCustomerId] = useState(""); // Store customer ID after creation or fetch
  const [customerData, setCustomerData] = useState({});
  const [newService, setNewService] = useState({
    vtype: "",
    name: "",
    code: "",
    price: "",
    quantity: 1,
    itype: "",
    notes: "",
  });
  const [services, setServices] = useState([]);
  const [isCustomService, setIsCustomService] = useState(false);
  const navigate = useNavigate();
  const { selectedCompany } = useCompanyContext();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const optionalCustomerId = query.get("customerId");

  useEffect(() => {
    if (optionalCustomerId) {
      const fetchData = async () => {
        try {
          const docSnap = await getDoc(
            doc(
              db,
              selectedCompany,
              "management",
              "customers",
              optionalCustomerId
            )
          );
          if (docSnap.exists()) {
            setCustomerData(docSnap.data());
          } else {
            console.log("No such document!");
            setCustomerData({ error: "Document not found" });
          }
        } catch (error) {
          console.error("Error fetching document: ", error);
        }
      };

      fetchData();
    }
  }, [optionalCustomerId, selectedCompany]);

  const handleCustomerSelect = async (customer) => {
    setCustomerName(customer.displayName);
    setCustomerData(customer);

    // Populate 'data' state with default and customer data
    const updatedData = {
      ...defaultCustomerData(customer),
      ...customer, // Merge customer data
    };

    setData(updatedData);
  };

  const handleInput = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleServiceChange = (e, field) => {
    const selectedValue = e.target.value;
    if (selectedValue === "Add Custom") {
      setIsCustomService(true);
      setNewService({ ...newService, [field]: "" });
    } else {
      setIsCustomService(false);
      setNewService({ ...newService, [field]: selectedValue });
    }
  };

  const handleAddService = () => {
    if (newService.name && newService.price) {
      setServices([...services, newService]);
      setNewService({
        vtype: "",
        name: "",
        code: "",
        price: "",
        quantity: 1,
        itype: "",
        notes: "",
      }); // Reset service input fields
      setIsCustomService(false); // Reset custom service option
    }
  };

  // Handle removing a service entry
  const handleDeleteService = (index) => {
    setServices(services.filter((_, i) => i !== index));
  };

  // Fetch or create customer, then add invoice
  const handleAdd = async (e) => {
    e.preventDefault();
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

          // Increment visit count for returning customer
          await incrementVisitCount(selectedCompany, currentCustomerId);
        } else {
          // Customer doesn't exist, create a new document with full details
          const newCustomerRef = doc(
            collection(db, `${selectedCompany}`, "management", "customers")
          );
          const newCustomerData = defaultCustomerData({
            ...data,
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
        collection(db, selectedCompany, "management", "invoices")
      );
      // Reference for the customer's specific invoices subcollection
      const customerInvoiceRef = doc(
        collection(
          db,
          selectedCompany,
          "management",
          "customers",
          currentCustomerId,
          "invoices"
        ),
        globalInvoiceRef.id // Use the same ID for both documents
      );

      const appointmentRef = doc(
        collection(db, selectedCompany, "management", collectionName)
      );

      // Prepare the invoice data
      const invoiceData = {
        ...data,
        ...currentCustomerData,
        services,
        customerId: currentCustomerId, // For easier reference in global invoices
        invoiceId: newInvoiceId,
        status: "draft",
        timeStamp: serverTimestamp(),
      };

      const batch = writeBatch(db);
      batch.set(globalInvoiceRef, invoiceData); // Add to global invoices collection
      batch.set(customerInvoiceRef, invoiceData); // Add to customer-specific invoices subcollection
      batch.set(appointmentRef, invoiceData);
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
                    {input.type === "select" && !input.multiSelect && (
                      <select
                        id={input.id}
                        onChange={handleInput}
                        value={data[input.id] || customerData[input.id] || ""}
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
                <div className="serviceInputGroup">
                  <h3>Add Service</h3>
                  <select
                    value={newService.vtype}
                    onChange={(e) => handleServiceChange(e, "vtype")}
                  >
                    <option value="" disabled>
                      Select Vehicle Type
                    </option>
                    {vehicleType.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {!isCustomService ? (
                    <select
                      value={newService.name}
                      onChange={(e) => handleServiceChange(e, "name")}
                    >
                      <option value="" disabled>
                        Select Service
                      </option>
                      {serviceType.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="Custom Service"
                      value={newService.name}
                      onChange={(e) =>
                        setNewService({
                          ...newService,
                          name: e.target.value,
                        })
                      }
                    />
                  )}
                  {serviceInputs.map((input) =>
                    input.type === "select" ? (
                      <select
                        key={input.id}
                        value={newService[input.id] || ""}
                        onChange={(e) => handleServiceChange(e, input.id)}
                      >
                        <option value="" disabled>
                          {input.placeholder}
                        </option>
                        {input.options &&
                          input.options.map((option, index) => (
                            <option key={index} value={option}>
                              {option}
                            </option>
                          ))}
                      </select>
                    ) : (
                      <input
                        key={input.id}
                        type={input.type}
                        placeholder={input.placeholder}
                        value={newService[input.id] || input.defaultValue || ""}
                        onChange={(e) =>
                          setNewService({
                            ...newService,
                            [input.id]: e.target.value,
                          })
                        }
                      />
                    )
                  )}
                  <IconButton onClick={handleAddService}>
                    <AddCircleOutline />
                  </IconButton>
                </div>

                {/* Display added services */}
                <div className="servicesList">
                  {services.map((service, index) => (
                    <div key={index} className="serviceItem">
                      <Chip
                        label={
                          selectedCompany === "aztec"
                            ? `${service.name} - ${service.code} - $${service.price}`
                            : `${service.name} - $${service.price}`
                        }
                        onDelete={() => handleDeleteService(index)}
                        className="chipItem"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewAppointment;
