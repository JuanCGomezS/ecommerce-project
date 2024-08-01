import React from 'react';

const Message = ({ type, text, onClose }) => {
  const getMessageStyle = () => {
    switch (type) {
        case 'error':
          return { backgroundColor: 'rgba(255, 0, 0, 0.15)', color: 'black', border: '2px solid rgba(255, 0, 0, 0.7)' };
        case 'warning':
          return { backgroundColor: 'rgba(255, 255, 0, 0.15)', color: 'black', border: '2px solid rgba(255, 140, 0, 0.7)' };
        case 'success':
          return { backgroundColor: 'rgba(0, 128, 0, 0.15)', color: 'black', border: '2px solid rgba(0, 128, 0, 0.7)' };
        default:
          return { backgroundColor: 'rgba(211, 211, 211, 0.15)', color: 'black', border: '2px solid rgba(211, 211, 211, 0.7)' };
      }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '10px 20px',
      borderRadius: '5px',
      zIndex: 1000,
      ...getMessageStyle(),
    }}>
      <span>{text}</span>
      <button onClick={onClose} style={{ marginLeft: '10px', cursor: 'pointer' }}>x</button>
    </div>
  );
};

export default Message;
