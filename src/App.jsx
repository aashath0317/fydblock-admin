// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminOverview from './AdminOverview';
import UserManagement from './UserManagement';
import AdminBotManagement from './AdminBotManagement';
import AdminLogin from './AdminLogin';

// Higher-order component to protect admin routes
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<AdminLogin />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={<PrivateRoute><AdminOverview /></PrivateRoute>} />
      <Route path="/users" element={<PrivateRoute><UserManagement /></PrivateRoute>} />
      <Route path="/bots" element={<PrivateRoute><AdminBotManagement /></PrivateRoute>} />

      {/* Redirect root to dashboard (which will redirect to login if no token) */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;
