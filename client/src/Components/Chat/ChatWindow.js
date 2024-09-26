import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_URL } from '../../utils/apiConfig';

const ChatWindow = ({ currentChat, socket }) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);  // Create a ref for scrolling

  // Join the room when a chat is selected
  useEffect(() => {
    if (currentChat) {
      socket.emit('joinRoom', { userId: currentChat.userId }); // Join the room based on the selected chat

      const fetchMessages = async () => {
        try {
          const response = await axios.get(`${API_URL}/api/messages`, {
            params: { from: currentChat.userId, to: currentChat.id }
          });
          setMessages(response.data);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };
      fetchMessages();
    }
  }, [currentChat, socket]);  // Depend on currentChat and socket to re-fetch messages when chat changes

  useEffect(() => {
    const handleNewMessage = (message) => {
      if (currentChat && (message.from === currentChat.userId || message.from === currentChat.id)) {
        setMessages(prev => [...prev, message]); // Add the message only when received from the server
      }
    };

    socket.on('newChatMessage', handleNewMessage); // Listen for real-time messages

    return () => {
      socket.off('newChatMessage', handleNewMessage); // Clean up listener
    };
  }, [currentChat, socket]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      // Emit the message to the server
      socket.emit('chatMessage', {
        from: currentChat.userId,
        to: currentChat.id,
        message: newMessage
      });

      setNewMessage(""); // Clear the input after sending the message
    }
  };

  return (
    <div className="chat-main">
      <div className="chat-header">
        {currentChat ? <h2>{currentChat.name}</h2> : <div className="select-chat-message">Select a user to chat</div>}
      </div>
      <div className="chat-messages">
        {messages.length > 0 ? messages.map((msg, index) => (
          <div key={index} className={`message ${msg.from === currentChat.userId ? 'you' : 'them'}`}>
            <div className="content">
              <strong>{msg.from === currentChat.userId ? 'You' : currentChat.name}:</strong> {msg.message}
            </div>
          </div>
        )) : <div className="no-messages">No messages yet</div>}
        <div ref={messagesEndRef} />
      </div>
      {currentChat && (
        <div className="chat-input-box">
          <input 
            type="text" 
            placeholder="Type here..." 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
