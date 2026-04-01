import { LogoBadge } from './LogoBadge';

export function LoadingScreen() {
  return (
    <main className="screen loading-screen">
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <div className="loading-card">
        <LogoBadge />
        <div className="loader-bar">
          <span />
        </div>
        <p>Preparando la academia, las preguntas y la aventura arcade...</p>
      </div>
    </main>
  );
}
