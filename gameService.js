import {
  getLocalLeaderboard,
  getLocalPlayer,
  getLocalProgress,
  setLocalLeaderboard,
  setLocalPlayer,
  setLocalProgress,
} from './localDb';
import {
  isFirebaseReady,
  loadFirebaseLeaderboard,
  loadFirebaseProgress,
  saveFirebasePlayer,
  saveFirebaseProgress,
  saveFirebaseScore,
  setupFirebase,
} from './firebase';

function createId() {
  return `player-${Math.random().toString(36).slice(2, 10)}`;
}

function mergeBestScore(entries, newEntry) {
  const existingIndex = entries.findIndex(
    (entry) => entry.name === newEntry.name && entry.group === newEntry.group,
  );

  if (existingIndex === -1) {
    return [...entries, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);
  }

  const current = entries[existingIndex];
  if (current.score >= newEntry.score) {
    return entries.sort((a, b) => b.score - a.score).slice(0, 20);
  }

  const clone = [...entries];
  clone[existingIndex] = newEntry;
  return clone.sort((a, b) => b.score - a.score).slice(0, 20);
}

export async function bootstrapGameData() {
  await setupFirebase();

  const player = getLocalPlayer();
  const localProgress = getLocalProgress();

  if (player && isFirebaseReady) {
    const remoteProgress = await loadFirebaseProgress(player.id);
    if (remoteProgress) {
      setLocalProgress({ ...localProgress, ...remoteProgress });
    }
  }

  const leaderboard = isFirebaseReady
    ? await loadFirebaseLeaderboard()
    : getLocalLeaderboard();

  return {
    player,
    progress: getLocalProgress(),
    leaderboard: leaderboard.length ? leaderboard : getLocalLeaderboard(),
    firebaseEnabled: isFirebaseReady,
  };
}

export async function registerPlayer({ name, group }) {
  const current = getLocalPlayer();
  const player = {
    id: current?.id || createId(),
    name: name.trim(),
    group: group.trim(),
  };

  setLocalPlayer(player);

  if (isFirebaseReady) {
    await saveFirebasePlayer(player);
  }

  return player;
}

export async function persistProgress(playerId, progress) {
  setLocalProgress(progress);
  if (isFirebaseReady && playerId) {
    await saveFirebaseProgress(playerId, progress);
  }
}

export async function submitLeaderboardEntry(entry) {
  const leaderboard = mergeBestScore(getLocalLeaderboard(), entry);
  setLocalLeaderboard(leaderboard);

  if (isFirebaseReady) {
    await saveFirebaseScore(entry);
    return loadFirebaseLeaderboard();
  }

  return leaderboard;
}
