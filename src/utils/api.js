// src/utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://faculdade-3znz.onrender.com',  // Substitua pela URL base do seu backend
});

export default api;
