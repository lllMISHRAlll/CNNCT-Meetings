import React, { useState } from "react";
import styles from "../stylesheets/availability.module.css";
import InputHours from "./InputHours";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faList } from "@fortawesome/free-solid-svg-icons";
import CustomCalendar from "./Calender";

const Availability = ({ availability, setAvailability, fetchUserInfo }) => {
  const [activeView, setActiveView] = useState("Availability");

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
          <CustomCalendar />
        )}
      </div>
    </div>
  );
};

export default Availability;
