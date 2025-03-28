import React, { useEffect, useState } from "react";
import styles from "../stylesheets/dashboard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleExclamation,
  faCopy,
  faPen,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { getBaseURI } from "../utils/config";
import { toast } from "react-toastify";

function Event({
  setActiveTab,
  meetings,
  setMeetings,
  setFormData,
  setEditable,
}) {
  const [conflict, setConflict] = useState();
  const [processedConflicts, setProcessedConflicts] = useState(new Map());
  const toggleEvent = async (eventId, currentStatus) => {
    const newStatus = !currentStatus;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${getBaseURI()}/api/event/updateevent/${eventId}`,
        { isActive: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMeetings((prev) =>
        prev.map((event) =>
          event._id === eventId ? { ...event, isActive: newStatus } : event
        )
      );
      newStatus
        ? toast.info("Meeting set to Activated")
        : toast.info("Meeting set to Deactivated");
    } catch (error) {
      console.error(
        "Error updating event:",
        error.response?.data || error.message
      );
    }
  };

  const copyLink = (link) => {
    navigator.clipboard.writeText(link);
    alert("Meeting link copied!");
  };

  const deleteMeeting = async (eventId) => {
    try {
      await axios.delete(`${getBaseURI()}/api/event/deleteevent/${eventId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setMeetings((prev) => prev.filter((event) => event._id !== eventId));
      toast.success("Meeting deleted successfully!");
    } catch (error) {
      console.error("Error deleting meeting:", error.response?.data || error);
      toast.error("Failed to delete meeting!");
    }
  };

  const editMeeting = (event) => {
    setFormData(event);
    setEditable(true);
    setActiveTab("CreateMeeting");
  };

  useEffect(() => {
    const fetchConflicts = async () => {
      try {
        const res = await axios.get(`${getBaseURI()}/api/event/getconflicts`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setConflict(res.data);

        const availabilityMap = Object.assign(
          {},
          ...res.data.availableForThisMeeting
        );
        const conflictMap = new Map();

        res.data.eventConflict.forEach(({ e1, e2 }) => {
          conflictMap.set(e1, {
            conflict: true,
            available: availabilityMap[e1] ?? null,
          });
          conflictMap.set(e2, {
            conflict: true,
            available: availabilityMap[e2] ?? null,
          });
        });
      } catch (error) {
        console.error(
          "Error fetching event availability info:",
          error.response?.data || error.message
        );
      }
    };

    fetchConflicts();
  }, []);

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
          {(() => {
            const processedConflicts = new Map();

            if (conflict) {
              conflict.eventConflict.forEach(({ e1 }) => {
                processedConflicts.set(e1, { conflict: true });
              });

              conflict.availableForThisMeeting.forEach((availability) => {
                const eventId = Object.keys(availability)[0];
                const isAvailable = availability[eventId];
                if (!processedConflicts.has(eventId)) {
                  processedConflicts.set(eventId, {});
                }
                processedConflicts.get(eventId).available = isAvailable;
              });
            }

            return meetings.map((event) => {
              const conflictData = processedConflicts.get(event._id);
              const hasConflict = conflictData?.conflict || false;
              const isAvailable = conflictData?.available ?? true;

              return (
                <div
                  key={event._id}
                  className={
                    event.isActive
                      ? styles.eventTileActive
                      : styles.eventTileInActive
                  }
                >
                  {(hasConflict || !isAvailable) && (
                    <div className={styles.conflictShow}>
                      <div className={styles.conflictIcon}>
                        <FontAwesomeIcon
                          icon={faCircleExclamation}
                          style={{ color: "#ed0000" }}
                        />
                      </div>
                      <div className={styles.conflictText}>
                        {hasConflict && <p>Conflict of Timing</p>}
                        {!isAvailable && (
                          <p>You are not Available for this Meeting</p>
                        )}
                      </div>
                    </div>
                  )}

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
                    <p>
                      {event.duration} {event.duration > 1 ? "hours" : "hour"}
                    </p>
                  </div>

                  <div className={styles.eventFooter}>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={event.isActive}
                        onChange={() => toggleEvent(event._id, event.isActive)}
                        className={styles.switchInput}
                      />
                      <span className={styles.switchSlider}></span>
                    </label>
                    <button onClick={() => copyLink(event.link)}>
                      <FontAwesomeIcon icon={faCopy} />
                    </button>
                    <button onClick={() => deleteMeeting(event._id)}>
                      <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                  </div>
                </div>
              );
            });
          })()}
        </div>
      )}
    </div>
  );
}

export default Event;
