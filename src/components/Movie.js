import { useEffect, useState } from "react";
import "./Dashboard.css";
import AOS from "aos";
import "aos/dist/aos.css";
import api from "../utils/api";
import Header from "./Header";
import { Link } from "react-router-dom";

function Movie() {
    const [filmes, setFilmes] = useState([]);
    const [filmesFiltrados, setFilmesFiltrados] = useState([]);
    const [diretorSelecionado, setDiretorSelecionado] = useState("");
    const [anoSelecionado, setAnoSelecionado] = useState("");
    const [duracaoSelecionada, setDuracaoSelecionada] = useState("");
    const [ordemNota, setOrdemNota] = useState("desc");
    const [ordemAlfabetica, setOrdemAlfabetica] = useState("");

    useEffect(() => {
        AOS.init({ duration: 1000, once: true });

        const carregarFilmes = async () => {
            try {
                const response = await api.get("/movie");
                setFilmes(response.data);
            } catch (error) {
                console.error("Erro ao carregar filmes:", error);
            }
        };

        carregarFilmes();
    }, []);

    useEffect(() => {
        let filtrados = [...filmes];

        if (diretorSelecionado) {
            filtrados = filtrados.filter((filme) => filme.director === diretorSelecionado);
        }

        if (anoSelecionado) {
            filtrados = filtrados.filter((filme) => filme.year === anoSelecionado);
        }

        if (duracaoSelecionada) {
            filtrados = filtrados.filter((filme) => filme.duration === duracaoSelecionada);
        }

        if (ordemNota === "desc") {
            filtrados.sort((a, b) => b.assesment - a.assesment);
        } else {
            filtrados.sort((a, b) => a.assesment - b.assesment);
        }

        if (ordemAlfabetica === "asc") {
            filtrados.sort((a, b) => a.name.localeCompare(b.name));
        } else if (ordemAlfabetica === "desc") {
            filtrados.sort((a, b) => b.name.localeCompare(a.name));
        }

        setFilmesFiltrados(filtrados);
    }, [filmes, diretorSelecionado, anoSelecionado, duracaoSelecionada, ordemNota, ordemAlfabetica]);

    // Valores únicos para filtros
    const diretores = [...new Set(filmes.map((f) => f.director).filter(Boolean))];
    const anos = [...new Set(filmes.map((f) => f.year).filter(Boolean))];
    const duracoes = [...new Set(filmes.map((f) => f.duration).filter(Boolean))];

    return (
        <>
            <Header />
            <div className="dashboard-container">
                <div className="filtros-container">
                    {/* Diretor */}
                    <label htmlFor="diretor">Filtrar por diretor:</label>
                    <select
                        id="diretor"
                        value={diretorSelecionado}
                        onChange={(e) => setDiretorSelecionado(e.target.value)}
                    >
                        <option value="">Todos</option>
                        {diretores.map((diretor, index) => (
                            <option key={index} value={diretor}>{diretor}</option>
                        ))}
                    </select>

                    {/* Ano */}
                    <label htmlFor="ano">Filtrar por ano:</label>
                    <select
                        id="ano"
                        value={anoSelecionado}
                        onChange={(e) => setAnoSelecionado(e.target.value)}
                    >
                        <option value="">Todos</option>
                        {anos.map((ano, index) => (
                            <option key={index} value={ano}>{ano}</option>
                        ))}
                    </select>

                    {/* Duração */}
                    <label htmlFor="duracao">Filtrar por duração:</label>
                    <select
                        id="duracao"
                        value={duracaoSelecionada}
                        onChange={(e) => setDuracaoSelecionada(e.target.value)}
                    >
                        <option value="">Todas</option>
                        {duracoes.map((duracao, index) => (
                            <option key={index} value={duracao}>{duracao}</option>
                        ))}
                    </select>

                    {/* Ordem por nota */}
                    <label htmlFor="ordemNota">Ordenar por nota:</label>
                    <select
                        id="ordemNota"
                        value={ordemNota}
                        onChange={(e) => setOrdemNota(e.target.value)}
                    >
                        <option value="desc">Mais avaliados</option>
                        <option value="asc">Menos avaliados</option>
                    </select>

                    {/* Ordem alfabética */}
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
                    {filmesFiltrados.map((filme, index) => (
                        <div key={index} className="filme-card" data-aos="fade-up">
                            <img src={filme.banner} alt={filme.name} className="img" />
                            <h3>{filme.name}</h3>
                            <Link to={`/movie/bot/info/${filme.id}`}>
                                <button className="btn-saiba-mais">Saiba mais</button>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Movie;
