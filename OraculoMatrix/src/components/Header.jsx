function Header({ currentPage, goToPage }) {
  const links = [
    { id: "inicio", label: "Início" },
    { id: "orientacao", label: "Orientação" },
    { id: "perguntas", label: "Teste" },
    { id: "pilulas", label: "Pílulas" },
    { id: "sobre", label: "Sobre" },
  ];

  return (
    <header className="header">
      <button type="button" className="brand" onClick={() => goToPage("inicio")} aria-label="Voltar para a tela inicial">
        <span className="brand-mark">Ω</span>
        <span>Oráculo Matrix</span>
      </button>

      <nav className="nav" aria-label="Navegação principal">
        {links.map((link) => (
          <button
            key={link.id}
            type="button"
            className={currentPage === link.id ? "nav-link active" : "nav-link"}
            onClick={() => goToPage(link.id)}
            aria-current={currentPage === link.id ? "page" : undefined}
          >
            {link.label}
          </button>
        ))}
      </nav>
    </header>
  );
}

export default Header;
