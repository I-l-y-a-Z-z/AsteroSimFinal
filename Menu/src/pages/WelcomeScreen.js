import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./WelcomeScreen.css";

export default function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="story-wrapper">
      <div className="stars"></div>
      <div className="earth-glow"></div>

      <div className="story-card">
        <motion.h1
          className="story-title"
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          AsteroSim — Mission Briefing
        </motion.h1>

        <motion.p
          className="story-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          You're the new mission lead at the Planetary Defense Center. Earlier today, telescopes
          detected a set of candidate asteroids that will make close approaches. Your task: choose
          an asteroid, inspect its stats, and run the simulation to evaluate impact scenarios.
        </motion.p>

        <div className="story-actions">
          <motion.button
            className="btn-primary"
            onClick={() => navigate("/select-comet")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            View Asteroid Candidates
          </motion.button>

          <motion.button
            className="btn-secondary"
            onClick={() => navigate("/simulation")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Quick Simulation Demo
          </motion.button>
        </div>

        <div className="story-hint"><p>Tip: Pick a recent date to find nearby asteroid approaches.</p>
              <p>Made by Team HackX: Ilyas Rahmouni, Haitam Laghmam, Zakaria Harira</p>
              <p>As part of the Nasa Space Apps Challenge Benguerir 2025</p></div>
      </div>
    </div>
  );
}
