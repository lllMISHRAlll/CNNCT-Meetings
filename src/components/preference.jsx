import React, { useState } from "react";
import style from "../stylesheets/authentication.module.css";
import preferenceStyle from "../stylesheets/preference.module.css";
import { useNavigate } from "react-router-dom";

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
export default function SignUp({ setHost, host }) {
  const navigate = useNavigate();
  const [selectedPreference, setSelectedPreference] = useState(null);

  const handleContinue = () => {
    console.log("Hostname:", host);
    console.log("Selected Preference:", selectedPreference);
    navigate("/dashboard");
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
              placeholder="Tell us your Username"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              className={preferenceStyle.inputField}
            />

            <h5>Select one category that best describes your CNNCT:</h5>
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
                  <img src={pref.icon} alt="icon" />
                  {pref.name}
                </div>
              ))}
            </div>

            <button
              className={preferenceStyle.continueBtn}
              onClick={handleContinue}
              disabled={!host || !selectedPreference}
            >
              Continue
            </button>
          </div>
        </div>
      </div>

      <div className={style.right}>
        <img src="assets/authentication/Frame.png" alt="SignUp Image" />
      </div>
    </div>
  );
}
