import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserId } from "../hooks/useUserId"; // adjust the import path to where your hook lives

// ────────────────────────────────────────────────────────────────────────────────
// Temprorary constant until the tariff can be configured dynamically.
// Picked a mid-range residential kWh price (USD/kWh → USD/h for an average kW).
// Replace this with a real value once it is available from user settings/UI.
// ────────────────────────────────────────────────────────────────────────────────
const TARIFF_PER_HOUR = 0.15;

export default function Estimate() {
  const navigate = useNavigate();
  const userId = useUserId();
    const token = localStorage.getItem('accessToken');

  // Backend returns the *monthly* savings figure, we derive yearly locally.
  const [monthlySavings, setMonthlySavings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return; // wait until we have the id

    const controller = new AbortController();

    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/savings/user/${userId}?tariffPerHour=${TARIFF_PER_HOUR}`,
          { signal: controller.signal, headers: { Authorization: `Bearer ${token}` }}
        );

        if (!res.ok) throw new Error(`Request failed with ${res.status}`);

        // The endpoint returns a primitive number, not JSON with a key
        const value = await res.json();
        setMonthlySavings(Number(value));
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Unknown error");
        }
      } finally {
        setLoading(false);
      }
    };

    load();

    return () => controller.abort();
  }, [userId]);

  const yearlySavings = monthlySavings != null ? monthlySavings * 12 : 0;

  // ──────────────────────────────────────────────────────────────────────────────
  // UI
  // ──────────────────────────────────────────────────────────────────────────────
  return (
    <div className="table" style={{ textAlign: "center" }}>
      <p>Estimated Savings:</p>

      {loading && <p>Loading…</p>}
      {error && (
        <p style={{ color: "red", margin: "1rem 0" }}>
          Couldn’t load savings&nbsp;– {error}
        </p>
      )}

      {!loading && !error && monthlySavings != null && (
        <>
          <p style={{ fontSize: "2rem", margin: "1rem 0" }}>
            ${monthlySavings.toFixed(2)} <small>monthly</small>
          </p>
          <p style={{ fontSize: "2rem", margin: "1rem 0" }}>
            ${yearlySavings.toFixed(2)} <small>yearly</small>
          </p>
        </>
      )}

      <button
        onClick={() => navigate("/appointment")}
        style={{
          padding: "0.75rem 1.5rem",
          fontSize: "1rem",
          borderRadius: "0.5rem",
          cursor: "pointer",
        }}
      >
        Book an appointment
      </button>
    </div>
  );
}