import React, { useState } from 'react';
import { uploadContextFile, fetchContext } from '../api/ollama';

/**
 * Componente para:
 * 1) Subir un archivo de texto que se usará como “contexto” RAG.
 * 2) Ver el texto concatenado actual de todos los archivos RAG.
 *
 * Cuando actualiza, cada vez que se genera un prompt, el backend lo concatenará en systemPrompt.
 */
export default function ContextUploader() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [ragText, setRagText] = useState('');

  // Carga inicial del contexto RAG
  React.useEffect(() => {
    loadContext();
  }, []);

  const loadContext = async () => {
    try {
      const text = await fetchContext();
      setRagText(text);
    } catch (err) {
      console.error('Error al cargar contexto RAG:', err);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      await uploadContextFile(file);
      setFile(null);
      await loadContext();
      alert('Archivo de contexto subido con éxito.');
    } catch (err) {
      console.error(err);
      alert('Error al subir el archivo.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
      <h3>Contexto RAG</h3>
      <input
        type="file"
        accept=".txt"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        style={{
          marginLeft: '8px',
          background: uploading ? '#ccc' : '#007bff',
          border: 'none',
          color: '#fff',
          padding: '8px 12px',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {uploading ? 'Subiendo...' : 'Subir Archivo'}
      </button>

      <div style={{ marginTop: '24px' }}>
        <h4>Texto de contexto actual:</h4>
        <div
          style={{
            whiteSpace: 'pre-wrap',
            background: '#f0f0f0',
            padding: '12px',
            borderRadius: '4px',
            maxHeight: '60vh',
            overflowY: 'auto'
          }}
        >
          {ragText || 'No hay contexto cargado.'}
        </div>
      </div>
    </div>
  );
}
