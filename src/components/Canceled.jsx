import React from "react";
import styles from "../stylesheets/dashboard.module.css";
import MeetingsOnBooking from "./MeetingsOnBooking";

export default function Canceled({ meetings, hostId }) {
  return (
    <div className={styles.bookingContent}>
      {meetings.map((event) => (
        <MeetingsOnBooking key={event._id} event={event} hostId={hostId} />
      ))}
    </div>
  );
}
