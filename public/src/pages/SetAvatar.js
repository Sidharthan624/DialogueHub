import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Loader from '../assets/loader.gif'
import { ToastContainer, toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios'
import { setAvatarRoute } from "../utils/APIRoutes";
import { Buffer } from "buffer"; 



const api = 'https://api.multiavatar.com'


const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    draggable: true,
    pauseOnHover:true,
    theme: "dark"
  }
  
  


function SetAvatar() {
  const navigate = useNavigate()
  const [avatars, setAvatars] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAvatar, setSelectedAvatar] = useState(undefined)

  useEffect( () => {
    if(!localStorage.getItem('chat-app-user')){
      navigate('/login')

    }

  },[]
    

  )

  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        const data = [];
        for (let i = 0; i < 4; i++) {
          const randomId = Math.round(Math.random() * 1000);
          const response = await axios.get(`${api}/${randomId}.svg`);
          const base64 = Buffer.from(response.data).toString("base64");
          data.push(`data:image/svg+xml;base64,${base64}`);
        }
        setAvatars(data);
      } catch (error) {
        console.error("Error fetching avatars:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvatars();
  }, []);
  const setProfilePicture = async () => {
          if(selectedAvatar === undefined) {
           
            
            toast.error("Please select an avatar", toastOptions)
          }  else {
            const user = await JSON.parse(localStorage.getItem('chat-app-user'))
            const {data} = await axios.post(`${setAvatarRoute}/${user._id}`, {
              image: avatars[selectedAvatar]
            })
            
            if(data.isSet) {
              user.isAvatarSet = true
              user.avatarImage = data.image
              localStorage.setItem('chat-app-user', JSON.stringify(user))
              navigate('/')
            }

          }
           
  }


  return (
    <>{isLoading ? <Container><img src={Loader} alt="" /></Container>
     :(<Container>
        <div className="title-container">
            <h1>Pick an avatar for your profile</h1>
        </div>
        <div className="avatars">
            {avatars.map((avatar, index) => {
                return ( 
                    <div className={`avatar ${selectedAvatar === index ? "selected" : ""}`} key={index}>
                        <img src={`data:image/svg+xml;base64/${avatar}`} alt="avatar" onClick={() => setSelectedAvatar(index)}/>

                    </div>
                    )
            })}

        </div>
        <button onClick={()=> setProfilePicture()} className="btn-sbmt">Set Avatar</button>
    </Container>)}

    <ToastContainer/>

    </>
  )
}
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: black;
  height: 100vh;
  width: 100vw;

  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      color: white;
    }
  }

  .avatars {
    display: flex;
    gap: 2rem;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;

      img {
        height: 4rem;
      }

      &.selected {
        border: 0.4rem solid #4e0eff;
      }
    }
  }

  .btn-sbmt {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;

    &:hover {
      background-color: #3a0bdc;
    }
  }
`


         


export default SetAvatar