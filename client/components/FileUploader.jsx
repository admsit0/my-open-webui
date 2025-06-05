import React from 'react';
import axios from 'axios';

export default function FileUploader() {
  const handleUpload = async (e) => {
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    await axios.post('/api/uploadContext', formData);
    alert('Archivo cargado correctamente.');
  };

  return (
    <div>
      <h3>Subir archivo de contexto (RAG)</h3>
      <input type="file" accept="text/*" onChange={handleUpload} />
    </div>
  );
}
