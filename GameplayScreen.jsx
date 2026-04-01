import { BossOverlay } from '../game/BossOverlay';
import { GameHUD } from '../game/GameHUD';
import { QuestionModal } from '../game/QuestionModal';
import { TouchControls } from '../game/TouchControls';
import { PrimaryButton } from '../ui/PrimaryButton';

export function GameplayScreen({ controller }) {
  const { session, currentLevel, actions, speech, audio } = controller;

  return (
    <main className="screen gameplay-screen">
      <GameHUD controller={controller} />

      <section className="arena-shell">
        <div className="arena-sky" />
        <div className="arena-grid" />

        {session.enemies.map((enemy) => (
          <div
            key={enemy.id}
            className={`enemy ${enemy.variant}`}
            style={{ left: `${enemy.x}%`, top: `${enemy.y}%`, width: `${enemy.size}%`, height: `${enemy.size}%` }}
          />
        ))}

        {session.shots.map((shot) => (
          <div
            key={shot.id}
            className="shot"
            style={{ left: `${shot.x}%`, top: `${shot.y}%` }}
          />
        ))}

        <div className={`hero ${session.heroShield ? 'shielded' : ''}`} style={{ left: `${session.heroX}%` }}>
          <div className="hero-core" />
          <div className="hero-wings" />
        </div>

        <div className="arena-banner glass-card">
          <strong>{currentLevel.title}</strong>
          <span>{session.feedback}</span>
        </div>

        <div className="powerup-strip">
          {session.heroShield && <span className="power-badge">Shield</span>}
          {session.powerUps.map((power) => (
            <span key={`${power.id}-${power.duration}`} className="power-badge">
              {power.label} {power.duration > 1 ? `(${power.duration})` : ''}
            </span>
          ))}
        </div>
      </section>

      <section className="gameplay-footer">
        <TouchControls actions={actions} />
        <div className="footer-buttons">
          <PrimaryButton variant="secondary" onClick={() => audio.setEnabled(!audio.enabled)}>
            {audio.enabled ? 'Silenciar audio' : 'Activar audio'}
          </PrimaryButton>
          <PrimaryButton variant="ghost" onClick={actions.goToLevels}>
            Salir del nivel
          </PrimaryButton>
        </div>
      </section>

      <QuestionModal
        question={session.activeQuestion}
        secondsLeft={session.questionSecondsLeft}
        onAnswer={actions.answerQuestion}
        onSpeak={actions.speakQuestion}
        speechSupported={speech.supported}
      />

      <BossOverlay controller={controller} />
    </main>
  );
}
