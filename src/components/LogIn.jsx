import React, { useState, useEffect } from "react";
import style from "../stylesheets/authentication.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { getBaseURI } from "../utils/config.js";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    emailOrUsername: "",
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

    if (name === "emailOrUsername") {
      const usernamePattern = /^[a-zA-Z0-9_]{4,20}$/;
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!usernamePattern.test(value) && !emailPattern.test(value)) {
        error = "Enter a valid username (4-20 chars) or email format";
      }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    const payload = {
      email: formData.emailOrUsername,
      password: formData.password,
    };

    try {
      const res = await axios.post(`${getBaseURI()}/api/auth/login`, payload);
      localStorage.setItem("token", res.data.token);
      toast.success(res.data.message);
      navigate("/preference");
    } catch (error) {
      console.error("Login Failed", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
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
              <label htmlFor="emailOrUsername">Username / Email</label>
              <input
                id="emailOrUsername"
                type="text"
                name="emailOrUsername"
                placeholder="Enter Username or Email"
                value={formData.emailOrUsername}
                onChange={handleChange}
                className={errors.emailOrUsername ? style.inputError : ""}
              />
              {errors.emailOrUsername && (
                <p className={style.error}>{errors.emailOrUsername}</p>
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
