import { doc, runTransaction } from "firebase/firestore";
import { db } from "../firebase";

export const getNextInvoiceId = async (selectedCompany) => {
  const invoiceCounterRef = doc(
    db,
    selectedCompany,
    "admin",
    "invoiceCounters",
    "nextInvoiceNumber"
  );

  try {
    const newInvoiceId = await runTransaction(db, async (transaction) => {
      const counterDoc = await transaction.get(invoiceCounterRef);

      if (!counterDoc.exists()) {
        throw new Error("Counter document does not exist.");
      }

      const currentInvoiceNumber = counterDoc.data().nextInvoiceNumber;

      // Increment and update the counter
      transaction.update(invoiceCounterRef, {
        nextInvoiceNumber: currentInvoiceNumber + 1,
      });

      return currentInvoiceNumber;
    });

    return newInvoiceId; // Return the incremented invoice number
  } catch (error) {
    console.error("Failed to retrieve next invoice number:", error);
    throw error; // Rethrow the error for handling upstream
  }
};

export const incrementVisitCount = async (selectedCompany, customerId) => {
  const customerRef = doc(
    db,
    `${selectedCompany}/management/customers`,
    customerId
  );

  try {
    await runTransaction(db, async (transaction) => {
      const customerSnapshot = await transaction.get(customerRef);
      if (customerSnapshot.exists()) {
        const currentVisitCount = customerSnapshot.data().visitCount || 0;
        transaction.update(customerRef, {
          visitCount: currentVisitCount + 1,
        });
      } else {
        throw new Error("Customer document does not exist");
      }
    });
  } catch (error) {
    console.error("Error incrementing visit count: ", error);
    throw error; // Optionally rethrow to handle errors in calling function
  }
};
