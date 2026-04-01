import { useEffect, useMemo, useRef, useState } from 'react';
import { badges as badgeCatalog } from '../data/badges';
import { createQuestionForLevel, getLevelById, levelDefinitions } from '../content/academyContent';
import { useAdaptiveDifficulty } from './useAdaptiveDifficultyBridge';
import { useAudioEngine } from './useAudioEngine';
import { useSpeech } from './useSpeech';
import {
  bootstrapGameData,
  persistProgress,
  registerPlayer,
  submitLeaderboardEntry,
} from '../services/gameService';
import { clamp, randomItem } from '../utils/random';

const SESSION_TIME = 180;
const PRE_BOSS_QUESTIONS = 7;
const BOSS_QUESTIONS = 3;
const HERO_STEP = 5;
const SHOT_SPEED = 1.8;

function defaultSession(levelId = 1, mode = 'practice') {
  return {
    levelId,
    mode,
    heroX: 50,
    heroShield: false,
    lives: 3,
    timeLeft: SESSION_TIME,
    score: 0,
    enemies: [],
    shots: [],
    activeQuestion: null,
    questionSecondsLeft: 0,
    questionTarget: null,
    preBossCleared: 0,
    bossHits: 0,
    bossReady: false,
    bossActive: false,
    bossDefeated: false,
    totalAnswered: 0,
    correctAnswers: 0,
    correctStreak: 0,
    wrongStreak: 0,
    feedback: 'Prepárate para aprender y disparar.',
    powerUps: [],
    status: 'ready',
    stars: 0,
    medals: [],
  };
}

function createEnemy(id, difficulty) {
  const variants = ['grammar-drone', 'vocab-meteor', 'quiz-bot', 'academy-orb'];
  return {
    id,
    x: 10 + Math.random() * 76,
    y: -10,
    speed: (0.28 + Math.random() * 0.22) * difficulty.enemySpeed,
    size: 8 + Math.random() * 4,
    variant: randomItem(variants),
  };
}

function createShot(heroX) {
  return {
    id: `shot-${crypto.randomUUID?.() || Math.random().toString(36).slice(2)}`,
    x: heroX,
    y: 84,
  };
}

function randomPowerUp() {
  return randomItem([
    { id: 'slow-motion', label: 'Slow Motion', duration: 9 },
    { id: 'double-points', label: 'Double Points', duration: 10 },
    { id: 'hint', label: 'Hint+', duration: 1 },
    { id: 'extra-shield', label: 'Extra Shield', duration: 1 },
    { id: 'freeze', label: 'Freeze Enemies', duration: 5 },
    { id: 'extra-time', label: 'Extra Time', duration: 1 },
  ]);
}

function getActiveMultiplier(powerUps) {
  return powerUps.some((item) => item.id === 'double-points') ? 2 : 1;
}

function nextPowerUps(powerUps) {
  return powerUps
    .map((power) => ({ ...power, duration: power.duration - 1 }))
    .filter((power) => power.duration > 0);
}

function starsForScore(score, lives, timeLeft) {
  if (score >= 1500 && lives >= 2 && timeLeft >= 60) return 3;
  if (score >= 900 && lives >= 1) return 2;
  return 1;
}

function resolveBadges(session, stars) {
  const earned = [];
  if (session.correctStreak >= 5) earned.push('sharp-shooter');
  if (session.timeLeft >= 90) earned.push('time-guardian');
  if (session.bossHits === BOSS_QUESTIONS && session.wrongStreak === 0) earned.push('boss-breaker');
  if (stars === 3) earned.push('academy-star');
  return badgeCatalog.filter((badge) => earned.includes(badge.id));
}

