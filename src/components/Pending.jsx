import React from "react";
import styles from "../stylesheets/dashboard.module.css";
import MeetingsOnBooking from "./MeetingsOnBooking";

export default function Pending({ meetings, hostId, isPending, setActiveTab }) {
  const pendingMeetings = meetings.filter(
    (event) =>
      event.createdBy !== hostId &&
      event.participants.some(
        (p) => p.userId === hostId && p.status.toUpperCase() === "PENDING"
      )
  );

  return (
    <div className={styles.bookingContent}>
      {pendingMeetings.map((event, i) => (
        <MeetingsOnBooking
          key={i}
          event={event}
          isPending={isPending}
          setActiveTab={setActiveTab}
        />
      ))}
    </div>
  );
}
