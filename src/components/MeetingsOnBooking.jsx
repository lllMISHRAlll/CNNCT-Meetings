import React, { useState, useEffect } from "react";
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
  setActiveTab,
}) {
  const [toggleMembersModal, settoggleMembersModal] = useState(false);
  const [status, setStatus] = useState(
    event.participants.find((p) => p.userId === hostId)?.status || "pending"
  );

  useEffect(() => {
    setStatus(
      event.participants.find((p) => p.userId === hostId)?.status || "pending"
    );
  }, [event]);

  const updateStatus = async (eventId, newStatus) => {
    try {
      const response = await axios.patch(
        `${getBaseURI()}/api/event/updatestatus/${eventId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setStatus(newStatus);
      newStatus === "accepted" ? setActiveTab("") : setActiveTab("Canceled");
      toast.info(`Meeting ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error.response?.data || error);
      toast.error("Failed to update status");
    }
  };

  return (
    <div className={style.meeting}>
      <div className={style.meetingInner}>
        <div className={style.meetingDate}>
          <p>{event.date}</p>
          <span>{event.time}</span>
        </div>
        <div className={style.meetingTopic}>
          <h3>{event.topic}</h3>
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
            onClick={() => updateStatus(event._id, "rejected")}
          >
            <FontAwesomeIcon icon={faBan} />
            Reject
          </button>
          <button
            type="submit"
            className={style.acceptBtn}
            onClick={() => updateStatus(event._id, "accepted")}
          >
            <FontAwesomeIcon icon={faCheck} />
            Accept
          </button>
        </div>
      )}

      <div className={style.participantsAndStatus}>
        {!isPending && <label>{status}</label>}

        <p onClick={() => settoggleMembersModal(!toggleMembersModal)}>
          <FontAwesomeIcon icon={faUserGroup} /> &nbsp;
          {event.participants.length} people
        </p>

        {toggleMembersModal && (
          <div className={style.membersModal}>
            <h2>Participants</h2>
            <div className={style.memberList}>
              <ul>
                {event.participants.map((p, index) => (
                  <li key={index}>
                    <input
                      type="checkbox"
                      checked={p.status === "accepted"}
                      readOnly
                    />
                    {p.email} ({p.status})
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
