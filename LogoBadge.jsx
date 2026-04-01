export function LogoBadge({ compact = false }) {
  return (
    <div className={`logo-badge ${compact ? 'compact' : ''}`}>
      <img src="/expressive-logo.png" alt="Logo de Expressive English Academy" />
      <div>
        <p>Videojuego educativo arcade</p>
        <h1>Los Juegos de Expressive English Academy</h1>
      </div>
    </div>
  );
}
