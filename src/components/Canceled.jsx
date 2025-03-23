import React from "react";
import styles from "../stylesheets/dashboard.module.css";
import MeetingsOnBooking from "./MeetingsOnBooking";

export default function Canceled() {
  return (
    <div className={styles.bookingContent}>
      <MeetingsOnBooking />
    </div>
  );
}
