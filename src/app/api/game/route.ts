import { NextResponse } from 'next/server';
import {
  createGameSession,
  processGuess,
  calculateGameScore,
  getPlayerRank,
  GameSession,
} from '@/lib/gameLogic';

// In-memory sessions store (ideal for lightweight stateful game turns)
const activeSessions = new Map<string, GameSession>();

// Cleanup older sessions every 10 minutes
const cleanupInterval = 1000 * 60 * 30;
function pruneExpiredSessions() {
  const now = Date.now();
  activeSessions.forEach((session, id) => {
    if (now - session.startTime > cleanupInterval) {
      activeSessions.delete(id);
    }
  });
}

export async function POST(request: Request) {
  try {
    pruneExpiredSessions();
    const body = await request.json();
    const { action = 'start' } = body;

    // 1. START A NEW GAME SESSION
    if (action === 'start') {
      const max = Number(body.max) || 100;
      const mode = body.mode || 'classic';
      const session = createGameSession(max, mode);
      activeSessions.set(session.id, session);

      return NextResponse.json({
        success: true,
        sessionId: session.id,
        max: session.max,
        mode: session.mode,
        remainingLives: session.remainingLives,
        currentMinBound: session.currentMinBound,
        currentMaxBound: session.currentMaxBound,
        message: `Game started! Guess a number between 1 and ${session.max}. Type 'quit' to exit.`,
      });
    }

    // 2. SUBMIT A GUESS
    if (action === 'guess') {
      const { sessionId, guess } = body;
      if (!sessionId || !activeSessions.has(sessionId)) {
        return NextResponse.json(
          { success: false, error: 'Session not found or expired. Please start a new game.' },
          { status: 404 }
        );
      }

      const session = activeSessions.get(sessionId)!;
      const result = processGuess(session, guess);

      let score = 0;
      let rank = null;

      if (result.isVictory) {
        const timeTakenSeconds = Math.round((Date.now() - session.startTime) / 1000);
        score = calculateGameScore(session.max, session.attempts, timeTakenSeconds);
        rank = getPlayerRank(1, 1);
        activeSessions.delete(sessionId);
      } else if (result.isGameOver) {
        activeSessions.delete(sessionId);
      }

      return NextResponse.json({
        success: true,
        result,
        attempts: session.attempts,
        score: result.isVictory ? score : undefined,
        rank: result.isVictory ? rank : undefined,
      });
    }

    // 3. QUIT THE GAME
    if (action === 'quit') {
      const { sessionId } = body;
      if (sessionId && activeSessions.has(sessionId)) {
        const session = activeSessions.get(sessionId)!;
        const result = processGuess(session, 'quit');
        activeSessions.delete(sessionId);
        return NextResponse.json({
          success: true,
          result,
        });
      }
      return NextResponse.json({
        success: true,
        message: 'you quit the game',
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action provided.' },
      { status: 400 }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown server error';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
