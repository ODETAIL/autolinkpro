import { serverTimestamp } from "firebase/firestore";

export const vehicleType = [
  "Suv",
  "Truck",
  "Sedan",
  "Minivan",
  "Convertible",
  "Hatchback",
  "Coupe",
];
export const invoiceType = ["A", "M", "O"];
export const serviceType = [
  "Windshield",
  "Door Glass",
  "Back Glass",
  "Sunroof",
  "Mirror",
  "Quarter Glass",
  "Chip Subscription",
  "Warranty",
  "Add Custom",
];
export const replacementEligibleServices = [
  "Windshield",
  "Door Glass",
  "Back Glass",
  "Sunroof",
  "Mirror",
  "Quarter Glass",
];
export const colors = [
  "#413c4d",
  "#212d40",
  "#19212e",
  "#1e1619",
  "#2a1716",
  "#522d2d",
  "#7a4343",
];

export const defaultCustomerData = (customerData) => {
  return {
    displayName: customerData.displayName || "",
    city: customerData.city || "",
    email: customerData.email || "",
    phone: customerData.phone || "",
    postalCode: customerData.postalCode || "",
    streetAddress1: customerData.streetAddress1 || "",
    streetAddress2: customerData.streetAddress2 || "",
    visitCount: customerData.visitCount || 1,
    timeStamp: customerData.timeStamp || serverTimestamp(),
  };
};

export const defaultInvoiceData = ({ customerName }) => {
  return {
    displayName: customerName,
    city: "",
    email: "",
    phone: "",
    postalCode: "",
    streetAddress1: "",
    streetAddress2: "",
    makemodel: "",
    status: "",
    year: "",
    services: [],
  };
};
