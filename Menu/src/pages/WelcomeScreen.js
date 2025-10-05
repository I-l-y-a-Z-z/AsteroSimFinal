import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./WelcomeScreen.css";

export default function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="welcome-wrapper">
      {/* Background layers */}
      <div className="stars"></div>
      <div className="earth-glow"></div>
      

      {/* Main content */}
      <div className="content">
        <motion.h1
          className="main-title"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          Astero Sim
        </motion.h1>

        <motion.p
          className="tagline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1.2 }}
        >
          Humanity's fate is in your hands.
          Track incoming comets. Devise defenses.
          Simulate outcomes — and save Earth from cosmic threats.
        </motion.p>

        <motion.button
          className="mission-button"
          onClick={() => navigate("/select-comet")}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Begin Mission
        </motion.button>
      </div>
    </div>
  );
}
