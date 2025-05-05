// src/utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://faculdade-cv39.onrender.com',  // Substitua pela URL base do seu backend
  // baseURL: 'http://localhost:8080', 
});

export default api;
