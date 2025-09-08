// src/components/reactions/ReactionButton.jsx
import React, { useState } from 'react';
import { ThumbsUp, Heart, Eye, ThumbsDown } from 'lucide-react';

const REACTIONS = {
  like: {
    icon: ThumbsUp,
    label: 'Me gusta',
    emoji: '👍',
    color: '#0d6efd',
    activeColor: '#0d6efd'
  },
  love: {
    icon: Heart,
    label: 'Me encanta',
    emoji: '❤️',
    color: '#dc3545',
    activeColor: '#dc3545'
  },
  seen: {
    icon: Eye,
    label: 'Visto',
    emoji: '👀',
    color: '#6c757d',
    activeColor: '#6c757d'
  },
  dislike: {
    icon: ThumbsDown,
    label: 'No me gusta',
    emoji: '👎',
    color: '#6c757d',
    activeColor: '#6c757d'
  }
};

const ReactionButton = ({
  reactions = {},
  userReaction = null,
  onReact,
  disabled = false,
  size = 'sm',
  showLabels = false,
  commentId = null,
  publicacionId = null
}) => {
  const [showReactions, setShowReactions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleReaction = async (reactionType) => {
    if (disabled || isLoading) return;

    setIsLoading(true);
    try {
      await onReact(reactionType, commentId, publicacionId);
    } catch (error) {
      console.error('Error al reaccionar:', error);
    } finally {
      setIsLoading(false);
      setShowReactions(false);
    }
  };

  const getTotalReactions = () => {
    return Object.values(reactions).reduce((total, count) => total + count, 0);
  };

  const getMostPopularReaction = () => {
    let maxCount = 0;
    let popularReaction = null;

    Object.entries(reactions).forEach(([type, count]) => {
      if (count > maxCount) {
        maxCount = count;
        popularReaction = type;
      }
    });

    return popularReaction;
  };

  const buttonSize = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 24 : 20;

  return (
    <div className="position-relative d-inline-block">
      {/* Botón principal */}
      <button
        className={`btn ${userReaction ? 'btn-primary' : 'btn-outline-secondary'} ${buttonSize} d-flex align-items-center gap-1`}
        onClick={() => setShowReactions(!showReactions)}
        disabled={disabled || isLoading}
        style={{
          color: userReaction && REACTIONS[userReaction] ? REACTIONS[userReaction].activeColor : undefined
        }}
      >
        {isLoading ? (
          <div className="spinner-border spinner-border-sm" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        ) : userReaction && REACTIONS[userReaction] ? (
          <>
            <span>{REACTIONS[userReaction].emoji}</span>
            {showLabels && <span>{REACTIONS[userReaction].label}</span>}
          </>
        ) : (
          <>
            <ThumbsUp size={iconSize} />
            {showLabels && <span>Reaccionar</span>}
          </>
        )}

        {getTotalReactions() > 0 && (
          <span className="badge bg-secondary ms-1">{getTotalReactions()}</span>
        )}
      </button>

      {/* Panel de reacciones */}
      {showReactions && (
        <div
          className="position-absolute bg-white border rounded shadow-lg p-2 d-flex flex-wrap gap-1"
          style={{
            bottom: '100%',
            right: '0',
            zIndex: 1000,
            minWidth: '200px',
            maxWidth: '90vw',
            transform: 'translateX(0)',
            marginBottom: '5px'
          }}
        >
          {Object.entries(REACTIONS).map(([type, config]) => {
            const IconComponent = config.icon;
            const count = reactions[type] || 0;
            const isActive = userReaction === type;

            return (
              <button
                key={type}
                className={`btn ${isActive ? 'btn-primary' : 'btn-outline-light'} btn-sm d-flex flex-column align-items-center p-1 p-md-2`}
                onClick={() => handleReaction(type)}
                disabled={disabled || isLoading}
                style={{
                  backgroundColor: isActive ? config.activeColor : 'transparent',
                  borderColor: config.color,
                  color: isActive ? 'white' : config.color,
                  minWidth: '40px',
                  width: '45px',
                  fontSize: '12px'
                }}
                title={config.label}
              >
                <span style={{ fontSize: '16px' }}>{config.emoji}</span>
                <small style={{ fontSize: '9px', lineHeight: 1 }} className="text-truncate w-100">
                  {config.label.length > 6 ? config.label.substring(0, 6) : config.label}
                </small>
                {count > 0 && (
                  <small className="badge bg-secondary mt-1" style={{ fontSize: '7px' }}>
                    {count}
                  </small>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Overlay para cerrar el panel */}
      {showReactions && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ zIndex: 999 }}
          onClick={() => setShowReactions(false)}
        />
      )}

      {/* Resumen de reacciones */}
      {getTotalReactions() > 0 && showLabels && (
        <div className="mt-1">
          <small className="text-muted">
            {Object.entries(reactions)
              .filter(([type, count]) => count > 0)
              .map(([type, count]) => `${REACTIONS[type].emoji} ${count}`)
              .join(' • ')}
          </small>
        </div>
      )}
    </div>
  );
};

export default ReactionButton;
