// src/pages/AdminPanel.jsx
import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import '../App.css';
import { useUserId } from '../hooks/useUserId';

/** util: read numeric userId from JWT or fallback to /users/me */


export default function AdminPanel() {
  const userId = useUserId();
  const token  = localStorage.getItem('accessToken');

  const [smart,       setSmart]       = useState([]);   // smart groups
  const [dumb,        setDumb]        = useState([]);   // all dumb devices
  const [linkSelect,  setLinkSelect]  = useState({});   // smartId -> dumbId
  const [showForm,    setShowForm]    = useState(false);
  const [newName,     setNewName]     = useState('');
  const [error,       setError]       = useState('');

  /* ───── Fetch initial data ───── */
/* ───── Fetch initial data ───── */
useEffect(() => {
  if (!userId) return;

  async function loadSmartData() {
    try {
      const res = await fetch(`/api/users/${userId}/smart-devices`, {
        headers: {Authorization : `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('cant load smart list');

      const smartList = await res.json(); // [{ id, name }, …]

      const lists = await Promise.all(
        smartList.map(s =>
          fetch(
            `/api/users/${userId}/smart-devices/${s.id}/devices`,
            { headers: { Authorization: `Bearer ${token}` } }
          )
            .then(r => (r.ok ? r.json() : []))  
            .then(devs => ({ ...s, devices: devs }))
        )
      );

      setSmart(lists);

      const statsRes = await fetch(`/api/usage-stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (statsRes.ok) {
        const stats = (await statsRes.json()).map((s, i) => ({
        ...s,
        id  : i + 1,          // ← искусственный, но НЕ null
        name: s.deviceName
        }));
        setDumb(stats);
      }
    } catch (err) {
      console.error('admin load error', err);
      setError('Failed to load data');
    }
  }

  loadSmartData();
}, [userId, token]);


const getAvailable = smartId => {
  const usedIds = new Set(
    (smart.find(s => s.id === smartId)?.devices || []).map(d => d.id)
  );
  return dumb.filter(d => !usedIds.has(d.id));
};
  /* ───── Derived: which dumb devices are still free ───── */
  const linkedIds = new Set(
    smart.flatMap(s => (s.devices || []).map(d => d.id))
  );
  const availableDumb = dumb.filter(d => !linkedIds.has(d.id));

  /* ───── Handlers ───── */
  const handleCreateSmart = async () => {
    if (!newName.trim()) return;
    try {
      const res = await fetch(`/api/users/${userId}/smart-devices`, {
        method : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization : `Bearer ${token}`
        },
        body: JSON.stringify({ name: newName.trim() })
      });
      if (!res.ok) throw new Error('Failed to create');
      const created = await res.json();
      setSmart(prev => [...prev, created]);
      setShowForm(false);
      setNewName('');
    } catch (e) {
      setError(e.message);
    }
  };


const handleLink = async smartId => {
  const deviceId = linkSelect[smartId];
  if (!deviceId) return;

  try {
    const res = await fetch(
      `/api/users/${userId}/smart-devices/${smartId}/devices`,
      {
        method : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization : `Bearer ${token}`
        },
        body: JSON.stringify({ deviceId }) 
      }
    );
    if (!res.ok) throw new Error('Server ${res.status}');

    const linked = dumb.find(d => d.id === deviceId);   

    setSmart(prev =>
      prev.map(s =>
        s.id === smartId
          ? { ...s, devices: [...(s.devices || []), linked] }
          : s
      )
    );
    setLinkSelect(prev => ({ ...prev, [smartId]: '' }));
  } catch (e) {
    setError(e.message);
  }
};
  const button = { padding: '0.5rem 1rem', fontSize: '1rem',
                   borderRadius: '0.5rem', cursor: 'pointer' };

/* ───── Рендер smart-карточек ───── */
<div className="devices-list" style={{ gap: '1rem' }}>
  {smart.map(s => {
    const avail = getAvailable(s.id);          
    return (
      <div key={s.id} className="device-card" style={{ padding: '1rem' }}>
        <h3 style={{ margin: '0 0 0.5rem' }}>{s.name}</h3>
        <p style={{ margin: '0 0 0.5rem' }}>
          Linked dumb devices: {(s.devices || []).length}
        </p>

        {(s.devices || []).map(d => (
        <div key={d.deviceName} style={{ fontSize: '0.9rem' }}>
            • {d.deviceName}
        </div>
        ))}

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '0.5rem',
          marginTop: '1rem'
        }}>
          <select
            value={linkSelect[s.id] || ''}
            onChange={e =>
              setLinkSelect(prev => ({ ...prev, [s.id]: Number(e.target.value) }))
            }
          >
            <option key="pl" value="">-- choose dumb device --</option>
            {avail.map(d => (
            <option key={d.deviceName} value={d.deviceName}>
                {d.deviceName}
            </option>
            ))}
          </select>
          <button
            style={button}
            onClick={() => handleLink(s.id)}
            disabled={!linkSelect[s.id]}
          >
            Link
          </button>
        </div>
      </div>
    );
  })}
</div>




  return (
    <div className="table" style={{ textAlign: 'left' }}>
      <h1>Admin panel</h1>

      {/* error banner */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* smart-device cards */}
      <div className="devices-list" style={{ gap: '1rem' }}>
        {smart.map(s => (
          <div key={s.id} className="device-card" style={{ padding: '1rem' }}>
            <h3 style={{ margin: '0 0 0.5rem' }}>{s.name}</h3>
            <p style={{ margin: '0 0 0.5rem' }}>
              Linked devices: {(s.devices || []).length}
            </p>

            {/* list linked */}
            {(s.devices || []).map(d => (
            <div key={d.id} style={{ fontSize: '0.9rem' }}>
                • {d.deviceName || d.name}
            </div>
            ))}

            {/* link selector */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: '0.5rem',
              marginTop: '1rem'
            }}>
            <select
            value={linkSelect[s.id] || ''}
            onChange={e =>
                setLinkSelect(prev => ({ ...prev, [s.id]: Number(e.target.value) }))
            }
            >
            <option value="">-- choose dumb device --</option>
            {getAvailable(s.id).map(d => (
                <option key={d.id} value={d.id}>
                {d.deviceName}
                </option>
            ))}
            </select>
              <button
                style={button}
                onClick={() => handleLink(s.id)}
                disabled={!linkSelect[s.id]}
              >
                Link
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* + button */}
      <button style={{ ...button, width: '100%', marginTop: '2rem',
                       fontSize: '1.25rem' }}
              onClick={() => setShowForm(true)}>
        + New smart device
      </button>

      {/* modal to create smart device */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setShowForm(false)}>
          <div style={{ background: '#444', padding: '1.5rem',
                        borderRadius: '0.5rem', minWidth: 300 }}
               onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: '1rem' }}>New smart device</h3>
            <input
              placeholder="Name"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              style={{ width: '100%', padding: '0.5rem',
                       borderRadius: '0.25rem', marginBottom: '1rem' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end',
                          gap: '0.5rem' }}>
              <button style={button} onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button style={button} onClick={handleCreateSmart}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}