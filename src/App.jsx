import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SignUp from "./components/SignUp";
import LogIn from "./components/LogIn";
import Preferences from "./components/preference";
import DashBoard from "./pages/DashBoard";
import { useState } from "react";

function App() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
    userName: "",
    preference: "",
  });

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/signup"
          element={<SignUp formData={formData} setFormData={setFormData} />}
        />
        <Route path="/login" element={<LogIn />} />
        <Route
          path="/preference"
          element={
            <Preferences formData={formData} setFormData={setFormData} />
          }
        />
        <Route path="/dashboard" element={<DashBoard />} />
      </Routes>
    </Router>
  );
}

export default App;
