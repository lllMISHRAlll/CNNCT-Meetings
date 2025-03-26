import React, { useState } from "react";
import styles from "../stylesheets/createMeeting.module.css";
import MeetingInput from "./MeetingInput";
import MeetingBanner from "./MeetingBanner";
import axios from "axios";
import { getBaseURI } from "../utils/config.js";
import { toast } from "react-toastify";

function CreateMeeting({
  formData,
  setFormData,
  addMeeting,
  setActiveTab,
  host,
  editable,
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

  const handleBannerSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = JSON.parse(
        atob(localStorage.getItem("token").split(".")[1])
      );
      const userId = userData.userId;
      const userEmail = userData.email;

      const payload = {
        topic: formData.topic,
        password: formData.password,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        period: formData.period,
        timezone: formData.timezone,
        duration: formData.duration,
        link: formData.link,
        createdBy: userId,
        participants: [
          { email: userEmail, status: "accepted", userId },
          ...(formData.emails
            ? formData.emails.split(",").map((email) => ({
                email: email.trim(),
                status: "pending",
              }))
            : []),
        ],
      };

      let res;
      if (editable && formData._id) {
        res = await axios.put(
          `${getBaseURI()}/api/event/updateevent/${formData._id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        toast.success("Meeting updated successfully!");
      } else {
        res = await axios.post(
          `${getBaseURI()}/api/event/createevent`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        toast.success("Meeting created successfully!");
        addMeeting(res.data);
      }

      setShowBanner(false);
      setActiveTab("Events");

      setFormData({
        topic: "",
        password: "",
        description: "",
        date: "",
        time: "",
        period: "AM",
        timezone: "",
        duration: "",
        link: "",
        emails: "",
      });
    } catch (error) {
      console.error("Error processing meeting:", error.response?.data || error);
    }
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
