import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [expanded, setExpanded] = useState({});
  const [deviceSelection, setDeviceSelection] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  const roomTypes = [
    { value: 'BEDROOM', label: 'Bedroom' },
    { value: 'KITCHEN', label: 'Kitchen' },
    { value: 'DINING_ROOM', label: 'Dining Room' },
    { value: 'BATHROOM', label: 'Bathroom' },
    { value: 'LIVING_ROOM', label: 'Living Room' },
    { value: 'OFFICE', label: 'Office' }
  ];

  const deviceTemplates = [
    { id: 't1', name: 'LED Bulb', powerWatts: 10, usageHoursPerDay: 5 },
    { id: 't2', name: 'Smart Thermostat', powerWatts: 3, usageHoursPerDay: 24 },
    { id: 't3', name: 'Energy Saver Fan', powerWatts: 50, usageHoursPerDay: 8 },
    { id: 't4', name: 'Refrigerator', powerWatts: 150, usageHoursPerDay: 24 },
    { id: 't5', name: 'Television', powerWatts: 60, usageHoursPerDay: 4 },
    { id: 't6', name: 'Laptop', powerWatts: 50, usageHoursPerDay: 6 },
    { id: 't7', name: 'Air Conditioner', powerWatts: 1000, usageHoursPerDay: 8 },
    { id: 't8', name: 'Electric Kettle', powerWatts: 2000, usageHoursPerDay: 0.5 },
    { id: 't9', name: 'Gaming Console', powerWatts: 120, usageHoursPerDay: 3 },
    { id: 't10', name: 'Dishwasher', powerWatts: 1800, usageHoursPerDay: 1 }
  ];

  useEffect(() => {
    async function fetchRooms() {
      try {
        const res = await fetch('/api/users/me/rooms', { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.rooms || [];
        setRooms(list);
      } catch {
        setRooms([]);
      }
    }
    fetchRooms();
  }, [token]);

  const buttonStyle = { padding: '0.5rem 1rem', fontSize: '1rem', borderRadius: '0.5rem', cursor: 'pointer' };
  const smallButton = { padding: '0.25rem 0.5rem', fontSize: '0.875rem', borderRadius: '0.5rem', cursor: 'pointer' };

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
        const res = await fetch('/devices', {
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
    <div className="table" style={{ textAlign: 'left' }}>
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
          <div key={room.id} className="device-card" style={{ width: '30%', minWidth: '200px', textAlign: 'left', overflow: 'visible', padding: '1rem' }}>
            <h3 style={{ margin: '0 0 0.5rem' }}>{room.name}</h3>
            <p style={{ margin: '0 0 0.25rem' }}>Devices: {(room.devices || []).length}</p>
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
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 1fr) 4rem auto', gap: '0.5rem', alignItems: 'stretch', marginTop: '0.5rem' }}>
                  <select
                    value={deviceSelection[room.id]?.templateId || ''}
                    onChange={e => handleSelectionChange(room.id, 'templateId', e.target.value)}
                    style={{ minWidth: '8rem', padding: '0.5rem', borderRadius: '0.25rem' }}
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
                    style={{ width: '3rem', padding: '0.5rem', borderRadius: '0.25rem' }}
                  />
                  <button onClick={() => handleAddDevice(room.id)} style={{...buttonStyle, height: '66%', padding: '0.5rem', borderRadius:'0.25rem'}}>Add</button>
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
