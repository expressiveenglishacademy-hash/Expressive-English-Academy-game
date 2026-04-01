import { mockLeaderboard } from '../data/mockLeaderboard';

const KEYS = {
  player: 'eea_player',
  progress: 'eea_progress',
  leaderboard: 'eea_leaderboard',
};

function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function getLocalPlayer() {
  return safeParse(window.localStorage.getItem(KEYS.player), null);
}

export function setLocalPlayer(player) {
  window.localStorage.setItem(KEYS.player, JSON.stringify(player));
}

export function getLocalProgress() {
  return safeParse(window.localStorage.getItem(KEYS.progress), {
    unlockedLevel: 1,
    bestScore: 0,
    totalStars: 0,
    completedLevels: {},
    badges: [],
    lastPlayedLevel: 1,
  });
}

export function setLocalProgress(progress) {
  window.localStorage.setItem(KEYS.progress, JSON.stringify(progress));
}

export function getLocalLeaderboard() {
  return safeParse(window.localStorage.getItem(KEYS.leaderboard), mockLeaderboard);
}

export function setLocalLeaderboard(leaderboard) {
  window.localStorage.setItem(KEYS.leaderboard, JSON.stringify(leaderboard));
}
