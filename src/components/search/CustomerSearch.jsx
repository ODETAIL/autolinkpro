import React, { useEffect, useRef, useState } from "react";
import { useCustomerContext } from "../../context/CustomerContext";
import "./customer-search.scss";

const CustomerSearch = ({ onCustomerSelect }) => {
  const { matchingCustomers, searchCustomers } = useCustomerContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  let handleBlurTimeout;

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    searchCustomers(value); // Trigger the search functionality
    setShowDropdown(true); // Show the dropdown while searching
  };

  const handleSelect = (customer) => {
    clearTimeout(handleBlurTimeout); // Prevent handleBlur from running
    onCustomerSelect(customer); // Pass the selected customer to the parent
    setSearchTerm(customer.displayName); // Set the selected customer name
    setShowDropdown(false); // Hide the dropdown
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowDropdown(false); // Hide dropdown if clicked outside
    }
  };

  const handleBlur = () => {
    handleBlurTimeout = setTimeout(() => {
      if (
        !matchingCustomers.some(
          (customer) => customer.displayName === searchTerm
        )
      ) {
        onCustomerSelect({ displayName: searchTerm });
      }
      setShowDropdown(false);
    }, 200);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="customerSearch" ref={dropdownRef}>
      <label>Customer</label>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        onFocus={() => setShowDropdown(true)} // Show dropdown on focus
        onBlur={handleBlur}
        className="customerSearchInput"
      />
      {showDropdown && matchingCustomers.length > 0 && (
        <ul className="dropdown">
          {matchingCustomers.map((customer, index) => (
            <li key={index} onClick={() => handleSelect(customer)}>
              {customer.displayName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomerSearch;
