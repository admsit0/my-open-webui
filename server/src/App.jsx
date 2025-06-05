import React, { useContext, useState, useEffect } from 'react';
import { AssistantContext } from './contexts/AssistantContext';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import MemoryManager from './components/MemoryManager';
import ContextUploader from './components/ContextUploader';
import './styles/global.css';

export default function App() {
  const { selectedAssistant, loading } = useContext(AssistantContext);
  const [activeTab, setActiveTab] = useState('chat');
  // activeTab: 'chat', 'memory', 'rag'

  if (loading) {
    return <div style={{ padding: '20px' }}>Cargando asistentes...</div>;
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        {!selectedAssistant ? (
          <div style={{ padding: '20px' }}>
            No tienes ningún asistente creado. Por favor, crea uno en la barra lateral.
          </div>
        ) : (
          <>
            <div className="chat-header">
              <img
                src={selectedAssistant.avatarUrl || 'https://via.placeholder.com/40'}
                alt="avatar"
              />
              <h2>{selectedAssistant.name}</h2>
            </div>

            {/* Menú de pestañas: Chat / Memoria / RAG */}
            <div className="subsection" style={{ display: 'flex' }}>
              <button
                style={{
                  marginRight: '12px',
                  background: activeTab === 'chat' ? '#007bff' : '#f0f0f0',
                  color: activeTab === 'chat' ? '#fff' : '#333',
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                onClick={() => setActiveTab('chat')}
              >
                Chat
              </button>
              <button
                style={{
                  marginRight: '12px',
                  background: activeTab === 'memory' ? '#007bff' : '#f0f0f0',
                  color: activeTab === 'memory' ? '#fff' : '#333',
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                onClick={() => setActiveTab('memory')}
              >
                Memoria
              </button>
              <button
                style={{
                  background: activeTab === 'rag' ? '#007bff' : '#f0f0f0',
                  color: activeTab === 'rag' ? '#fff' : '#333',
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                onClick={() => setActiveTab('rag')}
              >
                Contexto RAG
              </button>
            </div>

            {/* Contenido según pestaña */}
            {activeTab === 'chat' && <ChatWindow />}
            {activeTab === 'memory' && <MemoryManager />}
            {activeTab === 'rag' && <ContextUploader />}
          </>
        )}
      </div>
    </div>
  );
}
