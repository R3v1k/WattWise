// src/pages/AdminPanel.jsx  — 2025-06 backend-v2
// ---------------------------------------------------
// Endpoints the UI now uses
//   • GET  /api/smart-devices                  → list all smart devices **(со списком supported)**
//   • POST /api/smart-devices?name=<string>    → create new smart device
//   • POST /api/smart-devices/{smartId}/supported/{dumbId}
//                                              → link an existing dumb-device template
//   • POST /api/dumb-devices                   → create dumb-device template
//   • GET  /api/usage-stats                    → catalog of possible dumb devices
//
//  Flow when user presses «Link»:
//      1. Find template from usage-stats by id (ui selection)
//      2. POST /dumb-devices  → returns { id }
//      3. POST /smart-devices/{smartId}/supported/{id}
//      4. Refresh smart-device entry in local state
// ---------------------------------------------------

import React, { useEffect, useState } from 'react';
import '../App.css';

export default function AdminPanel() {
  const token = localStorage.getItem('accessToken');

  /* ───────────────────────────── state ───────────────────────────── */
  const [smart, setSmart]                 = useState([]); // [{id,name,devices:[{id,name}]}]
  const [templates, setTemplates]         = useState([]); // usage-stats rows
  const [linkSelect, setLinkSelect]       = useState({}); // smartId -> templateId
  const [showForm,  setShowForm]          = useState(false);
  const [newName,   setNewName]           = useState('');
  const [error,     setError]             = useState('');

  /* ─────────────────────────── fetch data ────────────────────────── */
  useEffect(() => {
    async function loadData() {
      try {
        /* 1️⃣ все умные устройства сразу приходят со своим supported-списком */
        const resSmart = await fetch('/api/smart-devices', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!resSmart.ok) throw new Error('Failed to load smart devices');
        const list = await resSmart.json(); // [{id,name,supported:[{id,name}]}]

        // нормализуем поле supported → devices для старого кода
        setSmart(
          list.map(s => ({ ...s, devices: s.supported ?? [] }))
        );

        /* 2️⃣ шаблоны (usage-stats) */
        const resStats = await fetch('/api/usage-stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!resStats.ok) throw new Error('load stats');
        const stats = await resStats.json();
        setTemplates(
          stats.map((s, idx) => ({
            id: idx + 1,                         // UI-only id
            name: s.deviceName,
            powerWatts: s.powerWatts ?? 0,
            defaultHours: s.avgDumbHoursPerDay ?? 1
          }))
        );
      } catch (e) {
        console.error(e);
        setError(e.message);
      }
    }

    loadData();
  }, [token]);

  /* ─────────────────────────── helpers ───────────────────────────── */
  const button = {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    borderRadius: '0.5rem',
    cursor: 'pointer'
  };

  const getAvailableFor = smartId => {
    const usedNames = new Set((smart.find(s => s.id === smartId)?.devices || []).map(d => d.name));
    return templates.filter(t => !usedNames.has(t.name));
  };

  /* ─────────────────────── create smart device ───────────────────── */
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

  /* ───────────────────────── link dumb to smart ──────────────────── */
  const handleLink = async smartId => {
    const tplId = linkSelect[smartId];
    const tpl   = templates.find(t => t.id === tplId);
    if (!tpl) return;

    try {
      // 1. create dumb template if not existing (we always create new)
      const resDumb = await fetch('/api/dumb-devices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: tpl.name,
          powerWatts: tpl.powerWatts,
          timeOn: tpl.defaultHours,
          timeUsedHours: tpl.defaultHours
        })
      });
      if (!resDumb.ok) throw new Error('Dumb create failed');
      const dumb = await resDumb.json(); // {id, name,…}

      // 2. link to smart
      const resLink = await fetch(`/api/smart-devices/${smartId}/supported/${dumb.id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!resLink.ok) throw new Error('Link failed');

      // 3. update local state
      setSmart(prev => prev.map(s => s.id === smartId ? {
        ...s,
        devices: [...(s.devices || []), { id: dumb.id, name: dumb.name }]
      } : s));
      setLinkSelect(prev => ({ ...prev, [smartId]: '' }));
    } catch (e) {
      setError(e.message);
    }
  };

  /* ───────────────────────────── render ──────────────────────────── */
  return (
    <div className="table" style={{ textAlign: 'left', width: '80vw', margin: '5vh auto' }}>
      <h1>Admin panel</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* smart cards */}
      <div className="devices-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {smart.map(s => (
          <div key={s.id} className="device-card" style={{ flex: '0 0 30%', padding: '1rem' }}>
            <h3 style={{ margin: '0 0 0.5rem' }}>{s.name}</h3>
            <p style={{ margin: '0 0 0.5rem' }}>Linked templates: {(s.devices || []).length}</p>

            {(s.devices || []).map(d => (
              <div key={d.id} style={{ fontSize: '0.9rem' }}>• {d.name}</div>
            ))}

            {/* link selector */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.5rem', marginTop: '1rem' }}>
              <select
                value={linkSelect[s.id] || ''}
                onChange={e => setLinkSelect(prev => ({ ...prev, [s.id]: Number(e.target.value) }))}
              >
                <option value="">-- choose dumb device --</option>
                {getAvailableFor(s.id).map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              <button style={button} onClick={() => handleLink(s.id)} disabled={!linkSelect[s.id]}>Link</button>
            </div>
          </div>
        ))}
      </div>

      {/* + new smart button */}
      <button style={{ ...button, width: '100%', marginTop: '2rem', fontSize: '1.25rem' }} onClick={() => setShowForm(true)}>
        + New smart device
      </button>

      {/* modal */}
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
