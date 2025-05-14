import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import './MovieInfo.css';
import api from "../utils/api";
import { Bar } from "react-chartjs-2";
import "./LoadingSpinner.css"
import { Link } from "react-router-dom";
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

function MovieBot() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [distribuicaoNotas, setDistribuicaoNotas] = useState(null);

  useEffect(() => {
    const carregarDetalhes = async () => {
      try {
        const response = await api.post("/filter/movie", { id });
        const data = response.data;

        // Filtrando e categorizando avaliações
        const avaliacoes = data.reviews || [];

        const comentariosPositivos = avaliacoes
          .filter((r) => r.rating >= 7)
          .map((r) => ({ content: r.comment, rating: r.rating }));

        const comentariosNegativos = avaliacoes
          .filter((r) => r.rating <= 4)
          .map((r) => ({ content: r.comment, rating: r.rating }));

        const comentariosNeutros = avaliacoes
          .filter((r) => r.rating > 4 && r.rating < 7)
          .map((r) => ({ content: r.comment, rating: r.rating }));

        const notas = avaliacoes.map((r) => r.rating);

        // Montar gráfico
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
              backgroundColor: "rgba(153, 102, 255, 0.6)",
              borderColor: "rgba(153, 102, 255, 1)",
              borderWidth: 1,
            },
          ],
        };

        setDistribuicaoNotas(dadosGrafico);

        setMovie({
          ...data,
          comentariosPositivos,
          comentariosNegativos,
          comentariosNeutros,
          totalAvaliacoes: notas.length,
          percentualPositivas: notas.length ? ((comentariosPositivos.length / notas.length) * 100).toFixed(1) : 0,
          percentualNegativas: notas.length ? ((comentariosNegativos.length / notas.length) * 100).toFixed(1) : 0,
        });
      } catch (error) {
        console.error("Erro ao carregar detalhes do filme:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarDetalhes();
  }, [id]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Distribuição das Notas do Filme" },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Número de Avaliações" } },
      x: { title: { display: true, text: "Faixa de Notas" } },
    },
  }), []);

  const truncateText = (text, maxLength = 200) =>
    text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!movie) {
    return <p className="error">Filme não encontrado.</p>;
  }


  return (
    <div className="movie-info">
      <h2>{movie.name}</h2>
      <img src={movie.banner} alt={movie.name} className="movie-poster" />
      <p><strong>Ano:</strong> {movie.year}</p>
      <p><strong>Duração:</strong> {movie.duration}</p>
      <p><strong>Diretor:</strong> {movie.director}</p>
      <p><strong>Avaliação:</strong> {movie.assesment}/10</p>
      <p><strong>Sinopse:</strong> {movie.sinopse}</p>

      <div className="estatisticas-resumo">
        <h3>Resumo das Avaliações</h3>
        {/* <p><strong>Total de Avaliações:</strong> {movie.totalAvaliacoes}</p>
        <p><strong>Positivas (≥7):</strong> {movie.comentariosPositivos.length} ({movie.percentualPositivas}%)</p>
        <p><strong>Negativas (≤4):</strong> {movie.comentariosNegativos.length} ({movie.percentualNegativas}%)</p>
        <p><strong>Neutras (5-6):</strong> {movie.comentariosNeutros.length}</p> */}
        <a href={movie.link} target="_blank" rel="noopener noreferrer">
          Ver no IMDB
        </a>
                <a href={movie.star} target="_blank" rel="noopener noreferrer">
          Ver no Estrelas
        </a>
      </div>

      {/* <div className="grafico-estatisticas">
        <h3>Distribuição das Avaliações</h3>
        {distribuicaoNotas && movie.totalAvaliacoes > 0 ? (
          <Bar data={distribuicaoNotas} options={chartOptions} />
        ) : (
          <p>Nenhuma avaliação disponível para exibir o gráfico.</p>
        )}
      </div> */}

      {/* <div className="avaliacoes">
        <h3>Avaliações Positivas</h3>
        {movie.comentariosPositivos.length > 0 ? (
          <ul>
            {movie.comentariosPositivos.map((c, i) => (
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
        {movie.comentariosNegativos.length > 0 ? (
          <ul>
            {movie.comentariosNegativos.map((c, i) => (
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
        {movie.comentariosNeutros.length > 0 ? (
          <ul>
            {movie.comentariosNeutros.map((c, i) => (
              <li key={i}>
                <strong>Nota: {c.rating}/10</strong>
                <p>{truncateText(c.content)}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma avaliação neutra.</p>
        )}
      </div> */}

      <Link to="/bot" className="btn-voltar">
        Voltar
      </Link>
    </div>
  );
}

export default MovieBot;
