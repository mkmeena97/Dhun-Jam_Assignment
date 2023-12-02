import '../styles/MyCSS.css'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = 'https://stg.dhunjam.in/account/admin/login';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`HTTP error! , Status: ${response.status}, Message: ${errorMessage}`);
      }

      const data = await response.json();
      navigate('/adminDashboard');
      console.log('Response:', data);

      // Call onLogin function with token or user data
    //   onLogin(data.token); // Assuming the response contains a token

      // Redirect to AdminDashboard after successful login
      localStorage.setItem("id",data.data.id)
      localStorage.setItem("token",data.data.token)
      navigate('/adminDashboard');
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <div className="container">
      <h1>Login Component</h1>
      <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        <br />
        <button type="submit">Login</button>
      </form>
      <p>New Registration? <a href="#">Register here</a></p>
    </div>
  );
};

export default Login;
