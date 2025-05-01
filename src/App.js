import React from 'react';
import "./App.css"
import { ToastContainer, toast } from 'react-toastify';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import CreateUser from './components/CreateUser';
import AssessmentForm from './components/AssessmentForm';

const App = () => {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} />

      <Routes>
        <Route path="/signin" element={<LoginPage />} />
        <Route path="/signup" element={<CreateUser />} />
        <Route path="/assessment" element={<AssessmentForm />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        {/* Outras rotas podem ser adicionadas aqui */}
      </Routes>
    </Router>
  );
};

export default App;
