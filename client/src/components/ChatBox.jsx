import React, { useState } from 'react';
import axios from 'axios';

export default function ChatBox({ assistant }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    const userMsg = { role: 'user', content: input };
    const history = messages.filter(m => m.role !== 'system');
    const res = await axios.post('/api/generate', {
      assistantId: assistant.id,
      userMessage: input,
      history
    });
    const reply = res.data.reply;
    setMessages([...messages, userMsg, { role: 'assistant', content: reply }]);
    setInput('');
  };

  return (
    <div>
      <h2>Conversación con {assistant.name}</h2>
      <div style={{ whiteSpace: 'pre-wrap' }}>
        {messages.map((m, i) => (
          <div key={i}><b>{m.role}:</b> {m.content}</div>
        ))}
      </div>
      <textarea value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={sendMessage}>Enviar</button>
    </div>
  );
}
