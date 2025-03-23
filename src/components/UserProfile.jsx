import React from "react";
import styles from "../stylesheets/profile.module.css";

function UseProfile() {
  return (
    <div className={styles.main}>
      <h1>Profile</h1>
      <p>Manage settings for your profile</p>
      <div className={styles.profileContainer}>
        <div className={styles.header}>
          <p className={styles.profileHeader}>Edit Profile</p>
        </div>

        <form className={styles.profileForm}>
          <div className={styles.profileInputGroup}>
            <label>Name</label>
            <input type="text" className={styles.profileInput} />
          </div>

          <div className={styles.profileInputGroup}>
            <label>Email</label>
            <input type="email" className={styles.profileInput} />
          </div>

          <div className={styles.profileInputGroup}>
            <label>Phone</label>
            <input type="tel" className={styles.profileInput} />
          </div>

          <div className={styles.profileInputGroup}>
            <label>Password</label>
            <input type="password" className={styles.profileInput} />
          </div>

          <div className={styles.profileInputGroup}>
            <label>Confirm Password</label>
            <input type="password" className={styles.profileInput} />
          </div>

          <div className={styles.profileButtonContainer}>
            <button type="submit" className={styles.profileSaveButton}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UseProfile;
