import React, { useState } from "react";
import styles from "../stylesheets/createMeeting.module.css";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function MeetingBanner({
  formData,
  handleChange,
  handleSubmit,
  setToggleBanner,
}) {
  const [bgColor, setBgColor] = useState("#2D221B");

  const predefinedColors = ["#FF7F00", "#FFFFFF", "#000000"];

  return (
    <div className={styles.bannerContainer}>
      <h2 className={styles.bannerHeader}>Banner</h2>
      <div className={styles.banner} style={{ backgroundColor: bgColor }}>
        <img src="assets/Rectangle 5526.png" alt="Avatar" />
        <div>
          <input
            placeholder="Team Meeting"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
          />
          <FontAwesomeIcon icon={faPencil} style={{ color: "#ffffff" }} />
        </div>
      </div>

      <p>Custom Background Color</p>
      <div className={styles.colorOptions}>
        {predefinedColors.map((color) => (
          <button
            key={color}
            className={styles.colorButton}
            style={{ backgroundColor: color }}
            onClick={() => setBgColor(color)}
          ></button>
        ))}
      </div>

      <div className={styles.colorInputContainer}>
        <input
          type="color"
          className={styles.colorInput}
          value={bgColor}
          onChange={(e) => setBgColor(e.target.value)}
        />
        <input
          type="text"
          className={styles.colorTextInput}
          value={bgColor}
          onChange={(e) => setBgColor(e.target.value)}
        />
      </div>
      <div className={styles.formInput}>
        <label>
          Add Link<span className={styles.mandatory}></span>
        </label>
        <input
          type="text"
          name="link"
          placeholder="Enter URL Here"
          value={formData.link}
          onChange={handleChange}
        />
      </div>
      <div className={styles.formInput}>
        <label>
          Add Emails<span className={styles.mandatory}></span>
        </label>
        <input
          type="text"
          name="emails"
          placeholder="Add member Emails"
          value={formData.emails}
          onChange={handleChange}
        />
      </div>
      <div className={styles.buttonContainer}>
        <button type="button" onClick={() => setToggleBanner(false)}>
          Cancel
        </button>
        <button
          type="button"
          className={styles.submitBtn}
          onClick={handleSubmit}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default MeetingBanner;
