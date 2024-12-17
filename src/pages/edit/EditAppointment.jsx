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
import { Chip, IconButton } from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";
import {
  getCustomerByName,
  getGlobalInvoiceDocument,
} from "../../helpers/queries";
import {
  invoiceType,
  serviceType,
  vehicleType,
} from "../../helpers/defaultData";
import { useCompanyContext } from "../../context/CompanyContext";

const EditAppointment = ({ inputs, title, collectionName }) => {
  const [data, setData] = useState({});
  const [customerName, setCustomerName] = useState(""); // Store customer name
  const [customerId, setCustomerId] = useState(""); // Store customer ID after creation or fetch
  const [globalInvoiceId, setGlobalInvoiceId] = useState("");
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
          setData(currentAppointmentData);
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

    setData({ ...data, [id]: value });
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
    if (newService.name && newService.code && newService.price) {
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
  const handleEdit = async (e) => {
    e.preventDefault();

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
          ...data,
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

      const invoiceData = {
        ...data,
        services,
        customerId: currentCustomerId,
        timeStamp: serverTimestamp(),
      };

      // Ensure documents exist or set them if not
      const globalInvoiceSnap = await getDoc(globalInvoiceRef);
      if (globalInvoiceSnap.exists()) {
        batch.update(globalInvoiceRef, invoiceData);
      } else {
        batch.set(globalInvoiceRef, invoiceData, { merge: true });
      }

      const customerInvoiceSnap = await getDoc(customerInvoiceRef);
      if (customerInvoiceSnap.exists()) {
        batch.update(customerInvoiceRef, invoiceData);
      } else {
        batch.set(customerInvoiceRef, invoiceData, { merge: true });
      }

      const appointmentSnap = await getDoc(appointmentRef);
      if (appointmentSnap.exists()) {
        batch.update(appointmentRef, invoiceData);
      } else {
        batch.set(appointmentRef, invoiceData, { merge: true });
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
                  <input
                    type="text"
                    placeholder="Code"
                    value={newService.code}
                    onChange={(e) =>
                      setNewService({
                        ...newService,
                        code: e.target.value,
                      })
                    }
                  />
                  <select
                    value={newService.itype}
                    onChange={(e) => handleServiceChange(e, "itype")}
                  >
                    <option value="" disabled>
                      Invoice Type
                    </option>
                    {invoiceType.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={newService.quantity ? newService.quantity : 1}
                    onChange={(e) =>
                      setNewService({
                        ...newService,
                        quantity: e.target.value,
                      })
                    }
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={newService.price}
                    onChange={(e) =>
                      setNewService({
                        ...newService,
                        price: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Notes"
                    value={newService.notes}
                    onChange={(e) =>
                      setNewService({
                        ...newService,
                        notes: e.target.value,
                      })
                    }
                  />
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
              <button type="submit">Update</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAppointment;
