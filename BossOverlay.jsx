import { useMemo } from 'react';
import { createQuestionForLevel } from '../../content/academyContent';
import { PrimaryButton } from '../ui/PrimaryButton';

export function BossOverlay({ controller }) {
  const { currentLevel, difficulty, session, actions } = controller;
  const question = useMemo(
    () => createQuestionForLevel(currentLevel, difficulty),
    [currentLevel, difficulty, session.bossHits, session.lives],
  );

  if (!session.bossActive) {
    return null;
  }

  return (
    <div className="overlay-panel boss-panel">
      <div className="glass-card modal-card boss-card">
        <div className="boss-header">
          <span>Boss Final</span>
          <strong>{currentLevel.bossName}</strong>
        </div>
        <h2>Defiéndete con inglés</h2>
        <p>
          Responde correctamente para romper el escudo del boss. Progreso: {session.bossHits}/
          3
        </p>

        <div className="boss-question">
          <h3>{question.prompt}</h3>
          <div className="option-grid">
            {question.options.map((option) => (
              <PrimaryButton
                key={option}
                variant="secondary"
                onClick={() => actions.answerBossQuestion(option, question)}
              >
                {option}
              </PrimaryButton>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
