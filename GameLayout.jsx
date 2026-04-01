import { HomeScreen } from '../screens/HomeScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { LevelSelectScreen } from '../screens/LevelSelectScreen';
import { GameplayScreen } from '../screens/GameplayScreen';
import { LeaderboardScreen } from '../screens/LeaderboardScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { VictoryScreen } from '../screens/VictoryScreen';
import { GameOverScreen } from '../screens/GameOverScreen';
import { CelebrationScreen } from '../screens/CelebrationScreen';
import { LoadingScreen } from '../ui/LoadingScreen';

export function GameLayout({ controller }) {
  if (!controller.bootstrapped) {
    return <LoadingScreen />;
  }

  switch (controller.screen) {
    case 'register':
      return <RegisterScreen controller={controller} />;
    case 'level-select':
      return <LevelSelectScreen controller={controller} />;
    case 'game':
      return <GameplayScreen controller={controller} />;
    case 'leaderboard':
      return <LeaderboardScreen controller={controller} />;
    case 'profile':
      return <ProfileScreen controller={controller} />;
    case 'victory':
      return <VictoryScreen controller={controller} />;
    case 'game-over':
      return <GameOverScreen controller={controller} />;
    case 'celebration':
      return <CelebrationScreen controller={controller} />;
    case 'home':
    default:
      return <HomeScreen controller={controller} />;
  }
}
