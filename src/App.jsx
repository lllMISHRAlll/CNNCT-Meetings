import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SignUp from "./components/SignUp";
import LogIn from "./components/LogIn";
import Preferences from "./components/preference";
import DashBoard from "./pages/DashBoard";
import { useState } from "react";
import withAuth from "./hoc/withAuth";

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

  const ProtectedDashBoard = withAuth(DashBoard);
  const RestrictedLogin = withAuth(LogIn, false);
  const RestrictedSignup = withAuth(SignUp, false);

  return (
    <Router basename="/">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/signup"
          element={<SignUp formData={formData} setFormData={setFormData} />}
        />
        <Route path="/login" element={<RestrictedLogin />} />
        <Route
          path="/preference"
          element={
            <Preferences formData={formData} setFormData={setFormData} />
          }
        />
        <Route path="/dashboard" element={<ProtectedDashBoard />} />
      </Routes>
    </Router>
  );
}

export default App;
