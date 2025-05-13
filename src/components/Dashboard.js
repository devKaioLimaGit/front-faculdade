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
                genero: filme.genre_ids.join(", "),
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
                genero: filme.genre_ids.join(", "),
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

  return (
    <>
      <Header />
      <div className="dashboard-container">
        <div className="filmes-grid">
          {filmes.map((filme) => (
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
