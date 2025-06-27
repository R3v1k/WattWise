import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

export default function RoomsPage() {
  const [rooms, setRooms]         = useState([]);
  const [deviceTemplates, setDeviceTemplates] = useState([]);  
  const [showForm, setShowForm]   = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [expanded, setExpanded]   = useState({});
  const [deviceSelection, setDeviceSelection] = useState({});
  const navigate = useNavigate();
  const token    = localStorage.getItem('accessToken');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    async function loadTemplates() {
      try {
        const res = await fetch('/api/usage-stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error();
        const stats = await res.json(); 
        setDeviceTemplates(
          stats.map((s, idx) => ({
            id: `stat-${idx}`,
            name: s.deviceName,
            powerWatts: s.powerWatts ?? 0,
            usageHoursPerDay: s.avgDumbHoursPerDay ?? 1
          }))
        );
      } catch {
        setDeviceTemplates([]);  
      }
    }
    loadTemplates();
  }, [token]);
    const roomTypes = [
    { value: 'BEDROOM', label: 'Bedroom' },
    { value: 'KITCHEN', label: 'Kitchen' },
    { value: 'DINING_ROOM', label: 'Dining Room' },
    { value: 'BATHROOM', label: 'Bathroom' },
    { value: 'LIVING_ROOM', label: 'Living Room' },
    { value: 'OFFICE', label: 'Office' }
  ];
  const buttonStyle = { padding: '0.5rem 1rem', fontSize: '1rem', borderRadius: '0.5rem', cursor: 'pointer' };
  const smallButton = { padding: '0.25rem 0.5rem', fontSize: '0.875rem', borderRadius: '0.5rem', cursor: 'pointer' };
  const selectStyle = {
    minWidth: isMobile ? 'auto' : '6rem',
    width: isMobile ? '100%' : 'auto',
    padding: isMobile ? '0.5rem 1rem' : '0.5rem 0.75rem',
    fontSize: isMobile ? '1rem' : '1rem',
    borderRadius: '0.25rem',
  };
  const handleAddClick = () => setShowForm(true);
  const handleCancel = () => { setShowForm(false); setSelectedType(''); };

  const handleCreate = async () => {
    if (!selectedType) return;
    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ type: selectedType })
      });
      const newRoom = await res.json();
      setRooms(prev => [...prev, newRoom]);
      setShowForm(false);
      setSelectedType('');
    } catch {
      alert('Failed to create room');
    }
  };

  const toggleExpand = id => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const handleSelectionChange = (roomId, field, value) => {
    setDeviceSelection(prev => ({
      ...prev,
      [roomId]: { ...prev[roomId], [field]: value }
    }));
  };

  const handleAddDevice = async roomId => {
    const sel = deviceSelection[roomId] || {};
    const template = deviceTemplates.find(t => t.id === sel.templateId);
    const qty = Number(sel.quantity);
    if (!template || qty < 1) return;
    try {
      const added = [];
      for (let i = 0; i < qty; i++) {
        const res = await fetch('/api/devices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            name: template.name,
            powerWatts: template.powerWatts,
            usageHoursPerDay: template.usageHoursPerDay,
            roomId
          })
        });
        if (res.ok) {
          const dev = await res.json();
          added.push(dev);
        }
      }
      setRooms(prev => prev.map(r => r.id === roomId ? { ...r, devices: [...(r.devices || []), ...added] } : r));
      setDeviceSelection(prev => ({ ...prev, [roomId]: {} }));
    } catch {
      alert('Failed to add device');
    }
  };

  const handleEstimate = () => navigate('/estimate', { state: { rooms, deviceTemplates } });

  return (
    <div className="table" style={{
      textAlign: 'left',
      width: isMobile ? '95vw' : '80vw',
      marginTop: isMobile ? '5vh' : '10vh',
      marginBottom: isMobile ? '5vh' : '10vh',
      marginLeft: 'auto',
      marginRight: 'auto',
    }}>
      <h1>Your Rooms</h1>
      <button onClick={handleAddClick} style={buttonStyle}>+ New Room</button>

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={handleCancel}>
          <div style={{ background: '#444', padding: '1.5rem', borderRadius: '0.5rem', minWidth: '300px' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: '#fff', marginBottom: '1rem' }}>New Room</h3>
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', fontSize: '1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}
            >
              <option value="">-- select type --</option>
              {roomTypes.map(rt => <option key={rt.value} value={rt.value}>{rt.label}</option>)}
            </select>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button onClick={handleCancel} style={smallButton}>Cancel</button>
              <button onClick={handleCreate} style={buttonStyle}>Create</button>
            </div>
          </div>
        </div>
      )}

      <div className="devices-list" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {rooms.map(room => (
          <div key={room.id} className="device-card"             
              style={{
              flex: isMobile ? '0 0 93%' : '0 0 30%',
              textAlign: 'left',
              overflow: 'visible',
              padding: '1rem',
            }}>
            <h3 style={{ margin: '0 0 0.5rem' }}>{room.name}</h3>
            <p style={{
              margin: '0 0 0.25rem',
              fontSize: isMobile ? '0.9rem' : '1rem',
            }}>Devices: {(room.devices || []).length}</p>
            <button onClick={() => toggleExpand(room.id)} style={smallButton}>{expanded[room.id] ? 'Hide' : 'Show'}</button>
            {expanded[room.id] && (
              <div style={{ marginTop: '0.5rem' }}>
                {/* grouped device counts */}
                {(() => {
                  const counts = {};
                  (room.devices || []).forEach(d => { counts[d.name] = (counts[d.name] || 0) + 1; });
                  return Object.entries(counts).map(([name, count]) => (
                    <div key={name} style={{ marginBottom: '0.25rem' }}>
                      {name}{count > 1 ? ` x${count}` : ''}
                    </div>
                  ));
                })()}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile
                    ? 'minmax(120px, 1fr) 3rem auto'
                    : 'minmax(120px, 1fr) 3rem auto',
                  gap: isMobile ? '0.25rem' : '0.5rem',
                  alignItems: 'baseline',
                  marginTop: isMobile ? '0.25rem' : '0.5rem',
                }}>
                  <select
                    value={deviceSelection[room.id]?.templateId || ''}
                    onChange={e => handleSelectionChange(room.id, 'templateId', e.target.value)}
                    style={selectStyle}
                  >
                    <option value="">-- choose device --</option>
                    {deviceTemplates.map(dt => <option key={dt.id} value={dt.id}>{dt.name}</option>)}
                  </select>
                  <input
                    type="number"
                    min={1}
                    placeholder="Qty"
                    value={deviceSelection[room.id]?.quantity || ''}
                    onChange={e => handleSelectionChange(room.id, 'quantity', e.target.value)}
                    style={{
                      width: isMobile ? '3rem' : '2.5rem',
                      padding: isMobile ? '0.5rem' : '0.5rem',
                      borderRadius: '0.25rem',
                    }}
                  />
                  <button onClick={() => handleAddDevice(room.id)}                     
                      style={{
                      ...buttonStyle,
                      padding: isMobile ? '0.25rem' : '0.5rem',
                      borderRadius: '0.25rem',
                    }}>Add</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <button onClick={handleEstimate} style={{ ...buttonStyle, width: '100%', marginTop: '2rem', fontSize: '1.25rem' }}>Estimate</button>
    </div>
  );
}
