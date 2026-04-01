import { LogoBadge } from '../ui/LogoBadge';
import { PrimaryButton } from '../ui/PrimaryButton';

export function CelebrationScreen({ controller }) {
  const { player, actions } = controller;

  return (
    <main className="screen celebration-screen">
      <div className="confetti-layer" />
      <section className="glass-card result-card success">
        <LogoBadge />
        <h2>¡Academy Challenge completado!</h2>
        <p>
          {player?.name || 'Estudiante'}, completaste la ruta completa de la academia. Tu inglés y
          tu puntería crecieron juntos.
        </p>
        <div className="celebration-stars">🏆 ⭐ 🎓 ⭐ 🏆</div>
        <div className="footer-actions">
          <PrimaryButton onClick={actions.goToLeaderboard}>Ver ranking</PrimaryButton>
          <PrimaryButton variant="secondary" onClick={actions.closeCelebration}>
            Jugar otro nivel
          </PrimaryButton>
        </div>
      </section>
    </main>
  );
}
