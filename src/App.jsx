import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminOverview from './AdminOverview';
import UserManagement from './UserManagement';
import AdminBotManagement from './AdminBotManagement';

// Simple placeholder for login if you haven't built a separate admin login yet
const AdminLogin = () => (
  <div className="h-screen flex items-center justify-center text-gray-500">
    Please login via the main app or implement standalone admin auth here.
  </div>
);

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<AdminOverview />} />
      <Route path="/users" element={<UserManagement />} />
      <Route path="/bots" element={<AdminBotManagement />} />
      <Route path="/login" element={<AdminLogin />} />
    </Routes>
  );
};

export default App;
