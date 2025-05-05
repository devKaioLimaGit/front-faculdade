import React, { useState } from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./AssessmentForm.css";
import api from "../utils/api";
import HeaderLogado from "./HeaderLogado";

const CreateFilme = () => {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    sinopse: ""
  });

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [button, setButton] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile && selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButton(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("gender", formData.gender);
      data.append("sinopse", formData.sinopse);
      if (file) {
        data.append("file", file);
      }

      await api.post("/movie", data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      toast.success("Filme enviado com sucesso!");
      setFormData({ name: "", gender: "", sinopse: "" });
      setFile(null);
      setPreviewUrl(null);
      setButton(false);
    } catch (err) {
      toast.error(err.response?.data?.error || "Erro ao enviar filme");
      setButton(false);
    }
  };

  return (
    <>
    <HeaderLogado/>
    <div className="login-container">
      <div className="overlay"></div>
      <form className="login-box" onSubmit={handleSubmit}>
        <h2 className="login-title">Cadastrar Novo Filme</h2>

        <input
          type="text"
          name="name"
          placeholder="Nome do Filme"
          className="login-input"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <select
          name="gender"
          className="login-input"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Gênero do Filme</option>
          <option value="Ação">Ação</option>
          <option value="Fantasia">Fantasia</option>
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
          name="sinopse"
          placeholder="Sinopse do Filme"
          className="login-input"
          rows="4"
          value={formData.sinopse}
          onChange={handleChange}
          required
        />

        <input
          type="file"
          name="file"
          className="login-input"
          onChange={handleFileChange}
          accept="image/*"
          required
        />

        {previewUrl && (
          <div style={{ margin: "10px 0" }}>
            <img
              src={previewUrl}
              alt="Pré-visualização"
              style={{ width: "100%", maxWidth: "300px", borderRadius: "8px" }}
            />
          </div>
        )}

        <button type="submit" className="login-button" disabled={button}>
          {button ? "Por Favor Aguarde..." : "Cadastrar Filme"}
        </button>
      </form>
    </div>
    </>
    
  );
};

export default CreateFilme;
