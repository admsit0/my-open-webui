import React, { useState, useRef, useEffect } from 'react';

/**
 * Componente para textarea + botón de “enviar”.
 * Props:
 *  - onSend(texto)
 *  - disabled (boolean)
 */
export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState('');
  const textareaRef = useRef();

  useEffect(() => {
    // Ajuste automático del alto del textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [text]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && text.trim()) {
        onSend(text);
        setText('');
      }
    }
  };

  return (
    <div className="chat-input">
      <textarea
        ref={textareaRef}
        rows="1"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Escribe un mensaje..."
        disabled={disabled}
      />
      <button
        onClick={() => {
          if (!disabled && text.trim()) {
            onSend(text);
            setText('');
          }
        }}
        disabled={disabled || !text.trim()}
      >
        Enviar
      </button>
    </div>
  );
}