function mergeProgress(progress, session, levelId) {
  const stars = starsForScore(session.score, session.lives, session.timeLeft);
  const completedLevels = {
    ...progress.completedLevels,
    [levelId]: {
      score: Math.max(progress.completedLevels?.[levelId]?.score || 0, session.score),
      stars: Math.max(progress.completedLevels?.[levelId]?.stars || 0, stars),
      completedAt: new Date().toISOString(),
    },
  };
  const badges = Array.from(new Set([...(progress.badges || []), ...resolveBadges(session, stars).map((b) => b.id)]));
  return {
    ...progress,
    bestScore: Math.max(progress.bestScore || 0, session.score),
    unlockedLevel: Math.min(levelDefinitions.length, Math.max(progress.unlockedLevel || 1, levelId + 1)),
    totalStars: Object.values(completedLevels).reduce((sum, level) => sum + level.stars, 0),
    completedLevels,
    badges,
    lastPlayedLevel: levelId,
  };
}

export function useAppController() {
  const [screen, setScreen] = useState('home');
  const [player, setPlayer] = useState(null);
  const [progress, setProgress] = useState({
    unlockedLevel: 1,
    bestScore: 0,
    totalStars: 0,
    completedLevels: {},
    badges: [],
    lastPlayedLevel: 1,
  });
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedMode, setSelectedMode] = useState('practice');
  const [session, setSession] = useState(defaultSession());
  const [firebaseEnabled, setFirebaseEnabled] = useState(false);
  const [bootstrapped, setBootstrapped] = useState(false);
  const [touchDirection, setTouchDirection] = useState(0);

  const audio = useAudioEngine();
  const speech = useSpeech();
  const loopRef = useRef({ lastSpawn: 0, lastTick: 0, shotCooldown: 0 });
  const difficulty = useAdaptiveDifficulty({
    totalAnswered: session.totalAnswered,
    correctAnswers: session.correctAnswers,
    correctStreak: session.correctStreak,
    wrongStreak: session.wrongStreak,
  });

  const currentLevel = useMemo(
    () => getLevelById(session.levelId || progress.lastPlayedLevel || 1),
    [progress.lastPlayedLevel, session.levelId],
  );

  useEffect(() => {
    bootstrapGameData().then((data) => {
      if (data.player) {
        setPlayer(data.player);
      }
      setProgress(data.progress);
      setLeaderboard(data.leaderboard);
      setFirebaseEnabled(data.firebaseEnabled);
      setBootstrapped(true);
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (screen !== 'game' || session.status !== 'playing') {
        return;
      }
      if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
        setSession((prev) => ({ ...prev, heroX: clamp(prev.heroX - HERO_STEP, 8, 92) }));
      }
      if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
        setSession((prev) => ({ ...prev, heroX: clamp(prev.heroX + HERO_STEP, 8, 92) }));
      }
      if (event.key === ' ' || event.key === 'Enter') {
        shoot();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screen, session.status]);

  useEffect(() => {
    if (screen !== 'game' || !session.activeQuestion) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setSession((prev) => {
        if (!prev.activeQuestion) {
          return prev;
        }
        if (prev.questionSecondsLeft <= 1) {
          return {
            ...prev,
            activeQuestion: null,
            questionSecondsLeft: 0,
            questionTarget: null,
            preBossCleared: prev.preBossCleared + 1,
            totalAnswered: prev.totalAnswered + 1,
            wrongStreak: prev.wrongStreak + 1,
            correctStreak: 0,
            lives: prev.heroShield ? prev.lives : prev.lives - 1,
            heroShield: false,
            feedback: 'Se acabó el tiempo de la pregunta. Inténtalo otra vez.',
            status: prev.heroShield ? prev.status : prev.lives - 1 <= 0 ? 'game-over' : prev.status,
          };
        }
        return {
          ...prev,
          questionSecondsLeft: prev.questionSecondsLeft - 1,
        };
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [screen, session.activeQuestion]);

  useEffect(() => {
    if (screen === 'game' && session.status === 'playing') {
      audio.startMusic();
    } else {
      audio.stopMusic();
    }
  }, [audio, screen, session.status]);

  useEffect(() => {
    if (screen !== 'game' || session.status !== 'playing') {
      return undefined;
    }

    let animationId;
    const tick = (timestamp) => {
      if (!loopRef.current.lastTick) {
        loopRef.current.lastTick = timestamp;
      }
      const delta = timestamp - loopRef.current.lastTick;
      loopRef.current.lastTick = timestamp;
      loopRef.current.shotCooldown = Math.max(0, loopRef.current.shotCooldown - delta);

      setSession((prev) => {
        if (prev.activeQuestion || prev.bossActive) {
          return prev;
        }

        // Los power-ups ajustan la velocidad del loop sin duplicar lógica de movimiento.
        const freezeActive = prev.powerUps.some((power) => power.id === 'freeze');
        const slowMotion = prev.powerUps.some((power) => power.id === 'slow-motion');
        const movementFactor = freezeActive ? 0 : slowMotion ? 0.55 : 1;

        let enemies = prev.enemies.map((enemy) => ({
          ...enemy,
          y: enemy.y + enemy.speed * movementFactor,
        }));
        let shots = prev.shots.map((shot) => ({ ...shot, y: shot.y - SHOT_SPEED }));
        let lives = prev.lives;
        let heroShield = prev.heroShield;
        let status = prev.status;
        let feedback = prev.feedback;
        let powerUps = nextPowerUps(prev.powerUps);

        const failedEnemies = enemies.filter((enemy) => enemy.y > 90);
        if (failedEnemies.length) {
          enemies = enemies.filter((enemy) => enemy.y <= 90);
          failedEnemies.forEach(() => {
            if (heroShield) {
              heroShield = false;
              feedback = 'Tu escudo salvó la jugada.';
            } else {
              lives -= 1;
              feedback = 'Un enemigo escapó. Sigue intentándolo.';
            }
          });
        }

        shots = shots.filter((shot) => shot.y > -10);

        let questionTarget = null;
        let activeQuestion = null;
        const remainingShots = [];

        shots.forEach((shot) => {
          const hit = enemies.find(
            (enemy) => Math.abs(enemy.x - shot.x) < 6 && Math.abs(enemy.y - shot.y) < 8,
          );

          if (hit && !questionTarget && prev.preBossCleared < PRE_BOSS_QUESTIONS) {
            questionTarget = hit;
            activeQuestion = createQuestionForLevel(currentLevel, difficulty);
          } else {
            remainingShots.push(shot);
          }
        });

        if (questionTarget) {
          enemies = enemies.filter((enemy) => enemy.id !== questionTarget.id);
        }

        if (
          timestamp - loopRef.current.lastSpawn > difficulty.spawnRate &&
          prev.preBossCleared < PRE_BOSS_QUESTIONS
        ) {
          enemies = [...enemies, createEnemy(`enemy-${timestamp}`, difficulty)];
          loopRef.current.lastSpawn = timestamp;
        }

        if (touchDirection !== 0) {
          const nextX = clamp(prev.heroX + touchDirection * 0.28 * delta, 8, 92);
          const timeLeft = Math.max(0, prev.timeLeft - delta / 1000);
          return {
            ...prev,
            heroX: nextX,
            enemies,
            shots: remainingShots,
            lives,
            heroShield,
            feedback,
            powerUps,
            activeQuestion,
            questionSecondsLeft: activeQuestion ? activeQuestion.timeLimit : prev.questionSecondsLeft,
            questionTarget,
            timeLeft,
            status: lives <= 0 || timeLeft <= 0 ? 'game-over' : status,
          };
        }

        const timeLeft = Math.max(0, prev.timeLeft - delta / 1000);

        return {
          ...prev,
          enemies,
          shots: remainingShots,
          lives,
          heroShield,
          feedback,
          powerUps,
          activeQuestion,
          questionSecondsLeft: activeQuestion ? activeQuestion.timeLimit : prev.questionSecondsLeft,
          questionTarget,
          timeLeft,
          status: lives <= 0 || timeLeft <= 0 ? 'game-over' : status,
        };
      });

      animationId = window.requestAnimationFrame(tick);
    };

    animationId = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(animationId);
      loopRef.current.lastTick = 0;
    };
  }, [currentLevel, difficulty, screen, session.status, touchDirection]);

  useEffect(() => {
    if (screen === 'game' && session.preBossCleared >= PRE_BOSS_QUESTIONS && !session.bossActive && !session.bossDefeated) {
      setSession((prev) => ({
        ...prev,
        bossActive: true,
        feedback: `${currentLevel.bossName} apareció. Prepárate para el duelo final.`,
      }));
      audio.playBoss();
    }
  }, [audio, currentLevel.bossName, screen, session.bossActive, session.bossDefeated, session.preBossCleared]);

  useEffect(() => {
    if (session.status === 'game-over') {
      audio.stopMusic();
      setScreen('game-over');
    }
  }, [audio, session.status]);

  async function handleRegister(form) {
    const saved = await registerPlayer(form);
    setPlayer(saved);
    setScreen('level-select');
  }

  function startLevel(levelId, mode = selectedMode) {
    const level = getLevelById(levelId);
    setSelectedMode(mode);
    setSession({
      ...defaultSession(level.id, mode),
        feedback: `Nivel ${level.id}: ${level.title}. Derriba enemigos y responde en inglés.`,
        status: 'playing',
        timeLeft: mode === 'practice' ? 210 : SESSION_TIME,
    });
    setScreen('game');
  }

  function shoot() {
    if (screen !== 'game' || session.status !== 'playing' || session.activeQuestion || session.bossActive) {
      return;
    }
    if (loopRef.current.shotCooldown > 0) {
      return;
    }
    loopRef.current.shotCooldown = 220;
    setSession((prev) => ({ ...prev, shots: [...prev.shots, createShot(prev.heroX)] }));
    audio.playShot();
  }

  function moveHero(direction) {
    setSession((prev) => ({
      ...prev,
      heroX: clamp(prev.heroX + direction * HERO_STEP, 8, 92),
    }));
  }

  function answerQuestion(option) {
    const question = session.activeQuestion;
    if (!question) return;

    const isCorrect = option === question.answer;
    const power = session.correctAnswers > 0 && (session.correctAnswers + 1) % 3 === 0 ? randomPowerUp() : null;

    setSession((prev) => {
      let nextPowerUps = [...prev.powerUps];
      let heroShield = prev.heroShield;
      let timeLeft = prev.timeLeft;
      let score = prev.score;
      let feedback = question.explanation;
      let lives = prev.lives;
      let correctStreak = prev.correctStreak;
      let wrongStreak = prev.wrongStreak;
      let correctAnswers = prev.correctAnswers;

      if (isCorrect) {
        correctAnswers += 1;
        correctStreak += 1;
        wrongStreak = 0;
        score += 120 * getActiveMultiplier(prev.powerUps);
        feedback = `Correcto. ${question.explanation}`;

        if (power) {
          if (power.id === 'extra-time') {
            timeLeft += 15;
          } else if (power.id === 'extra-shield') {
            heroShield = true;
          } else if (power.id === 'hint') {
            nextPowerUps.push(power);
          } else {
            nextPowerUps.push(power);
          }
          feedback = `${feedback} Power-up: ${power.label}.`;
        }
      } else {
        lives -= heroShield ? 0 : 1;
        heroShield = false;
        wrongStreak += 1;
        correctStreak = 0;
        feedback = `Ups. ${question.explanation}`;
      }

      return {
        ...prev,
        activeQuestion: null,
        questionSecondsLeft: 0,
        questionTarget: null,
        preBossCleared: prev.preBossCleared + 1,
        totalAnswered: prev.totalAnswered + 1,
        correctAnswers,
        correctStreak,
        wrongStreak,
        score,
        powerUps: nextPowerUps,
        lives,
        heroShield,
        timeLeft,
        feedback,
        status: lives <= 0 ? 'game-over' : prev.status,
      };
    });

    if (isCorrect) {
      audio.playSuccess();
    } else {
      audio.playError();
    }
  }

  function answerBossQuestion(option, question) {
    const isCorrect = option === question.answer;
    setSession((prev) => {
      const bossHits = isCorrect ? prev.bossHits + 1 : prev.bossHits;
      const lives = isCorrect ? prev.lives : prev.heroShield ? prev.lives : prev.lives - 1;
      const heroShield = isCorrect ? prev.heroShield : false;
      const totalAnswered = prev.totalAnswered + 1;
      const correctAnswers = isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers;
      const correctStreak = isCorrect ? prev.correctStreak + 1 : 0;
      const wrongStreak = isCorrect ? 0 : prev.wrongStreak + 1;
      const score = isCorrect ? prev.score + 220 * getActiveMultiplier(prev.powerUps) : prev.score;
      const bossDefeated = bossHits >= BOSS_QUESTIONS;

      return {
        ...prev,
        bossHits,
        bossActive: !bossDefeated,
        bossDefeated,
        totalAnswered,
        correctAnswers,
        correctStreak,
        wrongStreak,
        score,
        lives,
        heroShield,
        feedback: isCorrect
          ? `Gran respuesta. ${currentLevel.bossName} perdió energía.`
          : `${currentLevel.bossName} te golpeó. Intenta otra vez.`,
        status: lives <= 0 ? 'game-over' : bossDefeated ? 'completed' : prev.status,
      };
    });
    if (isCorrect) {
      audio.playSuccess();
    } else {
      audio.playError();
    }
  }

  async function finishLevel() {
    // Guardamos localmente y, si Firebase está disponible, sincronizamos progreso y ranking.
    const updatedProgress = mergeProgress(progress, session, session.levelId);
    setProgress(updatedProgress);
    await persistProgress(player?.id, updatedProgress);

    if (selectedMode === 'tournament' && player) {
      const latestLeaderboard = await submitLeaderboardEntry({
        id: player.id,
        name: player.name,
        group: player.group,
        score: session.score,
        levelReached: session.levelId,
        date: new Date().toISOString(),
      });
      setLeaderboard(latestLeaderboard);
    }

    if (session.levelId >= levelDefinitions.length) {
      setScreen('celebration');
      return;
    }

    setScreen('victory');
  }

  useEffect(() => {
    if (screen === 'game' && session.bossDefeated && session.status === 'completed') {
      finishLevel();
    }
  }, [screen, session.bossDefeated, session.status]);

  const profileBadges = useMemo(
    () => badgeCatalog.filter((badge) => progress.badges?.includes(badge.id)),
    [progress.badges],
  );

  return {
    bootstrapped,
    firebaseEnabled,
    screen,
    player,
    progress,
    leaderboard,
    selectedMode,
    session,
    difficulty,
    currentLevel,
    profileBadges,
    allLevels: levelDefinitions,
    speech,
    audio,
    actions: {
      goToHome: () => setScreen('home'),
      goToRegister: () => setScreen('register'),
      goToLevels: () => setScreen(player ? 'level-select' : 'register'),
      goToLeaderboard: () => setScreen('leaderboard'),
      goToProfile: () => setScreen(player ? 'profile' : 'register'),
      register: handleRegister,
      setSelectedMode,
      startLevel,
      retryLevel: () => startLevel(session.levelId, selectedMode),
      moveHero,
      setTouchDirection,
      shoot,
      answerQuestion,
      answerBossQuestion,
      speakQuestion: (text) => speech.speak(text),
      closeVictory: () => setScreen('level-select'),
      closeCelebration: () => setScreen('level-select'),
      exitGameOver: () => setScreen('level-select'),
    },
  };
}
