import React, { useContext, useState } from 'react';
import { AssistantContext } from '../contexts/AssistantContext';
import AssistantManager from './AssistantManager';

/**
 * Sidebar muestra:
 * - Botón para “Crear Asistente”
 * - Lista de asistentes (click para seleccionar)
 * - Para cada asistente: Editar (abre AssistantManager), Eliminar.
 */
export default function Sidebar() {
  const {
    assistants,
    selectedAssistant,
    setSelectedAssistant,
    removeAssistant
  } = useContext(AssistantContext);

  const [showManager, setShowManager] = useState(false);
  const [assistantToEdit, setAssistantToEdit] = useState(null);

  function handleEdit(assistant) {
    setAssistantToEdit(assistant);
    setShowManager(true);
  }

  function handleNew() {
    setAssistantToEdit(null);
    setShowManager(true);
  }

  return (
    <div className="sidebar">
      <div style={{ padding: '16px', borderBottom: '1px solid #ddd' }}>
        <button
          style={{
            width: '100%',
            padding: '8px',
            background: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          onClick={handleNew}
        >
          + Nuevo Asistente
        </button>
      </div>
      <div>
        {assistants.map((assistant) => (
          <div
            key={assistant.id}
            style={{
              padding: '12px 16px',
              background:
                selectedAssistant && selectedAssistant.id === assistant.id
                  ? '#e0f0ff'
                  : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              borderBottom: '1px solid #eee'
            }}
            onClick={() => setSelectedAssistant(assistant)}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={assistant.avatarUrl || 'https://via.placeholder.com/32'}
                alt="avatar"
                style={{ width: '32px', height: '32px', borderRadius: '50%', marginRight: '8px' }}
              />
              <span>{assistant.name}</span>
            </div>
            <div>
              <button
                style={{
                  marginRight: '6px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(assistant);
                }}
                title="Editar"
              >
                ✏️
              </button>
              <button
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  removeAssistant(assistant.id);
                }}
                title="Eliminar"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {showManager && (
        <AssistantManager
          assistant={assistantToEdit}
          onClose={() => setShowManager(false)}
        />
      )}
    </div>
  );
}
