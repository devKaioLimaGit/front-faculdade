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
  const [ordemAlfabetica, setOrdemAlfabetica] = useState("");
  const [generosDisponiveis, setGenerosDisponiveis] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    const carregarFilmes = async () => {
      try {
        const [filmesResponse, generosResponse] = await Promise.all([
          axios.get(`${TMDB_BASE_URL}/movie/popular`, {
            params: {
              api_key: TMDB_API_KEY,
              language: "pt-BR",
              page: 1,
            },
          }),
          axios.get(`${TMDB_BASE_URL}/genre/movie/list`, {
            params: {
              api_key: TMDB_API_KEY,
              language: "pt-BR",
            },
          }),
        ]);

        const filmesPopulares = filmesResponse.data.results;
        const listaGeneros = generosResponse.data.genres;

        setGenerosDisponiveis(listaGeneros);

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
      filtrados.sort((a, b) => b.nota - a.nota);
    } else {
      filtrados.sort((a, b) => a.nota - b.nota);
    }

    if (ordemAlfabetica === "asc") {
      filtrados.sort((a, b) => a.nome.localeCompare(b.nome));
    } else if (ordemAlfabetica === "desc") {
      filtrados.sort((a, b) => b.nome.localeCompare(a.nome));
    }

    setFilmesFiltrados(filtrados);
  }, [filmes, generoSelecionado, ordemNota, ordemAlfabetica]);

  return (
    <>
      <Header />
      <div className="dashboard-container">
        <div className="filtros-container">
          {/* Filtro por Gênero - preenchido dinamicamente */}
          <label htmlFor="genero">Filtrar por gênero:</label>
          <select
            id="genero"
            value={generoSelecionado}
            onChange={(e) => setGeneroSelecionado(e.target.value)}
          >
            <option value="">Todos</option>
            {generosDisponiveis.map((genero) => (
              <option key={genero.id} value={genero.id.toString()}>
                {genero.name}
              </option>
            ))}
          </select>

          {/* Filtro por nota */}
          <label htmlFor="ordemNota">Ordenar por nota:</label>
          <select
            id="ordemNota"
            value={ordemNota}
            onChange={(e) => setOrdemNota(e.target.value)}
          >
            <option value="desc">Mais avaliados</option>
            <option value="asc">Menos avaliados</option>
          </select>

          {/* Filtro por ordem alfabética */}
          <label htmlFor="ordemAlfabetica">Ordenar por nome:</label>
          <select
            id="ordemAlfabetica"
            value={ordemAlfabetica}
            onChange={(e) => setOrdemAlfabetica(e.target.value)}
          >
            <option value="">Sem ordem</option>
            <option value="asc">A-Z</option>
            <option value="desc">Z-A</option>
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
