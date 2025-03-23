import React, { useState } from "react";
import Navigation from "../components/Navigation";
import Event from "../components/Event";
import Booking from "../components/Booking";
import CreateMeeting from "../components/CreateMeeting";
import styles from "../stylesheets/dashboard.module.css";
import UserProfile from "../components/UserProfile";
import Availability from "../components/Availability";

function Dashboard({ host }) {
  const [activeTab, setActiveTab] = useState("Events");
  const [meetings, setMeetings] = useState([]);
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

  const addMeeting = (newMeeting) => {
    setMeetings((prev) => [...prev, { ...newMeeting, isActive: true }]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Events":
        return (
          <Event
            setMeetings={setMeetings}
            setActiveTab={setActiveTab}
            meetings={meetings}
            setFormData={setFormData}
          />
        );
      case "Booking":
        return <Booking />;
      case "CreateMeeting":
        return (
          <CreateMeeting
            host={host}
            formData={formData}
            setFormData={setFormData}
            addMeeting={addMeeting}
            setActiveTab={setActiveTab}
          />
        );
      case "Settings":
        return <UserProfile />;
      case "Availability":
        return <Availability />;
      default:
        return (
          <Event
            setMeetings={setMeetings}
            setActiveTab={setActiveTab}
            meetings={meetings}
            setFormData={setFormData}
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
