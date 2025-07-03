// src/pages/AdminPanel.jsx — 2025-06 backend-v2
// ---------------------------------------------------
// API version 3 (2025‑07‑01)
//   • GET  /api/smart-devices                            → list all smart devices (with supported list)
//   • POST /api/smart-devices?name=<string>              → create new smart device
//   • POST /api/smart-devices/{smartId}/supported/{dumbId}
//                                                       → link an existing dumb device template
//   • GET  /api/dumb-devices                            → list all dumb-device templates
// ---------------------------------------------------

import React, { useEffect, useState } from 'react';
import '../App.css';

export default function AdminPanel() {
  const token = localStorage.getItem('accessToken');

  const [smart, setSmart] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [linkSelect, setLinkSelect] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const resSmart = await fetch('/api/smart-devices', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!resSmart.ok) throw new Error('Failed to load smart devices');
        const list = await resSmart.json();
        setSmart(list.map(s => ({ ...s, devices: s.supported ?? [] })));

        const resDumb = await fetch('/api/dumb-devices', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!resDumb.ok) throw new Error('Failed to load dumb-devices');
        setTemplates(await resDumb.json());
      } catch (e) {
        console.error(e);
        setError(e.message);
      }
    }

    loadData();
  }, [token]);

  const button = {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    borderRadius: '0.5rem',
    cursor: 'pointer'
  };

  const getAvailableFor = smartId => {
    const usedIds = new Set((smart.find(s => s.id === smartId)?.devices || []).map(d => d.id));
    return templates.filter(t => !usedIds.has(t.id));
  };

  const handleCreateSmart = async () => {
    const name = newName.trim();
    if (!name) return;
    try {
      const res = await fetch(`/api/smart-devices?name=${encodeURIComponent(name)}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Create failed');
      const created = await res.json();
      setSmart(prev => [...prev, { ...created, devices: [] }]);
      setShowForm(false);
      setNewName('');
    } catch (e) {
      setError(e.message);
    }
  };

  const handleLink = async smartId => {
    const dumbId = linkSelect[smartId];
    if (!dumbId) return;

    try {
      const resLink = await fetch(`/api/smart-devices/${smartId}/supported/${dumbId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!resLink.ok) throw new Error('Link failed');

      const tpl = templates.find(t => t.id === dumbId);
      setSmart(prev => prev.map(s => s.id === smartId ? {
        ...s,
        devices: [...(s.devices || []), { id: dumbId, name: tpl?.name || `#${dumbId}` }]
      } : s));
      setLinkSelect(prev => ({ ...prev, [smartId]: null }));
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="table" style={{ textAlign: 'left', width: '80vw', margin: '5vh auto' }}>
      <h1>Admin panel</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="devices-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {smart.map(s => (
          <div key={s.id} className="device-card" style={{ flex: '0 0 30%', padding: '1rem' }}>
            <h3 style={{ margin: '0 0 0.5rem' }}>{s.name}</h3>
            <p style={{ margin: '0 0 0.5rem' }}>Linked templates: {(s.devices || []).length}</p>

            {(s.devices || []).map(d => (
              <div key={d.id} style={{ fontSize: '0.9rem' }}>• {d.name}</div>
            ))}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.5rem', marginTop: '1rem' }}>
              <select
                value={linkSelect[s.id] ?? ''}
                onChange={e => setLinkSelect(prev => ({ ...prev, [s.id]: e.target.value ? parseInt(e.target.value, 10) : null }))}
              >
                <option value="" disabled>-- choose dumb device --</option>
                {getAvailableFor(s.id).map(t => (
                  <option key={t.id} value={String(t.id)}>{t.name}</option>
                ))}
              </select>
              <button style={button} onClick={() => handleLink(s.id)} disabled={!linkSelect[s.id]}>Link</button>
            </div>
          </div>
        ))}
      </div>

      <button style={{ ...button, width: '100%', marginTop: '2rem', fontSize: '1.25rem' }} onClick={() => setShowForm(true)}>
        + New smart device
      </button>

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowForm(false)}>
          <div style={{ background: '#444', padding: '1.5rem', borderRadius: '0.5rem', minWidth: 300 }} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: '1rem' }}>New smart device</h3>
            <input
              placeholder="Name"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', marginBottom: '1rem' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button style={button} onClick={() => setShowForm(false)}>Cancel</button>
              <button style={button} onClick={handleCreateSmart}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
