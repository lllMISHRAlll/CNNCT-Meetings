import React, { useEffect, useState } from "react";
import styles from "../stylesheets/createMeeting.module.css";

function MeetingInput({
  formData,
  handleChange,
  setActiveTab,
  setToggleBanner,
}) {
  const [timezones, setTimezones] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchTimezones = () => {
      if (typeof Intl.supportedValuesOf === "function") {
        return Intl.supportedValuesOf("timeZone");
      } else {
        return [
          "UTC",
          "America/New_York",
          "America/Chicago",
          "America/Los_Angeles",
          "Europe/London",
          "Asia/Kolkata",
          "Asia/Tokyo",
          "Australia/Sydney",
        ];
      }
    };

    setTimezones(fetchTimezones());
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.topic.trim()) newErrors.topic = true;
    if (!formData.host?.trim()) newErrors.host = true;
    if (!formData.date.trim()) newErrors.date = true;
    if (!formData.time.trim()) newErrors.time = true;
    if (!formData.timezone.trim()) newErrors.timezone = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTimeChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 2) value = value.slice(0, 2) + ":" + value.slice(2, 4);
    if (value.length > 5) value = value.slice(0, 5);
    handleChange({ target: { name: "time", value } });
  };

  const handleDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    let day = value.slice(0, 2);
    let month = value.slice(2, 4);
    let year = value.slice(4, 8);

    if (parseInt(day) > 31) day = "31";
    if (parseInt(month) > 12) month = "12";

    let formattedValue = day;
    if (month.length) formattedValue += "/" + month;
    if (year.length) formattedValue += "/" + year;

    handleChange({ target: { name: "date", value: formattedValue } });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setToggleBanner(true);
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleFormSubmit}>
        <div className={styles.inputGroup}>
          <label>Event Topic</label>
          <input
            type="text"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            style={{ borderColor: errors.topic ? "#ED0000" : "" }}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Host Name</label>
          <input
            type="text"
            name="host"
            value={localStorage.getItem("username")}
            onChange={handleChange}
            style={{ borderColor: errors.host ? "red" : "" }}
          />
        </div>

        <div className={styles.inputGroupDescription}>
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="2"
            cols="6"
          ></textarea>
        </div>

        <div className={styles.inputGroupDateTime}>
          <label>Date and Time</label>
          <div className={styles.dateTimeContainer}>
            <input
              className={styles.dateInput}
              type="text"
              name="date"
              placeholder="DD/MM/YYYY"
              value={formData.date}
              onChange={handleDateChange}
              maxLength="10"
              style={{ borderColor: errors.date ? "red" : "" }}
            />
            <input
              className={styles.hrInput}
              type="text"
              name="time"
              placeholder="HH:MM"
              value={formData.time}
              onChange={handleTimeChange}
              maxLength="5"
              style={{ borderColor: errors.time ? "red" : "" }}
            />
            <select
              className={styles.ampmSelect}
              name="period"
              value={formData.period}
              onChange={handleChange}
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
            <select
              className={styles.timezoneInput}
              name="timezone"
              value={formData.timezone}
              onChange={handleChange}
              style={{ borderColor: errors.timezone ? "red" : "" }}
            >
              <option value="">Select Timezone</option>
              {timezones.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.inputGroupSetDuration}>
          <label>Set Duration</label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="in hr"
          />
        </div>

        <div className={styles.buttonContainer}>
          <button type="button" onClick={() => setActiveTab("Events")}>
            Cancel
          </button>
          <button type="submit" className={styles.submitBtn}>
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default MeetingInput;
