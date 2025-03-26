import React from "react";
import styles from "../stylesheets/dashboard.module.css";
import MeetingsOnBooking from "./MeetingsOnBooking";

export default function Upcoming({ meetings, hostId }) {
  const upcomingMeetings = meetings.filter(
    (event) =>
      event.createdBy === hostId ||
      event.participants.some(
        (p) => p.userId === hostId && p.status === "ACCEPTED"
      )
  );

  return (
    <div className={styles.bookingContent}>
      {upcomingMeetings.map((event, i) => (
        <MeetingsOnBooking key={i} event={event} hostId={hostId} />
      ))}
    </div>
  );
}
