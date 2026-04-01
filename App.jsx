import { useEffect, useState } from 'react';
import { GameLayout } from './components/layout/GameLayout';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { useAppController } from './hooks/useAppController';

function App() {
  const [booting, setBooting] = useState(true);
  const controller = useAppController();

  useEffect(() => {
    const timer = window.setTimeout(() => setBooting(false), 1400);
    return () => window.clearTimeout(timer);
  }, []);

  if (booting) {
    return <LoadingScreen />;
  }

  return <GameLayout controller={controller} />;
}

export default App;
