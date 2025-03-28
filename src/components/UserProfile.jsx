import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../stylesheets/profile.module.css";
import { toast } from "react-toastify";
import axios from "axios";
import { getBaseURI } from "../utils/config";

function UseProfile({ user, initialEmail, fetchUserInfo }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user?.name) {
      const nameParts = user.name.split(" ");
      setFormData((prev) => ({
        ...prev,
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const payload = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        ...(formData.password && { password: formData.password }),
      };

      const res = await axios.patch(
        `${getBaseURI()}/api/user/updateuser`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(res.data.message);
      fetchUserInfo();

      if (formData.email !== initialEmail || formData.password) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (error) {
      console.error("Update Failed", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message || "Update failed. Please try again."
      );
    }
  };

  return (
    <div className={styles.main}>
      <h1>Profile</h1>
      <p>Manage settings for your profile</p>
      <div className={styles.profileContainer}>
        <div className={styles.header}>
          <p className={styles.profileHeader}>Edit Profile</p>
        </div>

        <form className={styles.profileForm} onSubmit={handleSubmit}>
          <div className={styles.profileInputGroup}>
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={styles.profileInput}
            />
          </div>

          <div className={styles.profileInputGroup}>
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={styles.profileInput}
            />
          </div>

          <div className={styles.profileInputGroup}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.profileInput}
            />
          </div>

          <div className={styles.profileInputGroup}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={styles.profileInput}
            />
          </div>

          <div className={styles.profileInputGroup}>
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={styles.profileInput}
            />
            {formData.password !== formData.confirmPassword && (
              <p style={{ color: "red", fontSize: "14px" }}>
                Passwords do not match
              </p>
            )}
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
