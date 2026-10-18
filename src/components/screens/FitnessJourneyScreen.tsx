'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { PlanId, WorkoutExerciseItem, GeneratedWorkout } from '../../types';
import { generateWorkout } from '../../utils/workoutGenerator';
import { PlanGate, UpgradeModal } from '../PlanGate';
import { 
  Sparkles, 
  Dumbbell, 
  Flame, 
  Timer, 
  RotateCw, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Star, 
  Award, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  Zap, 
  BarChart3, 
  Lock, 
  Activity, 
  TrendingUp, 
  User, 
  X,
  Target,
  CheckSquare,
  Square
} from 'lucide-react';

interface FitnessJourneyScreenProps {
  initialPlan?: PlanId;
}

export const FitnessJourneyScreen: React.FC<FitnessJourneyScreenProps> = ({ initialPlan }) => {
  const { 
    profile, 
    currentUser, 
    isPremium, 
    isUpgradeModalOpen, 
    upgradeTriggerFeature, 
    openUpgradeModal, 
    closeUpgradeModal,
    workoutSessions,
    saveWorkoutSession,
    coaches,
    requestAppointment,
    navigateTo 
  } = useApp();

  // 1. Resolve Initial Plan from prop, query string, or profile.goal
  const resolvedDefaultPlan = useMemo<PlanId>(() => {
    if (initialPlan) return initialPlan;
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const qPlan = params.get('plan');
      if (qPlan === 'build-muscle' || qPlan === 'weight-loss' || qPlan === 'get-fit') {
        return qPlan;
      }
    }
    if (profile.goal === 'Muscle Gain') return 'build-muscle';
    if (profile.goal === 'Fat Loss') return 'weight-loss';
    return 'get-fit';
  }, [initialPlan, profile.goal]);

  const [activePlan, setActivePlan] = useState<PlanId>(resolvedDefaultPlan);
  const [lockedPlan, setLockedPlan] = useState<PlanId>(resolvedDefaultPlan);

  // Sync plan if URL search param updates
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const qPlan = params.get('plan');
      if (qPlan === 'build-muscle' || qPlan === 'weight-loss' || qPlan === 'get-fit') {
        setActivePlan(qPlan);
        setLockedPlan(qPlan);
      }
    }
  }, []);

  // 2. Active Workout state (generated dynamically)
  const [currentWorkout, setCurrentWorkout] = useState<GeneratedWorkout>(() => 
    generateWorkout(activePlan, profile)
  );
  const [completedExerciseIds, setCompletedExerciseIds] = useState<string[]>([]);
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);
  const [sessionSuccessToast, setSessionSuccessToast] = useState<string | null>(null);

  // Generate new workout when activePlan changes
  const handleRegenerate = (targetPlan = activePlan) => {
    const workout = generateWorkout(targetPlan, profile);
    setCurrentWorkout(workout);
    setCompletedExerciseIds([]);
  };

  // Plan Switching Logic with Freemium Check
  const handleSelectPlan = (planId: PlanId) => {
    if (planId === activePlan) return;

    if (!isPremium && planId !== lockedPlan) {
      // Free users are restricted to 1 active plan at a time
      openUpgradeModal('multi-plan');
      return;
    }

    setActivePlan(planId);
    handleRegenerate(planId);
  };

  // Exercise checkbox toggle
  const toggleExerciseDone = (id: string) => {
    setCompletedExerciseIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // 4. Complete Workout
  const handleCompleteWorkout = () => {
    if (completedExerciseIds.length === 0) return;

    const todayIso = new Date().toISOString().split('T')[0];
    const completedItems = currentWorkout.exercises.filter(ex => completedExerciseIds.includes(ex.id));
    const completedCalories = completedItems.reduce((sum, ex) => sum + ex.computedCalories, 0);
    const completedDuration = completedItems.reduce((sum, ex) => sum + ex.computedDurationMin, 0);

    saveWorkoutSession({
      planId: activePlan,
      date: todayIso,
      exercisesCompleted: completedExerciseIds,
      totalCalories: completedCalories,
      durationMin: Math.max(10, completedDuration)
    });

    setSessionSuccessToast(`🔥 Workout logged! Burned ${completedCalories} kcal across ${completedExerciseIds.length} completed exercises.`);
    setCompletedExerciseIds([]);
    setTimeout(() => setSessionSuccessToast(null), 5000);
  };

  // 5. Compute Live Analytics for Current User
  const userSessions = useMemo(() => {
    const uid = currentUser?.id || 'guest-user';
    return workoutSessions.filter(s => s.userId === uid);
  }, [workoutSessions, currentUser]);

  const analytics = useMemo(() => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const thisWeekSessions = userSessions.filter(s => {
      const sDate = new Date(s.date);
      return sDate >= sevenDaysAgo;
    });

    const weeklyCalories = thisWeekSessions.reduce((sum, s) => sum + s.totalCalories, 0);
    const weeklyCount = thisWeekSessions.length;

    // Calculate current consecutive day streak
    const uniqueDates = Array.from(new Set(userSessions.map(s => s.date))).sort().reverse();
    let streak = 0;
    const checkDate = new Date();

    for (let i = 0; i < 30; i++) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (uniqueDates.includes(dateStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (i === 0) {
        // Today might not be completed yet; check yesterday before terminating streak
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // 7-day distribution array for chart
    const last7DaysData = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      const daySessions = userSessions.filter(s => s.date === dStr);
      const dayKcal = daySessions.reduce((sum, s) => sum + s.totalCalories, 0);
      last7DaysData.push({
        day: dayNames[d.getDay()],
        date: dStr,
        calories: dayKcal,
        isToday: i === 0
      });
    }

    const maxChartKcal = Math.max(...last7DaysData.map(d => d.calories), 500);

    // All-time totals for Premium
    const allTimeCalories = userSessions.reduce((sum, s) => sum + s.totalCalories, 0);
    const allTimeSessions = userSessions.length;

    return {
      weeklyCalories,
      weeklyCount,
      streak,
      last7DaysData,
      maxChartKcal,
      allTimeCalories,
      allTimeSessions
    };
  }, [userSessions]);

  // 6. Coach Booking Modal state
  const [selectedCoach, setSelectedCoach] = useState<any | null>(null);
  const [bookingDate, setBookingDate] = useState(() => {
    const tmrw = new Date();
    tmrw.setDate(tmrw.getDate() + 1);
    return tmrw.toISOString().split('T')[0];
  });
  const [bookingTime, setBookingTime] = useState('11:00 AM');
  const [bookingMessage, setBookingMessage] = useState('');
  const [bookingToast, setBookingToast] = useState<string | null>(null);

  // Sort coaches: those matching current plan appear first
  const sortedCoaches = useMemo(() => {
    return [...coaches].sort((a, b) => {
      const aMatches = a.specializations.includes(activePlan) ? 1 : 0;
      const bMatches = b.specializations.includes(activePlan) ? 1 : 0;
      return bMatches - aMatches;
    });
  }, [coaches, activePlan]);

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCoach) return;

    /* Note: since this is a static site with no shared backend, both the customer and coach sides
       read/write the same browser's localStorage — fine for a single-machine demo, not for a real multi-user deployment. */
    requestAppointment({
      coachId: selectedCoach.id,
      date: bookingDate,
      time: bookingTime,
      planId: activePlan,
      message: bookingMessage || `Looking for guidance on ${activePlan === 'build-muscle' ? 'hypertrophy & mass' : activePlan === 'weight-loss' ? 'deficit & cardio' : 'functional fitness'}.`
    });

    setSelectedCoach(null);
    setBookingMessage('');
    setBookingToast('✓ Appointment request sent! Check status in your profile.');
    setTimeout(() => setBookingToast(null), 4000);
  };

  return (
    <div className="space-y-10 pb-20">
      {/* ─── HEADER & BANNER ─── */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-900 p-6 sm:p-10 text-white overflow-hidden shadow-soft border border-emerald-800/30">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black tracking-wide border border-emerald-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Algorithmic Fitness Journey</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Transform Your Body with Evidence-Based Training
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            Personalized routine computed for your <strong className="text-emerald-400">{profile.weight}kg</strong> body weight and <strong className="text-emerald-400">{profile.activity}</strong> training frequency with precision MET caloric burn tracking.
          </p>
        </div>

        {/* Floating background badge */}
        <div className="absolute right-4 -bottom-6 text-emerald-500/10 pointer-events-none hidden md:block">
          <Dumbbell className="w-64 h-64" />
        </div>
      </div>

      {/* ─── 1. PLAN SELECTOR (3 CARDS) ─── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-950 tracking-tight flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-600" />
              <span>Choose Your Target Training Plan</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select an objective to dynamically calibrate exercises, rep schemes, and energy expenditure.
            </p>
          </div>

          {!isPremium && (
            <button
              onClick={() => openUpgradeModal('multi-plan')}
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Unlock All Plans</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Plan 1: Get Fit */}
          <button
            onClick={() => handleSelectPlan('get-fit')}
            className={`p-5 rounded-2xl text-left border-2 transition-all relative flex flex-col justify-between ${
              activePlan === 'get-fit'
                ? 'border-emerald-600 bg-emerald-50/50 shadow-soft ring-2 ring-emerald-500/20'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl p-2 rounded-xl bg-emerald-100 text-emerald-800">🏃</span>
                {activePlan === 'get-fit' && (
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                    Active Plan
                  </span>
                )}
                {!isPremium && lockedPlan !== 'get-fit' && (
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> Premium
                  </span>
                )}
              </div>
              <h3 className="font-black text-slate-900 text-base">Get Fit & Functional</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Balanced athletic conditioning, functional mobility, and steady daily stamina.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] font-bold text-emerald-800 flex items-center gap-1">
              <span>Balanced Strength & Cardio</span>
            </div>
          </button>

          {/* Plan 2: Build Muscle */}
          <button
            onClick={() => handleSelectPlan('build-muscle')}
            className={`p-5 rounded-2xl text-left border-2 transition-all relative flex flex-col justify-between ${
              activePlan === 'build-muscle'
                ? 'border-emerald-600 bg-emerald-50/50 shadow-soft ring-2 ring-emerald-500/20'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl p-2 rounded-xl bg-emerald-100 text-emerald-800">💪</span>
                {activePlan === 'build-muscle' && (
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                    Active Plan
                  </span>
                )}
                {!isPremium && lockedPlan !== 'build-muscle' && (
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> Premium
                  </span>
                )}
              </div>
              <h3 className="font-black text-slate-900 text-base">Build Muscle (Hypertrophy)</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Progressive mechanical overload, compound resistance, and lean tissue growth.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] font-bold text-emerald-800 flex items-center gap-1">
              <span>Skews Strength & High Resistance</span>
            </div>
          </button>

          {/* Plan 3: Weight Loss */}
          <button
            onClick={() => handleSelectPlan('weight-loss')}
            className={`p-5 rounded-2xl text-left border-2 transition-all relative flex flex-col justify-between ${
              activePlan === 'weight-loss'
                ? 'border-emerald-600 bg-emerald-50/50 shadow-soft ring-2 ring-emerald-500/20'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl p-2 rounded-xl bg-emerald-100 text-emerald-800">🔥</span>
                {activePlan === 'weight-loss' && (
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                    Active Plan
                  </span>
                )}
                {!isPremium && lockedPlan !== 'weight-loss' && (
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> Premium
                  </span>
                )}
              </div>
              <h3 className="font-black text-slate-900 text-base">Weight Loss & Fat Shred</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                High-cadence metabolic conditioning, elevated EPOC, and optimal fat oxidation.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] font-bold text-emerald-800 flex items-center gap-1">
              <span>Skews High-MET Cardio & Intervals</span>
            </div>
          </button>
        </div>
      </section>

      {/* ─── 2 & 3. WORKOUT GENERATOR & EXERCISE LIST ─── */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft space-y-6">
        {/* Workout Bar Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-950 tracking-tight">Today&apos;s Tailored Routine</h2>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {currentWorkout.exercises.length} Exercises
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Algorithmically weighted for <strong className="text-slate-800 uppercase">{activePlan.replace('-', ' ')}</strong> at {profile.weight}kg.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Calorie and Time Badges */}
            <div className="flex items-center gap-3 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 text-xs">
              <div className="flex items-center gap-1 text-amber-600 font-bold">
                <Flame className="w-4 h-4 fill-amber-500" />
                <span>{currentWorkout.totalCalories} kcal</span>
              </div>
              <span className="text-slate-300">|</span>
              <div className="flex items-center gap-1 text-slate-700 font-bold">
                <Timer className="w-4 h-4 text-emerald-600" />
                <span>~{currentWorkout.totalDurationMin} min</span>
              </div>
            </div>

            {/* Regenerate Button */}
            <button
              onClick={() => handleRegenerate()}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors active:scale-95"
              title="Compute new randomized exercise set"
            >
              <RotateCw className="w-3.5 h-3.5 text-emerald-600" />
              <span>Regenerate</span>
            </button>
          </div>
        </div>

        {/* Toast notice */}
        {sessionSuccessToast && (
          <div className="p-4 bg-emerald-600 text-white rounded-2xl flex items-center gap-3 text-xs font-bold shadow-emerald animate-fade-in">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{sessionSuccessToast}</span>
          </div>
        )}

        {/* Exercise Cards */}
        <div className="space-y-3">
          {currentWorkout.exercises.map((exercise: WorkoutExerciseItem, index: number) => {
            const isDone = completedExerciseIds.includes(exercise.id);
            const isExpanded = expandedExerciseId === exercise.id;

            return (
              <div
                key={exercise.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isDone 
                    ? 'bg-emerald-50/40 border-emerald-300 shadow-xs' 
                    : 'bg-white border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left: Checkbox & Name */}
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      onClick={() => toggleExerciseDone(exercise.id)}
                      className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors"
                      aria-label="Mark exercise done"
                    >
                      {isDone ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-300" />
                      )}
                    </button>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-400">0{index + 1}.</span>
                        <h4 className={`font-black text-sm sm:text-base ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {exercise.name}
                        </h4>
                        
                        {/* Muscle Group Tag */}
                        <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                          {exercise.muscleGroup}
                        </span>

                        {/* Difficulty Badge */}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          exercise.difficulty === 'Beginner'
                            ? 'bg-blue-50 text-blue-700'
                            : exercise.difficulty === 'Intermediate'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}>
                          {exercise.difficulty}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-0.5 font-medium">
                        <span className="font-bold text-slate-900 flex items-center gap-1">
                          <Dumbbell className="w-3.5 h-3.5 text-emerald-600" />
                          {exercise.mode === 'reps' 
                            ? `${exercise.defaultSets} Sets × ${exercise.defaultReps} Reps`
                            : `${exercise.defaultDurationMin} Min Duration`}
                        </span>

                        <span>•</span>

                        <span className="text-slate-500">
                          Equipment: <strong className="text-slate-700">{exercise.equipment}</strong>
                        </span>

                        <span>•</span>

                        <span className="text-amber-700 font-bold flex items-center gap-0.5">
                          <Flame className="w-3.5 h-3.5 text-amber-500" />
                          ~{exercise.computedCalories} kcal
                        </span>
                      </div>

                      {/* Expandable description */}
                      {isExpanded && (
                        <p className="text-xs text-slate-500 mt-2 bg-slate-50 p-3 rounded-xl leading-relaxed border border-slate-100 animate-fade-in">
                          {exercise.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Expand Toggle */}
                  <button
                    onClick={() => setExpandedExerciseId(isExpanded ? null : exercise.id)}
                    className="text-slate-400 hover:text-slate-600 p-1 transition-colors"
                    aria-label="Toggle exercise description"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 4. Complete Workout Action Bar */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-slate-500 font-medium">
            Progress: <strong className="text-slate-900 font-bold">{completedExerciseIds.length}</strong> of {currentWorkout.exercises.length} exercises completed
          </div>

          <button
            onClick={handleCompleteWorkout}
            disabled={completedExerciseIds.length === 0}
            className={`py-3 px-6 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              completedExerciseIds.length > 0
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald shadow-sm active:scale-98 cursor-pointer'
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Complete Workout & Log Calories</span>
          </button>
        </div>
      </section>

      {/* ─── 5. MINI ANALYTICS PANEL (LIVE FROM WORKOUTSESSIONS) ─── */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft space-y-6">
        <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-black text-slate-950 tracking-tight flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              <span>Training Analytics & Caloric Momentum</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Computed live from your verified logged workout sessions. Never hardcoded.
            </p>
          </div>

          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-xl self-start sm:self-auto">
            Rolling 7-Day Window
          </span>
        </div>

        {userSessions.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 space-y-3">
            <Activity className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800 text-sm">Complete your first workout to see your stats</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Check off at least one exercise in today&apos;s routine above and click &ldquo;Complete Workout&rdquo; to initiate your streak and live charts.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stat Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-1">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">This Week&apos;s Calories</span>
                <div className="text-2xl sm:text-3xl font-black text-slate-950 flex items-baseline gap-1">
                  <span>{analytics.weeklyCalories}</span>
                  <span className="text-xs font-bold text-emerald-700">kcal</span>
                </div>
                <p className="text-[11px] text-slate-500">Across sessions in the last 7 days</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Workouts This Week</span>
                <div className="text-2xl sm:text-3xl font-black text-slate-950 flex items-baseline gap-1">
                  <span>{analytics.weeklyCount}</span>
                  <span className="text-xs font-bold text-slate-500">sessions</span>
                </div>
                <p className="text-[11px] text-slate-500">Target: 3-5 sessions / week</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-1">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">Current Day Streak</span>
                <div className="text-2xl sm:text-3xl font-black text-slate-950 flex items-baseline gap-1">
                  <span>{analytics.streak}</span>
                  <span className="text-xs font-bold text-amber-600">days in a row</span>
                </div>
                <p className="text-[11px] text-slate-500">Consecutive days with logged sessions</p>
              </div>
            </div>

            {/* 7-Day Bar Chart */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600 font-bold">
                <span>Daily Caloric Expenditure</span>
                <span className="text-[11px] text-slate-400">Peak: {analytics.maxChartKcal} kcal</span>
              </div>

              <div className="grid grid-cols-7 gap-2 sm:gap-4 h-36 items-end pt-4 border-b border-slate-200">
                {analytics.last7DaysData.map((item, idx) => {
                  const heightPercent = Math.max(8, Math.min(100, Math.round((item.calories / analytics.maxChartKcal) * 100)));

                  return (
                    <div key={idx} className="flex flex-col items-center h-full justify-end group">
                      <span className="text-[10px] font-mono font-bold text-slate-500 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.calories}
                      </span>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full max-w-[36px] rounded-t-lg transition-all ${
                          item.calories > 0
                            ? item.isToday 
                              ? 'bg-emerald-600 shadow-sm' 
                              : 'bg-emerald-400'
                            : 'bg-slate-200'
                        }`}
                      />
                      <span className={`text-[10px] font-bold mt-2 ${item.isToday ? 'text-emerald-700' : 'text-slate-500'}`}>
                        {item.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Extended Analytics (Gated to Premium) */}
            <PlanGate feature="full-analytics">
              <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-emerald-950 text-white space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                    <h4 className="font-black text-sm text-white">Full Historical & Muscle Group Breakdown</h4>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-400/30">
                    Premium Active
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                    <span className="text-slate-400 text-[11px]">All-Time Sessions</span>
                    <div className="text-xl font-black text-white mt-0.5">{analytics.allTimeSessions}</div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                    <span className="text-slate-400 text-[11px]">All-Time Calories</span>
                    <div className="text-xl font-black text-emerald-400 mt-0.5">{analytics.allTimeCalories} kcal</div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                    <span className="text-slate-400 text-[11px]">Primary Stimulus</span>
                    <div className="text-xl font-black text-white mt-0.5 uppercase">{activePlan.replace('-', ' ')}</div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                    <span className="text-slate-400 text-[11px]">Metabolic Factor</span>
                    <div className="text-xl font-black text-emerald-300 mt-0.5">High Efficiency</div>
                  </div>
                </div>
              </div>
            </PlanGate>
          </div>
        )}
      </section>

      {/* ─── 6. COACH APPOINTMENT SECTION (BOTTOM) ─── */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-black text-slate-950 tracking-tight flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              <span>Get Personal Guidance</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              1-on-1 consultations with verified exercise physiologists, strength coaches, and certified nutritionists.
            </p>
          </div>

          <button
            onClick={() => navigateTo('coach-onboard')}
            className="text-xs font-bold text-slate-600 hover:text-emerald-700 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Are you a trainer? Apply as Coach →</span>
          </button>
        </div>

        {/* Coach Toast notice */}
        {bookingToast && (
          <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center gap-3 text-xs font-bold shadow-md animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>{bookingToast}</span>
          </div>
        )}

        {/* Coach Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {sortedCoaches.map((coach) => {
            const matchesCurrentPlan = coach.specializations.includes(activePlan);

            return (
              <div 
                key={coach.id}
                className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                  matchesCurrentPlan 
                    ? 'bg-white border-emerald-300 shadow-soft' 
                    : 'bg-white border-slate-200/80 shadow-xs'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <img 
                      src={coach.photo} 
                      alt={coach.name} 
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = '/purepro-logo.png';
                      }}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/40 flex-shrink-0 shadow-sm"
                    />

                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-black text-slate-900 text-base">{coach.name}</h4>
                        <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{coach.rating}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 font-medium">
                        {coach.experienceYears} Years Clinical Experience • <strong className="text-emerald-700">Pre-Verified Coach</strong>
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {coach.specializations.map((spec: PlanId) => (
                          <span 
                            key={spec}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                              spec === activePlan 
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {spec.replace('-', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {coach.bio}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Specialized in: <strong className="text-slate-800 uppercase">{activePlan.replace('-', ' ')}</strong>
                  </span>

                  <button
                    onClick={() => setSelectedCoach(coach)}
                    className="py-2 px-4 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Request Appointment</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── BOOKING MODAL ─── */}
      {selectedCoach && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-950 to-emerald-950 p-6 text-white relative">
              <button
                onClick={() => setSelectedCoach(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                <img
                  src={selectedCoach.photo}
                  alt={selectedCoach.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = '/purepro-logo.png';
                  }}
                  className="w-12 h-12 rounded-xl object-cover border border-emerald-400"
                />
                <div>
                  <h3 className="font-black text-lg text-white">Book 1-on-1 Consultation</h3>
                  <p className="text-xs text-emerald-300 font-medium">with {selectedCoach.name}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleBookAppointment} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Preferred Date</label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Time Slot</label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                  >
                    <option value="09:00 AM">09:00 AM - 09:45 AM</option>
                    <option value="11:00 AM">11:00 AM - 11:45 AM</option>
                    <option value="02:00 PM">02:00 PM - 02:45 PM</option>
                    <option value="05:00 PM">05:00 PM - 05:45 PM</option>
                    <option value="07:00 PM">07:00 PM - 07:45 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Fitness Goal / Focus Plan</label>
                <input
                  type="text"
                  disabled
                  value={activePlan === 'build-muscle' ? 'Build Muscle (Hypertrophy & Strength)' : activePlan === 'weight-loss' ? 'Weight Loss (Metabolic Deficit)' : 'Get Fit (Daily Athletic Conditioning)'}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-100 text-xs font-bold text-slate-700 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Notes or Special Requirements</label>
                <textarea
                  rows={3}
                  placeholder="Share details on current injuries, specific lifting milestones, or nutrition questions..."
                  value={bookingMessage}
                  onChange={(e) => setBookingMessage(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-emerald flex items-center justify-center gap-2 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Appointment Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Freemium Upgrade Modal */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={closeUpgradeModal}
        triggeredFeature={upgradeTriggerFeature}
      />
    </div>
  );
};
