import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./AssessmentForm.css";
import api from "../utils/api";
import Header from "./Header";
const AssessmentForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    sexo: "",
    gender: "",
    comment: ""
  });

  

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };


  const [button , setButton] = useState(false)


  const handleSubmit = async (e) => {
    e.preventDefault();
    setButton(true);
    try {
      await api.post("/assessment", formData);
      toast.success("Avaliação enviada com sucesso!");
      setFormData({ name: "", email: "", sexo: "", gender: "", comment: "" });
      setButton(false);
    } catch (err) {
      toast.error(err.response?.data?.error || "Erro ao enviar avaliação");
    }
  };

  return (
    <>
    <Header/>
    <div className="login-container">
      <div className="overlay"></div>
      <form className="login-box" onSubmit={handleSubmit}>
        <h2 className="login-title">Formulário de Avaliação</h2>

        <input
          type="text"
          name="name"
          placeholder="Nome"
          className="login-input"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="E-mail"
          className="login-input"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <select
          name="sexo"
          className="login-input"
          value={formData.sexo}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Selecione seu sexo</option>
          <option value="Masculino">Masculino</option>
          <option value="Feminino">Feminino</option>
        </select>

        <select
          name="gender"
          className="login-input"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Gênero de Filme Favorito</option>
          <option value="Ação">Ação</option>
          <option value="Aventura">Aventura</option>
          <option value="Comédia">Comédia</option>
          <option value="Drama">Drama</option>
          <option value="Terror">Terror</option>
          <option value="Suspense">Suspense</option>
          <option value="Romance">Romance</option>
          <option value="Ficção Científica">Ficção Científica</option>
          <option value="Animação">Animação</option>
        </select>

        <textarea
          name="comment"
          placeholder="Deixe um comentário sobre por que você gosta desse gênero"
          className="login-input"
          rows="4"
          value={formData.comment}
          onChange={handleChange}
          required
        />
        
        {button ? <button type="submit" className="login-button" disabled>Por Favor Aguarde...</button> :  <button type="submit" className="login-button">Enviar Avaliação</button>}

      </form>
    </div>
    </>
  );
};

export default AssessmentForm;
