import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <div>
      <Routes>
        {/* Define routes for Login and AdminDashboard */}
        <Route path="/" element={<Login />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
