import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      const res = await fetch('/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || 'Login failed');
      localStorage.setItem('accessToken', data.accessToken);
      // Token is set in HttpOnly cookie by the server
      navigate('/devices');
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="table">
      <h2>Login</h2>
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
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleLogin}>Proceed</button>
    </div>
  );
}