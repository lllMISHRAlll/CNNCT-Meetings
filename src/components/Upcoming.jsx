import React from "react";
import styles from "../stylesheets/dashboard.module.css";
import MeetingsOnBooking from "./MeetingsOnBooking";

export default function Upcoming({ meetings, hostId }) {
  return (
    <div className={styles.bookingContent}>
      {meetings.length > 0 ? (
        meetings.map((event) => (
          <MeetingsOnBooking key={event._id} event={event} hostId={hostId} />
        ))
      ) : (
        <h1 className={styles.noMeetings}>No Meetings Ahead</h1>
      )}
    </div>
  );
}
