import { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import api from "../utils/api";
import Cookies from "js-cookie";
import HeaderLogado from "./HeaderLogado";

function Dashboard() {
    const [filmes, setFilmes] = useState([]);

    useEffect(() => {
        const carregarFilmes = async () => {
            const token = Cookies.get('token');
            try {
                const response = await api.get('/movie', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setFilmes(response.data);
            } catch (error) {
                console.error("Erro ao carregar filmes:", error);
            }
        };

        carregarFilmes();
    }, []);

    return (
        <>
            <HeaderLogado />
            <div className="dashboard-container">
                <div className="filmes-grid">
                    {filmes.map((filme) => (
                        <div key={filme.id} className="filme-card">
                            {filme.banner ? (
                                <img src={filme.banner} alt={filme.name} />
                            ) : (
                                <div className="placeholder">Sem imagem</div>
                            )}
                            <h3>{filme.name}</h3>
                            <p><strong>Gênero:</strong> {filme.gender}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Dashboard;
