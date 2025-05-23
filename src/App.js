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
import MovieInfo from './components/MovieInfo';
import Movie from './components/Movie';
import MovieBot from './components/MovieBot';
import Documents from './components/Documents';
import NotFound from './components/Notfound';
const App = () => {
  return (
    <Router>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/bot" element={<Movie />} />
        <Route path="/signin" element={<LoginPage />} />
        <Route path="/signup" element={<CreateUser />} />
        <Route path="/assessment" element={<AssessmentForm />} />
        <Route
          path="/api"
          element={
            <PrivateRoute>
              <Documents/>
            </PrivateRoute>
          }
        />

        <Route
          path="/movie/info/:id"
          element={
              <MovieInfo />
          }
        />
        <Route
          path="/movie/bot/info/:id"
          element={
              <MovieBot/>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
