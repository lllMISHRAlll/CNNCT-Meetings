import React, { useState } from "react";
import styles from "../stylesheets/dashboard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faPen, faTrashCan } from "@fortawesome/free-solid-svg-icons";

function Event({ setActiveTab, meetings, setMeetings, setFormData }) {
  const [activeEvents, setActiveEvents] = useState(
    meetings.reduce((acc, event) => ({ ...acc, [event.link]: true }), {})
  );

  const toggleEvent = (link) => {
    setActiveEvents((prev) => ({
      ...prev,
      [link]: !prev[link],
    }));
  };

  const copyLink = (link) => {
    navigator.clipboard.writeText(link);
    alert("Meeting link copied!");
  };

  const deleteMeeting = (link) => {
    setMeetings((prev) => prev.filter((event) => event.link !== link));
  };

  const editMeeting = (event) => {
    setFormData(event);
    setActiveTab("CreateMeeting");
  };

  return (
    <div className={styles.eventContainer}>
      <div className={styles.upperContent}>
        <div>
          <h1>Event Types</h1>
          <p>Create events to share for people to book on your calendar.</p>
        </div>
        <button
          className={styles.newEvent}
          type="submit"
          onClick={() => setActiveTab("CreateMeeting")}
        >
          <b>+</b> Add New Event
        </button>
      </div>

      {meetings.length === 0 ? (
        <h2 className={styles.noMeetings}>No meetings are scheduled.</h2>
      ) : (
        <div className={styles.eventList}>
          {meetings.map((event) => (
            <div
              key={event.link}
              className={
                activeEvents[event.link]
                  ? styles.eventTileActive
                  : styles.eventTileInActive
              }
            >
              <div className={styles.eventHeader}>
                <span>{event.topic}</span>
                <button type="button" onClick={() => editMeeting(event)}>
                  <FontAwesomeIcon icon={faPen} />
                </button>
              </div>
              <div className={styles.eventdatesANdInfo}>
                <div>{event.date}</div>
                <span>
                  {event.time} {event.period}
                </span>
                <p>{event.duration}</p>
              </div>

              <div className={styles.eventFooter}>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={activeEvents[event.link]}
                    onChange={() => toggleEvent(event.link)}
                    className={styles.switchInput}
                  />
                  <span className={styles.switchSlider}></span>
                </label>
                <button onClick={() => copyLink(event.link)}>
                  <FontAwesomeIcon icon={faCopy} />
                </button>
                <button onClick={() => deleteMeeting(event.link)}>
                  <FontAwesomeIcon icon={faTrashCan} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Event;
