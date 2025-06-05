# 🧠 Mi Open WebUI

Una interfaz de chat web completa que conecta con [Ollama](https://ollama.com) para utilizar modelos LLM locales (como llama3, mistral, gemma, etc). Incluye backend en Node.js (Express) y frontend en React (Vite).

---

## ✨ Estructura del proyecto

```
openWebUI/
├── client/                 # Frontend Vite + React
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   └── components/
│   │       ├── ChatBox.jsx
│   │       ├── AssistantSelector.jsx
│   │       └── FileUploader.jsx
├── server/                 # Backend Node.js + Express
│   ├── index.js
│   ├── package.json
│   └── .env                # Variables de entorno (puerto, etc)
├── docker-compose.yml
├── Dockerfile
├── start_openwebui.bat     # Script para Windows
├── start_openwebui.sh      # Script para Linux/macOS
└── README.md
```

---

## ✅ Requisitos

* Tener [Ollama](https://ollama.com) instalado y corriendo: `ollama run llama3`
* Node.js >= 18
* Git (si vas a clonar o subir a GitHub)

---

## ▶️ Ejecución en Windows (sin Docker)

1. Asegúrate de tener Ollama corriendo:

   ```powershell
   ollama run llama3
   ```

2. Lanza todo con doble clic o desde PowerShell:

   ```powershell
   ./start_openwebui.bat
   ```

3. Abre tu navegador en: [http://localhost:5173](http://localhost:5173)

---

## ▶️ Ejecución en Linux/macOS (sin Docker)

```bash
chmod +x ./start_openwebui.sh
./start_openwebui.sh
```

---

## 🐳 Ejecución con Docker

```bash
docker-compose up --build
```

Abre tu navegador en: [http://localhost:5173](http://localhost:5173)

---

## 🔙 Subir a GitHub

```bash
git init
git add .
git commit -m "Inicial"
gh repo create mi-open-webui --public --source=. --remote=origin
# (o usa GitHub Desktop para crear el repo si prefieres GUI)
git push -u origin main
```

---

## 🔧 Personalización

* Cambia el modelo en el backend (`server/index.js`), por defecto usa `llama3`
* Puedes editar los asistentes, contexto RAG y lógica fácilmente.

---

## 📦 Instalación manual (si no usas los scripts)

```bash
cd server
npm install
cd ../client
npm install
npm run dev
```

Y en otro terminal:

```bash
cd server
npm run dev
```

---

## 📤 API del backend

* `GET    /api/assistants`          → Lista asistentes
* `POST   /api/assistants`          → Crear/editar asistente
* `DELETE /api/assistants/:id`      → Eliminar asistente
* `GET    /api/context`             → Texto concatenado RAG
* `POST   /api/uploadContext`       → Subir archivo .txt para contexto
* `POST   /api/generate`            → Llama al modelo con el historial

---

## 🤪 Estado

✔️ Funcionalidad básica terminada
🧪 Probado en Windows, Linux y Docker
🔜 Pendiente: persistencia, carga de modelos en UI, login opcional

---

## ✨ Créditos

Hecho por Adam con ❤️ usando Express, Vite y Ollama
