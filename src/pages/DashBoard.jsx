import React, { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import Event from "../components/Event";
import Booking from "../components/Booking";
import CreateMeeting from "../components/CreateMeeting";
import styles from "../stylesheets/dashboard.module.css";
import UserProfile from "../components/UserProfile";
import Availability from "../components/Availability";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  faLink,
  faCalendarDay,
  faClock,
  faGear,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { getBaseURI } from "../utils/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Dashboard({ host }) {
  const [user, setUser] = useState();
  const [editable, setEditable] = useState(false);
  const [initialEmail, setInitialEmail] = useState("");
  const [meetings, setMeetings] = useState([]);
  const [hostId, setHostId] = useState();
  const [activeTab, setActiveTab] = useState("");
  const [availability, setAvailability] = useState(null);
  const [logoutBtnPop, setLogoutBtnPop] = useState(false);
  const navigate = useNavigate();
  const tabs = [
    { name: "Events", icon: faLink },
    { name: "Booking", icon: faCalendarDay },
    { name: "Availability", icon: faClock },
    { name: "Settings", icon: faGear },
  ];
  const [formData, setFormData] = useState({
    topic: "",
    password: "",
    host: "",
    description: "",
    date: "",
    time: "",
    period: "PM",
    timezone: "",
    duration: "",
    link: "",
    emails: "",
  });

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Something went wrong. Please log in again.");
        return;
      }

      const res = await axios.get(`${getBaseURI()}/api/user/userinfo`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAvailability(res.data?.user?.availability);
      setInitialEmail(res.data.user.email);
      setUser(res.data.user);
    } catch (error) {
      console.error(
        "Error fetching user info:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchEvents = async () => {
      try {
        if (!token) return;

        const res = await axios.get(`${getBaseURI()}/api/event/getevents`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { events, userId } = res.data;

        setHostId(userId);

        setMeetings(events);
      } catch (error) {
        console.error(
          "Error fetching events:",
          error.response?.data || error.message
        );
      }
    };

    fetchEvents();
  }, [activeTab]);

  const addMeeting = (newMeeting) => {
    setMeetings((prev) => [...prev, { ...newMeeting, isActive: true }]);
  };

  const handleLogOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Booking":
        return (
          <Booking
            meetings={meetings}
            hostId={hostId}
            setMeetings={setMeetings}
          />
        );
      case "CreateMeeting":
        return (
          <CreateMeeting
            host={host}
            formData={formData}
            setFormData={setFormData}
            addMeeting={addMeeting}
            setActiveTab={setActiveTab}
            editable={editable}
          />
        );
      case "Settings":
        return (
          <UserProfile
            user={user}
            initialEmail={initialEmail}
            fetchUserInfo={fetchUserInfo}
          />
        );
      case "Availability":
        return (
          <Availability
            fetchUserInfo={fetchUserInfo}
            availability={availability}
            setAvailability={setAvailability}
            meetings={meetings}
          />
        );
      default:
        return (
          <Event
            setMeetings={setMeetings}
            setActiveTab={setActiveTab}
            meetings={meetings}
            setFormData={setFormData}
            setEditable={setEditable}
          />
        );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.mobileHead}>
        <div className={styles.logo}>
          <img src="assets/logos/cbi_plug-eu.png" alt="Logo" />
          <p>CNNCT</p>
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
          </button>
        </div>
      </div>
      <div className={styles.left}>
        <Navigation
          logoutBtnPop={logoutBtnPop}
          setLogoutBtnPop={setLogoutBtnPop}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          handleLogOut={handleLogOut}
        />
      </div>
      <div className={styles.content}>{renderContent()}</div>
      <div className={styles.mobileNav}>
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
      </div>
    </div>
  );
}

export default Dashboard;
