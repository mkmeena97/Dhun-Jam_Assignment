import React, { useState } from 'react';
import '../styles/MyCSS.css';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const Login = ({onLogin}) => {
  const[username, setUsername] = useState('');
  const[password,setPassword] = useState('');
  const navigate = useNavigate();
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   axios.post('https://stg.dhunjam.in/account/admin/login',
  //   {
  //     username,
  //     password,
  //   })
  //   .then(response=>{
  //     const token = response.data.data.token;
  //     onLogin(token);
  //   })
  //   .catch(error =>{
  //     console.error('Login Error:-',error);
  //   });
  // };
  const handleSubmit = () => {
    if (username === 'DJ@4' && password === 'Dhunjam@2023') {
      onLogin(true);
      navigate('/admin-dashboard');
    } else {
      onLogin(false);
    }
  };

  return (
    <div className="container">
      <h1>Venue Admin Login</h1>
      <form onSubmit={handleSubmit}>
        <input type="text"
         id="username" 
         placeholder="Enter your username" 
         value={username}
         onChange={(e)=>setUsername(e.target.value)}
         />

        <input
         type="password"
          id="password" 
          placeholder="Enter your password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
           />
        <button type="submit">Login</button>
      </form>

      <p>New Registration? <a href="#">Register here</a></p>
    </div>
  );
};

export default Login;
