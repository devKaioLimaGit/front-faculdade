import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import "./Dashboard.css";
import Header from "./Header";

const TMDB_API_KEY = "bc0820000620dc88604fb3d1f8418bc7";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

function Dashboard() {
  const [filmes, setFilmes] = useState([]);
  const [filmesFiltrados, setFilmesFiltrados] = useState([]);
  const [generoSelecionado, setGeneroSelecionado] = useState("");
  const [ordemNota, setOrdemNota] = useState("desc");

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    const carregarFilmes = async () => {
      try {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
          params: {
            api_key: TMDB_API_KEY,
            language: "pt-BR",
            page: 1,
          },
        });

        const filmesPopulares = response.data.results;

        const filmesComReviews = await Promise.all(
          filmesPopulares.map(async (filme) => {
            try {
              const reviewsRes = await axios.get(
                `${TMDB_BASE_URL}/movie/${filme.id}/reviews`,
                {
                  params: { api_key: TMDB_API_KEY, language: "pt-BR" },
                }
              );

              const reviews = reviewsRes.data.results;
              const comentariosPositivos = reviews
                .filter(
                  (review) =>
                    review.author_details.rating !== null &&
                    review.author_details.rating >= 7
                )
                .map((review) => review.content);

              const comentariosNegativos = reviews
                .filter(
                  (review) =>
                    review.author_details.rating !== null &&
                    review.author_details.rating <= 4
                )
                .map((review) => review.content);

              return {
                id: filme.id,
                nome: filme.title,
                banner: filme.poster_path
                  ? `https://image.tmdb.org/t/p/w500${filme.poster_path}`
                  : null,
                nota: filme.vote_average,
                genero: filme.genre_ids.map(String),
                comentariosPositivos,
                comentariosNegativos,
              };
            } catch (error) {
              console.error("Erro ao buscar reviews:", error);
              return {
                id: filme.id,
                nome: filme.title,
                banner: filme.poster_path
                  ? `https://image.tmdb.org/t/p/w500${filme.poster_path}`
                  : null,
                nota: filme.vote_average,
                genero: filme.genre_ids.map(String),
                comentariosPositivos: [],
                comentariosNegativos: [],
              };
            }
          })
        );

        setFilmes(filmesComReviews);
      } catch (error) {
        console.error("Erro ao carregar filmes da TMDb:", error);
      }
    };

    carregarFilmes();
  }, []);

  useEffect(() => {
    let filtrados = [...filmes];

    if (generoSelecionado) {
      filtrados = filtrados.filter((filme) =>
        filme.genero.includes(generoSelecionado)
      );
    }

    if (ordemNota === "desc") {
      filtrados.sort((a, b) => b.nota - a.nota); // nota maior primeiro
    } else {
      filtrados.sort((a, b) => a.nota - b.nota); // nota menor primeiro
    }

    setFilmesFiltrados(filtrados);
  }, [filmes, generoSelecionado, ordemNota]);

  return (
    <>
      <Header />
      <div className="dashboard-container">
        <div className="filtros-container">
          <label htmlFor="genero">Filtrar por gênero:</label>
          <select
            id="genero"
            value={generoSelecionado}
            onChange={(e) => setGeneroSelecionado(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="28">Ação</option>
            <option value="35">Comédia</option>
            <option value="18">Drama</option>
            <option value="10749">Romance</option>
            <option value="27">Terror</option>
            <option value="16">Animação</option>
            <option value="12">Aventura</option>
            <option value="878">Ficção Científica</option>
          </select>

          <label htmlFor="ordemNota">Ordenar por nota:</label>
          <select
            id="ordemNota"
            value={ordemNota}
            onChange={(e) => setOrdemNota(e.target.value)}
          >
            <option value="desc">Mais avaliados</option>
            <option value="asc">Menos avaliados</option>
          </select>
        </div>

        <div className="filmes-grid">
          {filmesFiltrados.map((filme) => (
            <div key={filme.id} className="filme-card" data-aos="fade-up">
              {filme.banner ? (
                <img className="img" src={filme.banner} alt={filme.nome} />
              ) : (
                <div className="placeholder">Sem imagem</div>
              )}
              <h3>{filme.nome}</h3>
              <Link to={`/movie/info/${filme.id}`}>
                <button className="btn-saiba-mais">Saiba mais</button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
