import { LogoBadge } from '../ui/LogoBadge';
import { PrimaryButton } from '../ui/PrimaryButton';
import { formatDate } from '../../utils/format';

export function LeaderboardScreen({ controller }) {
  const { leaderboard, player, actions } = controller;
  const playerGroup = player?.group;
  const grouped = playerGroup
    ? leaderboard.filter((entry) => entry.group === playerGroup)
    : [];

  return (
    <main className="screen board-screen">
      <section className="glass-card leaderboard-card">
        <LogoBadge compact />
        <h2>Leaderboard online</h2>
        <p>Compite con toda la academia y mejora tu propio récord cada vez que juegas.</p>

        <div className="leaderboard-grid">
          <div>
            <h3>Ranking general</h3>
            <div className="leaderboard-table">
              {leaderboard.map((entry, index) => (
                <div key={`${entry.name}-${entry.group}-${index}`} className="leader-row">
                  <span>#{index + 1}</span>
                  <strong>{entry.name}</strong>
                  <span>{entry.group}</span>
                  <span>{entry.score} pts</span>
                  <span>Nivel {entry.levelReached}</span>
                  <span>{formatDate(entry.date)}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3>Ranking por grupo {playerGroup ? `(${playerGroup})` : ''}</h3>
            <div className="leaderboard-table">
              {(grouped.length ? grouped : leaderboard.slice(0, 5)).map((entry, index) => (
                <div key={`${entry.id || index}-group`} className="leader-row compact">
                  <span>#{index + 1}</span>
                  <strong>{entry.name}</strong>
                  <span>{entry.score} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-actions">
          <PrimaryButton onClick={actions.goToLevels}>Volver a niveles</PrimaryButton>
          <PrimaryButton variant="ghost" onClick={actions.goToHome}>
            Inicio
          </PrimaryButton>
        </div>
      </section>
    </main>
  );
}
