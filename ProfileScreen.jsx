import { LogoBadge } from '../ui/LogoBadge';
import { PrimaryButton } from '../ui/PrimaryButton';
import { badges } from '../../data/badges';

export function ProfileScreen({ controller }) {
  const { player, progress, profileBadges, actions } = controller;

  return (
    <main className="screen profile-screen">
      <section className="glass-card profile-card">
        <LogoBadge compact />
        <h2>Perfil del estudiante</h2>
        <div className="profile-summary">
          <div>
            <strong>{player?.name || 'Estudiante'}</strong>
            <span>Grupo {player?.group || '-'}</span>
          </div>
          <div>
            <strong>Mejor score</strong>
            <span>{progress.bestScore}</span>
          </div>
          <div>
            <strong>Nivel desbloqueado</strong>
            <span>{progress.unlockedLevel}</span>
          </div>
          <div>
            <strong>Estrellas</strong>
            <span>{progress.totalStars}</span>
          </div>
        </div>

        <div className="completed-levels">
          <h3>Niveles completados</h3>
          <div className="mini-grid">
            {Object.entries(progress.completedLevels || {}).map(([levelId, data]) => (
              <div key={levelId} className="mini-card">
                <strong>Nivel {levelId}</strong>
                <span>{data.score} pts</span>
                <span>{'⭐'.repeat(data.stars)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="completed-levels">
          <h3>Badges y medallas</h3>
          <div className="mini-grid">
            {(profileBadges.length ? profileBadges : badges).map((badge) => (
              <div key={badge.id} className="mini-card">
                <strong>{badge.icon} {badge.name}</strong>
                <span>{badge.description}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="footer-actions">
          <PrimaryButton onClick={actions.goToLevels}>Seguir jugando</PrimaryButton>
          <PrimaryButton variant="ghost" onClick={actions.goToHome}>
            Inicio
          </PrimaryButton>
        </div>
      </section>
    </main>
  );
}
