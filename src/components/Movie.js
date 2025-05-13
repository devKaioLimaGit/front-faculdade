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
    const [generoSelecionado, setGeneroSelecionado] = useState("");
    const [ordemNota, setOrdemNota] = useState("desc");

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

        if (generoSelecionado) {
            filtrados = filtrados.filter((filme) => filme.gender === generoSelecionado);
        }

        if (ordemNota === "desc") {
            filtrados.sort((a, b) => b.assesment - a.assesment);
        } else {
            filtrados.sort((a, b) => a.assesment - b.assesment);
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
                        <option value="Ação">Ação</option>
                        <option value="Comédia">Comédia</option>
                        <option value="Drama">Drama</option>
                        <option value="Romance">Romance</option>
                        <option value="Terror">Terror</option>
                        <option value="Animação">Animação</option>
                        <option value="Aventura">Aventura</option>
                        <option value="Ficção Científica">Ficção Científica</option>
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
