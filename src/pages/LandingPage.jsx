import React, { useEffect } from "react";
import style from "../stylesheets/landingPage.module.css";
import TestimonialCards from "../components/TestimonialCards";
import IntegrationCard from "../components/IntegrationCard";
import { testimonials, integrations, socialMediaIcons } from "../data";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    token && localStorage.removeItem("token");
  });

  return (
    <div className={style.main}>
      <div className={style.header}>
        <div className={style.logo}>
          <img src="assets/logos/cbi_plug-eu.png" />
          <p>CNNCT</p>
        </div>
        <button
          className={style.signUpButton1}
          type="submit"
          onClick={() => navigate("/signup")}
        >
          Sign up free
        </button>
      </div>
      <div className={style.body}>
        <div className={style.neck}>
          <h1>
            CNNCT – Easy <br />
            Scheduling Ahead
          </h1>
          <button
            className={style.signUpButton2}
            type="submit"
            onClick={() => navigate("/signup")}
          >
            Sign up free
          </button>
          <img src="assets/landingPage/screen 1.png" />
          <h3>Simplified scheduling for you and your team</h3>
          <p>
            CNNCT eliminates the back-and-forth of scheduling meetings so you
            can focus on what matters. Set your availability, share your link,
            and let others book time with you instantly.
          </p>
        </div>
        <div className={style.lowerNeck}>
          <div className={style.leftContent}>
            <h4>
              Stay Organized with Your <br /> Calendar & Meetings
            </h4>
            <p>Seamless Event Scheduling</p>
            <ul>
              <li>
                View all your upcoming meetings and appointments in one place.
              </li>
              <li>
                Syncs with Google Calendar, Outlook, and iCloud to avoid
                conflicts.
              </li>
              <li>
                Customize event types: one-on-ones, team meetings, group <br />
                sessions, and webinars.
              </li>
            </ul>
            <h1>
              Here's what our <span>customer</span> <br />
              has to says
            </h1>
            <button className={style.readCustomer} type="submit">
              Read customer stories
            </button>
          </div>
          <div className={style.rightContent}>
            <img
              className={style.screen3}
              src="assets/landingPage/screen 3.png"
            />
            <img
              className={style.screen2}
              src="assets/landingPage/SCREEN 2.png"
            />
            <div className={style.lorem}>
              <img src="assets/logos/icon star.png" />
              <p>
                [short description goes in here] lorem <br /> ipsum is a
                placeholder text to <br /> demonstrate.
              </p>
            </div>
          </div>
        </div>
        <div className={style.grid}>
          {testimonials.map((testimonial, index) => (
            <TestimonialCards
              key={index}
              {...testimonial}
              customClass={
                index === 1 || index === 2 ? style.whiteBg : style.defaultBg
              }
            />
          ))}
        </div>
        <div className={style.container}>
          <h1>All Link Apps and Integrations</h1>
          <div className={style.grid2}>
            {integrations.map((item, index) => (
              <IntegrationCard key={index} {...item} />
            ))}
          </div>
          <footer className={style.footer}>
            <div className={style.footerBodyWrapper}>
              <div className={style.authButtons}>
                <button
                  className={style.login}
                  type="submit"
                  onClick={() => navigate("/login")}
                >
                  Log in
                </button>
                <button
                  className={style.signup}
                  type="submit"
                  onClick={() => navigate("/signup")}
                >
                  Sign up free
                </button>
              </div>
              <div className={style.links}>
                <div>
                  <p>About CNNCT</p>
                  <p>Blog</p>
                  <p>Press</p>
                  <p>Social Good</p>
                  <p>Contact</p>
                </div>
                <div>
                  <p>Careers</p>
                  <p>Getting Started</p>
                  <p>Features and How-Tos</p>
                  <p>FAQs</p>
                  <p>Report a Violation</p>
                </div>
                <div>
                  <p>Terms and Conditions</p>
                  <p>Privacy Policy</p>
                  <p>Cookie Notice</p>
                  <p>Trust Center</p>
                </div>
              </div>
            </div>

            <div className={style.footerLowerWrapper}>
              <p>
                We acknowledge the Traditional Custodians of the land on which
                our office stands, The Wurundjeri <br /> people of the Kulin
                Nation, and pay our respects to Elders past, present and
                emerging.
              </p>
              <div className={style.socialMediaIcons}>
                {socialMediaIcons.map((icon, index) => (
                  <img key={index} src={icon.src} alt={icon.alt} />
                ))}
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
