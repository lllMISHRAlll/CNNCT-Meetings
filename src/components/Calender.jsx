import React from "react";
import styles from "../stylesheets/availability.module.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Calendar as BigCalendar,
  momentLocalizer,
  Views,
} from "react-big-calendar";
import moment from "moment";

const localizer = momentLocalizer(moment);

const formats = {
  dayFormat: (date, culture, localizer) =>
    localizer.format(date, "ddd DD", culture),
};

export default function CustomCalendar({
  view,
  setView,
  date,
  setDate,
  events,
}) {
  return (
    <div className={styles.calendarView}>
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        views={{ month: true, week: true, day: true, agenda: true }}
        view={view}
        onView={(newView) => setView(newView)}
        date={date}
        onNavigate={(newDate) => setDate(newDate)}
        step={30}
        showMultiDayTimes
        popup
        formats={formats}
      />
    </div>
  );
}
