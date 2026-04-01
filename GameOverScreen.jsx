import { LogoBadge } from '../ui/LogoBadge';
import { PrimaryButton } from '../ui/PrimaryButton';

export function GameOverScreen({ controller }) {
  const { session, actions } = controller;

  return (
    <main className="screen result-screen">
      <section className="glass-card result-card danger">
        <LogoBadge compact />
        <h2>Game Over</h2>
        <p>La academia te espera para otro intento. Repite el nivel, mejora tu score y vuelve más fuerte.</p>
        <div className="result-stats">
          <span>Score final: {session.score}</span>
          <span>Preguntas correctas: {session.correctAnswers}</span>
          <span>Preguntas respondidas: {session.totalAnswered}</span>
        </div>
        <div className="footer-actions">
          <PrimaryButton onClick={actions.retryLevel}>Intentar otra vez</PrimaryButton>
          <PrimaryButton variant="ghost" onClick={actions.exitGameOver}>
            Volver a niveles
          </PrimaryButton>
        </div>
      </section>
    </main>
  );
}
