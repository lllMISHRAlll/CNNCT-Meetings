import React, { useState } from "react";
import styles from "../stylesheets/createMeeting.module.css";
import MeetingInput from "./MeetingInput";
import MeetingBanner from "./MeetingBanner";

function CreateMeeting({
  formData,
  setFormData,
  addMeeting,
  setActiveTab,
  host,
}) {
  const [showBanner, setShowBanner] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    setShowBanner(true);
  };

  const handleBannerSubmit = (e) => {
    e.preventDefault();
    addMeeting(formData);
    setShowBanner(false);
    setActiveTab("Events");
    console.log(formData);

    setFormData({
      topic: "",
      password: "",
      host: "",
      description: "",
      date: "",
      time: "",
      period: "AM",
      timezone: "",
      duration: "",
    });
  };

  return (
    <div className={styles.main}>
      <h1>Create Event</h1>
      <p>Create events to share for people to book on your calendar.</p>
      <div className={styles.createMeetingContainer}>
        <div className={styles.header}>
          <h1>Add Event</h1>
        </div>

        {showBanner ? (
          <MeetingBanner
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleBannerSubmit}
            setToggleBanner={setShowBanner}
          />
        ) : (
          <MeetingInput
            host={host}
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleInputSubmit}
            setActiveTab={setActiveTab}
            setToggleBanner={setShowBanner}
          />
        )}
      </div>
    </div>
  );
}

export default CreateMeeting;
