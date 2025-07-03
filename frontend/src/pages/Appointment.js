import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserId } from '../hooks/useUserId';

export default function Appointment() {
  const userId   = useUserId();
  const navigate = useNavigate();

  const [date,  setDate]  = useState('');
  const [time,  setTime]  = useState('');
  const [error, setError] = useState(null);
  const token = localStorage.getItem('accessToken');
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
      height: 'auto',
      margin: isMobile ? '5vh auto' : '10vh auto',
    };
  
    const labelStyle = {
      width: '100%',
      marginBottom: '1rem',
      display: 'flex',
      flexDirection: 'column',
    };
  
    const inputStyle = {
      width: '100%',
      padding: isMobile ? '0.5rem 1rem' : '1rem 1.25rem',
      fontSize: isMobile ? '1rem' : '1.125rem',
      marginTop: '0.5rem',
    };
  
    const buttonStyle = {
      width: '100%',
      maxWidth: '300px',
      padding: isMobile ? '0.75rem 1rem' : '1rem 1.25rem',
      fontSize: isMobile ? '1rem' : '1.125rem',
      borderRadius: '0.5rem',
      cursor: 'pointer',
    };
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
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          appointmentDate: date, // YYYY-MM-DD
          appointmentTime: time, // HH:mm:ss
        }),
      });

      if (res.ok) {
        const data = await res.json();
        navigate('/thank-you', { state: data });
        return;
      }

      if (res.status === 400)      setError('Invalid time format.');
      else if (res.status === 404) setError('User not found.');
      else                         setError('Unexpected server error.');
    } catch {
      setError('Network error. Please try again later.');
    }
  };

  return (
    <form className="table" style={containerStyle} onSubmit={handleSubmit}>
      <label style={labelStyle}>
        Preferred date
        <input
          type="date"
          required
          value={date}
          onChange={e => setDate(e.target.value)}
        />
      </label>

      <label style={labelStyle}>
        Preferred time
        <input
          type="time"
          step="1"
          required
          value={time}
          onChange={e => setTime(e.target.value)}
        />
      </label>

      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

      <button type="submit" style={buttonStyle}>Send</button>
    </form>
  );
}
