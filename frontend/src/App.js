import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import logo from './logo.svg';

import Home        from './pages/Home';
import Login       from './pages/Login';
import Join        from './pages/Join';
import Slider      from './pages/Slider';
import Devices     from './pages/Devices';
import Estimate    from './pages/Estimate';
import Appointment from './pages/Appointment';
import ThankYou    from './pages/ThankYou';
import Profile     from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <header className="header">
        <div className="header__logo"><img src={logo} alt="Logo" /></div>
        <nav className="header__nav">
          <Link to="/">Home</Link>
          <Link to="/login">Log in</Link>
          <Link to="/join">Join</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/"            element={<Home />} />
        <Route path="/login"       element={<Login />} />
        <Route path="/join"        element={<Join />} />
        <Route path="/start"       element={<Slider />} />
        <Route path="/devices"     element={<Devices />} />
        <Route path="/estimate"    element={<Estimate />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/thank-you"   element={<ThankYou />} />
        <Route path="/profile"     element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
