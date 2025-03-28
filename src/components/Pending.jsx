import React from "react";
import styles from "../stylesheets/dashboard.module.css";
import MeetingsOnBooking from "./MeetingsOnBooking";

export default function Pending({ meetings, hostId }) {
  return (
    <div className={styles.bookingContent}>
      {meetings.length > 0 ? (
        meetings.map((event) => (
          <MeetingsOnBooking
            key={event._id}
            event={event}
            hostId={hostId}
            isPending={true}
          />
        ))
      ) : (
        <h1 className={styles.noMeetings}>No Pending Meetings</h1>
      )}
    </div>
  );
}
