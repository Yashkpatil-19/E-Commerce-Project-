'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, 
  Volume2, 
  VolumeX, 
  Heart, 
  Clock, 
  Sparkles, 
  RotateCcw, 
  ArrowUp, 
  ArrowDown, 
  Trophy, 
  Zap, 
  HelpCircle, 
  Copy, 
  Check, 
  ChevronRight,
  Award,
  LogOut
} from 'lucide-react';
import { 
  createGameSession, 
  processGuess, 
  calculateGameScore, 
  getPlayerRank, 
  GameMode, 
  GameSession, 
  GuessEvaluation,
  Proximity
} from '../../lib/gameLogic';
import { soundEffects } from '../../utils/soundEffects';
import { useApp } from '../../context/AppContext';

export const GuessingGameScreen: React.FC = () => {
  const { navigateTo } = useApp();

  // Settings & Configuration
  const [maxInput, setMaxInput] = useState<number>(100);
  const [selectedMode, setSelectedMode] = useState<GameMode>('classic');
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(soundEffects.getMuted());

  // Game State
  const [session, setSession] = useState<GameSession>(() => createGameSession(100, 'classic'));
  const [currentGuessInput, setCurrentGuessInput] = useState<string>('');
  const [lastEvaluation, setLastEvaluation] = useState<GuessEvaluation | null>(null);
  const [gameStarted, setGameStarted] = useState<boolean>(true);

  // Gamification & Addictive Stats
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [totalWins, setTotalWins] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [lastScore, setLastScore] = useState<number>(0);
  const [couponCopied, setCouponCopied] = useState<boolean>(false);

  // Blitz Timer State
  const [blitzSecondsLeft, setBlitzSecondsLeft] = useState<number>(60);
  const blitzTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Victory Confetti Canvas Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Load persistent stats
  useEffect(() => {
    try {
      const savedStats = localStorage.getItem('guess_game_stats');
      if (savedStats) {
        const parsed = JSON.parse(savedStats);
        setStreak(parsed.streak || 0);
        setBestStreak(parsed.bestStreak || 0);
        setTotalWins(parsed.totalWins || 0);
        setHighScore(parsed.highScore || 0);
      }
    } catch {}
  }, []);

  // Save persistent stats
  const updateStats = (won: boolean, score: number = 0) => {
    let newStreak = streak;
    let newBest = bestStreak;
    let newTotal = totalWins;
    let newHigh = highScore;

    if (won) {
      newStreak += 1;
      if (newStreak > newBest) newBest = newStreak;
      newTotal += 1;
      if (score > newHigh) newHigh = score;
    } else {
      newStreak = 0;
    }

    setStreak(newStreak);
    setBestStreak(newBest);
    setTotalWins(newTotal);
    setHighScore(newHigh);

    try {
      localStorage.setItem('guess_game_stats', JSON.stringify({
        streak: newStreak,
        bestStreak: newBest,
        totalWins: newTotal,
        highScore: newHigh,
      }));
    } catch {}
  };

  // Blitz timer effect
  useEffect(() => {
    if (session.mode === 'blitz' && session.status === 'active') {
      blitzTimerRef.current = setInterval(() => {
        setBlitzSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(blitzTimerRef.current!);
            handleTimeExpired();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (blitzTimerRef.current) clearInterval(blitzTimerRef.current);
    };
  }, [session.mode, session.status, session.id]);

  const handleTimeExpired = () => {
    soundEffects.playLifeLost();
    updateStats(false);
    setLastEvaluation({
      status: 'smaller',
      message: `Time's Up! The secret number was ${session.target}.`,
      guessNumber: null,
      random: session.target,
      newMinBound: session.currentMinBound,
      newMaxBound: session.currentMaxBound,
      remainingLives: 0,
      isGameOver: true,
      isVictory: false,
    });
  };

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If game is over and space or R is pressed, play again immediately
      if (lastEvaluation?.isGameOver) {
        if (e.code === 'Space' || e.key === 'r' || e.key === 'R') {
          e.preventDefault();
          startNewGame();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lastEvaluation]);

  // Focus input automatically
  useEffect(() => {
    if (inputRef.current && session.status === 'active') {
      inputRef.current.focus();
    }
  }, [session.status, session.attempts]);

  // Start a fresh game
  const startNewGame = (customMax?: number, customMode?: GameMode) => {
    const targetMax = customMax !== undefined ? customMax : maxInput;
    const targetMode = customMode !== undefined ? customMode : selectedMode;

    if (blitzTimerRef.current) clearInterval(blitzTimerRef.current);
    setBlitzSecondsLeft(60);

    const newSession = createGameSession(targetMax, targetMode);
    setSession(newSession);
    setLastEvaluation(null);
    setCurrentGuessInput('');
    setGameStarted(true);
    setCouponCopied(false);

    soundEffects.playClick();
  };

  // Handle Guess Submission
  const handleGuessSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentGuessInput.trim() || session.status !== 'active') return;

    soundEffects.playClick();
    const evaluation = processGuess(session, currentGuessInput);
    setLastEvaluation(evaluation);
    setCurrentGuessInput('');

    // Audio and feedback triggers
    if (evaluation.status === 'correct') {
      soundEffects.playVictory();
      const elapsedSeconds = Math.round((Date.now() - session.startTime) / 1000);
      const score = calculateGameScore(session.max, session.attempts, elapsedSeconds, streak + 1);
      setLastScore(score);
      updateStats(true, score);
      triggerConfetti();
    } else if (evaluation.status === 'larger') {
      soundEffects.playLarger();
      if (evaluation.proximity === 'boiling') soundEffects.playBoilingPing();
    } else if (evaluation.status === 'smaller') {
      soundEffects.playSmaller();
      if (evaluation.proximity === 'boiling') soundEffects.playBoilingPing();
    }

    if (session.mode === 'survival' && evaluation.remainingLives !== undefined && evaluation.remainingLives < session.maxLives) {
      if (evaluation.isGameOver && !evaluation.isVictory) {
        soundEffects.playLifeLost();
        updateStats(false);
      }
    }
  };

  // Handle Quit
  const handleQuit = () => {
    soundEffects.playClick();
    const evaluation = processGuess(session, 'quit');
    setLastEvaluation(evaluation);
    updateStats(false);
  };

  // Toggle Mute
  const handleToggleMute = () => {
    const muted = soundEffects.toggleMute();
    setIsAudioMuted(muted);
  };

  // Canvas Confetti Generator
  const triggerConfetti = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      r: number;
      d: number;
      color: string;
      tilt: number;
      tiltAngleIncremental: number;
      tiltAngle: number;
    }> = [];

    const colors = ['#10B981', '#F59E0B', '#6366F1', '#EC4899', '#06B6D4', '#8B5CF6'];
    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 8 + 3,
        d: Math.random() * 40 + 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.floor(Math.random() * 10) - 10,
        tiltAngleIncremental: Math.random() * 0.07 + 0.05,
        tiltAngle: 0,
      });
    }

    let animationFrameId: number;
    let step = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      step++;
      particles.forEach((p) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(step + p.d) + 3 + p.r / 2) * 1.5;
        p.tilt = Math.sin(p.tiltAngle - step / 3) * 15;

        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();
      });

      if (step < 180) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    render();
  };

  // Copy Coupon Code
  const copyCoupon = () => {
    navigator.clipboard.writeText('ORACLE15');
    setCouponCopied(true);
    setTimeout(() => setCouponCopied(false), 2000);
  };

  const rankInfo = getPlayerRank(totalWins, bestStreak);
  const remainingNumbers = session.currentMaxBound - session.currentMinBound + 1;

  // Proximity colors & icons
  const getProximityBadge = (prox?: Proximity) => {
    switch (prox) {
      case 'boiling':
        return { label: '🌋 BOILING HOT (≤2 away!)', bg: 'bg-rose-500 text-white animate-pulse' };
      case 'hot':
        return { label: '🔥 HOT FIRE (Very close!)', bg: 'bg-amber-500 text-white' };
      case 'warm':
        return { label: '☀️ WARM (Getting closer)', bg: 'bg-yellow-400 text-slate-900' };
      case 'cool':
        return { label: '🧊 COOL', bg: 'bg-cyan-500 text-white' };
      default:
        return { label: '❄️ FREEZING COLD', bg: 'bg-blue-600 text-white' };
    }
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-start py-4 px-2 sm:px-4">
      {/* Confetti Overlay Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-50 w-full h-full"
      />

      {/* Main Glassmorphic Arcade Container */}
      <div className="w-full max-w-2xl bg-white border border-slate-200/80 shadow-2xl rounded-3xl overflow-hidden transition-all duration-300">
        
        {/* Top Header & Gamification Bar */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white p-5 sm:p-6 border-b border-emerald-500/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{rankInfo.badge}</span>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  THE MIND READER
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-widest">
                    Arcade Edition
                  </span>
                </h1>
                <p className="text-xs text-slate-300 font-medium">
                  Rank: <strong className="text-emerald-400">{rankInfo.title}</strong>
                </p>
              </div>
            </div>

            {/* Audio Toggle & Quick Exit */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleMute}
                title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                {isAudioMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>
              <button
                onClick={() => navigateTo('products')}
                className="text-xs px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1"
              >
                Store <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Gamified Live Stat Badges */}
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-center">
            <div className="bg-slate-900/70 p-2 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Streak</div>
              <div className="text-base font-black text-amber-400 flex items-center justify-center gap-0.5">
                <Flame className="w-4 h-4 fill-amber-400 text-amber-400 animate-bounce" />
                {streak}x
              </div>
            </div>
            <div className="bg-slate-900/70 p-2 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Best Streak</div>
              <div className="text-base font-black text-emerald-400">{bestStreak}x</div>
            </div>
            <div className="bg-slate-900/70 p-2 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Wins</div>
              <div className="text-base font-black text-cyan-400">{totalWins}</div>
            </div>
            <div className="bg-slate-900/70 p-2 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">High Score</div>
              <div className="text-base font-black text-purple-400">{highScore}</div>
            </div>
          </div>
        </div>

        {/* Mode Selector & Difficulty Tabs */}
        <div className="bg-slate-100/80 px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Modes */}
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-500 mr-1">Mode:</span>
            <button
              onClick={() => { setSelectedMode('classic'); startNewGame(maxInput, 'classic'); }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedMode === 'classic'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              🎯 Classic
            </button>
            <button
              onClick={() => { setSelectedMode('survival'); startNewGame(maxInput, 'survival'); }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedMode === 'survival'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              💖 Survival (7 Lives)
            </button>
            <button
              onClick={() => { setSelectedMode('blitz'); startNewGame(maxInput, 'blitz'); }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedMode === 'blitz'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              ⚡ 60s Blitz
            </button>
          </div>

          {/* Quick Max Range Presets */}
          <div className="flex items-center gap-1">
            <span className="font-semibold text-slate-500">Max:</span>
            {[50, 100, 500].map((val) => (
              <button
                key={val}
                onClick={() => { setMaxInput(val); startNewGame(val, selectedMode); }}
                className={`px-2 py-1 rounded font-mono text-[11px] font-bold ${
                  maxInput === val 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>

        {/* Live Active Game Panel */}
        <div className="p-5 sm:p-6 space-y-6">

          {/* Mode Special Status Indicators */}
          {session.mode === 'survival' && (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
                Remaining Lives:
              </span>
              <div className="flex gap-1">
                {Array.from({ length: 7 }).map((_, i) => (
                  <Heart
                    key={i}
                    className={`w-5 h-5 transition-transform ${
                      i < session.remainingLives
                        ? 'fill-rose-500 text-rose-500 scale-100'
                        : 'fill-slate-200 text-slate-300 scale-90'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {session.mode === 'blitz' && (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600 animate-spin" />
                Blitz Time Remaining:
              </span>
              <span className={`font-mono text-lg font-black ${blitzSecondsLeft <= 10 ? 'text-rose-600 animate-pulse' : 'text-amber-800'}`}>
                {blitzSecondsLeft}s
              </span>
            </div>
          )}

          {/* THE "RANGE SQUEEZE" VISUALIZER */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-inner border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1 text-emerald-400">
                <Zap className="w-3.5 h-3.5" /> Possibility Constriction Bar
              </span>
              <span className="font-mono text-amber-300 font-bold">
                {remainingNumbers} numbers left
              </span>
            </div>

            {/* Interactive Dynamic Range Slider */}
            <div className="relative h-8 bg-slate-950 rounded-xl overflow-hidden flex items-center px-3 border border-slate-800">
              <div 
                className="absolute inset-y-0 bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 opacity-90 transition-all duration-500 rounded-lg shadow-lg"
                style={{
                  left: `${((session.currentMinBound - 1) / session.max) * 100}%`,
                  right: `${((session.max - session.currentMaxBound) / session.max) * 100}%`,
                }}
              />
              <div className="relative z-10 w-full flex justify-between text-xs font-mono font-black text-white drop-shadow">
                <span>Min: {session.currentMinBound}</span>
                <span className="text-amber-200">? SECRET ?</span>
                <span>Max: {session.currentMaxBound}</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2 font-mono">
              <span>Start: 1</span>
              <span>Total Range: 1 to {session.max}</span>
              <span>End: {session.max}</span>
            </div>
          </div>

          {/* HINT BANNER & STATUS NOTIFICATION */}
          {lastEvaluation && (
            <div className={`p-4 rounded-2xl border transition-all animate-fadeIn ${
              lastEvaluation.isVictory
                ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-md shadow-emerald-100'
                : lastEvaluation.isGameOver
                ? 'bg-rose-50 border-rose-300 text-rose-950'
                : lastEvaluation.status === 'larger'
                ? 'bg-amber-50 border-amber-300 text-amber-950'
                : lastEvaluation.status === 'smaller'
                ? 'bg-cyan-50 border-cyan-300 text-cyan-950'
                : 'bg-slate-100 border-slate-300 text-slate-800'
            }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  {lastEvaluation.status === 'larger' && (
                    <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0">
                      <ArrowDown className="w-5 h-5" />
                    </div>
                  )}
                  {lastEvaluation.status === 'smaller' && (
                    <div className="w-9 h-9 rounded-xl bg-cyan-600 text-white flex items-center justify-center font-bold shrink-0">
                      <ArrowUp className="w-5 h-5" />
                    </div>
                  )}
                  {lastEvaluation.isVictory && (
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                  )}
                  {lastEvaluation.isGameOver && !lastEvaluation.isVictory && (
                    <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold shrink-0">
                      <LogOut className="w-5 h-5" />
                    </div>
                  )}

                  <div>
                    <div className="font-bold text-sm sm:text-base">
                      {lastEvaluation.message}
                    </div>
                    {lastEvaluation.proximity && !lastEvaluation.isVictory && (
                      <div className="mt-1">
                        <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full ${getProximityBadge(lastEvaluation.proximity).bg}`}>
                          {getProximityBadge(lastEvaluation.proximity).label}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[11px] text-slate-500 font-mono">Attempts</div>
                  <div className="font-mono font-black text-base text-slate-900">{session.attempts}</div>
                </div>
              </div>
            </div>
          )}

          {/* VICTORY CELEBRATION MODAL */}
          {lastEvaluation?.isVictory && (
            <div className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white p-6 rounded-3xl shadow-xl text-center space-y-4 animate-scaleUp">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 text-3xl">
                🏆
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                GENIUS! YOU NAILED IT!
              </h2>
              <p className="text-sm text-emerald-100 max-w-md mx-auto">
                The mystery number was <strong className="text-amber-300 font-mono text-lg">{lastEvaluation.random}</strong>. Solved in only <strong>{session.attempts} guesses</strong>!
              </p>

              {/* Reward Score & Multiplier */}
              <div className="grid grid-cols-3 gap-2 bg-black/20 p-3 rounded-2xl max-w-sm mx-auto text-center">
                <div>
                  <div className="text-[10px] text-emerald-200 uppercase font-semibold">Score</div>
                  <div className="text-lg font-black text-amber-300 font-mono">+{lastScore}</div>
                </div>
                <div>
                  <div className="text-[10px] text-emerald-200 uppercase font-semibold">Streak</div>
                  <div className="text-lg font-black text-white font-mono">{streak}x 🔥</div>
                </div>
                <div>
                  <div className="text-[10px] text-emerald-200 uppercase font-semibold">Rank</div>
                  <div className="text-xs font-bold text-emerald-300">{rankInfo.title}</div>
                </div>
              </div>

              {/* Store Discount Unlock */}
              <div className="bg-white/10 border border-white/20 p-3.5 rounded-2xl max-w-md mx-auto flex items-center justify-between gap-3 text-left">
                <div>
                  <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">🎉 Secret Store Perk Unlocked</div>
                  <div className="text-xs text-emerald-100">Use code <strong className="font-mono text-white">ORACLE15</strong> for 15% off cart!</div>
                </div>
                <button
                  onClick={copyCoupon}
                  className="px-3 py-1.5 rounded-xl bg-white text-emerald-900 font-bold text-xs hover:bg-emerald-50 transition-colors flex items-center gap-1 shrink-0"
                >
                  {couponCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {couponCopied ? 'Copied' : 'Copy'}
                </button>
              </div>

              {/* Instant Dopamine Replay Action */}
              <div className="pt-2">
                <button
                  onClick={() => startNewGame()}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-base shadow-lg transition-transform transform active:scale-95 flex items-center justify-center gap-2 mx-auto"
                >
                  <RotateCcw className="w-5 h-5" />
                  PLAY AGAIN (Press Space)
                </button>
              </div>
            </div>
          )}

          {/* GAME OVER (LOST / QUIT) SCREEN */}
          {lastEvaluation?.isGameOver && !lastEvaluation.isVictory && (
            <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl text-center space-y-4">
              <div className="text-3xl">💀</div>
              <h2 className="text-xl sm:text-2xl font-black">
                {lastEvaluation.status === 'quit' ? 'GAME FORFEITED' : 'OUT OF ATTEMPTS'}
              </h2>
              <p className="text-sm text-slate-300">
                The secret number was <strong className="text-emerald-400 font-mono text-base">{lastEvaluation.random}</strong>.
              </p>
              <button
                onClick={() => startNewGame()}
                className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition-transform active:scale-95 flex items-center gap-2 mx-auto"
              >
                <RotateCcw className="w-4 h-4" />
                TRY AGAIN (Press Space)
              </button>
            </div>
          )}

          {/* MAIN GUESS INPUT & ACTION FORM */}
          {session.status === 'active' && (
            <form onSubmit={handleGuessSubmit} className="space-y-4">
              <div className="relative">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Enter Your Guess (1 to {session.max}):
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      ref={inputRef}
                      type="number"
                      min={1}
                      max={session.max}
                      value={currentGuessInput}
                      onChange={(e) => setCurrentGuessInput(e.target.value)}
                      placeholder={`Enter number between ${session.currentMinBound} and ${session.currentMaxBound}`}
                      className="w-full h-14 px-4 text-xl sm:text-2xl font-mono font-bold text-slate-900 bg-slate-50 border-2 border-slate-300 focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all placeholder:text-slate-400 placeholder:text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="h-14 px-6 sm:px-8 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-base sm:text-lg rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0"
                  >
                    GUESS <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Quick Nudge Buttons & Controls */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-medium">Quick input:</span>
                  {[
                    Math.round((session.currentMinBound + session.currentMaxBound) / 2),
                    session.currentMinBound,
                    session.currentMaxBound,
                  ]
                    .filter((v, i, a) => a.indexOf(v) === i)
                    .map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setCurrentGuessInput(String(val))}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 font-mono font-bold text-slate-700 transition-colors"
                      >
                        {val === Math.round((session.currentMinBound + session.currentMaxBound) / 2) ? `Mid (${val})` : val}
                      </button>
                    ))}
                </div>

                {/* Quit Game button faithfully matching logic */}
                <button
                  type="button"
                  onClick={handleQuit}
                  className="text-slate-400 hover:text-rose-600 transition-colors font-medium flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" /> Quit Game
                </button>
              </div>
            </form>
          )}

          {/* GUESS HISTORY CAROUSEL / TIMELINE */}
          {session.history.length > 0 && (
            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-bold uppercase tracking-wider">Previous Guesses ({session.history.length})</span>
                <span>Recent first</span>
              </div>
              <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-1">
                {session.history.slice().reverse().map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-slate-800"
                  >
                    <span className="text-slate-400 font-normal">#{session.history.length - idx}:</span>
                    <span className="text-slate-900">{item.guess}</span>
                    {item.hint === 'larger' ? (
                      <span className="text-amber-600 flex items-center text-[10px]">
                        <ArrowDown className="w-3 h-3" /> HIGH
                      </span>
                    ) : (
                      <span className="text-cyan-600 flex items-center text-[10px]">
                        <ArrowUp className="w-3 h-3" /> LOW
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Bottom Game Engine & Code Information Box */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Powered by <code>Math.floor(Math.random() * max) + 1</code></span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => startNewGame()}
              className="hover:text-emerald-600 font-semibold flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset Game
            </button>
            <span>Press <strong>Enter</strong> to Guess</span>
          </div>
        </div>

      </div>
    </div>
  );
};
