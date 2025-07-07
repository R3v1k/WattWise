import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Slider() {
  const [value, setValue] = useState(50);
  const navigate = useNavigate();

  return (
    <div className="table">
      <h3>Our devices</h3>
      <input
        type="range" min="0" max="100"
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <p>{value} % better</p>
      <button onClick={() => navigate('/estimate')}>Next</button>
    </div>
  );
}
