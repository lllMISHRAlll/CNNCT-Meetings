import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../stylesheets/availability.module.css";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const InputHours = () => {
  const [hours, setHours] = useState({
    Mon: [{ id: 1, from: "", to: "" }],
    Tue: [{ id: 1, from: "", to: "" }],
    Wed: [{ id: 1, from: "", to: "" }],
    Thu: [{ id: 1, from: "", to: "" }],
    Fri: [{ id: 1, from: "", to: "" }],
    Sat: [{ id: 1, from: "", to: "" }],
  });

  const [activeDays, setActiveDays] = useState(
    Object.keys(hours).reduce((acc, day) => ({ ...acc, [day]: true }), {})
  );

  const addTimeSlot = (day) => {
    setHours((prev) => ({
      ...prev,
      [day]: [...prev[day], { id: Date.now(), from: "", to: "" }],
    }));
  };

  const removeTimeSlot = (day, id) => {
    setHours((prev) => ({
      ...prev,
      [day]:
        prev[day].length > 1
          ? prev[day].filter((slot) => slot.id !== id)
          : prev[day],
    }));
  };

  const toggleDay = (day) => {
    setActiveDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  return (
    <div className={styles.inputHours}>
      <div className={styles.selectContainer}>
        <div>
          <label>Activity</label>
          <select>
            <option>Event type</option>
          </select>
        </div>
        <div>
          <label>Time Zone</label>
          <select>
            <option>Indian Standard Time</option>
          </select>
        </div>
      </div>

      <div className={styles.weeklyHours}>
        <p>Weekly hours</p>

        <div className={styles.sundayContainer}>
          <div className={styles.sundayRow}>
            <input type="checkbox" checked disabled />
            <span>Sun</span>
            <span className={styles.unavailableText}>Unavailable</span>
          </div>
        </div>

        <div className={styles.otherDaysContainer}>
          {Object.keys(hours).map((day) => (
            <div key={day} className={styles.dayRow}>
              <input
                type="checkbox"
                checked={activeDays[day]}
                onChange={() => toggleDay(day)}
              />
              <span className={styles.dayName}>{day}</span>

              <div className={styles.timeSlots}>
                <AnimatePresence>
                  {hours[day].map((slot) => (
                    <motion.div
                      key={slot.id}
                      className={styles.inputHrWrapper}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <input type="time" disabled={!activeDays[day]} />
                      <span>-</span>
                      <input type="time" disabled={!activeDays[day]} />
                      <button
                        className={styles.delete}
                        onClick={() => removeTimeSlot(day, slot.id)}
                        disabled={hours[day].length === 1}
                      >
                        ×
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <button
                className={styles.add}
                onClick={() => addTimeSlot(day)}
                disabled={!activeDays[day]}
              >
                +
              </button>
              <button className={styles.copy} disabled={!activeDays[day]}>
                <FontAwesomeIcon icon={faCopy} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InputHours;
