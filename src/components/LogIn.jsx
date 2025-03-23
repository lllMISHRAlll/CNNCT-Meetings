import React, { useState, useEffect } from "react";
import style from "../stylesheets/authentication.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const hasErrors = Object.values(errors).some((error) => error);
    const allFieldsFilled = Object.values(formData).every((value) => value);
    setIsFormValid(!hasErrors && allFieldsFilled);
  }, [formData, errors]);

  const validate = (name, value) => {
    let error = "";

    if (!value) error = `${name} is required`;

    if (name === "username") {
      const usernamePattern = /^[a-zA-Z0-9_]{4,20}$/;
      if (!usernamePattern.test(value))
        error =
          "Username must be 4-20 characters (letters, numbers, underscores)";
    }

    if (name === "password") {
      const passwordPattern =
        /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordPattern.test(value))
        error =
          "Password must be at least 8 characters, include an uppercase letter, a number, and a special character.";
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({
      ...prev,
      [name]: validate(name, value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    console.log("Login Successful", formData);
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
            <h3>Sign in</h3>
          </div>

          <form className={style.signupForm} onSubmit={handleSubmit}>
            <div className={style.signUpForm}>
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                name="username"
                placeholder="Enter Username"
                value={formData.username}
                onChange={handleChange}
                className={errors.username ? style.inputError : ""}
              />
              {errors.username && (
                <p className={style.error}>{errors.username}</p>
              )}
            </div>

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

            <button
              className={style.authBtn}
              type="submit"
              disabled={!isFormValid}
            >
              Log in
            </button>
            <p className={style.loginToSignUp}>
              Don't have an account? <a href="/signup">Sign Up</a>
            </p>
          </form>
        </div>
      </div>
      <div className={style.right}>
        <img src="assets/authentication/Frame.png" alt="Login Image" />
      </div>
    </div>
  );
}
