import React from 'react';
import Login from './components/Login';
import { Link, Route, Router, Routes } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';


function App() {
  return (
    <div>
      <Link to={Login}>Login</Link>
      <Router>
        <Routes>
          <Route path='/admin-dashboard' element={AdminDashboard}/>
        </Routes> 
      </Router>
    </div>  
  );
}

export default App;
