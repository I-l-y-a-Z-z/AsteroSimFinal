import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CometSelection.css";

const backend_port = "https://asterobackend-production.up.railway.app/";

export default function CometSelection() {
  const [asteroids, setAsteroids] = useState([]);
  const [selectedAsteroid, setSelectedAsteroid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // user input states
  const [date, setDate] = useState("");
  const [rate, setRate] = useState(5);
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  useEffect(() => {
    if (!date) return; // wait until a date is chosen

    const fetchAsteroids = async () => {
      setLoading(true);
      setError(null);

      try {
        // encode params
        const params = new URLSearchParams({ start: date, end: date, rate: String(rate) }).toString();
        const url = `http://${backend_port}/get_range?${params}`;

        let res;
        try {
          res = await axios.get(url);
        } catch (firstErr) {
          if (firstErr?.response?.status === 404) {
            const altUrl = url.endsWith("/") ? url.slice(0, -1) : url + "/";
            console.warn(`404 for ${url}, retrying ${altUrl}`);
            res = await axios.get(altUrl);
          } else {
            throw firstErr;
          }
        }

        const formatted = res.data.map((c, index) => ({
          id: index + 1,
          name: c.name,
          size: `${c.diameter_min_km.toFixed(2)} - ${c.diameter_max_km.toFixed(2)} km`,
          density: c.absolute_magnitude ? `${c.absolute_magnitude.toFixed(2)} mag` : "N/A",
          composition: c.is_hazardous ? "Potentially Hazardous" : "Non-hazardous",
          velocity: `${parseFloat(c.velocity_km_s).toFixed(2)} km/s`,
          missDistance: `${parseFloat(c.miss_distance_km).toLocaleString()} km`,
          date: c.close_approach_date,
        }));

        setAsteroids(formatted);
      } catch (err) {
        console.error("Error fetching asteroids:", err?.response?.status, err?.response?.data || err.message || err);
        setError("Failed to load asteroid data. See console for details.");
      } finally {
        setLoading(false);
      }
    };

    fetchAsteroids();
  }, [date, rate]); // re-run on change

  const handleStart = () => {
    if (selectedAsteroid) {
      localStorage.setItem("selectedAsteroid", JSON.stringify(selectedAsteroid));
      navigate("/simulation");
    } else {
      // UX fallback: show inline error and focus the controls
      setError("Please select an asteroid before running the simulation.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="asteroid-page">
      <div className="stars"></div>
      <div className="earth-glow"></div>

      <div className="header">
        <h1 className="title">Mission: Select an Asteroid</h1>
        <p className="subtitle">Choose a date and maximum results, inspect candidates, then run the simulation.</p>
      </div>

      <div className="controls">
        <div className="control">
          <label>Select Date:</label>
          <input type="date" value={date} min="1900-01-01" max={today} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="control">
          <label>Max # of Asteroids:</label>
          <input type="number" value={rate} min="1" max="100" onChange={(e) => setRate(e.target.value)} />
        </div>
      </div>

      {loading && date && <div className="loading">Loading asteroid data...</div>}
      {error && <div className="error">{error}</div>}

      {!loading && asteroids.length > 0 && (
        <div className="asteroid-grid">
          {asteroids.map((a) => (
            <div key={a.id} className={`asteroid-card ${selectedAsteroid?.id === a.id ? "selected" : ""}`}>
              <h2 className="asteroid-name">{a.name}</h2>
              <p><strong>Size:</strong> {a.size}</p>
              <p><strong>Velocity:</strong> {a.velocity}</p>
              <p><strong>Miss Distance:</strong> {a.missDistance}</p>
              <p><strong>Risk Level:</strong> {a.composition}</p>
              <p><strong>Approach Date:</strong> {a.date}</p>
              <button className="select-button" onClick={() => setSelectedAsteroid(a)}>{selectedAsteroid?.id === a.id ? "Selected" : "Select"}</button>
            </div>
          ))}
        </div>
      )}

      {!loading && date && asteroids.length === 0 && <div className="no-results">No asteroids found for that date.</div>}

      <div className="start-wrap">
        <button className="start-sim" onClick={handleStart} disabled={!selectedAsteroid}>Run Simulation</button>
      </div>
    </div>
  );
}
