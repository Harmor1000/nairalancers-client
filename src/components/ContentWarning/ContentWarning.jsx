import React from 'react';
import './ContentWarning.scss';

const ContentWarning = ({ 
  warning, 
  type = 'warning', // 'warning', 'error', 'info'
  onDismiss,
  violations = [],
  suggestions = [],
  showDetails = false 
}) => {
  if (!warning) return null;

  const getIcon = () => {
    switch (type) {
      case 'error':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '🔒';
    }
  };

  return (
    <div className={`content-warning ${type}`}>
      <div className="content-warning__main">
        <div className="content-warning__icon">
          {getIcon()}
        </div>
        <div className="content-warning__content">
          <div className="content-warning__message">
            {warning}
          </div>
          
          {showDetails && violations.length > 0 && (
            <div className="content-warning__details">
              <strong>Detected issues:</strong>
              <ul className="content-warning__violations">
                {violations.map((violation, index) => (
                  <li key={index}>
                    {violation.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {suggestions.length > 0 && (
            <div className="content-warning__suggestions">
              <strong>Tips for secure communication:</strong>
              <ul className="content-warning__suggestions-list">
                {suggestions.slice(0, 3).map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {onDismiss && (
          <button 
            className="content-warning__dismiss"
            onClick={onDismiss}
            aria-label="Dismiss warning"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default ContentWarning;

