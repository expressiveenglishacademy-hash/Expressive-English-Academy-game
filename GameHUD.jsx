import { formatTime } from '../../utils/format';
import { StatPill } from '../ui/StatPill';

export function GameHUD({ controller }) {
  const { session, difficulty, currentLevel } = controller;

  return (
    <div className="game-hud glass-card">
      <StatPill label="Vidas" value={'❤'.repeat(session.lives)} />
      <StatPill label="Tiempo" value={formatTime(session.timeLeft)} accent="cyan" />
      <StatPill label="Score" value={session.score} accent="gold" />
      <StatPill label="Nivel" value={`${currentLevel.id}. ${currentLevel.title}`} />
      <StatPill label="Progreso" value={`${session.preBossCleared}/${7}`} accent="cyan" />
      <StatPill label="Rango" value={difficulty.label} accent="gold" />
    </div>
  );
}
