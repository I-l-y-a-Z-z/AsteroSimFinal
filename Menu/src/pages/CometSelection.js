import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CometSelection.css";

const backend_port = "localhost:8000";

export default function CometSelection() {
  const [comets, setComets] = useState([]);
  const [selectedComet, setSelectedComet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New: user input states
  const [date, setDate] = useState("");
  const [rate, setRate] = useState(5);
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  useEffect(() => {
    if (!date) return; // wait until a date is chosen


    const fetchComets = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(
          `http://${backend_port}/get_range?start=${date}&end=${date}&rate=${rate}`
        , {headers: {'Access-Control-Allow-Origin' : '*'}});

        const formatted = res.data.map((c, index) => ({
          id: index + 1,
          name: c.name,
          size: `${c.diameter_min_km.toFixed(2)} - ${c.diameter_max_km.toFixed(
            2
          )} km`,
          density: c.absolute_magnitude
            ? `${c.absolute_magnitude.toFixed(2)} mag`
            : "N/A",
          composition: c.is_hazardous ? "Potentially Hazardous" : "Non-hazardous",
          velocity: `${parseFloat(c.velocity_km_s).toFixed(2)} km/s`,
          missDistance: `${parseFloat(c.miss_distance_km).toLocaleString()} km`,
          date: c.close_approach_date,
        }));

        setComets(formatted);
      } catch (err) {
        console.error("Error fetching comets:", err);
        setError("Failed to load comet data.");
      } finally {
        setLoading(false);
      }
    };

    fetchComets();
  }, [date, rate]); // re-run on change

  const handleStart = () => {
    if (selectedComet) {
      localStorage.setItem("selectedComet", JSON.stringify(selectedComet));
      navigate("/simulation");
    }
  };

  return (
    <div className="comet-page">
      <div className="stars"></div>
      <div className="earth-glow"></div>

      <h1 className="comet-title">Choose Your Asteroid</h1>
      <p className="comet-subtitle">
        Pick a date and rate, then choose a comet from the results.
      </p>

      {/* 🔥 Date & Rate Controls */}
      <div className="controls">
        <div className="control">
          <label>Select Date:</label>
          <input
            type="date"
            value={date}
            min="1900-01-01"
            max={today}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="control">
          <label>Max # of Comets:</label>
          <input
            type="number"
            value={rate}
            min="1"
            max="100"
            onChange={(e) => setRate(e.target.value)}
          />
        </div>
      </div>

      {loading && date && <div className="loading">☄️ Loading comet data...</div>}
      {error && <div className="error">{error}</div>}

      {!loading && comets.length > 0 && (
        <div className="comet-grid">
          {comets.map((comet) => (
            <div
              key={comet.id}
              className={`comet-card ${selectedComet?.id === comet.id ? "selected" : ""
                }`}
            >
              <h2 className="comet-name">{comet.name}</h2>
              <p><strong>Size:</strong> {comet.size}</p>
              <p><strong>Velocity:</strong> {comet.velocity}</p>
              <p><strong>Miss Distance:</strong> {comet.missDistance}</p>
              <p><strong>Risk Level:</strong> {comet.composition}</p>
              <p><strong>Approach Date:</strong> {comet.date}</p>
              <button
                className="select-button"
                onClick={() => setSelectedComet(comet)}
              >
                {selectedComet?.id === comet.id ? "✅ Selected" : "Select"}
              </button>
            </div>
          ))}
        </div>
      )}

      {!loading && date && comets.length === 0 && (
        <div className="no-results">No comets found for that date.</div>
      )}

      <button
        className="start-animation"
        onClick={handleStart}
        disabled={!selectedComet}
      >
        Simulate Possible Impact
      </button>
    </div>
  );
}
