import React from 'react';
import "./App.css"
import { ToastContainer, toast } from 'react-toastify';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import CreateUser from './components/CreateUser';
import AssessmentForm from './components/AssessmentForm';
import CreateFilme from './components/CreateFilme';
import Footer from './components/Footer';
const App = () => {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} />

      <Routes>
        <Route path="/" element={<AssessmentForm />} />
        <Route path="/api" element={<PrivateRoute>
          <CreateFilme />
        </PrivateRoute>} />
        <Route path="/signin" element={<LoginPage />} />
        <Route path="/signup" element={<CreateUser />} />
        <Route path="/assessment" element={<AssessmentForm />} />
        <Route
          path="/movie"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
      <Footer/>
    </Router>
  );
};

export default App;
