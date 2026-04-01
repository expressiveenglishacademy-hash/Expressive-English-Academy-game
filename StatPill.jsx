export function StatPill({ label, value, accent = 'blue' }) {
  return (
    <div className={`stat-pill ${accent}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
