import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

/**
 * ROOMS & DEVICES PAGE (updated for new backend API 2025-06)
 * ---------------------------------------------------------
 * ✔  GET    /api/usage-stats      → list of *device statistics templates*
 * ✔  POST   /api/dumb-devices     → create a new _dumb_ device template
 * ✔  POST   /api/devices?roomId=RID&dumbDeviceId=DID  → attach template to a room
 *
 *  The flow for “Add device” is now:
 *    1. Create the dumb-device template (if qty > 1 => create that many)
 *    2. Immediately attach each to the chosen room.
 *
 *  NOTE: the old endpoint that accepted a full JSON body on /api/devices
 *  no longer exists, so avoid sending a request body there.
 */

export default function RoomsPage() {
  const navigate = useNavigate();
  const token    = localStorage.getItem('accessToken');

  // ──────────────────────────── state ────────────────────────────
  const [rooms, setRooms]                     = useState([]);
  const [deviceTemplates, setDeviceTemplates] = useState([]);  // from usage-stats
  const [showForm, setShowForm]               = useState(false);
  const [selectedType, setSelectedType]       = useState('');
  const [expanded, setExpanded]               = useState({});
  const [deviceSelection, setDeviceSelection] = useState({});  // per-room UI selections
  const [isMobile, setIsMobile]               = useState(window.innerWidth <= 600);

  // ───── responsive helper ─────
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ───── fetch device statistics templates ─────
  useEffect(() => {
    async function loadTemplates() {
      try {
        const res = await fetch('/api/usage-stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch /usage-stats');
        const stats = await res.json();

        /*
         * Backend returns something like:
         *   [{ deviceName, powerWatts, avgDumbHoursPerDay, avgSmartHoursPerDay }]
         */
        const mapped = stats.map((s, idx) => ({
          id: s.id ?? `stat-${idx}`,
          name: s.deviceName ?? s.name ?? 'Unnamed device',
          powerWatts: s.powerWatts ?? 0,
          usageHoursPerDay: s.avgDumbHoursPerDay ?? 1
        }));
        setDeviceTemplates(mapped);
      } catch (err) {
        console.error(err);
        setDeviceTemplates([]);
      }
    }
    loadTemplates();
  }, [token]);

  // ──────────────────────────── UI helpers ────────────────────────────
  const roomTypes = [
    { value: 'BEDROOM',     label: 'Bedroom' },
    { value: 'KITCHEN',     label: 'Kitchen' },
    { value: 'DINING_ROOM', label: 'Dining Room' },
    { value: 'BATHROOM',    label: 'Bathroom' },
    { value: 'LIVING_ROOM', label: 'Living Room' },
    { value: 'OFFICE',      label: 'Office' }
  ];
  const buttonStyle = {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    borderRadius: '0.5rem',
    cursor: 'pointer'
  };
  const smallButton = {
    padding: '0.25rem 0.5rem',
    fontSize: '0.875rem',
    borderRadius: '0.5rem',
    cursor: 'pointer'
  };
  const selectStyle = {
    minWidth: isMobile ? 'auto' : '6rem',
    width: isMobile ? '100%' : 'auto',
    padding: isMobile ? '0.5rem 1rem' : '0.5rem 0.75rem',
    fontSize: '1rem',
    borderRadius: '0.25rem'
  };

  // ──────────────────────────── room creation ────────────────────────────
  const handleAddClick = () => setShowForm(true);
  const handleCancel   = () => { setShowForm(false); setSelectedType(''); };

  const handleCreateRoom = async () => {
    if (!selectedType) return;
    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ type: selectedType })
      });
      if (!res.ok) throw new Error();
      const newRoom = await res.json();
      setRooms(prev => [...prev, newRoom]);
      setShowForm(false);
      setSelectedType('');
    } catch {
      alert('Failed to create room');
    }
  };

  // ──────────────────────────── expand / collapse ────────────────────────────
  const toggleExpand = id => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  // ──────────────────────────── device selection state helper ────────────────────────────
  const handleSelectionChange = (roomId, field, value) => {
    setDeviceSelection(prev => ({
      ...prev,
      [roomId]: { ...prev[roomId], [field]: value }
    }));
  };

  // ──────────────────────────── ADD DEVICE (new API) ────────────────────────────
  const handleAddDevice = async roomId => {
    const sel = deviceSelection[roomId] || {};
    const template = deviceTemplates.find(t => t.id === sel.templateId);
    const qty = sel.quantity ? Number(sel.quantity) : 1; // default 1
    if (!template || qty < 1) return;

    try {
      const added = [];
      for (let i = 0; i < qty; i++) {
        /**
         * 1️⃣  Create dumb-device template
         */
        const resTemplate = await fetch('/api/dumb-devices', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            name: template.name,
            powerWatts: template.powerWatts,
            timeOn: template.usageHoursPerDay,
            timeUsedHours: template.usageHoursPerDay
          })
        });
        if (!resTemplate.ok) throw new Error('Failed to create dumb device');
        const newTemplate = await resTemplate.json();

        /**
         * 2️⃣  Attach it to the room (no request body required)
         */
        const resAttach = await fetch(`/api/devices?roomId=${roomId}&dumbDeviceId=${newTemplate.id}`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!resAttach.ok) throw new Error('Failed to attach device to room');
        const deviceInstance = await resAttach.json();
        added.push(deviceInstance);
      }

      // merge into local state
      setRooms(prev => prev.map(r => r.id === roomId ? {
        ...r,
        devices: [...(r.devices || []), ...added]
      } : r));

      // reset per-room selection UI
      setDeviceSelection(prev => ({ ...prev, [roomId]: {} }));
    } catch (err) {
      console.error(err);
      alert('Failed to add device');
    }
  };

  // ──────────────────────────── navigate to estimate ────────────────────────────
  const handleEstimate = () => navigate('/estimate', { state: { rooms, deviceTemplates } });

  // ──────────────────────────── render ────────────────────────────
  return (
    <div
      className="table"
      style={{
        textAlign: 'left',
        width: isMobile ? '95vw' : '80vw',
        marginTop: isMobile ? '5vh' : '10vh',
        marginBottom: isMobile ? '5vh' : '10vh',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}
    >
      <h1>Your Rooms</h1>
      <button onClick={handleAddClick} style={buttonStyle}>+ New Room</button>

      {/* ───── Create-Room Modal ───── */}
      {showForm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={handleCancel}
        >
          <div
            style={{
              background: '#444',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              minWidth: '300px'
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ color: '#fff', marginBottom: '1rem' }}>New Room</h3>
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                fontSize: '1rem',
                borderRadius: '0.5rem',
                marginBottom: '1rem'
              }}
            >
              <option value="">-- select type --</option>
              {roomTypes.map(rt => (
                <option key={rt.value} value={rt.value}>
                  {rt.label}
                </option>
              ))}
            </select>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button onClick={handleCancel} style={smallButton}>Cancel</button>
              <button onClick={handleCreateRoom} style={buttonStyle}>Create</button>
            </div>
          </div>
        </div>
      )}

      {/* ───── Rooms list ───── */}
      <div
        className="devices-list"
        style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
      >
        {rooms.map(room => (
          <div
            key={room.id}
            className="device-card"
            style={{
              flex: isMobile ? '0 0 93%' : '0 0 30%',
              textAlign: 'left',
              overflow: 'visible',
              padding: '1rem'
            }}
          >
            <h3 style={{ margin: '0 0 0.5rem' }}>{room.name}</h3>
            <p
              style={{
                margin: '0 0 0.25rem',
                fontSize: isMobile ? '0.9rem' : '1rem'
              }}
            >
              Devices: {(room.devices || []).length}
            </p>
            <button onClick={() => toggleExpand(room.id)} style={smallButton}>
              {expanded[room.id] ? 'Hide' : 'Show'}
            </button>
            {expanded[room.id] && (
              <div style={{ marginTop: '0.5rem' }}>
                {/* grouped device counts */}
                {(() => {
                  const counts = {};
                  (room.devices || []).forEach(d => {
                    const key = d.template?.name ?? d.name ?? 'Device';
                    counts[key] = (counts[key] || 0) + 1;
                  });
                  return Object.entries(counts).map(([name, count]) => (
                    <div key={name} style={{ marginBottom: '0.25rem' }}>
                      {name}
                      {count > 1 ? ` x${count}` : ''}
                    </div>
                  ));
                })()}

                {/* add-device controls */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile
                      ? 'minmax(120px, 1fr) auto auto'
                      : 'minmax(120px, 1fr) auto auto',
                    gap: isMobile ? '0.25rem' : '0.5rem',
                    alignItems: 'center',
                    marginTop: isMobile ? '0.25rem' : '0.5rem'
                  }}
                >
                  {/* device selector */}
                  <select
                    value={deviceSelection[room.id]?.templateId || ''}
                    onChange={e => handleSelectionChange(room.id, 'templateId', e.target.value)}
                    style={selectStyle}
                  >
                    <option value="">-- choose device --</option>
                    {deviceTemplates.map(dt => (
                      <option key={dt.id} value={dt.id}>
                        {dt.name}
                      </option>
                    ))}
                  </select>

                  {/* quantity stepper */}
                  {(() => {
                    const qty = deviceSelection[room.id]?.quantity ?? 1;
                    return (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span style={{ fontWeight: 600 }}>Amount: </span>
                        <button
                          onClick={() => handleSelectionChange(room.id, 'quantity', Math.max(1, qty + 1))}
                          style={{ ...smallButton, padding: isMobile ? '0.25rem' : '0.25rem' }}
                        >
                          +
                        </button>
                        <span style={{ minWidth: '1.5rem', textAlign: 'center' }}>{qty}</span>
                        <button
                          onClick={() => handleSelectionChange(room.id, 'quantity', Math.max(1, qty - 1))}
                          style={{ ...smallButton, padding: isMobile ? '0.25rem' : '0.25rem' }}
                        >
                          -
                        </button>
                      </div>
                    );
                  })()}

                  {/* add button */}
                  <button
                    onClick={() => handleAddDevice(room.id)}
                    style={{
                      ...buttonStyle,
                      padding: isMobile ? '0.25rem' : '0.5rem',
                      borderRadius: '0.25rem'
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ───── Estimate button ───── */}
      <button
        onClick={handleEstimate}
        style={{
          ...buttonStyle,
          width: '100%',
          marginTop: '2rem',
          fontSize: '1.25rem'
        }}
      >
        Estimate
      </button>
    </div>
  );
}
