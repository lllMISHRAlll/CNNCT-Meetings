import React, { useState } from "react";
import styles from "../stylesheets/dashboard.module.css";
import Upcoming from "./Upcoming";
import Pending from "./Pending";
import Canceled from "./Canceled";
import Past from "./Past";

function Booking() {
  const [activeTab, setActiveTab] = useState("Upcoming");

  const renderComponent = () => {
    switch (activeTab) {
      case "Upcoming":
        return <Upcoming />;
      case "Pending":
        return <Pending />;
      case "Canceled":
        return <Canceled />;
      case "Past":
        return <Past />;
      default:
        return <Upcoming />;
    }
  };

  return (
    <div className={styles.bookingContainer}>
      <h1>Booking</h1>
      <p>See upcoming and past events booked through your event type links.</p>

      <div className={styles.bookingSections}>
        <div className={styles.bookingHead}>
          {["Upcoming", "Pending", "Canceled", "Past"].map((tab) => (
            <div
              key={tab}
              className={activeTab === tab ? styles.activeTab : ""}
              onClick={() => setActiveTab(tab)}
            >
              <p>{tab}</p>
            </div>
          ))}
        </div>

        <div className={styles.bookingContentContainer}>
          {renderComponent()}
        </div>
      </div>
    </div>
  );
}

export default Booking;
