import "./calendar.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
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
import { companyName, db } from "../../firebase";
import { colors } from "../../helpers/defaultData";
import { DeleteOutline } from "@mui/icons-material";

const Calendar = ({ collectionName, columns }) => {
	const calendarRef = useRef(null);
	const [data, setData] = useState({});
	const [currentEvents, setCurrentEvents] = useState([]);

	// Fetch and listen to events in real-time
	useEffect(() => {
		const unsub = onSnapshot(
			collection(db, `${companyName}/management/${collectionName}`),
			(snapShot) => {
				let events = [];
				snapShot.docs.forEach((doc) => {
					// Convert Firestore timestamps to JavaScript Dates
					const eventData = doc.data();
					events.push({
						...eventData,
						id: doc.id,
						title: eventData.title,
						start: eventData.start,
						end: eventData.end,
					});
				});
				setData(events); // Update state with events from Firestore
				addEventsToCalendar(events); // Add events to the calendar
			},
			(error) => {
				console.log("Error fetching events:", error);
			}
		);
		return () => unsub();
	}, [collectionName]);

	const addEventsToCalendar = (events) => {
		const calendarApi = calendarRef.current.getApi();
		calendarApi.removeAllEvents(); // Clear existing events
		events.forEach((event) => {
			calendarApi.addEvent(event); // Add each event from Firestore
		});
	};

	const setAppointments = (events) => {
		const serializableEvents = events.map((event, index) => ({
			...event,
			id: index,
			title: event.title,
			start: event.start.toISOString(),
			end: event.end.toISOString(),
			extendedProps: event.extendedProps,
		}));

		setCurrentEvents(serializableEvents);
	};

	const handleAppointmentDrop = async (info) => {
		const invoiceId = info.event._def.extendedProps.invoiceId;

		// Query Firestore to find the document with the matching `invoiceId`
		const appointmentsRef = collection(
			db,
			`${companyName}/management/${collectionName}`
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
					`${companyName}/management/${collectionName}`,
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

	const handleEventClick = (eventClickInfo) => {
		const { title, start, end, extendedProps } = eventClickInfo.event;
		console.log(eventClickInfo.event);
		alert(`
			Title: ${title}
			Start: ${start.toLocaleString()}
			End: ${end ? end.toLocaleString() : "N/A"}
			Customer Name: ${extendedProps.displayName}
			Code: ${extendedProps.code}
			Email: ${extendedProps.email}
			Phone Number: ${extendedProps.phone}
			Notes: ${extendedProps.notes}
		`);
	};

	const handleDeleteAppointment = async (invoiceId) => {
		// Query Firestore to find the document with the matching `invoiceId`
		const appointmentsRef = collection(
			db,
			`${companyName}/management/${collectionName}`
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
					`${companyName}/management/${collectionName}`,
					docId
				);

				// Delete the document from Firestore
				await deleteDoc(eventRef);

				// Update the local state to remove the event from the UI
				setCurrentEvents((prevEvents) =>
					prevEvents.filter(
						(event) =>
							event._def.extendedProps.invoiceId !== invoiceId
					)
				);
			}
		} catch (error) {
			console.error("Error deleting appointment:", error);
		}
	};

	// const renderEventContent = (eventInfo) => (
	// 	<div
	// 		style={{
	// 			backgroundColor:
	// 				eventInfo.event.extendedProps.color || "#023e8a",
	// 		}}
	// 	>
	// 		<b>{eventInfo.timeText}</b>
	// 		<i>{eventInfo.event.title}</i>
	// 	</div>
	// );
	return (
		<div className="calendar">
			<Sidebar />
			<div className="calendarContainer">
				<Navbar />
				<div className="top">
					<div className="left">
						<div className="eventTitleContainer">
							<h1 className="title">Appointments</h1>
							<Link
								to={`/${collectionName}/new`}
								className="link"
							>
								Add New
							</Link>
						</div>
						<div className="eventContainer">
							{currentEvents
								.filter(
									(event) =>
										new Date(event.start) >= new Date()
								)
								.map((event, index) => (
									<div
										key={event.id}
										className="eventCard"
										style={{
											backgroundColor:
												colors[index % colors.length],
										}}
									>
										<DeleteOutline
											className="deleteIcon"
											onClick={() =>
												handleDeleteAppointment(
													event.extendedProps
														.invoiceId
												)
											}
										/>
										<div className="eventInfo">
											<h3 className="eventTitle">
												{event.title}
											</h3>
											<p className="eventDescription">
												{event.extendedProps.notes}
											</p>
										</div>
										<div className="eventDateBox">
											<span className="eventDate">
												{new Date(
													event.start
												).toLocaleDateString("en-GB", {
													day: "2-digit",
													month: "2-digit",
													year: "numeric",
												})}
											</span>
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
							eventBackgroundColor={""}
							eventTextColor={""}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Calendar;
