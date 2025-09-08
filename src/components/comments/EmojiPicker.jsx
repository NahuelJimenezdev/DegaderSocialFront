// src/components/comments/EmojiPicker.jsx
import React, { useState } from 'react';
import { Smile } from 'lucide-react';

const EMOJI_CATEGORIES = {
  caras: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '🫠', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '☺️', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝'],
  gestos: ['🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🫨', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😮‍💨', '😵', '😵‍💫'],
  emociones: ['😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🫣', '😖', '😣', '😞', '😔', '😟', '😕'],
  corazones: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟'],
  manos: ['👍', '👎', '👌', '🤌', '🤏', '✌️', '🤞', '🫰', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👋', '🤚', '🖐️', '✋', '🖖', '👏', '🙌'],
  objetos: ['🎉', '🎊', '🎈', '🎁', '🏆', '🥇', '🏅', '⭐', '🌟', '💫', '✨', '🎯', '🔥', '💯', '✅', '❌', '💤', '💭', '💬', '🗯️']
};

const EmojiPicker = ({ onEmojiSelect, show, onToggle }) => {
  const [activeCategory, setActiveCategory] = useState('caras');

  if (!show) {
    return (
      <button
        type="button"
        className="btn btn-outline-secondary btn-sm"
        onClick={onToggle}
        title="Añadir emoji"
      >
        <Smile size={16} />
      </button>
    );
  }

  return (
    <div className="position-relative">
      <button
        type="button"
        className="btn btn-secondary btn-sm"
        onClick={onToggle}
        title="Cerrar emojis"
      >
        <Smile size={16} />
      </button>

      <div
        className="position-absolute bg-white border rounded shadow-lg p-2"
        style={{
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '280px',
          maxWidth: 'calc(100vw - 20px)',
          maxHeight: '250px',
          zIndex: 1050,
          marginBottom: '5px'
        }}
      >
        {/* Pestañas de categorías */}
        <div className="d-flex flex-wrap gap-1 mb-2 border-bottom pb-2">
          {Object.keys(EMOJI_CATEGORIES).map(category => (
            <button
              key={category}
              type="button"
              className={`btn btn-sm ${activeCategory === category ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setActiveCategory(category)}
              style={{ fontSize: '10px', padding: '2px 6px' }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grid de emojis */}
        <div
          className="d-flex flex-wrap gap-1"
          style={{ maxHeight: '150px', overflowY: 'auto' }}
        >
          {EMOJI_CATEGORIES[activeCategory].map((emoji, index) => (
            <button
              key={index}
              type="button"
              className="btn btn-light btn-sm p-1"
              onClick={() => onEmojiSelect(emoji)}
              style={{
                fontSize: '18px',
                lineHeight: '1',
                width: '30px',
                height: '30px'
              }}
              title={emoji}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmojiPicker;
