import React, { useEffect, useState } from "react";
import styles from "../stylesheets/createMeeting.module.css";

function MeetingInput({
  formData,
  handleChange,
  handleSubmit,
  setActiveTab,
  setToggleBanner,
  host,
}) {
  const [timezones, setTimezones] = useState([]);
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

    if (day > 31) day = "31";

    if (month > 12) month = "12";

    if (year.length > 4) year = year.slice(0, 4);

    let formattedValue = day;
    if (month.length) formattedValue += "/" + month;
    if (year.length) formattedValue += "/" + year;

    handleChange({ target: { name: "date", value: formattedValue } });
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label>
            Event Topic<span className={styles.mandatory}></span>
          </label>
          <input
            type="text"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            required
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
          <label>
            Host Name
            <span className={styles.mandatory}></span>
          </label>
          <input
            type="text"
            name="host"
            value={host || formData.host}
            onChange={handleChange}
            required
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
          <label>
            Date and Time<span className={styles.mandatory}></span>
          </label>
          <div className={styles.dateTimeContainer}>
            <input
              className={styles.dateInput}
              type="text"
              name="date"
              placeholder="DD/MM/YYYY"
              value={formData.date}
              onChange={handleDateChange}
              maxLength="10"
              required
            />
            <input
              className={styles.hrInput}
              type="text"
              name="time"
              placeholder="HH:MM"
              value={formData.time}
              onChange={handleTimeChange}
              maxLength="5"
              required
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
              required
            >
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
            type="text"
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
          <button
            type="submit"
            className={styles.submitBtn}
            onClick={() => setToggleBanner(true)}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default MeetingInput;
