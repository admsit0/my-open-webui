import axios from 'axios';
import { API_BASE } from '../utils/constants';

/**
 * Funciones para comunicarse con el backend en Node/Express.
 */

// 1) Obtener lista de asistentes
export async function fetchAssistants() {
  const resp = await axios.get(`${API_BASE}/assistants`);
  return resp.data; // arreglo de asistentes
}

// 2) Crear/Actualizar asistente
export async function saveAssistant(assistant) {
  // assistant = { id?, name, avatarUrl, systemPrompt }
  const resp = await axios.post(`${API_BASE}/assistants`, assistant);
  return resp.data;
}

// 3) Eliminar asistente
export async function deleteAssistant(id) {
  const resp = await axios.delete(`${API_BASE}/assistants/${id}`);
  return resp.data;
}

// 4) Subir archivo de contexto RAG
export async function uploadContextFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  const resp = await axios.post(`${API_BASE}/uploadContext`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return resp.data; // { id, filename, content }
}

// 5) Obtener contexto RAG concatenado
export async function fetchContext() {
  const resp = await axios.get(`${API_BASE}/context`);
  return resp.data.context;
}

// 6) Generar respuesta (chat)
export async function generateReply({ assistantId, history, userMessage }) {
  const resp = await axios.post(`${API_BASE}/generate`, {
    assistantId,
    history,
    userMessage
  });
  return resp.data; // { assistantId, reply, full }
}
