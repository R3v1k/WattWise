import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Appointment() {
  const [name, setName] = useState('');
  const [phone,setPhone] = useState('');
  const [time, setTime] = useState('');
  const navigate = useNavigate();

  const onSubmit = e => {
    e.preventDefault();
    // отправка формы...
    navigate('/thank-you');
  };

  return (
    <form className="table" onSubmit={onSubmit}>
      <label>Your name<input value={name} onChange={e => setName(e.target.value)}/></label>
      <label>Your phone number<input value={phone} onChange={e => setPhone(e.target.value)}/></label>
      <label>Preferable time to call<input value={time} onChange={e => setTime(e.target.value)}/></label>
      <button type="submit">Send</button>
    </form>
  );
}
