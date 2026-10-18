/**
 * Core Number Guessing Game Logic
 * Implements the user's game engine:
 * 
 * const max = prompt("enter Your max number ");
 * const random = Math.floor(Math.random() * max ) + 1;
 * let guess = prompt("guess the Number ");
 * while(true){
 *   if(guess == "quit"){ break; }
 *   if(guess == random){ break; }
 *   else if(guess > random){ hint: larger }
 *   else if(guess < random){ hint: smaller }
 *   else { wrong guess }
 * }
 */

export type GameMode = 'classic' | 'survival' | 'blitz';

export type Proximity = 'boiling' | 'hot' | 'warm' | 'cool' | 'freezing';

export interface GuessEvaluation {
  status: 'correct' | 'larger' | 'smaller' | 'invalid' | 'quit';
  message: string;
  guessNumber: number | null;
  random?: number; // only revealed when correct or quit
  proximity?: Proximity;
  difference?: number;
  newMinBound: number;
  newMaxBound: number;
  remainingLives?: number;
  isGameOver: boolean;
  isVictory: boolean;
}

export interface GameSession {
  id: string;
  max: number;
  target: number;
  mode: GameMode;
  attempts: number;
  maxLives: number;
  remainingLives: number;
  currentMinBound: number;
  currentMaxBound: number;
  startTime: number;
  history: Array<{
    guess: number;
    hint: 'larger' | 'smaller';
    proximity: Proximity;
    timestamp: number;
  }>;
  status: 'active' | 'won' | 'lost' | 'quit';
}

/**
 * Creates a new game session using the exact logic:
 * const random = Math.floor(Math.random() * max) + 1;
 */
export function createGameSession(
  maxInput: number | string = 100,
  mode: GameMode = 'classic',
  lives: number = 7
): GameSession {
  const max = Math.max(5, Math.floor(Number(maxInput)) || 100);
  const target = Math.floor(Math.random() * max) + 1;

  return {
    id: 'game_' + Math.random().toString(36).substring(2, 9),
    max,
    target,
    mode,
    attempts: 0,
    maxLives: mode === 'survival' ? lives : Infinity,
    remainingLives: mode === 'survival' ? lives : Infinity,
    currentMinBound: 1,
    currentMaxBound: max,
    startTime: Date.now(),
    history: [],
    status: 'active',
  };
}

/**
 * Computes proximity heat level between guess and target
 */
export function calculateProximity(guess: number, target: number, max: number): Proximity {
  const diff = Math.abs(guess - target);
  if (diff === 0) return 'boiling';
  if (diff <= 2 || diff <= Math.max(1, max * 0.03)) return 'boiling';
  if (diff <= 5 || diff <= Math.max(2, max * 0.08)) return 'hot';
  if (diff <= Math.max(4, max * 0.20)) return 'warm';
  if (diff <= Math.max(8, max * 0.40)) return 'cool';
  return 'freezing';
}

/**
 * Evaluates a guess against the active game session
 * faithfully matching:
 * if (guess == "quit") -> you quit the game
 * if (guess == random) -> you guessed the number correctly
 * else if (guess > random) -> hint: your guess is larger than the Number, please try again
 * else if (guess < random) -> hint :your guess is smaller than the Number, please try again
 * else -> wrong guess, please try again
 */
