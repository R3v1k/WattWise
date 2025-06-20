import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="table">
      <h1>Tired of wasting money & energy?</h1>
      <p>See how much you can save with our devices!</p>
      <Link to="/join"><button>Get started</button></Link>
    </div>
  );
}
