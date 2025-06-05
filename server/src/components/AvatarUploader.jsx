import React, { useRef } from 'react';

/**
 * Componente para subir una imagen y convertirla a Base64.
 * Recibe:
 *  - avatarUrl (string Base64 o vacío)
 *  - setAvatarUrl (función para actualizar)
 */
export default function AvatarUploader({ avatarUrl, setAvatarUrl }) {
  const inputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      {avatarUrl && (
        <img
          src={avatarUrl}
          alt="avatar"
          style={{ width: '60px', height: '60px', borderRadius: '50%', marginBottom: '8px' }}
        />
      )}
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleFileChange}
      />
    </div>
  );
}
