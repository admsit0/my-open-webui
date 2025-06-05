import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AssistantSelector({ onSelect }) {
  const [assistants, setAssistants] = useState([]);
  const [form, setForm] = useState({ name: '', avatarUrl: '', systemPrompt: '' });

  useEffect(() => {
    axios.get('/api/assistants').then(res => setAssistants(res.data));
  }, []);

  const handleSubmit = async () => {
    const res = await axios.post('/api/assistants', form);
    setAssistants(prev => [...prev, res.data]);
    onSelect(res.data);
  };

  return (
    <div>
      <h2>Asistentes</h2>
      {assistants.map(a => (
        <button key={a.id} onClick={() => onSelect(a)}>{a.name}</button>
      ))}
      <h3>Crear nuevo</h3>
      <input placeholder="Nombre" onChange={e => setForm({...form, name: e.target.value})} />
      <input placeholder="Avatar URL (base64)" onChange={e => setForm({...form, avatarUrl: e.target.value})} />
      <textarea placeholder="Prompt" onChange={e => setForm({...form, systemPrompt: e.target.value})} />
      <button onClick={handleSubmit}>Crear</button>
    </div>
  );
}