export function processGuess(session: GameSession, rawInput: string | number): GuessEvaluation {
  const inputStr = String(rawInput).trim().toLowerCase();

  // Quit condition
  if (inputStr === 'quit' || inputStr === 'q') {
    session.status = 'quit';
    return {
      status: 'quit',
      message: 'you quit the game',
      guessNumber: null,
      random: session.target,
      newMinBound: session.currentMinBound,
      newMaxBound: session.currentMaxBound,
      remainingLives: session.remainingLives,
      isGameOver: true,
      isVictory: false,
    };
  }

  const guess = Number(inputStr);

  // Invalid / non-number check
  if (isNaN(guess) || inputStr === '' || !Number.isInteger(guess)) {
    return {
      status: 'invalid',
      message: 'wromg guess, please try again',
      guessNumber: null,
      newMinBound: session.currentMinBound,
      newMaxBound: session.currentMaxBound,
      remainingLives: session.remainingLives,
      isGameOver: false,
      isVictory: false,
    };
  }

  session.attempts += 1;
  const random = session.target;

  // Correct guess
  if (guess === random) {
    session.status = 'won';
    return {
      status: 'correct',
      message: `you guessed the number correctly, ${random}`,
      guessNumber: guess,
      random,
      proximity: 'boiling',
      difference: 0,
      newMinBound: guess,
      newMaxBound: guess,
      remainingLives: session.remainingLives,
      isGameOver: true,
      isVictory: true,
    };
  }

  // Survival mode life penalty
  if (session.mode === 'survival') {
    session.remainingLives -= 1;
    if (session.remainingLives <= 0) {
      session.status = 'lost';
      return {
        status: guess > random ? 'larger' : 'smaller',
        message: `Game Over! You ran out of attempts. The secret number was ${random}.`,
        guessNumber: guess,
        random,
        proximity: calculateProximity(guess, random, session.max),
        difference: Math.abs(guess - random),
        newMinBound: session.currentMinBound,
        newMaxBound: session.currentMaxBound,
        remainingLives: 0,
        isGameOver: true,
        isVictory: false,
      };
    }
  }

  // Guess larger than random
  if (guess > random) {
    if (guess < session.currentMaxBound) {
      session.currentMaxBound = guess - 1;
    }
    const proximity = calculateProximity(guess, random, session.max);
    session.history.push({
      guess,
      hint: 'larger',
      proximity,
      timestamp: Date.now(),
    });

    return {
      status: 'larger',
      message: 'hint: your guess is larger than the Number, please try again',
      guessNumber: guess,
      proximity,
      difference: guess - random,
      newMinBound: session.currentMinBound,
      newMaxBound: session.currentMaxBound,
      remainingLives: session.remainingLives,
      isGameOver: false,
      isVictory: false,
    };
  }

  // Guess smaller than random
  if (guess < random) {
    if (guess > session.currentMinBound) {
      session.currentMinBound = guess + 1;
    }
    const proximity = calculateProximity(guess, random, session.max);
    session.history.push({
      guess,
      hint: 'smaller',
      proximity,
      timestamp: Date.now(),
    });

    return {
      status: 'smaller',
      message: 'hint :your guess is smaller than the Number, please try again',
      guessNumber: guess,
      proximity,
      difference: random - guess,
      newMinBound: session.currentMinBound,
      newMaxBound: session.currentMaxBound,
      remainingLives: session.remainingLives,
      isGameOver: false,
      isVictory: false,
    };
  }

  // Fallback
  return {
    status: 'invalid',
    message: 'wromg guess, please try again',
    guessNumber: null,
    newMinBound: session.currentMinBound,
    newMaxBound: session.currentMaxBound,
    remainingLives: session.remainingLives,
    isGameOver: false,
    isVictory: false,
  };
}

/**
 * Calculates score based on max number, attempts, and time spent
 */
export function calculateGameScore(
  max: number,
  attempts: number,
  timeSeconds: number,
  streak: number = 1
): number {
  const basePoints = max * 10;
  const attemptsPenalty = Math.max(1, attempts) * 35;
  const timeBonus = Math.max(0, 300 - timeSeconds * 5);
  const streakMultiplier = 1 + (streak - 1) * 0.25;

  const rawScore = Math.max(50, basePoints - attemptsPenalty + timeBonus);
  return Math.round(rawScore * streakMultiplier);
}

/**
 * Rank titles based on score & win count
 */
export function getPlayerRank(totalWins: number, bestStreak: number): {
  title: string;
  badge: string;
  nextGoal: string;
} {
  if (totalWins >= 25 || bestStreak >= 7) {
    return {
      title: 'Quantum Grandmaster',
      badge: '👑',
      nextGoal: 'You have mastered the multiverse of numbers!',
    };
  }
  if (totalWins >= 12 || bestStreak >= 4) {
    return {
      title: 'Telepathic Oracle',
      badge: '🔮',
      nextGoal: `${25 - totalWins} more wins to reach Quantum Grandmaster`,
    };
  }
  if (totalWins >= 6 || bestStreak >= 2) {
    return {
      title: 'Mind Reader',
      badge: '🧠',
      nextGoal: `${12 - totalWins} more wins to reach Telepathic Oracle`,
    };
  }
  if (totalWins >= 2) {
    return {
      title: 'Number Sleuth',
      badge: '🔍',
      nextGoal: `${6 - totalWins} more wins to reach Mind Reader`,
    };
  }
  return {
    title: 'Novice Guesser',
    badge: '🎯',
    nextGoal: 'Win 2 games to rank up to Number Sleuth',
  };
}
