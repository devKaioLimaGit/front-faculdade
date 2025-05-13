import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import './MovieInfo.css';
import "./LoadingSpinner.css"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY || "bc0820000620dc88604fb3d1f8418bc7";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const FALLBACK_IMAGE = "https://via.placeholder.com/500x750?text=No+Poster";

function MovieInfo() {
  const { id } = useParams();
  const [filme, setFilme] = useState(null);
  const [distribuicaoNotas, setDistribuicaoNotas] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDetalhes = async () => {
      setLoading(true);
      setError(null);
      try {
        const [detalhesRes, reviewsRes] = await Promise.all([
          axios.get(`${TMDB_BASE_URL}/movie/${id}`, {
            params: { api_key: TMDB_API_KEY, language: "pt-BR" },
          }),
          axios.get(`${TMDB_BASE_URL}/movie/${id}/reviews`, {
            params: { api_key: TMDB_API_KEY, language: "pt-BR" },
          }),
        ]);

        let reviews = reviewsRes.data.results || [];

        // Fallback to English reviews if pt-BR has too few results
        if (reviews.length < 3) {
          const englishReviewsRes = await axios.get(`${TMDB_BASE_URL}/movie/${id}/reviews`, {
            params: { api_key: TMDB_API_KEY, language: "en-US" },
          });
          reviews = englishReviewsRes.data.results || [];
        }

        // Process reviews
        const comentariosPositivos = reviews
          .filter((r) => r.author_details?.rating >= 7)
          .map((r) => ({ content: r.content, rating: r.author_details.rating || "N/A" }));

        const comentariosNegativos = reviews
          .filter((r) => r.author_details?.rating <= 4)
          .map((r) => ({ content: r.content, rating: r.author_details.rating || "N/A" }));

        const comentariosNeutros = reviews
          .filter((r) => r.author_details?.rating > 4 && r.author_details.rating < 7)
          .map((r) => ({ content: r.content, rating: r.author_details.rating || "N/A" }));

        const notas = reviews
          .filter((r) => r.author_details?.rating)
          .map((r) => r.author_details.rating);

        // Calculate rating distribution
        const faixas = { "1-2": 0, "3-4": 0, "5-6": 0, "7-8": 0, "9-10": 0 };
        notas.forEach((nota) => {
          if (nota <= 2) faixas["1-2"]++;
          else if (nota <= 4) faixas["3-4"]++;
          else if (nota <= 6) faixas["5-6"]++;
          else if (nota <= 8) faixas["7-8"]++;
          else faixas["9-10"]++;
        });

        const dadosGrafico = {
          labels: Object.keys(faixas),
          datasets: [
            {
              label: "Quantidade de Avaliações",
              data: Object.values(faixas),
              backgroundColor: "rgba(255, 206, 86, 0.6)",
              borderColor: "rgba(255, 206, 86, 1)",
              borderWidth: 1,
            },
          ],
        };

        setDistribuicaoNotas(dadosGrafico);

        // Format release date
        const dataLancamento = new Date(detalhesRes.data.release_date).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });

        // Ensure all filme properties are initialized
        setFilme({
          titulo: detalhesRes.data.title || "Título não disponível",
          sinopse: detalhesRes.data.overview || "Sinopse não disponível.",
          nota: detalhesRes.data.vote_average ? detalhesRes.data.vote_average.toFixed(1) : "N/A",
          imagem: detalhesRes.data.poster_path
            ? `https://image.tmdb.org/t/p/w500${detalhesRes.data.poster_path}`
            : FALLBACK_IMAGE,
          dataLancamento: dataLancamento || "Data não disponível",
          generos: detalhesRes.data.genres?.map((g) => g.name).join(", ") || "Gêneros não disponíveis",
          comentariosPositivos: comentariosPositivos || [],
          comentariosNegativos: comentariosNegativos || [],
          comentariosNeutros: comentariosNeutros || [],
          totalAvaliacoes: reviews.length || 0,
          percentualPositivas: notas.length
            ? ((comentariosPositivos.length / notas.length) * 100).toFixed(1)
            : 0,
          percentualNegativas: notas.length
            ? ((comentariosNegativos.length / notas.length) * 100).toFixed(1)
            : 0,
        });

        // Debug logging
        console.log("Filme state:", {
          comentariosPositivos,
          comentariosNegativos,
          comentariosNeutros,
          totalAvaliacoes: reviews.length,
        });
      } catch (error) {
        console.error("Erro ao carregar detalhes do filme:", error);
        setError("Não foi possível carregar os detalhes do filme. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    carregarDetalhes();
  }, [id]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: { display: true, text: "Distribuição das Notas do Filme" },
      },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: "Número de Avaliações" } },
        x: { title: { display: true, text: "Faixa de Notas" } },
      },
    }),
    []
  );

  const truncateText = (text, maxLength = 200) =>
    text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

if (loading) {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
    </div>
  );
}
  if (error) return <p className="error">{error}</p>;
  if (!filme) return <p className="error">Nenhum dado disponível.</p>;

  return (
    <div className="movie-info">
      <h2>{filme.titulo}</h2>
      <img src={filme.imagem} alt={filme.titulo} className="movie-poster" />
      <p><strong>Lançamento:</strong> {filme.dataLancamento}</p>
      <p><strong>Gêneros:</strong> {filme.generos}</p>
      <p><strong>Nota Média:</strong> {filme.nota} / 10</p>
      <p><strong>Sinopse:</strong> {filme.sinopse}</p>

      <div className="estatisticas-resumo">
        <h3>Resumo das Avaliações</h3>
        <p><strong>Total de Avaliações:</strong> {filme.totalAvaliacoes}</p>
        <p>
          <strong>Positivas (≥7):</strong>{" "}
          {(filme.comentariosPositivos || []).length} ({filme.percentualPositivas}%)
        </p>
        <p>
          <strong>Negativas (≤4):</strong>{" "}
          {(filme.comentariosNegativas || []).length} ({filme.percentualNegativas}%)
        </p>
        <p>
          <strong>Neutras (5-6):</strong> {(filme.comentariosNeutros || []).length}
        </p>
      </div>

      <div className="grafico-estatisticas">
        <h3>Distribuição das Avaliações</h3>
        {distribuicaoNotas && filme.totalAvaliacoes > 0 ? (
          <Bar data={distribuicaoNotas} options={chartOptions} />
        ) : (
          <p>Nenhuma avaliação disponível para exibir o gráfico.</p>
        )}
      </div>

      <div className="avaliacoes">
        <h3>Avaliações Positivas</h3>
        {(filme.comentariosPositivos || []).length > 0 ? (
          <ul>
            {(filme.comentariosPositivos || []).map((c, i) => (
              <li key={i}>
                <strong>Nota: {c.rating}/10</strong>
                <p>{truncateText(c.content)}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma avaliação positiva.</p>
        )}

        <h3>Avaliações Negativas</h3>
        {(filme.comentariosNegativas || []).length > 0 ? (
          <ul>
            {(filme.comentariosNegativas || []).map((c, i) => (
              <li key={i}>
                <strong>Nota: {c.rating}/10</strong>
                <p>{truncateText(c.content)}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma avaliação negativa.</p>
        )}

        <h3>Avaliações Neutras</h3>
        {(filme.comentariosNeutros || []).length > 0 ? (
          <ul>
            {(filme.comentariosNeutros || []).map((c, i) => (
              <li key={i}>
                <strong>Nota: {c.rating}/10</strong>
                <p>{truncateText(c.content)}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma avaliação neutra.</p>
        )}
      </div>
    </div>
  );
}

export default MovieInfo;