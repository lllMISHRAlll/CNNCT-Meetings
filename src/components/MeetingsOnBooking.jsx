import React, { useState } from "react";
import style from "../stylesheets/dashboard.module.css";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function MeetingsOnBooking() {
  const [toggleMembersModal, settoggleMembersModal] = useState(false);

  return (
    <div className={style.meeting}>
      <div className={style.meetingInner}>
        <div>
          <p>Friday, 28 feb</p>
          <span>1:30</span>
        </div>
        <div>
          <h3>Meeting-2</h3>
          <p className={style.teamCount}>You and 2</p>
        </div>
      </div>
      <div className={style.participantsAndStatus}>
        <label>Accepted</label>
        <p onClick={() => settoggleMembersModal(!toggleMembersModal)}>
          <FontAwesomeIcon icon={faUserGroup} /> &nbsp; 13 people
        </p>
        {toggleMembersModal && (
          <div className={style.membersModal}>
            <h2>Participants</h2>
            <div className={style.memberList}>
              <ul>
                <li>
                  <input type="checkbox" />
                  serfs
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
