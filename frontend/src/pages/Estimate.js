import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUserId } from "../hooks/useUserId";

/**
 * Страница показывает экономию, запрашивая её у backend.
 * Цена за кВт·ч передаётся через navigate-state со страницы Rooms.
 * Если значение не передано, берётся 0.15 $/kWh.
 */
export default function Estimate() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const userId    = useUserId();
  const token     = localStorage.getItem("accessToken");

  /** Цена $/kWh (передаётся со страницы Rooms) */
  const tariffPerHour =
    Number(location.state?.tariff) > 0 ? Number(location.state.tariff) : 0.15;

  const [monthlySavings, setMonthlySavings] = useState(null);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState(null);

  useEffect(() => {
    if (!userId) return;           // ждём id пользователя
    const controller = new AbortController();

    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/savings/user/${userId}?tariffPerHour=${tariffPerHour}`,
          { signal: controller.signal, headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) throw new Error(`Request failed with ${res.status}`);

        // endpoint возвращает число
        const value = await res.json();
        setMonthlySavings(Number(value));
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, [userId, tariffPerHour, token]);

  const yearlySavings = monthlySavings != null ? monthlySavings * 12 : 0;

  /* ------------------------------------------------------------------ */
  /*  UI                                                                */
  /* ------------------------------------------------------------------ */
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
          <p style={{ margin: "0.5rem 0", fontSize: "0.9rem" }}>
            (calculations with&nbsp;
            <strong>${tariffPerHour.toFixed(2)} $/kWh</strong>)
          </p>

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
