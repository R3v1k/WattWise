import React, { useState } from 'react';

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #E0E7FF 0%, #A78BFA 100%)',
    padding: '1.5rem',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: 'rgba(255,255,255,0.85)',
    backdropFilter: 'blur(12px)',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    borderRadius: '24px',
    padding: '2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '800',
    marginBottom: '1.5rem',
    textAlign: 'center',
    color: '#6B21A8',
  },
  formGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    marginBottom: '0.5rem',
    color: '#4B5563',
  },
  input: {
    width: '100%',
    border: '1px solid #D1D5DB',
    borderRadius: '8px',
    padding: '0.75rem',
    fontSize: '1rem',
  },
  select: {
    width: '100%',
    border: '1px solid #D1D5DB',
    borderRadius: '8px',
    padding: '0.75rem',
    fontSize: '1rem',
  },
  avatarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1rem',
  },
  avatar: {
    width: '4rem',
    height: '4rem',
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, boxShadow 0.2s ease',
  },
  avatarSelected: {
    boxShadow: '0 0 0 4px rgba(139,92,246,0.8)',
  },
  button: {
    width: '100%',
    backgroundColor: '#7C3AED',
    color: '#FFFFFF',
    padding: '0.75rem',
    fontSize: '1rem',
    fontWeight: '600',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};

const avatarOptions = [
  '/avatars/avatar1.png',
  '/avatars/avatar2.png',
  '/avatars/avatar3.png',
  '/avatars/avatar4.png',
];

export default function Profile() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [region, setRegion] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ firstName, lastName, region, avatar: selectedAvatar });
    // отправка на сервер…
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>User Profile</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              style={styles.input}
              placeholder="Enter first name"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              style={styles.input}
              placeholder="Enter last name"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Continent</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              style={styles.select}
            >
              <option value="">Select continent</option>
              <option value="Africa">Africa</option>
              <option value="Australia">Australia</option>
              <option value="Asia">Asia</option>
              <option value="Europe">Europe</option>
              <option value="North America">North America</option>
              <option value="South America">South America</option>
              <option value="Russia">Russia</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Avatar</label>
            <div style={styles.avatarGrid}>
              {avatarOptions.map((src) => (
                <img
                  key={src}
                  src={src}
                  alt="avatar"
                  style={{
                    ...styles.avatar,
                    ...(selectedAvatar === src ? styles.avatarSelected : {}),
                  }}
                  onClick={() => setSelectedAvatar(src)}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            style={styles.button}
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}