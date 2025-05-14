import { useNavigate } from 'react-router-dom';
import './Notfound.css'; // se for separado, ou estilos inline/module

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <div className="notfound-card">
        <h1>404</h1>
        <p>Página não encontrada</p>
        <button className="btn-voltar" onClick={() => navigate('/')}>
          Voltar para o início
        </button>
      </div>
    </div>
  );
};

export default NotFound;
