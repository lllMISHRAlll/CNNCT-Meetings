import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../stylesheets/availability.module.css";
import { getBaseURI } from "../utils/config";
import { toast } from "react-toastify";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const AM_PM_OPTIONS = ["AM", "PM"];

const convertTo24Hour = (time, period) => {
  if (!time) return "00:00";

  const cleanedTime = time.trim().replace(/\s/g, "");
  let [hour, minute] = cleanedTime
    .split(":")
    .map((num) => parseInt(num, 10) || 0);

  minute = Math.min(59, Math.max(0, minute));
  hour = Math.min(23, Math.max(0, hour));

  if (period === "PM" && hour < 12) {
    hour += 12;
  }
  if (period === "AM" && hour === 12) {
    hour = 0;
  }

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
};

const convertTo12Hour = (time) => {
  if (!time) return { time: "12:00", period: "AM" };

  const cleanedTime = time.trim().replace(/\s/g, "");
  let [hour, minute] = cleanedTime
    .split(":")
    .map((num) => parseInt(num, 10) || 0);

  minute = Math.min(59, Math.max(0, minute));
  hour = Math.min(23, Math.max(0, hour));

  let period = "AM";

  if (hour >= 12) {
    period = "PM";
    if (hour > 12) {
      hour -= 12;
    }
  }
  if (hour === 0) {
    hour = 12;
  }

  return {
    time: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
    period,
  };
};

const InputHours = ({ availability, setAvailability, fetchUserInfo }) => {
  const [hours, setHours] = useState({});
  const [activeDays, setActiveDays] = useState(
    WEEKDAYS.reduce((acc, day) => ({ ...acc, [day]: day !== "Sun" }), {})
  );

  useEffect(() => {
    const updatedHours = {};
    WEEKDAYS.forEach((day) => {
      updatedHours[day] = availability?.[day]?.map((slot) => {
        let from = convertTo12Hour(slot.from || "00:00");
        let to = convertTo12Hour(slot.to || "23:59");
        return { from, to };
      }) || [
        {
          from: convertTo12Hour("00:00"),
          to: convertTo12Hour("23:59"),
        },
      ];
    });
    setHours(updatedHours);
  }, [availability]);

  const saveAvailability = async () => {
    try {
      const formattedAvailability = {};
      Object.keys(hours).forEach((day) => {
        if (day === "Sun") return;
        formattedAvailability[day] = hours[day].map((slot) => ({
          from: convertTo24Hour(slot.from.time, slot.from.period),
          to: convertTo24Hour(slot.to.time, slot.to.period),
        }));
      });

      const res = await axios.post(
        `${getBaseURI()}/api/availability/inputhours`,
        { availability: formattedAvailability },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setAvailability(res.data.availability);
      toast.success("Available Hours Updated Successfully");
      fetchUserInfo();
    } catch (err) {
      console.error("Error saving availability:", err);
    }
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

        <div className={styles.otherDaysContainer}>
          <div className={styles.sundayContainer}>
            <input
              className={styles.sundayInput}
              type="checkbox"
              checked
              disabled
            />
            <span className={styles.dayName}>Sun</span>
            <span className={styles.unavailableText}>Unavailable</span>
          </div>

          {WEEKDAYS.filter((day) => day !== "Sun").map((day) => (
            <div key={day} className={styles.dayRow}>
              <input
                type="checkbox"
                checked={activeDays[day]}
                onChange={() =>
                  setActiveDays({ ...activeDays, [day]: !activeDays[day] })
                }
              />
              <span className={styles.dayName}>{day}</span>

              <div className={styles.timeSlots}>
                {hours[day]?.map((slot, index) => (
                  <div key={index} className={styles.inputHrWrapper}>
                    <div className={styles.timeWrapper}>
                      <input
                        type="text"
                        value={slot.from.time}
                        onChange={(e) =>
                          setHours((prev) => ({
                            ...prev,
                            [day]: prev[day].map((s, i) =>
                              i === index
                                ? {
                                    ...s,
                                    from: { ...s.from, time: e.target.value },
                                  }
                                : s
                            ),
                          }))
                        }
                        placeholder="HH:MM"
                        disabled={!activeDays[day]}
                      />
                      <select
                        value={slot.from.period}
                        onChange={(e) =>
                          setHours((prev) => ({
                            ...prev,
                            [day]: prev[day].map((s, i) =>
                              i === index
                                ? {
                                    ...s,
                                    from: { ...s.from, period: e.target.value },
                                  }
                                : s
                            ),
                          }))
                        }
                        disabled={!activeDays[day]}
                      >
                        {AM_PM_OPTIONS.map((ampm) => (
                          <option key={ampm} value={ampm}>
                            {ampm}
                          </option>
                        ))}
                      </select>
                    </div>

                    <span>-</span>

                    <div className={styles.timeWrapper}>
                      <input
                        type="text"
                        value={slot.to.time}
                        onChange={(e) =>
                          setHours((prev) => ({
                            ...prev,
                            [day]: prev[day].map((s, i) =>
                              i === index
                                ? {
                                    ...s,
                                    to: { ...s.to, time: e.target.value },
                                  }
                                : s
                            ),
                          }))
                        }
                        placeholder="HH:MM"
                        disabled={!activeDays[day]}
                      />
                      <select
                        value={slot.to.period}
                        onChange={(e) =>
                          setHours((prev) => ({
                            ...prev,
                            [day]: prev[day].map((s, i) =>
                              i === index
                                ? {
                                    ...s,
                                    to: { ...s.to, period: e.target.value },
                                  }
                                : s
                            ),
                          }))
                        }
                        disabled={!activeDays[day]}
                      >
                        {AM_PM_OPTIONS.map((ampm) => (
                          <option key={ampm} value={ampm}>
                            {ampm}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      className={styles.delete}
                      onClick={() =>
                        setHours((prev) => ({
                          ...prev,
                          [day]: prev[day].filter((_, i) => i !== index),
                        }))
                      }
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <button
                className={styles.add}
                onClick={() =>
                  setHours((prev) => ({
                    ...prev,
                    [day]: [
                      ...(prev[day] || []),
                      {
                        from: convertTo12Hour("00:00"),
                        to: convertTo12Hour("23:59"),
                      },
                    ],
                  }))
                }
              >
                +
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.saveBtn}>
        <button className={styles.saveButton} onClick={saveAvailability}>
          Save
        </button>
      </div>
    </div>
  );
};

export default InputHours;
