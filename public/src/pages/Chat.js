import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { allUserRoute, host } from '../utils/APIRoutes';
import Loader from '../assets/loader.gif'
import Contacts from '../components/Contacts';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';
import axios from 'axios';
import {io} from 'socket.io-client'

function Chat() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [loading, setLoading] = useState(true); 
  const [currentChat, setCurrentChat] = useState(undefined)
  const socket = useRef()
 
  

  useEffect(() => {
    const checkUser = async () => {
      const storedUser = localStorage.getItem('chat-app-user');
      if (!storedUser) {
        navigate('/login');
      } else {
        setCurrentUser(JSON.parse(storedUser));
      }
    };
    checkUser();
  }, [navigate]); 
  useEffect(() => {
   if(currentUser){
    socket.current = io(host)
    socket.current.emit('add-user', currentUser._id)
   }

  },[currentUser])

  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser && currentUser.isAvatarSet) {
        try {
          const response = await axios.get(`${allUserRoute}/${currentUser._id}`);
          setContacts(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching contacts:', error);
        }
      } else if (currentUser) {
        navigate('/set-avatar');
      }
    };

    if (currentUser) {
      fetchContacts();
    }
  }, [currentUser, navigate]);
  const handleChatChange = (chat) => {
    setCurrentChat(chat)
  }

  if (loading) {
    return <Container><img src={Loader} alt="" /></Container>;
  }

  return (
    <Container>
      <div className="container">
        <Contacts currentUser={currentUser} contacts={contacts} changeChat={handleChatChange}/>
        {currentChat === undefined ? (
          <Welcome currentUser={currentUser}/>
          ) : (
          <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket}/>
          
          )}
      </div>
      

      
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

export default Chat;
