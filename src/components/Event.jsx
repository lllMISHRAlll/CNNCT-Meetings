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
      toast.info(
        newStatus ? "Meeting set to Activated" : "Meeting set to Deactivated"
      );
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
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setMeetings((prev) => prev.filter((event) => event._id !== eventId));
      toast.success("Meeting deleted successfully!");
    } catch (error) {
      console.error("Error deleting meeting:", error.response?.data || error);
      toast.error("Failed to delete meeting!");
    }
  };

  const editMeeting = (event) => {
    const currentEvent = {
      ...event,
      emails: event.participants?.map((p) => p.email).join(","),
    };
    setFormData(currentEvent);
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

  const decodeToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage");
      return null;
    }

    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const decodedPayload = JSON.parse(atob(base64));
      return decodedPayload;
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  };

  const dcToken = decodeToken();

  function formatDate(dateStr) {
    if (!dateStr) return;

    const [day, month, year] = dateStr.split("/").map(Number);
    const date = new Date(year, month - 1, day);

    const options = { weekday: "long", day: "2-digit", month: "short" };
    const formattedDate = date.toLocaleDateString("en-GB", options);
    return formattedDate.replace(/ (\d+)/, ", $1");
  }

  const formatTimeRange = (time, period, duration) => {
    let [hour, minute] = time.split(":").map(Number);

    // Convert 12-hour format to 24-hour format
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;

    let endHour = hour + duration;

    // Convert back to 12-hour format
    let startHour = hour % 12 || 12;
    let startPeriod = period;

    let endPeriod = endHour >= 12 ? "PM" : "AM";
    let formattedEndHour = endHour % 12 || 12;

    return `${startHour}:${minute
      .toString()
      .padStart(2, "0")} ${startPeriod} - ${formattedEndHour}:${minute
      .toString()
      .padStart(2, "0")} ${endPeriod}`;
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

      {meetings?.length === 0 ? (
        <h2 className={styles.noMeetings}>No meetings are scheduled.</h2>
      ) : (
        <div className={styles.eventList}>
          {meetings?.map((event) => {
            const hasConflict = conflict?.eventConflict.some(
              ({ e1 }) => e1 === event._id
            );
            const isAvailable = conflict?.availableForThisMeeting.some(
              (availability) => Object.keys(availability)[0] === event._id
            );

            const canEdit = dcToken.userId === event.createdBy;

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
                  {canEdit && (
                    <button type="button" onClick={() => editMeeting(event)}>
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                  )}
                </div>

                <div className={styles.eventdatesANdInfo}>
                  <div>{formatDate(event.date)}</div>
                  <span>
                    {formatTimeRange(event.time, event.period, event.duration)}
                  </span>
                  <p>
                    {event.duration} {event.duration > 1 ? "hours" : "hour"},{" "}
                    Group Meeting
                  </p>
                </div>

                <div className={styles.eventFooter}>
                  <>
                    {canEdit && (
                      <label className={styles.switch}>
                        <input
                          type="checkbox"
                          checked={event.isActive}
                          onChange={() =>
                            toggleEvent(event._id, event.isActive)
                          }
                          className={styles.switchInput}
                        />
                        <span className={styles.switchSlider}></span>
                      </label>
                    )}

                    <button onClick={() => copyLink(event.link)}>
                      <FontAwesomeIcon icon={faCopy} />
                    </button>
                    {canEdit && (
                      <button onClick={() => deleteMeeting(event._id)}>
                        <FontAwesomeIcon icon={faTrashCan} />
                      </button>
                    )}
                  </>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Event;
