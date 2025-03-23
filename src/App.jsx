import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SignUp from "./components/SignUp";
import LogIn from "./components/LogIn";
import Preferences from "./components/preference";
import DashBoard from "./pages/DashBoard";
import { useState } from "react";

function App() {
  const [host, setHost] = useState("");
  console.log("host :", host);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
        <Route
          path="/preference"
          element={<Preferences setHost={setHost} host={host} />}
        />
        <Route path="/dashboard" element={<DashBoard host={host} />} />
      </Routes>
    </Router>
  );
}

export default App;
