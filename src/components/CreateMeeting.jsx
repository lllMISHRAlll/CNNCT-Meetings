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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBannerSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Your session has expired. Please log in again.");
      }

      let userData;
      try {
        userData = JSON.parse(atob(token.split(".")[1]));
      } catch (e) {
        throw new Error("Invalid session token. Please log in again.");
      }

      if (!userData?.userId || !userData?.email) {
        throw new Error("User information missing. Please log in again.");
      }

      const { userId, email: userEmail } = userData;

      if (!formData.topic || !formData.date || !formData.time) {
        throw new Error("Please fill in all required fields");
      }

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
        console.log(formData._id);

        res = await axios.put(
          `${getBaseURI()}/api/event/updateevent/${formData._id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
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
              Authorization: `Bearer ${token}`,
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
      console.error("Meeting error:", error);

      let errorMessage = "An error occurred while processing your request";

      if (error.response) {
        errorMessage =
          error.response.data?.message ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);

      if (
        error.message.includes("session") ||
        error.message.includes("token")
      ) {
        localStorage.removeItem("token");
      }
    } finally {
      setIsSubmitting(false);
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
            isSubmitting={isSubmitting}
          />
        ) : (
          <MeetingInput
            host={host}
            formData={formData}
            handleChange={handleChange}
            setActiveTab={setActiveTab}
            setToggleBanner={setShowBanner}
          />
        )}
      </div>
    </div>
  );
}

export default CreateMeeting;
