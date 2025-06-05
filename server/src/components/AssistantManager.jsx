import React, { useState, useContext, useEffect } from 'react';
import { AssistantContext } from '../contexts/AssistantContext';
import AvatarUploader from './AvatarUploader';

/**
 * Componente modal para Crear o Editar un asistente.
 * Props:
 *  - assistant: objeto { id, name, avatarUrl, systemPrompt } o null (para crear).
 *  - onClose: función para cerrar el modal.
 */
export default function AssistantManager({ assistant, onClose }) {
  const { createOrUpdateAssistant } = useContext(AssistantContext);

  const [name, setName] = useState(assistant ? assistant.name : '');
  const [avatarUrl, setAvatarUrl] = useState(assistant ? assistant.avatarUrl : '');
  const [systemPrompt, setSystemPrompt] = useState(assistant ? assistant.systemPrompt : '');
  const [error, setError] = useState('');

  useEffect(() => {
    // Resetear error cuando cambian los campos
    setError('');
  }, [name, systemPrompt]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !systemPrompt.trim()) {
      setError('Nombre y Prompt de sistema son obligatorios.');
      return;
    }
    await createOrUpdateAssistant({
      id: assistant ? assistant.id : undefined,
      name: name.trim(),
      avatarUrl,
      systemPrompt: systemPrompt.trim()
    });
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.3)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff',
          padding: '24px',
          borderRadius: '8px',
          width: '400px',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>{assistant ? 'Editar Asistente' : 'Nuevo Asistente'}</h3>
        {error && (
          <div style={{ color: 'red', marginBottom: '8px' }}>{error}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '12px' }}>
            <label>Nombre:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label>Avatar (opcional):</label>
            <AvatarUploader
              avatarUrl={avatarUrl}
              setAvatarUrl={setAvatarUrl}
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label>Prompt de Sistema:</label>
            <textarea
              rows="4"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                marginRight: '8px',
                background: '#ccc',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{
                background: '#007bff',
                border: 'none',
                color: '#fff',
                padding: '8px 12px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
