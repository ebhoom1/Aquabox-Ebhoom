import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import { useSelector } from 'react-redux';
import './chat.css'; // Ensure this path is correct
import { API_URL } from '../../utils/apiConfig'; // Ensure API_URL is correct

const socket = io(`${API_URL}`);

const ChatApp = () => {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch current user data from Redux
  const { userData } = useSelector((state) => state.user);
  const currentUser = userData?.validUserOne;

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axios.get(`${API_URL}/api/getallusers`);
        console.log(response.data.users);
        if (response.data && response.data.users && currentUser) {
          setChats(response.data.users.map(user => ({
            id: user._id,
            name: user.companyName || 'No Name', // Provide a fallback value
            userName:user.userName || 'No userName',
            avatar: user.avatar || 'assets/images/admin.png', // Provide a default avatar if not available
            lastMessage: user.lastMessage || 'No messages yet', // Provide a default message
            userId: currentUser._id // Use the actual current user ID from Redux state
          })));
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    }

    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser]);

  // Listen for incoming chat messages via socket
  useEffect(() => {
    socket.on('newChatMessage', (message) => {
      setChats(prevChats => {
        return prevChats.map(chat =>
          chat.id === message.to ? {
            ...chat,
            messages: [...chat.messages || [], message],
            lastMessage: message.message
          } : chat
        );
      });
    });

    return () => socket.off('newChatMessage');
  }, []);

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.userName.toLowerCase().includes(searchTerm.toLocaleLowerCase())
  );

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="row page-title-header">
          <div className="col-12">
            <div className="page-header">
              <h4 className="page-title">Chat Application</h4>
            </div>
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-md-4">
            <ChatSidebar 
              chats={filteredChats} 
              selectChat={setCurrentChat} 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
            />
          </div>
          <div className="col-md-8">
            <ChatWindow currentChat={currentChat} socket={socket} />
            {console.log('currenchat', currentChat)}
          </div>
        </div>
      </div>
      <footer className="footer">
        <div className="container-fluid clearfix">
          <span className="text-muted d-block text-center text-sm-left d-sm-inline-block">
            AquaBox Control and Monitor System
          </span>
          <span className="float-none float-sm-right d-block mt-1 mt-sm-0 text-center">
            © <a href="https://envirobotics.com" target="_blank">EnviRobotics</a> 2022
          </span>
        </div>
      </footer>
    </div>
  );
};

export default ChatApp;