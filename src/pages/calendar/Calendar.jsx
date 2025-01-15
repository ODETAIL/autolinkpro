import "./calendar.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { colors } from "../../helpers/defaultData";
import { DeleteOutline, EditOutlined } from "@mui/icons-material";
import { useCompanyContext } from "../../context/CompanyContext";

const Calendar = ({ collectionName, columns }) => {
  const calendarRef = useRef(null);
  const [data, setData] = useState({});
  const [currentEvents, setCurrentEvents] = useState([]);
  const { selectedCompany } = useCompanyContext();
  const navigate = useNavigate();

  // Fetch and listen to events in real-time
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, `${selectedCompany}/management/${collectionName}`),
      (snapShot) => {
        const events = snapShot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          start: doc.data().start,
          end: doc.data().end,
          ...doc.data(),
        }));

        setData(events);
      },
      (error) => {
        console.log("Error fetching events:", error);
      }
    );
    return () => unsub();
  }, [collectionName, selectedCompany]);

  const setAppointments = (events) => {
    const serializableEvents = events.map((event, index) => ({
      ...event,
      id: index,
      title: event.title,
      start: event.start ? new Date(event.start).toISOString() : null,
      end: event.end ? new Date(event.end).toISOString() : null,
      extendedProps: event.extendedProps,
    }));

    setCurrentEvents(serializableEvents);
  };

  const handleAppointmentDrop = async (info) => {
    const invoiceId = info.event._def.extendedProps.invoiceId;

    // Query Firestore to find the document with the matching `invoiceId`
    const appointmentsRef = collection(
      db,
      `${selectedCompany}/management/${collectionName}`
    );
    const q = query(appointmentsRef, where("invoiceId", "==", invoiceId));

    try {
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Assume the first matching document is the one we need
        const docSnapshot = querySnapshot.docs[0];
        const docId = docSnapshot.id;

        const modifiedEvent = {
          start: info.event.start.toISOString(),
          end: info.event.end ? info.event.end.toISOString() : null,
        };

        // Reference the document by its ID and update it
        const eventRef = doc(
          db,
          `${selectedCompany}/management/${collectionName}`,
          docId
        );
        await updateDoc(eventRef, modifiedEvent);

        // Update local state
        setCurrentEvents((prevEvents) =>
          prevEvents.map((event) =>
            event._def.extendedProps.invoiceId === invoiceId
              ? {
                  ...event,
                  start: modifiedEvent.start,
                  end: modifiedEvent.end,
                }
              : event
          )
        );

        console.log("Event updated in Firestore:", modifiedEvent);
      } else {
        console.error("No document found with invoiceId:", invoiceId);
      }
    } catch (error) {
      console.error("Error updating event in Firestore:", error);
    }
  };

  const handleEventClick = async (eventClickInfo) => {
    const currentEvent = eventClickInfo.event;
    const invoiceId = currentEvent._def.extendedProps.invoiceId;

    // Determine the collection reference based on the selected company
    const collectionPath =
      selectedCompany === "aztec"
        ? `${selectedCompany}/management/invoices`
        : `${selectedCompany}/management/${collectionName}`;

    const collectionRef = collection(db, collectionPath);
    const q = query(collectionRef, where("invoiceId", "==", invoiceId));

    try {
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Assume the first matching document is the one we need
        const docSnapshot = querySnapshot.docs[0];
        const docId = docSnapshot.id;
        selectedCompany === "aztec"
          ? navigate(`/invoices/view/${docId}`)
          : navigate(`/${collectionName}/edit/${docId}`);
      } else {
        console.error("No document found with invoiceId:", invoiceId);
      }
    } catch (error) {
      console.error("Error updating event in Firestore:", error);
    }
  };

  const handleDeleteAppointment = async (invoiceId) => {
    // Query Firestore to find the document with the matching `invoiceId`
    const appointmentsRef = collection(
      db,
      `${selectedCompany}/management/${collectionName}`
    );
    const q = query(appointmentsRef, where("invoiceId", "==", invoiceId));

    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const docSnapshot = querySnapshot.docs[0];
        const docId = docSnapshot.id;

        // Reference the document by its ID and update it
        const eventRef = doc(
          db,
          `${selectedCompany}/management/${collectionName}`,
          docId
        );

        // Delete the document from Firestore
        await deleteDoc(eventRef);

        // Update the local state to remove the event from the UI
        setCurrentEvents((prevEvents) =>
          prevEvents.filter(
            (event) => event._def.extendedProps.invoiceId !== invoiceId
          )
        );
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  const handleEditAppointment = async (invoiceId) => {
    // Determine the collection reference based on the selected company
    const collectionPath =
      selectedCompany === "aztec"
        ? `${selectedCompany}/management/invoices`
        : `${selectedCompany}/management/${collectionName}`;

    const collectionRef = collection(db, collectionPath);
    const q = query(collectionRef, where("invoiceId", "==", invoiceId));

    try {
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Assume the first matching document is the one we need
        const docSnapshot = querySnapshot.docs[0];
        const docId = docSnapshot.id;
        selectedCompany === "aztec"
          ? navigate(`/invoices/view/${docId}`)
          : navigate(`/${collectionName}/edit/${docId}`);
      } else {
        console.error("No document found with invoiceId:", invoiceId);
      }
    } catch (error) {
      console.error("Error updating event in Firestore:", error);
    }
  };

  return (
    <div className="calendar">
      <Sidebar />
      <div className="calendarContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <div className="eventTitleContainer">
              <h1 className="title">Appointments</h1>
              <Link to={`/${collectionName}/new`} className="link">
                Add New
              </Link>
            </div>
            <div className="eventContainer">
              {currentEvents
                .filter((event) => new Date(event.start) >= new Date())
                .map((event, index) => (
                  <div
                    key={event.id}
                    className="eventCard"
                    style={{
                      backgroundColor: colors[index % colors.length],
                    }}
                    onClick={() =>
                      handleEventClick({
                        event: {
                          _def: {
                            extendedProps: {
                              invoiceId: event.extendedProps.invoiceId,
                            },
                          },
                        },
                      })
                    } // Call handleEventClick when the card is clicked
                  >
                    <div className="eventInfo">
                      <h3 className="eventTitle">{event.title}</h3>
                      <p className="eventDescription">
                        {event.extendedProps.notes}
                      </p>
                    </div>
                    <div className="eventDateBox">
                      <span className="eventDate">
                        {new Date(event.start).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="eventActions">
                      <DeleteOutline
                        className="deleteIcon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAppointment(
                            event.extendedProps.invoiceId
                          );
                        }}
                      />
                      <EditOutlined
                        className="editIcon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditAppointment(event.extendedProps.invoiceId);
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="right">
            <FullCalendar
              ref={calendarRef}
              height="75vh"
              plugins={[
                dayGridPlugin,
                timeGridPlugin,
                interactionPlugin,
                listPlugin,
              ]}
              headerToolbar={{
                left: "prev,next,today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
              }}
              initialView="dayGridMonth"
              editable={true}
              selectMirror={true}
              dayMaxEvents={true}
              eventClick={handleEventClick}
              eventDisplay="block"
              events={data}
              // eventContent={renderEventContent}
              eventsSet={(events) => setAppointments(events)}
              eventDrop={(event) => handleAppointmentDrop(event)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
