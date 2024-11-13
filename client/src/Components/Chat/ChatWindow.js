import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_URL } from '../../utils/apiConfig';
import {FaPaperPlane, FaPaperclip, FaPlus, FaTrash, FaTimes } from 'react-icons/fa'; // Import icons for send and share

const ChatWindow = ({ currentChat, socket }) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]); // For holding the file list
  const [fileDescriptions, setFileDescriptions] = useState({}); // Holds descriptions for each file
  const messagesEndRef = useRef(null); // Create a ref for scrolling
  const fileInputRef = useRef(null); // Create a ref for the file input

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
  }, [currentChat, socket]); // Depend on currentChat and socket to re-fetch messages when chat changes

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

  const sendMessage = async () => {
    if (newMessage.trim() || selectedFiles.length > 0) {
        const formData = new FormData();
        formData.append('from', currentChat.userId);
        formData.append('to', currentChat.id);
        formData.append('message', newMessage);

        // Check if there are files to upload
        if (selectedFiles.length > 0) {
            selectedFiles.forEach(file => {
                formData.append('files', file);
            });

            try {
                // Send files and message to the server
                const response = await axios.post(`${API_URL}/api/uploadFiles`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                // Emit the complete message with files and text
                socket.emit('chatMessage', {
                    from: currentChat.userId,
                    to: currentChat.id,
                    message: response.data.chat.message,
                    files: response.data.chat.files
                });
            } catch (error) {
                console.error('Error uploading files:', error);
            }
        } else {
            try {
                // Send just the text message to the server
                const response = await axios.post(`${API_URL}/api/send`, {
                    from: currentChat.userId,
                    to: currentChat.id,
                    message: newMessage
                });
                // Emit the text-only message
                socket.emit('chatMessage', {
                    from: currentChat.userId,
                    to: currentChat.id,
                    message: newMessage
                });
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }

        // Clear the message and selected files after sending
        setNewMessage("");
        setSelectedFiles([]);
    }
};

  const sendFiles = () => {
    // Similar implementation to send files as described before.
  };

  const handleFileShare = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prevFiles => [...prevFiles, ...files]);
    e.target.value = null; // Reset file input
  };

  const handleDeleteFile = (fileName) => {
    setSelectedFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
    const newDescriptions = { ...fileDescriptions };
    delete newDescriptions[fileName];
    setFileDescriptions(newDescriptions);
  };

  const cancelSendFiles = () => {
    setSelectedFiles([]);
    setFileDescriptions({});
  };
  // Function to render message content with or without files
const renderMessageContent = (msg) => {
  return (
      <>
          <strong>{msg.from === currentChat.userId ? 'You' : currentChat.name}:</strong>
          <p>{msg.message}</p>
          {msg.files && msg.files.map((file, index) => (
            <div key={index} className="file-message">
                <a href={`${API_URL}/uploadFiles/${file.filename}`} download>
                    {file.originalname} {/* Ensure you send originalname if you want to show the file's original name */}
                </a>
                <p>Description: {file.description || "No description provided."}</p>
            </div>
          ))}
      </>
  );
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
                {renderMessageContent(msg)}
            </div>
          </div>
        )) : <div className="no-messages">No messages yet</div>}
        <div ref={messagesEndRef} />
      </div>
      <div className="file-preview-section">
        {selectedFiles.length > 0 && (
          <div className="file-preview">
            {selectedFiles.map((file, index) => (
              <div key={index} className="file-preview-item">
                <FaTrash onClick={() => handleDeleteFile(file.name)} />
                {file.name}
                <input
                  type="text"
                  placeholder="Add a description"
                  value={fileDescriptions[file.name] || ''}
                  onChange={(e) => setFileDescriptions(prev => ({ ...prev, [file.name]: e.target.value }))}
                />
              </div>
            ))}
            
            <button onClick={() => fileInputRef.current.click()} className="add-file-button"><FaPlus /> Add more files</button>
            <button onClick={sendMessage} className="send-files-button"><FaPaperPlane /> Send Files</button>
            <button onClick={cancelSendFiles}className='cancel-files-button'><FaTimes /> Cancel</button>

          </div>
        )}
        </div>
      {/* File Preview Section
      {selectedFiles.length > 0 && (
        <div className="file-preview">
          {selectedFiles.map((file, index) => (
            <div key={index} className="file-preview-item">
              <FaTrash onClick={() => handleDeleteFile(file.name)} />
              {file.name}
              <input type="text" placeholder="Add a description" value={fileDescriptions[file.name] || ''}
                onChange={(e) => setFileDescriptions(prev => ({ ...prev, [file.name]: e.target.value }))}
              />
            </div>
          ))}
          <button onClick={sendFiles}>Send</button>
          <button onClick={cancelSendFiles}><FaTimes /> Cancel</button>
        </div>
      )} */}

      {currentChat && (
        <div className="chat-input-box">
          <input
            type="text"
            placeholder="Type here..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="chat-input"
          />
          <FaPaperclip className="share-icon" onClick={handleFileShare} title="Share a file" />
          <FaPaperPlane className="send-icon" onClick={sendMessage} title="Send message" />

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            multiple
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
