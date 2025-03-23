import React from "react";
import styles from "../stylesheets/integrationCard.module.css";

export default function IntegrationCard({ title, text, icon }) {
  return (
    <div className={styles.card}>
      <div className={styles.icon}>
        <img src={icon} alt={title} />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.text}>{text}</p>
      </div>
    </div>
  );
}
