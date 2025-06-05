import React, { useContext, useState, useEffect, useRef } from 'react';
import { AssistantContext } from '../contexts/AssistantContext';
import { loadChatHistory, saveChatHistory, loadMemory } from '../utils/storage';
import { generateReply } from '../api/ollama';
import ChatInput from './ChatInput';

/**
 * Ventana de chat principal:
 * - Muestra mensajes históricos (user/assistant).
 * - Permite enviar un nuevo mensaje.
 * - Al enviar, guarda en localStorage y hace la llamada a /api/generate.
 */

export default function ChatWindow() {
  const { selectedAssistant } = useContext(AssistantContext);
  const [history, setHistory] = useState([]); // { role: 'user'|'assistant', content }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef();

  // Carga inicial de historial desde localStorage
  useEffect(() => {
    if (selectedAssistant) {
      const h = loadChatHistory(selectedAssistant.id);
      setHistory(h);
    }
  }, [selectedAssistant]);

  // Scroll automático hacia abajo
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  const handleSend = async (messageText) => {
    if (!messageText.trim()) return;
    setError('');
    const newHistory = [
      ...history,
      { role: 'user', content: messageText.trim() }
    ];
    setHistory(newHistory);
    saveChatHistory(selectedAssistant.id, newHistory);
    setLoading(true);

    try {
      // Obtener texto de memoria y pasarlo como parte del “history” o parámetro adicional
      const memoryText = loadMemory(selectedAssistant.id);
      let combinedHistory = newHistory;
      if (memoryText && memoryText.trim()) {
        // Inyectamos un mensaje de sistema con la memoria (opcional)
        combinedHistory = [
          { role: 'assistant', content: `Memoria persistente: ${memoryText}` },
          ...newHistory
        ];
      }

      const response = await generateReply({
        assistantId: selectedAssistant.id,
        history: combinedHistory,
        userMessage: messageText.trim()
      });

      const assistantReply = response.reply || '';
      const updatedHistory = [
        ...newHistory,
        { role: 'assistant', content: assistantReply }
      ];
      setHistory(updatedHistory);
      saveChatHistory(selectedAssistant.id, updatedHistory);
    } catch (e) {
      console.error(e);
      setError('Error al comunicarse con el asistente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="chat-window">
        {history.map((msg, idx) => (
          <div
            key={idx}
            className={`message ${msg.role}`}
            style={{
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <div className="bubble">{msg.content}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      {error && (
        <div style={{ color: 'red', padding: '8px' }}>{error}</div>
      )}
      <ChatInput onSend={handleSend} disabled={loading} />
    </div>
  );
}
