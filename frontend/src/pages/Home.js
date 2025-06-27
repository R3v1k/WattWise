import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
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
  return (
    <div className="table" style={containerStyle}>
      <h1>Tired of wasting money & energy?</h1>
      <p>See how much you can save with our devices!</p>
      <Link to="/auth"><button
            style={{
            width: '100%',
            maxWidth: '300px',
            padding: '0.75rem 1rem',
            fontSize: '1rem',
          }}>Get started</button></Link>
    </div>
  );
}
