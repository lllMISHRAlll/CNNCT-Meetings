import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLink,
  faCalendarDay,
  faClock,
  faGear,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import styles from "../stylesheets/dashboard.module.css";
import { useNavigate } from "react-router-dom";

function Navigation({ activeTab, setActiveTab }) {
  const navigate = useNavigate();
  const [logoutBtnPop, setLogoutBtnPop] = useState(false);
  const tabs = [
    { name: "Events", icon: faLink },
    { name: "Booking", icon: faCalendarDay },
    { name: "Availability", icon: faClock },
    { name: "Settings", icon: faGear },
  ];

  const handleLogOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className={styles.navigationMain}>
      <div className={styles.logo} onClick={() => navigate("/")}>
        <img src="assets/logos/cbi_plug-eu.png" alt="Logo" />
        <p>CNNCT</p>
      </div>
      <div className={styles.navigation}>
        {tabs.map((tab) => (
          <div
            key={tab.name}
            className={`${styles.navItem} ${
              activeTab === tab.name ? styles.active : ""
            }`}
            onClick={() => setActiveTab(tab.name)}
          >
            <FontAwesomeIcon icon={tab.icon} />
            <span>{tab.name}</span>
          </div>
        ))}
        <button
          type="submit"
          className={`${styles.createEvent} ${
            activeTab === "CreateMeeting" ? styles.activeCreate : ""
          }`}
          onClick={() => setActiveTab("CreateMeeting")}
        >
          <b>+</b> Create
        </button>
      </div>
      <div className={styles.logoutBtnWrapper}>
        {logoutBtnPop && (
          <button
            type="submit"
            className={styles.logoutBtn}
            onClick={handleLogOut}
          >
            <FontAwesomeIcon icon={faArrowRightFromBracket} rotation={180} />
            Sign Out
          </button>
        )}

        <button
          className={styles.logoutBtnent}
          type="submit"
          onClick={() => setLogoutBtnPop(!logoutBtnPop)}
        >
          <img src="assets/Rectangle 5526.png" />
          {localStorage.getItem("username")}
        </button>
      </div>
    </div>
  );
}

export default Navigation;
