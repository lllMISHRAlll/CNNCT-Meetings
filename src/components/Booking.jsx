import React, { useEffect, useState } from "react";
import styles from "../stylesheets/dashboard.module.css";
import Upcoming from "./Upcoming";
import Pending from "./Pending";
import Canceled from "./Canceled";
import Past from "./Past";

function Booking({ meetings, hostId, setMeetings }) {
  const [activeTab, setActiveTab] = useState("");
  const isPending = activeTab === "Pending";

  const renderComponent = () => {
    switch (activeTab) {
      case "Pending":
        return (
          <Pending
            setMeetings={setMeetings}
            meetings={meetings}
            hostId={hostId}
            isPending={isPending}
            setActiveTab={setActiveTab}
          />
        );
      case "Canceled":
        return <Canceled meetings={meetings} hostId={hostId} />;
      case "Past":
        return <Past meetings={meetings} hostId={hostId} />;
      default:
        return <Upcoming meetings={meetings} hostId={hostId} />;
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
