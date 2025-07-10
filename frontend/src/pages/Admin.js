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

  // NEW: appointments state + modal flag -----------------------------------
  const [appointments, setAppointments] = useState([]);
  const [showAppointments, setShowAppointments] = useState(false);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  // ------------------------------------------------------------------------

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

  /**
   * Helpers & styles
   */
  const button = {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    borderRadius: '0.5rem',
    cursor: 'pointer'
  };

  const deleteButton = {
    ...button,
    background: '#b22',
    color: '#fff',
    fontSize: '0.8rem',
    padding: '0.25rem 0.5rem',
    lineHeight: 1
  };

  const modalBackdrop = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  };

  const modalCardAppointments = {
    background: '#444',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    minWidth: 800,
    maxHeight: '80vh',
    overflowY: 'auto'
  };
    const modalCard = {
    background: '#444',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    minWidth: 300,
    maxHeight: '80vh',
    overflowY: 'auto'
  };

  const getAvailableFor = smartId => {
    const usedIds = new Set((smart.find(s => s.id === smartId)?.devices || []).map(d => d.id));
    return templates.filter(t => !usedIds.has(t.id));
  };

  /**
   * API actions
   */
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

  const handleDeleteSmart = async smartId => {
    if (!window.confirm('Delete this smart device and all its linked templates?')) return;

    try {
      const res = await fetch(`/api/smart-devices/${smartId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Delete failed');

      setSmart(prev => prev.filter(s => s.id !== smartId));
    } catch (e) {
      setError(e.message);
    }
  };

  const handleUnlink = async (smartId, dumbId) => {
    if (!window.confirm('Unlink this template from the smart device?')) return;

    try {
      const res = await fetch(`/api/smart-devices/${smartId}/supported/${dumbId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Unlink failed');

      // remove the dumb-device from local state
      setSmart(prev =>
        prev.map(s =>
          s.id === smartId ? { ...s, devices: (s.devices || []).filter(d => d.id !== dumbId) } : s
        )
      );
    } catch (e) {
      setError(e.message);
    }
  };

  // NEW: fetch and show appointments ---------------------------------------
  const handleOpenAppointments = async () => {
    setShowAppointments(true);

    // Only fetch when first opening or if you want to refresh every time
    if (appointments.length === 0) {
      setLoadingAppointments(true);
      try {
        const res = await fetch('/api/admin/appointments/api/appointments', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to load appointments');
        const data = await res.json();
        setAppointments(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoadingAppointments(false);
      }
    }
  };
  // ------------------------------------------------------------------------

  return (
    <div className="table" style={{ textAlign: 'left', width: '80vw', margin: '5vh auto' }}>
      {/* Header with appointments button aligned right */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0 }}>Admin panel</h1>
        <button
          style={{ ...button, fontSize: '1.25rem' }}
          onClick={handleOpenAppointments}
        >
          View all appointments
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* SMART DEVICES ----------------------------------------------------- */}
      <div className="devices-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {smart.map(s => (
          <div key={s.id} className="device-card" style={{ position: 'relative', flex: '0 0 30%', padding: '1rem', border: '1px solid #666', borderRadius: '0.5rem' }}>
            {/* delete button */}
            <button style={{ ...deleteButton, position: 'absolute', top: '0.5rem', right: '0.5rem' }}
                    title="Delete smart device"
                    onClick={() => handleDeleteSmart(s.id)}>
              🗑
            </button>

            <h3 style={{ margin: '0 0 0.5rem' }}>{s.name}</h3>
            <p style={{ margin: '0 0 0.5rem' }}>Linked templates: {(s.devices || []).length}</p>

            {(s.devices || []).map(d => (
              <div
                key={d.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '0.9rem',
                  gap: '0.25rem'
                }}
              >
                • {d.name}
                <button
                  style={deleteButton}
                  title="Unlink template"
                  onClick={() => handleUnlink(s.id, d.id)}
                >
                  🗑
                </button>
              </div>
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

      {/* ADD NEW SMART DEVICE --------------------------------------------- */}
      <button style={{ ...button, width: '100%', marginTop: '2rem', fontSize: '1.25rem' }} onClick={() => setShowForm(true)}>
        + New smart device
      </button>

      {/* NEW SMART DEVICE MODAL ------------------------------------------ */}
      {showForm && (
        <div style={modalBackdrop} onClick={() => setShowForm(false)}>
          <div style={modalCard} onClick={e => e.stopPropagation()}>
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

      {/* APPOINTMENTS MODAL ---------------------------------------------- */}
      {showAppointments && (
        <div style={modalBackdrop} onClick={() => setShowAppointments(false)}>
          <div style={modalCardAppointments} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: '1rem' }}>Appointments</h3>
            {loadingAppointments ? (
              <p>Loading...</p>
            ) : appointments.length === 0 ? (
              <p>No appointments found.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', borderBottom: '1px solid #666', paddingBottom: '0.5rem' }}>Registration email</th>
                    <th style={{ textAlign: 'left', borderBottom: '1px solid #666', paddingBottom: '0.5rem' }}>Phone</th>
                    <th style={{ textAlign: 'left', borderBottom: '1px solid #666', paddingBottom: '0.5rem' }}>Appointment email</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(app => (
                    <tr key={app.id}>
                      <td style={{ padding: '0.25rem 0' }}>{app.user?.email || '—'}</td>
                      <td style={{ padding: '0.25rem 0' }}>{app.phone || '—'}</td>
                      <td style={{ padding: '0.25rem 0' }}>{app.email || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button style={button} onClick={() => setShowAppointments(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
