import React from 'react';
import {Route, Routes } from 'react-router-dom'; 

import HomePage from './components/HomePage';
import RegistrationPage from './components/RegistrationPage';
import NotFound from './components/NotFound';
import LoginPage from './components/LoginPage';

function App() {
  return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} /> 
        <Route path="*" element={<NotFound />} /> 
      </Routes>
  );
}

export default App;
