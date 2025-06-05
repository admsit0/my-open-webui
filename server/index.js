/**
 * Backend Express para “Mi Open WebUI”
 * - Rutas:
 *    GET  /api/assistants         -> devuelve lista de asistentes guardados (en memoria)
 *    POST /api/assistants         -> crea o actualiza un asistente
 *    DELETE /api/assistants/:id   -> elimina un asistente
 *    GET  /api/context            -> devuelve el texto RAG concatenado
 *    POST /api/uploadContext      -> sube archivos de texto para usar como contexto RAG
 *    POST /api/generate           -> llama a Ollama con los parámetros apropiados
 */

import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { nanoid } from 'nanoid';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Carga variables de entorno
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const PORT = process.env.PORT || 4000;

// --- ESTRUCTURAS EN MEMORIA PARA EJEMPLO ---
let assistants = {}; // { id: { id, name, avatarUrl (base64), systemPrompt } }
let ragFiles = {};   // { id: { id, filename, content } }

// Configuración de multer para recibir archivos de texto
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(__dirname, 'uploads');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir);
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
  }),
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('text/')) {
      return cb(new Error('Solo se permiten archivos de texto'), false);
    }
    cb(null, true);
  }
});

// --- RUTAS PARA ASISTENTES ---
app.get('/api/assistants', (req, res) => {
  // Devuelve arreglo con todos los asistentes
  return res.json(Object.values(assistants));
});

app.post('/api/assistants', (req, res) => {
  /**
   * Crea o actualiza un asistente.
   * Body esperado:
   * {
   *   id?: string,           // si se manda, actualiza
   *   name: string,
   *   avatarUrl: string,     // Base64 (ej: "data:image/png;base64,....")
   *   systemPrompt: string   // Instrucciones para prompt de sistema
   * }
   */
  const { id, name, avatarUrl, systemPrompt } = req.body;
  if (!name || !systemPrompt) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }

  let assistantId = id;
  if (!assistantId) {
    assistantId = nanoid();
  }

  assistants[assistantId] = {
    id: assistantId,
    name,
    avatarUrl: avatarUrl || '',
    systemPrompt
  };

  return res.json(assistants[assistantId]);
});

app.delete('/api/assistants/:id', (req, res) => {
  const { id } = req.params;
  if (assistants[id]) {
    delete assistants[id];
    return res.json({ success: true });
  } else {
    return res.status(404).json({ error: 'Asistente no encontrado.' });
  }
});

// --- RUTAS PARA RAG CONTEXT ---
app.get('/api/context', (req, res) => {
  // Devuelve concatenado de todo el contenido de archivos RAG
  const allText = Object.values(ragFiles).map(f => f.content).join('\n\n----\n\n');
  return res.json({ context: allText });
});

app.post('/api/uploadContext', upload.single('file'), (req, res) => {
  // Se sube un archivo de texto; lo leemos y guardamos su contenido en ragFiles
  if (!req.file) {
    return res.status(400).json({ error: 'No se recibió ningún archivo.' });
  }
  const filePath = path.join(req.file.destination, req.file.filename);
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error al leer el archivo.' });
    }
    const id = nanoid();
    ragFiles[id] = {
      id,
      filename: req.file.originalname,
      content: data
    };
    // Borra el archivo físico (opcional; ya tenemos contenido en memoria)
    fs.unlinkSync(filePath);
    return res.json(ragFiles[id]);
  });
});

// --- RUTA PARA GENERAR TEXTO con Ollama ---
app.post('/api/generate', async (req, res) => {
  /**
   * Body esperado:
   * {
   *   assistantId: string,
   *   history: Array<{ role: 'user'|'assistant', content: string }>,
   *   userMessage: string
   * }
   *
   * El servidor se encargará de armar:
   *   1) El mensaje de sistema (systemPrompt del asistente).
   *   2) El contexto RAG (GET /api/context).
   *   3) La memoria de conversación enviada por el cliente (history).
   *   4) El mensaje actual del usuario (userMessage).
   */
  try {
    const { assistantId, history, userMessage } = req.body;
    if (!assistantId || !assistants[assistantId]) {
      return res.status(400).json({ error: 'Asistente inválido.' });
    }
    if (!userMessage) {
      return res.status(400).json({ error: 'Falta userMessage.' });
    }

    // 1) Mensaje de sistema
    const systemPrompt = assistants[assistantId].systemPrompt;

    // 2) Contexto RAG
    const contextResp = await axios.get(`http://localhost:${PORT}/api/context`);
    const ragContext = contextResp.data.context || '';

    // 3) Armado de mensajes para Ollama
    // Formato: [
    //   { role: 'system', content: <systemPrompt + ragContext> },
    //   ...history,  // cada item: { role: 'user'|'assistant', content }
    //   { role: 'user', content: userMessage }
    // ]
    let systemContent = systemPrompt;
    if (ragContext.trim()) {
      systemContent += '\n\nContexto adicional:\n' + ragContext;
    }

    const messages = [
      { role: 'system', content: systemContent },
      ...history,
      { role: 'user', content: userMessage }
    ];

    // 4) Llamada a Ollama
    const response = await axios.post(
      `${OLLAMA_HOST}/api/generate`,
      {
        model: "llama3", // o el que prefieras; podrías parametrizarlo luego
        messages
      },
      { timeout: 600000 } // 10 minutos max (ajusta según convenga)
    );

    // 5) Devolver al cliente el contenido generado
    return res.json({
      assistantId,
      reply: response.data.choices[0].message.content || '',
      full: response.data
    });
  } catch (err) {
    console.error(err.toString());
    return res.status(500).json({ error: 'Error en /api/generate', details: err.toString() });
  }
});

// --- INICIA EXPRESS ---
app.listen(PORT, () => {
  console.log(`✅ Server corriendo en http://localhost:${PORT}`);
  console.log(`   Ollama backend apuntando a: ${OLLAMA_HOST}`);
});
