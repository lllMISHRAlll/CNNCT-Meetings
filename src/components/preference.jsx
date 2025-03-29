import React, { useState } from "react";
import style from "../stylesheets/authentication.module.css";
import preferenceStyle from "../stylesheets/preference.module.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { getBaseURI } from "../utils/config.js";

const preferences = [
  { id: 1, name: "Sales", icon: "assets/icons/Sales.png" },
  { id: 2, name: "Education", icon: "assets/icons/Education.png" },
  { id: 3, name: "Finance", icon: "assets/icons/Finance.png" },
  {
    id: 4,
    name: "Government & Politics",
    icon: "assets/icons/Government & Politics.png",
  },
  { id: 5, name: "Consulting", icon: "assets/icons/Consulting.png" },
  { id: 6, name: "Recruiting", icon: "assets/icons/Recruiting.png" },
  { id: 7, name: "Tech", icon: "assets/icons/Tech.png" },
  { id: 8, name: "Marketing", icon: "assets/icons/Marketing.png" },
];

export default function Preferences({ formData, setFormData }) {
  const navigate = useNavigate();
  const [selectedPreference, setSelectedPreference] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    if (!formData.userName?.trim()) {
      return toast.error("Please enter a username");
    }
    if (!selectedPreference) {
      return toast.error("Please select a preference");
    }

    setIsLoading(true);

    try {
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        username: formData.userName.trim(),
      };

      const response = await axios.post(
        `${getBaseURI()}/api/auth/signup`,
        payload
      );
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        termsAccepted: false,
        userName: "",
        preference: "",
      });
      toast.success(response.data.message || "User registered successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Registration Error Details:", {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config,
      });

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error?.message ||
        "Registration failed. Please try again.";

      toast.error(errorMessage);

      if (error.response?.data?.error?.code === 11000) {
        if (error.message.includes("email")) {
          toast.error("Email already registered");
        } else if (error.message.includes("username")) {
          toast.error("Username already taken");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={style.main}>
      <div className={preferenceStyle.left}>
        <div className={style.logo} onClick={() => navigate("/")}>
          <img src="assets/logos/cbi_plug-eu.png" alt="Logo" />
          <p>CNNCT</p>
        </div>
        <div className={preferenceStyle.body}>
          <div className={preferenceStyle.hostContainer}>
            <h2>Your Preference</h2>
            <input
              type="text"
              placeholder="Create your username"
              value={formData.userName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  userName: e.target.value.replace(/\s/g, ""),
                }))
              }
              className={preferenceStyle.inputField}
              maxLength={20}
              minLength={3}
            />

            <h5>Select your primary interest:</h5>
            <br />

            <div className={preferenceStyle.options}>
              {preferences.map((pref) => (
                <div
                  key={pref.id}
                  className={`${preferenceStyle.option} ${
                    selectedPreference === pref.name
                      ? preferenceStyle.selected
                      : ""
                  }`}
                  onClick={() => setSelectedPreference(pref.name)}
                >
                  <img src={pref.icon} alt={pref.name} />
                  {pref.name}
                </div>
              ))}
            </div>

            <button
              className={preferenceStyle.continueBtn}
              onClick={handleContinue}
              disabled={
                !formData.userName?.trim() || !selectedPreference || isLoading
              }
            >
              {isLoading ? "Creating Account..." : "Continue"}
            </button>
          </div>
        </div>
      </div>

      <div className={style.right}>
        <img src="assets/authentication/Frame.png" alt="SignUp Illustration" />
      </div>
    </div>
  );
}
