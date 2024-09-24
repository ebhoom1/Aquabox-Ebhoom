import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_URL } from '../../utils/apiConfig';

const ChatWindow = ({ currentChat, socket }) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);  // Create a ref for scrolling

  // Fetch messages whenever the currentChat changes
  useEffect(() => {
    if (currentChat) {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(`${API_URL}/api/messages`, {
            params: { from: currentChat.userId, to: currentChat.id }
          });
          setMessages(response.data);  // Assuming the response data is the array of messages
          scrollToBottom();  // Scroll to bottom when messages are initially fetched
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };
      setInterval(()=>{
        fetchMessages();
        
      },100)
    }
  }, [currentChat]);  // Depend on currentChat to re-fetch messages when it changes

  useEffect(() => {
    const handleNewMessage = (message) => {
      if (currentChat && (message.from === currentChat.userId || message.from === currentChat.id)) {
        setMessages(prev => [...prev, message]);
      }
    };

    socket.on('newChatMessage', handleNewMessage);

    return () => {
      socket.off('newChatMessage', handleNewMessage);
    };
  }, [currentChat, socket]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      socket.emit('chatMessage', {
        from: currentChat.userId,
        to: currentChat.id,
        message: newMessage
      });

      setMessages(prevMessages => [
        ...prevMessages,
        { from: currentChat.userId, message: newMessage }
      ]);

      setNewMessage("");
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




