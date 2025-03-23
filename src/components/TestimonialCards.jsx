import React from "react";
import styles from "../stylesheets/testimonialCard.module.css";

export default function TestimonialCards({
  title,
  text,
  name,
  position,
  customClass,
}) {
  return (
    <div className={`${styles.container} ${customClass}`}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.text}>{text}</p>
      <div className={styles.profile}>
        <div className={styles.avatar}></div>
        <div className={styles.details}>
          <p className={styles.name}>{name}</p>
          <p className={styles.position}>{position}</p>
        </div>
      </div>
    </div>
  );
}
