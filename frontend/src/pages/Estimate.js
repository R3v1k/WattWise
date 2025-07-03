import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Estimate() {
  const navigate = useNavigate();
  const location = useLocation();
  const { rooms = [], deviceTemplates = [] } = location.state || {};

  // savings per device per month
  const savingsRates = {
    'LED Bulb': 2,
    'Smart Thermostat': 8,
    'Energy Saver Fan': 3,
    'Refrigerator': 5,
    'Television': 4,
    'Laptop': 3,
    'Air Conditioner': 10,
    'Electric Kettle': 1,
    'Gaming Console': 4,
    'Dishwasher': 6
  };

  // compute total monthly savings
  const totalMonthly = rooms.reduce((roomAcc, room) => {
    const counts = {};
    (room.devices || []).forEach(d => {
      counts[d.name] = (counts[d.name] || 0) + 1;
    });
    const roomSum = Object.entries(counts).reduce(
      (sum, [name, qty]) => sum + (savingsRates[name] || 0) * qty,
      0
    );
    return roomAcc + roomSum;
  }, 0);

  const totalYearly = totalMonthly * 12;

  return (
    <div className="table" style={{ textAlign: 'center' }}>
      <p>Estimated Savings:</p>
      <p style={{ fontSize: '2rem', margin: '1rem 0' }}>
        ${totalMonthly.toFixed(2)} <small>monthly</small>
      </p>
      <p style={{ fontSize: '2rem', margin: '1rem 0' }}>
        ${totalYearly.toFixed(2)} <small>yearly</small>
      </p>
      <button
        onClick={() => navigate('/appointment')}
        style={{
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          borderRadius: '0.5rem',
          cursor: 'pointer'
        }}
      >
        Book an appointment
      </button>
    </div>
  );
}
