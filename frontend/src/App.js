import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import logo from './logo.svg';

import Home        from './pages/Home';
import Slider      from './pages/Slider';
import Devices     from './pages/Devices';
import Estimate    from './pages/Estimate';
import Appointment from './pages/Appointment';
import ThankYou    from './pages/ThankYou';
import Profile     from './pages/Profile';
import Auth        from './pages/Auth';
import Admin       from './pages/Admin';

function App() {
  // Check if the user is authenticated
  const accessToken = localStorage.getItem('accessToken');

  // Clear the token when the user logs out
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
  };

  return (
    <BrowserRouter>
      <header className="header">
        <div className="header__logo"><img src={logo} alt="Logo" /></div>
        <nav className="header__nav">
          <Link to="/">Home</Link>
          {accessToken && (
            <Link to="/auth" onClick={handleLogout} className="header__logout">
              Log&nbsp;out
            </Link>
          )}
        </nav>
      </header>

      <Routes>
        <Route path="/"            element={<Home />} />
        <Route path="/start"       element={<Slider />} />
        <Route path="/devices"     element={<Devices />} />
        <Route path="/estimate"    element={<Estimate />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/thank-you"   element={<ThankYou />} />
        <Route path="/profile"     element={<Profile />} />
        <Route path="/auth"        element={<Auth />} />
        <Route path="/admin"       element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
