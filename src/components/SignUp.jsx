import React, { useState, useEffect } from "react";
import style from "../stylesheets/authentication.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function SignUp({ formData, setFormData }) {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = (name, value) => {
    if (!value && name !== "termsAccepted") return `${name} is required`;

    switch (name) {
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? ""
          : "Invalid email format";
      case "password":
        return /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          value
        )
          ? ""
          : "Password must be 8+ chars with 1 uppercase, 1 number, and 1 special character";
      case "confirmPassword":
        return value === formData.password ? "" : "Passwords don't match";
      default:
        return "";
    }
  };

  useEffect(() => {
    const signupFields = [
      "firstName",
      "lastName",
      "email",
      "password",
      "confirmPassword",
      "termsAccepted",
    ];

    const noErrors = signupFields.every((field) => !errors[field]);
    const allRequiredFilled = signupFields.every((field) =>
      field === "termsAccepted" ? formData[field] : Boolean(formData[field])
    );

    setIsFormValid(noErrors && allRequiredFilled);
  }, [formData, errors]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({ ...prev, [name]: fieldValue }));
    setErrors((prev) => ({ ...prev, [name]: validate(name, fieldValue) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) {
      toast.error("Please fill all required fields correctly");
      return;
    }
    navigate("/preference");
  };

  return (
    <div className={style.main}>
      <div className={style.left}>
        <div className={style.logo} onClick={() => navigate("/")}>
          <img src="assets/logos/cbi_plug-eu.png" alt="Logo" />
          <p>CNNCT</p>
        </div>
        <div className={style.signupContainer}>
          <div className={style.formUpper}>
            <h2>Create an account</h2>
            <a href="/login">Sign in instead</a>
          </div>

          <form className={style.signupForm} onSubmit={handleSubmit}>
            {["firstName", "lastName", "email"].map((field) => (
              <div className={style.signUpForm} key={field}>
                <label htmlFor={field}>
                  {field.replace(/([A-Z])/g, " $1").trim()}
                </label>
                <input
                  id={field}
                  type="text"
                  name={field}
                  placeholder={`Enter ${field
                    .replace(/([A-Z])/g, " $1")
                    .trim()}`}
                  value={formData[field]}
                  onChange={handleChange}
                  className={errors[field] ? style.inputError : ""}
                />
                {errors[field] && (
                  <p className={style.error}>{errors[field]}</p>
                )}
              </div>
            ))}

            <div className={style.signUpForm}>
              <label htmlFor="password">Password</label>
              <div className={style.passwordContainer}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? style.inputError : ""}
                />
                <span
                  className={style.eyeIcon}
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                </span>
              </div>
              {errors.password && (
                <p className={style.error}>{errors.password}</p>
              )}
            </div>

            <div className={style.signUpForm}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Re-enter Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? style.inputError : ""}
              />
              {errors.confirmPassword && (
                <p className={style.error}>{errors.confirmPassword}</p>
              )}
            </div>

            <div className={style.terms}>
              <input
                type="checkbox"
                name="termsAccepted"
                className={style.checkBox}
                checked={formData.termsAccepted}
                onChange={handleChange}
              />
              <p>
                By creating an account, I agree to the{" "}
                <a href="#">Terms of use</a> and <a href="#">Privacy Policy</a>
              </p>
            </div>

            <button
              className={style.authBtn}
              type="submit"
              disabled={!isFormValid}
            >
              Create an account
            </button>
          </form>
        </div>
        <p className={style.termsAndServices}>
          This site is protected by reCAPTCHA and the{" "}
          <span>Google Privacy Policy</span> and <span>Terms of Service</span>{" "}
          apply.
        </p>
      </div>
      <div className={style.right}>
        <img src="assets/authentication/Frame.png" alt="SignUp Image" />
      </div>
    </div>
  );
}
