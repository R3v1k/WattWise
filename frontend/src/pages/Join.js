//Join.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const specialChars = /[!@#*()\-]/;
const uppercaseRegex = /[A-Z]/;

export default function Join() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const isLengthValid = password.length >= 6;
  const hasUppercase = uppercaseRegex.test(password);
  const hasSpecialChar = specialChars.test(password);
  const isPasswordValid = isLengthValid && hasUppercase && hasSpecialChar;

  const handleRegister = async () => {
    if (!isPasswordValid) {
      setError('Password does not meet requirements');
      return;
    }
    if (!firstName || !lastName || !email) {
      setError('Please fill in all fields');
      return;
    }

    // Собираем тело запроса
    const body = {
      firstName,
      lastName,
      email,
      password,
      currencyCode: currency,
      pricePerWatt: 0.1
    };

    try {
      const res = await fetch(`/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration error');

      localStorage.setItem('token', data.accessToken);
      navigate('/login');
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="table">
      <h2>Join us!</h2>
      <input
        placeholder="First Name"
        value={firstName}
        onChange={e => {
          setFirstName(e.target.value);
          setError('');
        }}
      />
      <input
        placeholder="Last Name"
        value={lastName}
        onChange={e => {
          setLastName(e.target.value);
          setError('');
        }}
      />
      <input
        placeholder="Email"
        type="email"
        value={email}
        onChange={e => {
          setEmail(e.target.value);
          setError('');
        }}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={e => {
          setPassword(e.target.value);
          setError('');
        }}
      />
      <input
        placeholder="Currency (e.g. USD)"
        value={currency}
        onChange={e => {
          setCurrency(e.target.value);
          setError('');
        }}
      />

      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: '1rem auto',
          textAlign: 'left',
          maxWidth: 300
        }}
      >
        <li style={{ color: isLengthValid ? 'lightgreen' : '#ff6b6b' }}>
          {isLengthValid ? '✔' : '✖'} Min. 6 characters
        </li>
        <li style={{ color: hasUppercase ? 'lightgreen' : '#ff6b6b' }}>
          {hasUppercase ? '✔' : '✖'} One uppercase English letter
        </li>
        <li style={{ color: hasSpecialChar ? 'lightgreen' : '#ff6b6b' }}>
          {hasSpecialChar ? '✔' : '✖'} One special char (!@#*()-)
        </li>
      </ul>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button
        onClick={handleRegister}
        disabled={!isPasswordValid || !firstName || !lastName || !email}
      >
        Proceed
      </button>
    </div>
  );
}