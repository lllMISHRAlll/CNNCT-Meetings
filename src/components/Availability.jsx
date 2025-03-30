import React, { useState } from "react";
import styles from "../stylesheets/availability.module.css";
import InputHours from "./InputHours";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faList } from "@fortawesome/free-solid-svg-icons";
import CustomCalendar from "./Calender";

const Availability = ({
  availability,
  setAvailability,
  fetchUserInfo,
  meetings,
}) => {
  const [activeView, setActiveView] = useState("Availability");
  const sampleDate = new Date(2025, 2, 30, 10, 0);
  const formattedEvents = meetings?.map((event) => {
    const [day, month, year] = event.date.split("/").map(Number);
    const [hours, minutes] = event.time.split(":").map(Number);

    const eventHours =
      event.period === "PM" && hours !== 12 ? hours + 12 : hours;
    const eventMonth = month - 1;

    const start = new Date(year, eventMonth, day, eventHours, minutes);
    const end = new Date(start.getTime() + event.duration * 60 * 60 * 1000);

    return {
      id: event._id,
      title: event.topic,
      start,
      end,
    };
  });

  const [view, setView] = React.useState("month");
  const [date, setDate] = React.useState(new Date());

  return (
    <div className={styles.main}>
      <h1>Availability</h1>
      <p>Configure times when you are available for bookings</p>

      <div className={styles.toggleButtons}>
        <button
          className={activeView === "Availability" ? styles.active : ""}
          onClick={() => setActiveView("Availability")}
        >
          <FontAwesomeIcon icon={faList} />
          Availability
        </button>
        <button
          className={activeView === "CalendarView" ? styles.active : ""}
          onClick={() => setActiveView("CalendarView")}
        >
          <FontAwesomeIcon icon={faCalendar} />
          Calendar View
        </button>
      </div>

      <div className={styles.container}>
        {activeView === "Availability" ? (
          <InputHours
            fetchUserInfo={fetchUserInfo}
            availability={availability}
            setAvailability={setAvailability}
          />
        ) : (
          <CustomCalendar
            view={view}
            setView={setView}
            date={date}
            setDate={setDate}
            events={formattedEvents}
          />
        )}
      </div>
    </div>
  );
};

export default Availability;
