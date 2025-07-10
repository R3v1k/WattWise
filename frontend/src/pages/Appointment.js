import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserId } from '../hooks/useUserId';

export default function Appointment() {
  const userId   = useUserId();
  const navigate = useNavigate();

  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);

  const token = localStorage.getItem('accessToken');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  /* --- adjust layout on resize --- */
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /* --- inline styles (same as before) --- */
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: isMobile ? '1rem' : '2rem',
    maxWidth: '600px',
    width: isMobile ? '90vw' : 'auto',
    height: 'auto',
    margin: isMobile ? '5vh auto' : '10vh auto',
  };

  const inputStyle = {
    width: '100%',
    marginBottom: '0rem',
    display: 'flex',
    flexDirection: 'column',
  };

  const labelStyle = {
    width: '100%',
    padding: isMobile ? '0.5rem 1rem' : '1rem 1.25rem',
    fontSize: isMobile ? '1rem' : '1.125rem',
    marginTop: '0rem',
  };

  const buttonStyle = {
    width: '100%',
    maxWidth: '300px',
    padding: isMobile ? '0.75rem 1rem' : '1rem 1.25rem',
    fontSize: isMobile ? '1rem' : '1.125rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
  };

  /* --- submit handler --- */
  const handleSubmit = async e => {
    e.preventDefault();

    if (!userId) {
      setError('User is not authenticated. Please sign in again.');
      return;
    }

    try {
      const res = await fetch(`/api/users/${userId}/appointments`, {
        method : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept'      : 'application/json',
          Authorization : `Bearer ${token}`,
        },
        body: JSON.stringify({ phone, email }),
      });

      if (res.ok) {
        const data = await res.json();
        navigate('/thank-you', { state: data });
        return;
      }

      if (res.status === 400)      setError('Invalid phone or e-mail format.');
      else if (res.status === 404) setError('User not found.');
      else                         setError('Unexpected server error.');
    } catch {
      setError('Network error. Please try again later.');
    }
  };

  return (
    <form className="table" style={containerStyle} onSubmit={handleSubmit}>
      {/* --- Phone --- */}
      <label style={labelStyle}>
        Phone
        <input
          type="tel"
          placeholder="+1 (555) 123-4567"
          required
          style={inputStyle}
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />
      </label>

      {/* --- Email --- */}
      <label style={labelStyle}>
        E-mail
        <input
          type="email"
          placeholder="you@example.com"
          required
          style={inputStyle}
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>

      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

      <button type="submit" style={buttonStyle}>
        Send
      </button>
    </form>
  );
}
