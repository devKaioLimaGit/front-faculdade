import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";
import Cookies from "js-cookie";

function Dashboard() {
    const [filmes, setFilmes] = useState([]);
    const navigate = useNavigate();

    const handleLogout = () => {
        Cookies.remove('token'); // Remove o token
        navigate('/signin'); // Redireciona para a página de login
    };

    useEffect(() => {
        const carregarFilmes = async () => {
            try {
                const response = await axios.get("https://api.themoviedb.org/3/movie/now_playing", {
                    params: {
                        api_key: "bc0820000620dc88604fb3d1f8418bc7",
                        language: "pt-BR",
                        page: 1,
                    }
                });

                setFilmes(response.data.results);
            } catch (error) {
                console.error("Erro ao carregar filmes:", error);
            }
        };

        carregarFilmes();
    }, []);

    return (
        <div className="dashboard-container">
            <button onClick={handleLogout}>Logout</button>
            <h1>Filmes em Cartaz</h1>
            <div className="filmes-grid">
                {filmes.map((filme) => (
                    <div key={filme.id} className="filme-card">
                        {filme.poster_path ? (
                            <img
                                src={`https://image.tmdb.org/t/p/w300${filme.poster_path}`}
                                alt={filme.title}
                            />
                        ) : (
                            <div className="placeholder">Sem imagem</div>
                        )}
                        <h3>{filme.title}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;
