import React from 'react';
import '../styles/MyCSS.css';

const Login = () => {
  return (
    <div className="container">
      <h1>Venue Admin Login</h1>
      <form action="#">
        <input type="text" placeholder="Username" />
        <br />
        <input type="password" placeholder="Password" />
        <br />
        <input type="submit" value="Login" />
      </form>
      <br />
      <a>New Registration?</a>
    </div>
  );
};

export default Login;
