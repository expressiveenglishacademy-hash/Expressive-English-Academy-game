import { clamp } from '../utils/random';

export function getAdaptiveState(stats) {
  const accuracy = stats.totalAnswered ? stats.correctAnswers / stats.totalAnswered : 0.5;
  const streakBoost = clamp(stats.correctStreak / 6, 0, 0.35);
  const errorPenalty = clamp(stats.wrongStreak / 5, 0, 0.3);
  const performanceIndex = clamp(accuracy + streakBoost - errorPenalty, 0.1, 1);

  let label = 'Explorador';
  let enemySpeed = 0.9;
  let timeLimit = 14;
  let spawnRate = 1350;
  let aidMode = 'full';
  let hintCount = 2;

  if (performanceIndex > 0.38) {
    label = 'Aventurero';
    enemySpeed = 1.05;
    timeLimit = 12;
    spawnRate = 1150;
    aidMode = 'soft';
    hintCount = 1;
  }

  if (performanceIndex > 0.62) {
    label = 'Pro';
    enemySpeed = 1.18;
    timeLimit = 10;
    spawnRate = 950;
    aidMode = 'minimal';
    hintCount = 1;
  }

  if (performanceIndex > 0.82) {
    label = 'Master';
    enemySpeed = 1.32;
    timeLimit = 8;
    spawnRate = 820;
    aidMode = 'minimal';
    hintCount = 0;
  }

  return {
    performanceIndex,
    label,
    enemySpeed,
    timeLimit,
    spawnRate,
    aidMode,
    hintCount,
  };
}
