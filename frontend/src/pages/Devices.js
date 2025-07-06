import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserId } from '../hooks/useUserId';
import '../App.css';

export default function RoomsPage() {
  const navigate = useNavigate();
  const userId = useUserId();
  const token = localStorage.getItem('accessToken');

  const [rooms, setRooms] = useState([]);
  const [deviceTemplates, setDeviceTemplates] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [deviceSelection, setDeviceSelection] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const [pendingCount, setPendingCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  /* ------------------------------------------------------------------ */
  /*  Responsive helpers                                                */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /* ------------------------------------------------------------------ */
  /*  Initial data load                                                 */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    async function loadData() {
      try {
        /* 1. Забираем все уже подключённые dumb‑devices и комнаты     */
        const [attachedRes, roomsRes] = await Promise.all([
          fetch('/api/dumb-devices/attached', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`/api/rooms/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        if (!attachedRes.ok || !roomsRes.ok) throw new Error('Bad response');

        /* 2. Формируем «шаблоны» устройств из полученных dumb‑devices */
        const attachedDevices = await attachedRes.json();
        setDeviceTemplates(
          attachedDevices.map(d => ({
            id: d.id,
            name: d.name ?? 'Unnamed device',
            powerWatts: d.powerWatts ?? 0,
            usageHoursPerDay: d.timeUsedHours ?? d.timeOn ?? 1
          }))
        );

        /* 3. Комнаты                                                   */
        const roomsRaw = await roomsRes.json();

        /* 4. Для каждой комнаты тянем связанные девайсы                */
        const roomsWithDevices = await Promise.all(
          roomsRaw.map(async room => {
            try {
              const devRes = await fetch(`/api/devices/rooms/${room.id}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              const devices = devRes.ok ? await devRes.json() : [];
              return { ...room, devices };
            } catch {
              return { ...room, devices: [] };
            }
          })
        );

        /* 5. Сохраняем в state                                         */
        setRooms(roomsWithDevices);
      } catch (err) {
        console.error('Error loading data', err);
      }
    }

    if (userId) loadData();
  }, [token, userId]);

  /* ------------------------------------------------------------------ */
  /*  Static data                                                       */
  /* ------------------------------------------------------------------ */
  const roomTypes = [
    { value: 'BEDROOM', label: 'Bedroom' },
    { value: 'KITCHEN', label: 'Kitchen' },
    { value: 'DINING_ROOM', label: 'Dining Room' },
    { value: 'BATHROOM', label: 'Bathroom' },
    { value: 'LIVING_ROOM', label: 'Living Room' },
    { value: 'OFFICE', label: 'Office' }
  ];

  /* ------------------------------------------------------------------ */
  /*  Derived helpers                                                   */
  /* ------------------------------------------------------------------ */
  const hasUnaddedSelection = Object.values(deviceSelection).some(sel => sel?.templateId);

  /* ------------------------------------------------------------------ */
  /*  UI helpers                                                        */
  /* ------------------------------------------------------------------ */
  const buttonStyle = {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    textDecoration: 'none'
  };
  const smallButton = {
    padding: '0.25rem',
    fontSize: '1rem',
    lineHeight: '1.2',
    verticalAlign: 'baseline',
    cursor: 'pointer',
    textDecoration: 'none',
    borderRadius: '0.5rem',
    background: 'transparent',
    border: '1px solid #888',
    color: '#fff'
  };
  const counterSpan = {
    display: 'inline-block',
    minWidth: '1.5rem',
    textAlign: 'center',
    fontSize: '1rem',
    lineHeight: '1.2',
    verticalAlign: 'baseline'
  };
  const selectStyle = {
    minWidth: isMobile ? 'auto' : '6rem',
    width: isMobile ? '100%' : 'auto',
    padding: isMobile ? '0.5rem 1rem' : '0.5rem 0.75rem',
    fontSize: '1rem',
    borderRadius: '0.25rem'
  };

  /* ------------------------------------------------------------------ */
  /*  Handlers                                                          */
  /* ------------------------------------------------------------------ */
  const handleAddClick = () => setShowForm(true);
  const handleCancel = () => setShowForm(false);

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
      setRooms(prev => [...prev, { ...newRoom, devices: [] }]);
      setShowForm(false);
      setSelectedType('');
    } catch {
      alert('Failed to create room');
    }
  };

  const handleSelectionChange = (roomId, field, value) =>
    setDeviceSelection(prev => ({
      ...prev,
      [roomId]: { ...prev[roomId], [field]: value }
    }));

  const handleAddDevice = roomId => {
    const sel = deviceSelection[roomId] || {};
    const template = deviceTemplates.find(t => t.id == sel.templateId);
    const qty = sel.quantity ? Number(sel.quantity) : 1;
    if (!template || qty < 1) return;

    /* Оптимистично отображаем placeholder‑ы                            */
    setTotalCount(qty);
    setPendingCount(qty);
    setRooms(prev =>
      prev.map(r =>
        r.id === roomId
          ? {
              ...r,
              devices: [
                ...r.devices,
                ...Array(qty).fill({ template, pending: true })
              ]
            }
          : r
      )
    );
    setDeviceSelection(prev => ({ ...prev, [roomId]: {} }));

    /* Асинхронно цепляем существующий dumb‑device к комнате            */
    (async () => {
      for (let i = 0; i < qty; i++) {
        try {
          const resAttach = await fetch(
            `/api/devices?roomId=${roomId}&dumbDeviceId=${template.id}`,
            {
              method: 'POST',
              headers: { Authorization: `Bearer ${token}` }
            }
          );
          if (!resAttach.ok) throw new Error();
          const instance = await resAttach.json();

          /* Заменяем первый pending‑плейсхолдер на реальный инстанс    */
          setRooms(prev =>
            prev.map(r => {
              if (r.id !== roomId) return r;
              const idx = r.devices.findIndex(d => d.pending);
              const newDevices = [...r.devices];
              if (idx !== -1) newDevices[idx] = instance;
              return { ...r, devices: newDevices };
            })
          );
        } catch {
          console.error('Failed to attach device');
        } finally {
          setPendingCount(prev => prev - 1);
        }
      }
    })();
  };

  /* ------------------------------------------------------------------ */
  /*  NEW: Delete device handler                                        */
  /* ------------------------------------------------------------------ */
  const handleDeleteDevice = async (roomId, deviceId) => {
    if (!deviceId) return;
    const confirmed = window.confirm('Are you sure you want to delete this device?');
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/devices/${deviceId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed request');

      // remove device from local state
      setRooms(prev =>
        prev.map(r =>
          r.id === roomId ? { ...r, devices: r.devices.filter(d => d.id !== deviceId) } : r
        )
      );
    } catch (err) {
      console.error('Failed to delete device', err);
      alert('Failed to delete device');
    }
  };

  const handleEstimate = () => {
    if (pendingCount === 0 && !hasUnaddedSelection)
      navigate('/estimate', { state: { rooms, deviceTemplates } });
  };

  const progress =
    totalCount > 0
      ? Math.round(((totalCount - pendingCount) / totalCount) * 100)
      : 0;

  const buttonDisabled = pendingCount > 0 || hasUnaddedSelection;
  const buttonLabel = pendingCount > 0
    ? `Updating Server ${progress}%`
    : hasUnaddedSelection
      ? 'Please, add device first!'
      : 'Estimate';

  /* ------------------------------------------------------------------ */
  /*  Render                                                            */
  /* ------------------------------------------------------------------ */
  return (
    <div
      className="table"
      style={{
        textAlign: 'left',
        width: isMobile ? '95vw' : '80vw',
        margin: isMobile ? '5vh auto' : '10vh auto',
        minHeight: isMobile ? '80vh' : 'auto',
      }}
    >
      <h1>Your Rooms</h1>
      <button onClick={handleAddClick} style={buttonStyle}>
        + New Room
      </button>

      {/* ----------------------  NEW ROOM FORM ---------------------- */}
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
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.5rem'
              }}
            >
              <button onClick={handleCancel} style={smallButton}>
                ×
              </button>
              <button onClick={handleCreateRoom} style={buttonStyle}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------  ROOMS LIST  ------------------------- */}
      <div
        className="devices-list"
        style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
      >
        {rooms.map(room => (
          <div
            key={room.id}
            className="device-card"
            style={{ flex: isMobile ? '0 0 93%' : '0 0 30%', padding: '1rem' }}
          >
            <h3 style={{ margin: '0 0 0.5rem' }}>{room.name}</h3>
            <p
              style={{
                margin: '0 0 0.25rem',
                fontSize: isMobile ? '0.9rem' : '1rem'
              }}
            >
              Devices: {room.devices.length}
            </p>
            <div style={{ marginTop: '0.5rem' }}>
              {/* ---------------- SINGLE DEVICE LISTING WITH DELETE ---------- */}
              {room.devices.map((d, idx) => (
                <div
                  key={d.id || idx}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.25rem'
                  }}
                >
                  <span>
                    {d.template?.name || d.name || 'Device'}
                    {d.pending ? ' (adding...)' : ''}
                  </span>
                  {!d.pending && (
                    <button
                      onClick={() => handleDeleteDevice(room.id, d.id)}
                      style={smallButton}
                      disabled={pendingCount > 0}
                    >
                      🗑
                    </button>
                  )}
                </div>
              ))}

              {/* ---------------- ADD DEVICE CONTROLS ---------------------- */}
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
                <select
                  value={deviceSelection[room.id]?.templateId || ''}
                  onChange={e =>
                    handleSelectionChange(room.id, 'templateId', e.target.value)
                  }
                  style={selectStyle}
                >
                  <option value="">-- choose device --</option>
                  {deviceTemplates.map(dt => (
                    <option key={dt.id} value={dt.id}>
                      {dt.name}
                    </option>
                  ))}
                </select>
                <div
                  style={{ display: 'inline-flex', alignItems: 'baseline', gap: '0.25rem' }}
                >
                  <span style={{ fontWeight: 600, marginRight: '0.25rem' }}>
                    Amount:
                  </span>
                  <button
                    onClick={() =>
                      handleSelectionChange(
                        room.id,
                        'quantity',
                        (deviceSelection[room.id]?.quantity || 1) + 1
                      )
                    }
                    style={smallButton}
                  >
                    +
                  </button>
                  <span style={counterSpan}>{deviceSelection[room.id]?.quantity || 1}</span>
                  <button
                    onClick={() =>
                      handleSelectionChange(
                        room.id,
                        'quantity',
                        Math.max(1, (deviceSelection[room.id]?.quantity || 1) - 1)
                      )
                    }
                    style={smallButton}
                  >
                    -
                  </button>
                </div>
                <button
                  onClick={() => handleAddDevice(room.id)}
                  disabled={pendingCount > 0}
                  style={{
                    ...buttonStyle,
                    padding: isMobile ? '0.25rem' : '0.5rem',
                    borderRadius: '0.25rem',
                    opacity: pendingCount > 0 ? 0.6 : 1
                  }}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ----------------------  ESTIMATE  --------------------------- */}
      <button
        onClick={handleEstimate}
        disabled={buttonDisabled}
        style={{
          ...buttonStyle,
          width: isMobile ? '90%' : '40%',
          marginTop: '2rem',
          fontSize: '1rem',
          display: 'block',
          margin: '0 auto',
          opacity: buttonDisabled ? 0.6 : 1
        }}
      >
        {buttonLabel}
      </button>
    </div>
  );
}
