import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import Logout from './Logout'
import ChatInput from '../components/ChatInput';
import axios from 'axios';
import { sendMessageRoute, getAllMessageRoute } from '../utils/messageRoutes';
import { v4 as uuidv4 } from 'uuid'




function ChatContainer({ currentChat, currentUser, socket }) {
  const [messages,setMessages] = useState([])
  const [arrivalMsg,setArrivalMsg] = useState(null)
  const scrollRef = useRef()
  useEffect(() => {
    const fetchMessages = async () => {
     const response = await axios.post(getAllMessageRoute, {
      from:currentUser._id,
      to: currentChat._id
     })
     
     
     
     setMessages(response.data)
  }
  fetchMessages()
}

,[currentChat])
  const handleSendMsg = async (msg) => {
       await axios.post(sendMessageRoute, {
        from: currentUser._id,
        to: currentChat._id,
        message: msg
       })
       socket.current.emit('send-msg', {
        to: currentChat._id,
        from: currentUser._id,
        message: msg
       })
       const msgs = [...messages]
       msgs.push({fromSelf: true, message:msg})
       setMessages(msgs)
  }
  useEffect(() => {
    if(socket.current) {
      socket.current.on('msg-receive',(msg) => {
        setArrivalMsg({fromSelf: false, message:msg})
        console.log('Received message:', msg);
      })
    }
  }, [])
  useEffect(() => {
    arrivalMsg && setMessages((prev) => [...prev, arrivalMsg] )

  },[arrivalMsg])
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: 'smooth' })

  },[messages])
  return (
    <Container>
        <div className="chat-header">
        <div className="user-details">
            <div className="avatar">
                <img src={currentChat.avatarImage} alt="" />
                
            </div>
            <div className="username">
                    <h3>{currentChat.username}</h3>
                </div>
        </div>
     <Logout/>
    </div>
    <div className="chat-messages">
      {
        messages.map((message, index) => {
          return (
           <div ref={scrollRef} key={uuidv4()}>
            <div className={`message ${message.fromSelf ? 'sent' : 'received'}`}>
            <div className="content">
              <p>
                {message.message}
              </p>
            </div>

            </div>
           </div>
          )
        })
      }
    </div>
    <ChatInput handleSendMsg = {handleSendMsg}/>
    </Container>
  )
}
const Container = styled.div`
      padding-top: 1rem;
      display: grid;
      grid-template-rows: 10% 78% 12%;
        overflow: hidden;
        gap: 0.1 rem;
      .chat-header {
       display: flex;
       justify-content: space-between;
       align-items: center;
       padding: 0.2rem;
       .user-details {
        display: flex;
        align-items: center;
        gap: 1rem;
        .avatar {
          img {
          height: 3rem;
          }
        }
          .username {
             h3{
                color: white;
             }
          }
       }
      }
       .chat-messages {
          padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sent {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .received {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
       }

`


export default ChatContainer