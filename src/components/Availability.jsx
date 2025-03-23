import React, { useState } from "react";
import styles from "../stylesheets/availability.module.css";
import InputHours from "./InputHours";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faList } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import CustomCalendar from "./Calender";

const Availability = () => {
  const [activeView, setActiveView] = useState("Availability");
  const [calendarView, setCalendarView] = useState("month");
  const [date, setDate] = useState(moment().toDate());

  const events = [
    {
      title: "Team Meeting",
      start: new Date(2025, 2, 25, 10, 0),
      end: new Date(2025, 2, 25, 11, 0),
    },
    {
      title: "Project Deadline",
      start: new Date(2025, 2, 31, 15, 0),
      end: new Date(2025, 2, 31, 16, 0),
    },
  ];

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
          <InputHours />
        ) : (
          <CustomCalendar
            view={calendarView}
            setView={setCalendarView}
            date={date}
            setDate={setDate}
            events={events}
          />
        )}
      </div>
    </div>
  );
};

export default Availability;
