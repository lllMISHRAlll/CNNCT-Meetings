import React, { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import Event from "../components/Event";
import Booking from "../components/Booking";
import CreateMeeting from "../components/CreateMeeting";
import styles from "../stylesheets/dashboard.module.css";
import UserProfile from "../components/UserProfile";
import Availability from "../components/Availability";
import axios from "axios";
import { toast } from "react-toastify";
import { getBaseURI } from "../utils/config";

function Dashboard({ host }) {
  const [user, setUser] = useState();
  const [editable, setEditable] = useState(false);
  const [initialEmail, setInitialEmail] = useState("");
  const [meetings, setMeetings] = useState([]);
  const [hostId, setHostId] = useState();
  const [activeTab, setActiveTab] = useState("");
  const [availability, setAvailability] = useState(null);
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
      if (!token) {
        toast.error("Something went wrong. Please log in again.");
        return;
      }

      const res = await axios.get(`${getBaseURI()}/api/user/userinfo`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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
        return <UserProfile user={user} initialEmail={initialEmail} />;
      case "Availability":
        return (
          <Availability
            fetchUserInfo={fetchUserInfo}
            availability={availability}
            setAvailability={setAvailability}
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
      <div className={styles.left}>
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <div className={styles.content}>{renderContent()}</div>
    </div>
  );
}

export default Dashboard;
