import React from 'react';
import ChatBox from './components/ChatBox';
import AssistantSelector from './components/AssistantSelector';
import FileUploader from './components/FileUploader';

const App = () => {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Mi Open WebUI</h1>
      <AssistantSelector />
      <FileUploader />
      <ChatBox />
    </div>
  );
};

export default App;
