import "./Documents.css";
import HeaderLogado from "./HeaderLogado";

export default function Documents() {
  return (
    <>
      <HeaderLogado />
      <div className="documents-container">
        <h1 className="title">📄 Documentação - Bot Scraper de Filmes (IMDB)</h1>

        <section className="section">
          <h2 className="section-title">🔧 O que este software faz?</h2>
          <p>
            Este bot automatiza a extração de informações de filmes diretamente do <strong>IMDb</strong>.
            Ao fornecer um arquivo <code>.txt</code> com nomes de filmes, o sistema:
          </p>
          <ul>
            <li>Busca automaticamente os filmes no IMDb</li>
            <li>Coleta dados como título, ano, nota, duração, diretor, sinopse e imagem do pôster</li>
            <li>Gera um arquivo <code>.json</code> com os dados coletados</li>
            <li>Envia os dados para uma API backend usando <code>POST</code></li>
          </ul>
        </section>

        <section className="section">
          <h2 className="section-title">📁 Como usar?</h2>
          <ol>
            <li>Arraste e solte um arquivo <code>.txt</code> contendo os nomes dos filmes</li>
            <li>O bot inicia automaticamente a coleta de dados no IMDb</li>
            <li>Um log em tempo real é exibido na tela</li>
            <li>O JSON com os dados será salvo no mesmo diretório do arquivo de entrada</li>
          </ol>
        </section>

        <section className="section">
          <h2 className="section-title">📦 Tecnologias utilizadas</h2>
          <ul>
            <li><strong>Selenium</strong> – para automação do navegador</li>
            <li><strong>Pandas</strong> – para leitura do arquivo TXT</li>
            <li><strong>Requests</strong> – para envio dos dados à API</li>
            <li><strong>Tkinter</strong> – para interface gráfica do usuário</li>
          </ul>
        </section>

        <section className="section">
          <h2 className="section-title">🌐 Consumir a API de Filmes</h2>
          <p>
            Caso queira consumir nossa API de filmes em seu projeto, é muito simples!
            Basta utilizar a URL abaixo para obter todos os dados em formato <code>JSON</code>:
          </p>
          <pre className="api-url">
            https://faculdade-cv39.onrender.com/movie
          </pre>
        </section>

        <section className="section">
  <h2 className="section-title">📥 Download do software</h2>
  <p>
    Clique no botão abaixo para baixar o software em formato <code>.zip</code> contendo todos os arquivos necessários:
  </p>
  <a
    href="https://github.com/devKaioLimaGit/Cinemato.Graphy/tree/main"
    target="_black"
    className="download-button"
  >
    ⬇️ Baixar Bot Scraper de Filmes
  </a>
  <p style={{ marginTop: "10px" }}>
    <strong>⚠️ Atenção:</strong> Após o download, extraia o conteúdo do arquivo <code>.zip</code> diretamente na pasta <code>C:\</code> do seu sistema. Isso é necessário para que o bot funcione corretamente com os caminhos pré-configurados.
  </p>
  <p style={{ marginTop: "10px" }}>
    <strong>🧩 Dica:</strong> Caso ocorra algum erro ao iniciar o bot ou ao abrir o navegador, verifique se o <strong>Mozilla Firefox</strong> está instalado em seu sistema. O bot utiliza o Firefox para automação via Selenium. A instalação não é obrigatória, mas pode ser necessária caso o navegador não esteja presente ou o caminho esteja incorreto.
  </p>
</section>


      </div>
    </>
  );
}
