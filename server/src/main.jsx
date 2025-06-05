import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/global.css';
import { AssistantProvider } from './contexts/AssistantContext';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <AssistantProvider>
      <App />
    </AssistantProvider>
  </React.StrictMode>
);
