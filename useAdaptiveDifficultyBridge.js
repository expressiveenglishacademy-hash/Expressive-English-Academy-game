import { getAdaptiveState } from './useAdaptiveDifficulty';

export function useAdaptiveDifficulty(stats) {
  return getAdaptiveState(stats);
}
