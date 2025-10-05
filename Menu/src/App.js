import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomeScreen from "./pages/WelcomeScreen";
import CometSelection from "./pages/CometSelection";
import "./App.css";

const simulation_port = "localhost:3000";

function SimulationPage() {
  const comet = JSON.parse(localStorage.getItem("selectedComet"));
  console.log(comet);

  const data = encodeURIComponent(JSON.stringify(comet));
  window.location.href = `http://${simulation_port}?data=${data}`;
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
