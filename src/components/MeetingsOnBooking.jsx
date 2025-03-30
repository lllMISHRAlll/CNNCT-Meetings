import React, { useState } from "react";
import style from "../stylesheets/dashboard.module.css";
import { faBan, faCheck, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { toast } from "react-toastify";
import { getBaseURI } from "../utils/config";

export default function MeetingsOnBooking({
  event,
  isPending,
  hostId,
  handleStatusChange,
  canceled,
  setMeetings,
}) {
  const [toggleMembersModal, settoggleMembersModal] = useState(false);
  const currentStatus =
    event.participants.find((p) => p.userId === hostId)?.status || "pending";

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${getBaseURI()}/api/event/getevents`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const { events } = res.data;

      setMeetings(events);
    } catch (error) {
      console.error(
        "Error fetching events:",
        error.response?.data || error.message
      );
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      await axios.patch(
        `${getBaseURI()}/api/event/updatestatus/${event._id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.info(`Meeting ${newStatus}`);
      await fetchEvents();
      handleStatusChange?.(event._id, newStatus);
    } catch (error) {
      console.error("Error updating status:", error.response?.data || error);
      toast.error("Failed to update status");
    }
  };

  function formatDate(dateStr) {
    const [day, month, year] = dateStr.split("/").map(Number);
    const date = new Date(year, month - 1, day);

    const options = { weekday: "long", day: "2-digit", month: "short" };
    const formattedDate = date.toLocaleDateString("en-GB", options);
    return formattedDate.replace(/ (\d+)/, ", $1");
  }

  return (
    <div className={style.meeting}>
      <div className={style.meetingInner}>
        <div className={style.meetingDate}>
          <p>{formatDate(event.date)}</p>
          <span>{event.time}</span>
        </div>
        <div className={style.meetingTopic}>
          <h4>{event.topic}</h4>
          <p className={style.teamCount}>
            You and {event.participants.length - 1}
          </p>
        </div>
      </div>

      {isPending && (
        <div className={style.statusBtn}>
          <button
            type="submit"
            className={style.rejectBtn}
            onClick={() => updateStatus("rejected")}
          >
            <FontAwesomeIcon icon={faBan} />
            <span>Reject</span>
          </button>
          <button
            type="submit"
            className={style.acceptBtn}
            onClick={() => updateStatus("accepted")}
          >
            <FontAwesomeIcon icon={faCheck} />
            <span>Accept</span>
          </button>
        </div>
      )}

      <div
        className={canceled ? style.rejectBtnBg : style.participantsAndStatus}
      >
        {!isPending && <label>{currentStatus}</label>}

        <p onClick={() => settoggleMembersModal(!toggleMembersModal)}>
          <FontAwesomeIcon icon={faUserGroup} /> &nbsp;
          {event.participants.length} <span>people</span>
        </p>

        {toggleMembersModal && (
          <div className={style.membersModal}>
            <h2>
              Participants <span>({event.participants.length})</span>
              {isPending && (
                <div className={style.statusBtnModal}>
                  <button
                    type="submit"
                    className={style.rejectBtn}
                    onClick={() => updateStatus("rejected")}
                  >
                    <FontAwesomeIcon icon={faBan} />
                    Reject
                  </button>
                  <button
                    type="submit"
                    className={style.acceptBtn}
                    onClick={() => updateStatus("accepted")}
                  >
                    <FontAwesomeIcon icon={faCheck} />
                    Accept
                  </button>
                </div>
              )}
            </h2>
            <div className={style.memberList}>
              <ul>
                {event.participants.map((p, index) => (
                  <li key={index}>
                    <p>{p.name || "NA"}</p>
                    <input
                      type="checkbox"
                      checked={p.status === "ACCEPTED"}
                      readOnly
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
