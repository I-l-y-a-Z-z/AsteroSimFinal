import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomeScreen from "./pages/WelcomeScreen";
import CometSelection from "./pages/CometSelection";
import "./App.css";

const simulation_port = "https://astero-simulation-service.vercel.app/";

function SimulationPage() {
  const raw = localStorage.getItem("selectedAsteroid");
  if (!raw) {
    // no selection: log and send user back to selection page
    console.warn("No selected asteroid found in localStorage. Redirecting to selection.");
    // try to navigate back to the selection route
    window.location.href = "/select-comet";
    return null;
  }

  let asteroid = null;
  try {
    asteroid = JSON.parse(raw);
  } catch (err) {
    console.error("Failed to parse selectedAsteroid from localStorage:", err, raw);
    window.location.href = "/select-comet";
    return null;
  }

  console.log("Launching simulation for:", asteroid);
  const data = encodeURIComponent(JSON.stringify(asteroid));
  window.location.href = `${simulation_port}?data=${data}`;
  return null;
}


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/select-comet" element={<CometSelection />} />
        <Route path="/simulation" element={<SimulationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
