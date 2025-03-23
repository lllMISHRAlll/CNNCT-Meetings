import React, { useState, useEffect } from "react";
import style from "../stylesheets/authentication.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const hasErrors = Object.values(errors).some((error) => error);
    const allFieldsFilled = Object.keys(formData).every(
      (key) => key === "termsAccepted" || formData[key]
    );
    setIsFormValid(!hasErrors && allFieldsFilled && formData.termsAccepted);
  }, [formData, errors]);

  const validate = (name, value) => {
    let error = "";

    if (!value) error = `${name} is required`;

    if (name === "email") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) error = "Invalid email format";
    }

    if (name === "password") {
      const passwordPattern =
        /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordPattern.test(value))
        error =
          "Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.";
    }

    if (name === "confirmPassword" && value !== formData.password) {
      error = "Passwords do not match";
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({ ...prev, [name]: fieldValue }));

    setErrors((prev) => ({
      ...prev,
      [name]: validate(name, fieldValue),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    console.log("Form Submitted", formData);
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
