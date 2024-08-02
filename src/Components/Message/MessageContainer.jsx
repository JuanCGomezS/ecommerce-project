import React, { useState, useImperativeHandle, forwardRef } from 'react';
import Message from './index';

const MessageContainer = forwardRef((props, ref) => {
  const [messages, setMessages] = useState([]);

  useImperativeHandle(ref, () => ({
    addMessage(type, text) {
      const id = Date.now();
      setMessages((prevMessages) => [...prevMessages, { id, type, text }]);
      setTimeout(() => {
        setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== id));
      }, 3000);
    },
  }));

  return (
    <div>
      {messages.map((msg) => (
        <Message
          key={msg.id}
          type={msg.type}
          text={msg.text}
          onClose={() => setMessages((prevMessages) => prevMessages.filter((m) => m.id !== msg.id))}
        />
      ))}
    </div>
  );
});

export default MessageContainer;
