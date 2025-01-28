import React, { useState } from "react";
import { IconButton, Chip } from "@mui/material";
import { AddCircleOutline, SaveAs } from "@mui/icons-material";
import "./services.scss";

const ServiceDetails = ({
  services,
  setServices,
  vehicleType,
  serviceType,
  serviceInputs,
  companyName,
}) => {
  const [newService, setNewService] = useState({
    vtype: "",
    name: "",
    code: "",
    price: "",
    quantity: 1,
    itype: "",
    notes: "",
  });
  const [isCustomService, setIsCustomService] = useState(false);
  const [editIndex, setEditIndex] = useState(null); // Track the index of the service being edited

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
      if (editIndex !== null) {
        // Update an existing service
        const updatedServices = [...services];
        updatedServices[editIndex] = newService;
        setServices(updatedServices);
        setEditIndex(null); // Reset edit mode
      } else {
        // Add a new service
        setServices([...services, newService]);
      }

      // Reset newService state
      setNewService({
        vtype: "",
        name: "",
        code: "",
        price: "",
        quantity: 1,
        itype: "",
        notes: "",
      });
      setIsCustomService(false); // Reset custom service option
    }
  };

  const handleDeleteService = (index) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const handleEditService = (index) => {
    setNewService(services[index]); // Populate the form with the selected service's details
    setEditIndex(index); // Set the index of the service being edited
    setIsCustomService(services[index].name === ""); // Check if it's a custom service
  };

  return (
    <div className="serviceContainer">
      <div className="serviceInputGroup">
        <h3>{editIndex !== null ? "Edit Service" : "Add Service"}</h3>
        {/* Vehicle Type Dropdown */}
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

        {/* Service Name Dropdown or Custom Input */}
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

        {/* Additional Service Inputs */}
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
              value={newService[input.id] || ""}
              onChange={(e) =>
                setNewService({
                  ...newService,
                  [input.id]: e.target.value,
                })
              }
            />
          )
        )}

        {/* Add or Update Service Button */}
        <IconButton onClick={handleAddService}>
          {editIndex !== null ? <SaveAs /> : <AddCircleOutline />}
        </IconButton>
      </div>
      {/* Display Added Services */}
      <div className="servicesList">
        {services.map((service, index) => (
          <Chip
            key={index}
            label={
              companyName === "aztec"
                ? `${service.name} - ${service.code} - $${service.price}`
                : `${service.name} - $${service.price}`
            }
            onClick={() => handleEditService(index)} // Edit on chip click
            onDelete={() => handleDeleteService(index)} // Delete on chip delete
            className="chipItem"
          />
        ))}
      </div>
    </div>
  );
};

export default ServiceDetails;
