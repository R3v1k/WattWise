// src/pages/Auth.jsx
import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const specialChars    = /[!@#*()\-]/;
const uppercaseRegex  = /[A-Z]/;

export default function Auth() {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  
    useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth <= 600);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  
    const containerStyle = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isMobile ? '1rem' : '2rem',
      maxWidth: '600px',
      width: isMobile ? '90vw' : 'auto',
      height: '80vh',
      margin: isMobile ? '5vh auto' : '10vh auto',
    };
  // toggle: "login" | "register"
  const [mode, setMode] = useState('login');

  // shared fields
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');

  // register-only fields
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [currency,  setCurrency]  = useState('USD');

  const navigate = useNavigate();

  // password rules (only relevant for register)
  const isLengthValid   = password.length >= 6;
  const hasUppercase    = uppercaseRegex.test(password);
  const hasSpecialChar  = specialChars.test(password);
  const isPasswordValid = isLengthValid && hasUppercase && hasSpecialChar;

  const clearAll = () => {
    setError('');
    setPassword('');
  };

  /* ------------------------------------------------------------------ */
  async function handleSubmit() {
    if (mode === 'login') {
      /* -------- LOGIN -------- */
      if (!email || !password) {
        setError('Please enter both email and password');
        return;
      }

      try {
        const res  = await fetch('/auth/login', {
          method     : 'POST',
          credentials: 'include',
          headers    : { 'Content-Type': 'application/json' },
          body       : JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || data.message || 'Login failed');

        localStorage.setItem('accessToken', data.accessToken);
        navigate('/devices');
      } catch (e) {
        setError(e.message);
      }
    } else {
      /* -------- REGISTER -------- */
      if (!isPasswordValid) {
        setError('Password does not meet requirements');
        return;
      }
      if (!firstName || !lastName || !email) {
        setError('Please fill in all fields');
        return;
      }

      const body = {
        firstName,
        lastName,
        email,
        password,
        currencyCode: currency,
        pricePerWatt: 0.1
      };

      try {
        const res  = await fetch('/auth/register', {
          method : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body   : JSON.stringify(body)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Registration error');
        localStorage.setItem('accessToken', data.accessToken);
        // Registration successful → straight to login or dashboard
        setMode('login');
        clearAll();
        navigate('/devices');           // or navigate('/devices');
      } catch (e) {
        setError(e.message);
      }
    }
  }
  /* ------------------------------------------------------------------ */

  return (
    <div className="table" style={containerStyle}>
      {/* ─────── Toggle tabs ─────── */}
      <div className="auth-toggle">
        <button
          className={mode === 'login' ? 'active' : ''}
          onClick={() => { setMode('login');  clearAll(); }}>
          Login
        </button>
        <button
          className={mode === 'register' ? 'active' : ''}
          onClick={() => { setMode('register'); clearAll(); }}>
          Register
        </button>
      </div>

      {/* ─────── Header ─────── */}
      <h2>{mode === 'login' ? 'Login' : 'Join us!'}</h2>

      {/* ─────── Inputs ─────── */}
      {mode === 'register' && (
        <>
          <input
            placeholder="First Name"
            value={firstName}
            onChange={e => { setFirstName(e.target.value); setError(''); }}
          />
          <input
            placeholder="Last Name"
            value={lastName}
            onChange={e => { setLastName(e.target.value); setError(''); }}
          />
        </>
      )}

      <input
        placeholder="Email"
        type="email"
        value={email}
        onChange={e => { setEmail(e.target.value); setError(''); }}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={e => { setPassword(e.target.value); setError(''); }}
      />

      {mode === 'register' && (
        <input
          placeholder="Currency (e.g. USD)"
          value={currency}
          onChange={e => { setCurrency(e.target.value); setError(''); }}
        />
      )}

      {/* ─────── Password hints ─────── */}
      {mode === 'register' && (
        <ul style={{
          listStyle: 'none',
          padding  : 0,
          margin   : '1rem auto',
          textAlign: 'left',
          maxWidth : 300 }}>
          <li style={{ color: isLengthValid  ? 'lightgreen' : '#ff6b6b' }}>
            {isLengthValid  ? '✔' : '✖'} Min. 6 characters
          </li>
          <li style={{ color: hasUppercase   ? 'lightgreen' : '#ff6b6b' }}>
            {hasUppercase   ? '✔' : '✖'} One uppercase letter
          </li>
          <li style={{ color: hasSpecialChar ? 'lightgreen' : '#ff6b6b' }}>
            {hasSpecialChar ? '✔' : '✖'} One special char (!@#*()-)
          </li>
        </ul>
      )}

      {/* ─────── Error & submit ─────── */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button
        onClick={handleSubmit}
        disabled={
          mode === 'register'
            ? !isPasswordValid || !firstName || !lastName || !email
            : false
        }
      >
        Proceed
      </button>
    </div>
  );
}
