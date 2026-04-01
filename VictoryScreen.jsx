import { LogoBadge } from '../ui/LogoBadge';
import { PrimaryButton } from '../ui/PrimaryButton';

export function VictoryScreen({ controller }) {
  const { currentLevel, session, actions } = controller;
  const stars = session.score >= 1500 ? 3 : session.score >= 900 ? 2 : 1;

  return (
    <main className="screen result-screen">
      <section className="glass-card result-card success">
        <LogoBadge compact />
        <h2>¡Nivel superado!</h2>
        <p>
          Has vencido a <strong>{currentLevel.bossName}</strong> y completaste el contenido de{' '}
          <strong>{currentLevel.title}</strong>.
        </p>
        <div className="celebration-stars">{'⭐'.repeat(stars)}</div>
        <div className="result-stats">
          <span>Score: {session.score}</span>
          <span>Vidas: {session.lives}</span>
          <span>Tiempo restante: {Math.round(session.timeLeft)}s</span>
        </div>
        <div className="footer-actions">
          <PrimaryButton onClick={actions.closeVictory}>Seguir con más niveles</PrimaryButton>
          <PrimaryButton variant="secondary" onClick={actions.retryLevel}>
            Repetir
          </PrimaryButton>
        </div>
      </section>
    </main>
  );
}
