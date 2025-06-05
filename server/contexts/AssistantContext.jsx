/**
 * Contexto global para manejar:
 * - El asistente seleccionado.
 * - La lista de asistentes.
 * - Funciones para recargar, crear, eliminar, actualizar.
 */

import React, { createContext, useState, useEffect } from 'react';
import { fetchAssistants, saveAssistant, deleteAssistant } from '../api/ollama';

export const AssistantContext = createContext();

export function AssistantProvider({ children }) {
  const [assistants, setAssistants] = useState([]);
  const [selectedAssistant, setSelectedAssistant] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carga inicial de asistentes
  useEffect(() => {
    loadAssistants();
  }, []);

  async function loadAssistants() {
    setLoading(true);
    try {
      const data = await fetchAssistants();
      setAssistants(data);
      // Si no hay ninguno, selectedAssistant = null
      if (data.length > 0 && !selectedAssistant) {
        setSelectedAssistant(data[0]);
      }
    } catch (err) {
      console.error('Error al cargar asistentes:', err);
    } finally {
      setLoading(false);
    }
  }

  async function createOrUpdateAssistant(assistant) {
    try {
      const saved = await saveAssistant(assistant);
      await loadAssistants();
      setSelectedAssistant(saved);
    } catch (err) {
      console.error('Error guardando asistente:', err);
    }
  }

  async function removeAssistant(id) {
    try {
      await deleteAssistant(id);
      await loadAssistants();
      // Si eliminamos el que estaba seleccionado, seleccionamos otro o null
      if (selectedAssistant && selectedAssistant.id === id) {
        setSelectedAssistant(assistants.filter(a => a.id !== id)[0] || null);
      }
    } catch (err) {
      console.error('Error eliminando asistente:', err);
    }
  }

  return (
    <AssistantContext.Provider
      value={{
        assistants,
        loading,
        selectedAssistant,
        setSelectedAssistant,
        createOrUpdateAssistant,
        removeAssistant,
        reloadAssistants: loadAssistants
      }}
    >
      {children}
    </AssistantContext.Provider>
  );
}
