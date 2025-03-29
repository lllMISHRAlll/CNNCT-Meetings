import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../stylesheets/availability.module.css";
import { getBaseURI } from "../utils/config";
import { toast } from "react-toastify";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const AM_PM_OPTIONS = ["AM", "PM"];

const convertTo24Hour = (time, period) => {
  if (!time) return "00:00";

  const [hourStr, minuteStr] = time.split(":");
  const hour = parseInt(hourStr, 10) || 0;
  const minute = parseInt(minuteStr, 10) || 0;

  let finalHour = hour;
  if (period === "PM" && hour < 12) finalHour += 12;
  if (period === "AM" && hour === 12) finalHour = 0;

  return `${String(finalHour).padStart(2, "0")}:${String(minute).padStart(
    2,
    "0"
  )}`;
};

const parseTimeSlot = (timeStr) => {
  if (!timeStr) return { time: "12:00", period: "AM" };

  const parts = timeStr.split(" ");
  const timePart = parts[0] || "12:00";
  const period = parts[1] || "AM";

  let [hourStr, minuteStr] = timePart.split(":");
  const hour = parseInt(hourStr, 10) || 0;
  const minute = parseInt(minuteStr, 10) || 0;

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
    const defaultSlot = {
      from: { time: "12:00", period: "AM" },
      to: { time: "11:59", period: "PM" },
    };

    const updatedHours = {};
    WEEKDAYS.forEach((day) => {
      updatedHours[day] = availability?.[day]?.map((slot) => ({
        from: parseTimeSlot(slot.from),
        to: parseTimeSlot(slot.to),
      })) || [defaultSlot];
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
      toast.error(
        err.response?.data?.message || "Failed to update availability"
      );
    }
  };

  const handleTimeChange = (day, index, field, value) => {
    setHours((prev) => ({
      ...prev,
      [day]: prev[day].map((slot, i) =>
        i === index ? { ...slot, [field]: value } : slot
      ),
    }));
  };

  const addTimeSlot = (day) => {
    setHours((prev) => ({
      ...prev,
      [day]: [
        ...(prev[day] || []),
        {
          from: { time: "09:00", period: "AM" },
          to: { time: "05:00", period: "PM" },
        },
      ],
    }));
  };

  const removeTimeSlot = (day, index) => {
    if (hours[day].length <= 1) return;
    setHours((prev) => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index),
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
                          handleTimeChange(day, index, "from", {
                            ...slot.from,
                            time: e.target.value,
                          })
                        }
                        placeholder="HH:MM"
                        disabled={!activeDays[day]}
                        maxLength={5}
                      />
                      <select
                        value={slot.from.period}
                        onChange={(e) =>
                          handleTimeChange(day, index, "from", {
                            ...slot.from,
                            period: e.target.value,
                          })
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
                          handleTimeChange(day, index, "to", {
                            ...slot.to,
                            time: e.target.value,
                          })
                        }
                        placeholder="HH:MM"
                        disabled={!activeDays[day]}
                        maxLength={5}
                      />
                      <select
                        value={slot.to.period}
                        onChange={(e) =>
                          handleTimeChange(day, index, "to", {
                            ...slot.to,
                            period: e.target.value,
                          })
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
                      onClick={() => removeTimeSlot(day, index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <button className={styles.add} onClick={() => addTimeSlot(day)}>
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
