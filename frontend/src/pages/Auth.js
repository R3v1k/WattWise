// src/pages/Auth.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const specialChars   = /[!@#*()\-]/;
const uppercaseRegex = /[A-Z]/;

export default function Auth() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const containerStyle = {
    display       : 'flex',
    flexDirection : 'column',
    alignItems    : 'center',
    justifyContent: 'center',
    padding       : isMobile ? '1rem' : '2rem',
    maxWidth      : '600px',
    width         : isMobile ? '90vw' : 'auto',
    height        : '80vh',
    margin        : isMobile ? '5vh auto' : '10vh auto',
  };

  const [mode, setMode] = useState('login');
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass]         = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [error, setError]               = useState('');
  const [firstName, setFirstName]       = useState('');
  const [lastName, setLastName]         = useState('');
  const [currency, setCurrency]         = useState('USD');

  const navigate = useNavigate();

  const isLengthValid   = password.length >= 6;
  const hasUppercase    = uppercaseRegex.test(password);
  const hasSpecialChar  = specialChars.test(password);
  const isPasswordValid = isLengthValid && hasUppercase && hasSpecialChar;
  const isConfirmMatch  = mode === 'register' ? password === confirmPassword : true;

  const clearAll = () => {
    setError('');
    setPassword('');
    setConfirmPassword('');
    setShowPass(false);
    setShowConfirm(false);
  };

  function renderPasswordInput(placeholder, value, setValue, isShown, toggleShow) {
    return (
      <div className="password-wrapper">
        <input
          placeholder={placeholder}
          type={isShown ? 'text' : 'password'}
          value={value}
          onChange={e => {
            setValue(e.target.value);
            setError('');
          }}
        />
      </div>
    );
  }

  async function handleSubmit() {
    if (mode === 'login') {
      if (!email || !password) {
        setError('Please enter both email and password');
        return;
      }
      try {
        const res = await fetch('/auth/login', {
          method      : 'POST',
          credentials : 'include',
          headers     : { 'Content-Type': 'application/json' },
          body        : JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || data.message || 'Log in failed');
        localStorage.setItem('accessToken', data.accessToken);
        navigate('/devices');
      } catch (e) {
        setError(e.message);
      }
    } else {
      if (!isPasswordValid) {
        setError('Password does not meet requirements');
        return;
      }
      if (!isConfirmMatch) {
        setError('Password and confirmation do not match');
        return;
      }
      if (!firstName || !lastName || !email) {
        setError('Please fill in all required fields');
        return;
      }
      const body = {
        firstName,
        lastName,
        email,
        password,
        currencyCode: currency,
        pricePerWatt: 0.1,
      };
      try {
        const res = await fetch('/auth/register', {
          method : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body   : JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Registration error');
        localStorage.setItem('accessToken', data.accessToken);
        setMode('login');
        clearAll();
        navigate('/devices');
      } catch (e) {
        setError(e.message);
      }
    }
  }

  return (
    <div className="table" style={containerStyle}>
      <div className="auth-toggle">
        <button
          className={mode === 'login' ? 'active' : ''}
          onClick={() => {
            setMode('login');
            clearAll();
          }}
        >
          Log in
        </button>
        <button
          className={mode === 'register' ? 'active' : ''}
          onClick={() => {
            setMode('register');
            clearAll();
          }}
        >
          Register
        </button>
      </div>

      <h2>{mode === 'login' ? 'Log in' : 'Join us!'}</h2>

      {mode === 'register' && (
        <>
          <input
            placeholder="First Name"
            value={firstName}
            onChange={e => {
              setFirstName(e.target.value);
              setError('');
            }}
            style={{ marginBottom: '1rem' }}
          />
          <input
            placeholder="Last Name"
            value={lastName}
            onChange={e => {
              setLastName(e.target.value);
              setError('');
            }}
            style={{ marginBottom: '1rem' }}
          />
        </>
      )}

      <input
        placeholder="Email"
        type="email"
        value={email}
        onChange={e => {
          setEmail(e.target.value);
          setError('');
        }}
        style={{ marginBottom: '1rem' }}
      />

      {renderPasswordInput('Password', password, setPassword, showPass, () => setShowPass(prev => !prev))}

      {mode === 'register' &&
        renderPasswordInput('Confirm Password', confirmPassword, setConfirmPassword, showConfirm, () => setShowConfirm(prev => !prev))}

      {mode === 'register' && (
        <input
          placeholder="Currency (e.g. USD)"
          value={currency}
          onChange={e => {
            setCurrency(e.target.value);
            setError('');
          }}
          style={{ marginBottom: '1rem' }}
        />
      )}

      {mode === 'register' && (
        <ul style={{ listStyle: 'none', padding: 0, margin: '1rem auto', textAlign: 'left', maxWidth: 300 }}>
          <li style={{ color: isLengthValid ? 'lightgreen' : '#ff6b6b' }}>
            {isLengthValid ? '✔' : '✖'} Min. 6 characters
          </li>
          <li style={{ color: hasUppercase ? 'lightgreen' : '#ff6b6b' }}>
            {hasUppercase ? '✔' : '✖'} One uppercase letter
          </li>
          <li style={{ color: hasSpecialChar ? 'lightgreen' : '#ff6b6b' }}>
            {hasSpecialChar ? '✔' : '✖'} One special char (!@#*()-)
          </li>
          <li style={{ color: isConfirmMatch ? 'lightgreen' : '#ff6b6b' }}>
            {isConfirmMatch ? '✔' : '✖'} Passwords match
          </li>
        </ul>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button style = {{borderRadius: '0.5rem'}}
        onClick={handleSubmit}
        disabled={
          mode === 'register'
            ? !isPasswordValid || !isConfirmMatch || !firstName || !lastName || !email
            : false
        }
      >
        Proceed
      </button>
    </div>
  );
}
