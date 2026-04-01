export function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

export function shuffle(items) {
  const clone = [...items];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

export function sample(items, total = 1) {
  return shuffle(items).slice(0, total);
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
