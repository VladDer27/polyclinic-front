import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Импортируем Routes и Route
import HomePage from './components/HomePage';
import RegistrationPage from './components/RegistrationPage';
import NotFound from './components/NotFound';
import LoginPage from './components/LoginPage';
import EditPatientPage from './components/patient/EditPatientPage';
import Appointments from './components/patient/Appointments';
import GuestToPatient from './components/guest/GuestToPatient';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} /> 
        <Route path="/patient/edit/:patientId" element={<EditPatientPage />} />
        <Route path="/patient/appointments/:patientId" element={<Appointments />} />
        <Route path="/guest/edit/:guestId" element={<GuestToPatient />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
