import { LogoBadge } from '../ui/LogoBadge';
import { PrimaryButton } from '../ui/PrimaryButton';
import { StatPill } from '../ui/StatPill';

export function HomeScreen({ controller }) {
  const { player, progress, firebaseEnabled, actions } = controller;

  return (
    <main className="screen home-screen">
      <div className="orb orb-a" />
      <div className="orb orb-b" />

      <section className="hero-panel glass-card">
        <LogoBadge />
        <p className="hero-copy">
          Un shooter arcade educativo en el que cada disparo te acerca a dominar el inglés
          con vocabulario, gramática, bosses y retos progresivos.
        </p>

        <div className="hero-stats">
          <StatPill label="Niveles" value="16" />
          <StatPill label="Modo" value="Práctica + Torneo" accent="cyan" />
          <StatPill label="Guardado" value={firebaseEnabled ? 'Firebase' : 'Mock local'} accent="gold" />
        </div>

        <div className="hero-actions">
          <PrimaryButton onClick={player ? actions.goToLevels : actions.goToRegister}>
            {player ? 'Continuar aventura' : 'Comenzar ahora'}
          </PrimaryButton>
          <PrimaryButton variant="secondary" onClick={actions.goToLeaderboard}>
            Ver leaderboard
          </PrimaryButton>
          <PrimaryButton variant="ghost" onClick={actions.goToProfile}>
            Perfil del estudiante
          </PrimaryButton>
        </div>

        {player && (
          <div className="welcome-strip">
            <strong>{player.name}</strong>
            <span>Grupo {player.group}</span>
            <span>Mejor score: {progress.bestScore}</span>
            <span>Nivel desbloqueado: {progress.unlockedLevel}</span>
          </div>
        )}
      </section>

      <section className="feature-grid">
        <article className="glass-card feature-card">
          <h3>Shooting + Inglés</h3>
          <p>Golpea enemigos, responde en inglés y vuelve a la acción sin perder ritmo.</p>
        </article>
        <article className="glass-card feature-card">
          <h3>Dificultad adaptable</h3>
          <p>El juego ajusta velocidad, ayudas y tiempo para acompañar al estudiante.</p>
        </article>
        <article className="glass-card feature-card">
          <h3>Ideal para clase</h3>
          <p>Botones grandes, lectura clara y diseño apto para móvil, desktop y proyector.</p>
        </article>
      </section>
    </main>
  );
}
