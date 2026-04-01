import { LogoBadge } from '../ui/LogoBadge';
import { PrimaryButton } from '../ui/PrimaryButton';
import { StatPill } from '../ui/StatPill';

export function LevelSelectScreen({ controller }) {
  const { player, progress, allLevels, selectedMode, actions } = controller;

  return (
    <main className="screen level-screen">
      <section className="top-bar glass-card">
        <LogoBadge compact />
        <div className="top-bar-actions">
          <StatPill label="Jugador" value={player?.name || 'Invitado'} />
          <StatPill label="Grupo" value={player?.group || '-'} accent="cyan" />
          <StatPill label="Estrellas" value={progress.totalStars} accent="gold" />
        </div>
      </section>

      <section className="glass-card mode-panel">
        <div>
          <h2>Selecciona nivel y modo</h2>
          <p>Práctica da más tiempo. Torneo activa ranking online y ritmo más competitivo.</p>
        </div>
        <div className="mode-switch">
          <PrimaryButton
            variant={selectedMode === 'practice' ? 'primary' : 'secondary'}
            onClick={() => actions.setSelectedMode('practice')}
          >
            Modo práctica
          </PrimaryButton>
          <PrimaryButton
            variant={selectedMode === 'tournament' ? 'primary' : 'secondary'}
            onClick={() => actions.setSelectedMode('tournament')}
          >
            Modo torneo
          </PrimaryButton>
        </div>
      </section>

      <section className="level-grid">
        {allLevels.map((level) => {
          const locked = level.id > progress.unlockedLevel;
          const completed = progress.completedLevels?.[level.id];
          return (
            <article key={level.id} className={`glass-card level-card ${locked ? 'locked' : ''}`}>
              <div className="level-card-top">
                <span className="level-index">Nivel {level.id}</span>
                <span className="level-theme">{level.theme}</span>
              </div>
              <h3>{level.title}</h3>
              <p>Boss final: {level.bossName}</p>
              <div className="level-meta">
                <span>Preguntas: 10</span>
                <span>Mejor score: {completed?.score || 0}</span>
                <span>Estrellas: {completed?.stars || 0}</span>
              </div>
              <PrimaryButton disabled={locked} onClick={() => actions.startLevel(level.id)}>
                {locked ? 'Bloqueado' : completed ? 'Repetir nivel' : 'Jugar'}
              </PrimaryButton>
            </article>
          );
        })}
      </section>

      <section className="footer-actions">
        <PrimaryButton variant="secondary" onClick={actions.goToLeaderboard}>
          Leaderboard
        </PrimaryButton>
        <PrimaryButton variant="ghost" onClick={actions.goToProfile}>
          Mi progreso
        </PrimaryButton>
        <PrimaryButton variant="ghost" onClick={actions.goToHome}>
          Inicio
        </PrimaryButton>
      </section>
    </main>
  );
}
