/**
 * Funciones utilitarias para guardar y leer del localStorage
 * - Guardar conversación histórica por asistente.
 * - Guardar “memorias” o notas libres si quieres.
 */

export function saveChatHistory(assistantId, history) {
  localStorage.setItem(`chat_history_${assistantId}`, JSON.stringify(history));
}

export function loadChatHistory(assistantId) {
  const data = localStorage.getItem(`chat_history_${assistantId}`);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveMemory(assistantId, memory) {
  localStorage.setItem(`memory_${assistantId}`, JSON.stringify(memory));
}

export function loadMemory(assistantId) {
  const data = localStorage.getItem(`memory_${assistantId}`);
  if (!data) return '';
  try {
    return JSON.parse(data);
  } catch {
    return '';
  }
}
