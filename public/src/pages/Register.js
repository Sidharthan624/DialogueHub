import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import Logo from '../assets/logo.svg'
import { ToastContainer, toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios'
import { registerRoute } from "../utils/APIRoutes";

function Register() {
  const navigate = useNavigate()
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmpassword: ""
  })
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    draggable: true,
    pauseOnHover:true,
    theme: "dark"
  }
  useEffect( () => {
    if(localStorage.getItem('chat-app-user')){
      navigate('/')

    }

  },[]
    

  )
  const handleValidation = () => {
    const { username, email, password,confirmpassword } = values
    if(username.length < 3 ) {
      toast.error("Username should be atleast 3 characters long", toastOptions)
      return false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email", toastOptions);
      return false;
    } else if(password.length < 8) {
      toast.error("Password should be atleast 8 characters long", toastOptions)
      return false
    } else if(password !== confirmpassword) {
      toast.error("Passwords do not match", toastOptions)
      return false
    }
    return true
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    if(handleValidation()) {
      const { username, email, password } = values
      const {data} = await axios.post(registerRoute, {
        email,
        password,
        username
      })
      
      
      
      
      if(data.status === false) {
        
        toast.error(data.msg, toastOptions)
      }
      if(data.status === true) {
        
        
        localStorage.setItem('chat-app-user', JSON.stringify(data.user))
        navigate('/')
      }

    }
  };
  const handleChange = (e) => {
    setValues({...values,[e.target.name]:e.target.value})
  };

  return (
    <>
      <FormContainer>
        <form onSubmit={(event) => handleSubmit(event)} noValidate>
          <div className="brand">
            <img src={Logo} alt="" />
            <h1>DialogueHub</h1>
          </div>

          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            name="confirmpassword"
            placeholder="Confirm Password"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Register</button>
        </form>
        <span>
          Already a User? <Link to="/login">Login</Link>
        </span>
      </FormContainer>
      <ToastContainer />
    </>
  );
}
const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 0.5rem;
    padding: 3rem 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #9D00FF;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
    background-color: #9D00FF;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;


export default Register;
