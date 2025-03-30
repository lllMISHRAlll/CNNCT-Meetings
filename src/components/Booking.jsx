import React, { useEffect, useMemo, useState } from "react";
import styles from "../stylesheets/dashboard.module.css";
import Upcoming from "./Upcoming";
import Pending from "./Pending";
import Canceled from "./Canceled";
import Past from "./Past";

function Booking({ meetings: initialMeetings, hostId, setMeetings }) {
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [filteredMeetings, setFilteredMeetings] = useState({
    upcoming: [],
    pending: [],
    canceled: [],
    past: [],
  });

  useEffect(() => {
    const currentTime = new Date();
    const filtered = { upcoming: [], pending: [], canceled: [], past: [] };

    initialMeetings.forEach((event) => {
      try {
        const [day, month, year] = event.date.split("/");
        let [hours, minutes] = event.time
          .split(":")
          .map((val) => val.padStart(2, "0"));

        let eventDateTime = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day),
          parseInt(hours),
          parseInt(minutes)
        );

        if (event.period === "PM" && parseInt(hours) < 12) {
          eventDateTime.setHours(eventDateTime.getHours() + 12);
        }

        console.log("Event:", event.topic);
        console.log("Event DateTime:", eventDateTime);
        console.log("Current Time:", currentTime);
        console.log("Is Expired?", eventDateTime <= currentTime);

        const participant = event.participants.find((p) => p.userId === hostId);
        const isHost = event.createdBy === hostId;
        const isExpired = eventDateTime <= currentTime;

        if (isExpired) {
          filtered.past.push(event);
        } else {
          const isRejectedOrCanceled = ["REJECTED", "CANCELED"].includes(
            participant?.status
          );
          const isAccepted = participant?.status === "ACCEPTED";
          const isPending = participant?.status === "PENDING";

          if (isRejectedOrCanceled) {
            filtered.canceled.push(event);
          } else if (isHost || isAccepted) {
            filtered.upcoming.push(event);
          } else if (isPending) {
            filtered.pending.push(event);
          }
        }
      } catch (error) {
        console.error("Error parsing event date:", error);
      }
    });

    setFilteredMeetings(filtered);
  }, [initialMeetings, hostId]);

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
          {activeTab === "Pending" && (
            <Pending
              meetings={filteredMeetings.pending}
              hostId={hostId}
              setMeetings={setMeetings}
            />
          )}
          {activeTab === "Canceled" && (
            <Canceled meetings={filteredMeetings.canceled} hostId={hostId} />
          )}
          {activeTab === "Past" && (
            <Past meetings={filteredMeetings.past} hostId={hostId} />
          )}
          {activeTab === "Upcoming" && (
            <Upcoming meetings={filteredMeetings.upcoming} hostId={hostId} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Booking;
