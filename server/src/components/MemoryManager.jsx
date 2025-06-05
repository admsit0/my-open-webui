import React, { useContext, useState, useEffect } from 'react';
import { AssistantContext } from '../contexts/AssistantContext';
import { saveMemory, loadMemory } from '../utils/storage';

/**
 * Componente que muestra un textarea donde el usuario puede escribir “notas” o “memorias”
 * que se incluirán en cada conversación con el asistente.
 *
 * Se guarda en localStorage bajo la clave "memory_<assistantId>".
 */
export default function MemoryManager() {
  const { selectedAssistant } = useContext(AssistantContext);
  const [memory, setMemory] = useState('');

  useEffect(() => {
    if (selectedAssistant) {
      const m = loadMemory(selectedAssistant.id);
      setMemory(m);
    }
  }, [selectedAssistant]);

  const handleSave = () => {
    saveMemory(selectedAssistant.id, memory);
    alert('Memoria guardada.');
  };

  return (
    <div style={{ padding: '16px', overflowY: 'auto', flex: 1 }}>
      <h3>Memoria de {selectedAssistant.name}</h3>
      <textarea
        className="memory-textarea"
        value={memory}
        onChange={(e) => setMemory(e.target.value)}
        placeholder="Aquí puedes escribir notas persistentes para este asistente..."
      />
      <div style={{ marginTop: '12px' }}>
        <button
          onClick={handleSave}
          style={{
            background: '#28a745',
            border: 'none',
            color: '#fff',
            padding: '8px 14px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Guardar Memoria
        </button>
      </div>
    </div>
  );
}
