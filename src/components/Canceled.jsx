import React from "react";
import styles from "../stylesheets/dashboard.module.css";
import MeetingsOnBooking from "./MeetingsOnBooking";

export default function Canceled({ meetings, hostId }) {
  const canceledMeetings = meetings.filter(
    (event) =>
      event.createdBy !== hostId &&
      event.participants.some(
        (p) => p.userId === hostId && p.status === "REJECTED"
      )
  );

  return (
    <div className={styles.bookingContent}>
      {canceledMeetings.map((event, i) => (
        <MeetingsOnBooking key={i} event={event} />
      ))}
    </div>
  );
}
