import { Exercise, PlanId, UserProfile, WorkoutExerciseItem, GeneratedWorkout, ExerciseDifficulty } from '../types';
import rawExercises from '../data/exercises.json';

const allExercises: Exercise[] = rawExercises as Exercise[];

/**
 * Pure, unit-testable workout generator function
 * Computes a weighted, randomized 6-8 exercise routine adapted to user physiology.
 */
export function generateWorkout(planId: PlanId, profile: Partial<UserProfile> = {}): GeneratedWorkout {
  // 1. Resolve weight and activity level
  const weightKg = (profile as any).weight_kg ?? profile.weight ?? 70;
  const activityRaw = ((profile as any).activity_level ?? profile.activity ?? 'Moderate').toLowerCase();

  let targetTier: ExerciseDifficulty = 'Intermediate';
  let allowedTiers: ExerciseDifficulty[] = ['Intermediate', 'Beginner'];

  if (activityRaw.includes('sedentary') || activityRaw.includes('low')) {
    targetTier = 'Beginner';
    allowedTiers = ['Beginner'];
  } else if (activityRaw.includes('high') || activityRaw.includes('athlete')) {
    targetTier = 'Advanced';
    allowedTiers = ['Advanced', 'Intermediate'];
  } else {
    targetTier = 'Intermediate';
    allowedTiers = ['Intermediate', 'Beginner'];
  }

  // 2. Filter exercises by target plan
  let planPool = allExercises.filter(ex => ex.targetPlans.includes(planId));

  // 3. Filter by difficulty tiers (include target tier plus one tier easier)
  let tieredPool = planPool.filter(ex => allowedTiers.includes(ex.difficulty));
  if (tieredPool.length < 6) {
    tieredPool = planPool; // Fallback to ensure pool is never starving
  }

  // 4. Compute weight for weighted random selection
  // Build Muscle skews Strength; Weight Loss skews Cardio/Metabolic; Get Fit is balanced
  const weightedPool = tieredPool.map(ex => {
    let weightScore = 1.0;

    if (planId === 'build-muscle') {
      const isStrength = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Hamstrings', 'Glutes'].includes(ex.muscleGroup);
      const isResistance = ['Dumbbell', 'Machine'].includes(ex.equipment) || ex.mode === 'reps';
      if (isStrength && isResistance) weightScore += 2.5;
      else if (isStrength) weightScore += 1.5;
      if (ex.difficulty === targetTier) weightScore += 1.0;
    } else if (planId === 'weight-loss') {
      const isCardioOrMetabolic = ['Full Body', 'Core', 'Cardio'].includes(ex.muscleGroup) || ex.met >= 7.0 || ex.mode === 'duration';
      if (isCardioOrMetabolic) weightScore += 2.5;
      if (ex.equipment === 'None' || ex.equipment === 'Bodyweight') weightScore += 1.0;
      if (ex.difficulty === targetTier) weightScore += 1.0;
    } else {
      // Get Fit: balanced distribution
      weightScore = 1.0 + (ex.difficulty === targetTier ? 0.5 : 0);
    }

    return { exercise: ex, weight: weightScore };
  });

  // 5. Randomly pick 6-8 exercises without replacement using Math.random
  const countToPick = Math.floor(Math.random() * 3) + 6; // 6, 7, or 8
  const selected: Exercise[] = [];
  const remaining = [...weightedPool];

  for (let i = 0; i < countToPick && remaining.length > 0; i++) {
    const totalWeight = remaining.reduce((sum, item) => sum + item.weight, 0);
    let rand = Math.random() * totalWeight;
    let chosenIndex = 0;

    for (let j = 0; j < remaining.length; j++) {
      rand -= remaining[j].weight;
      if (rand <= 0) {
        chosenIndex = j;
        break;
      }
    }

    selected.push(remaining[chosenIndex].exercise);
    remaining.splice(chosenIndex, 1);
  }

  // 6. Compute duration_minutes and calories per exercise
  // Reps mode: sets × reps × 3 sec ÷ 60
  // Duration mode: defaultDurationMin
  // Calories = met × weightKg × (duration_minutes / 60) rounded
  let totalCalories = 0;
  let totalDurationMin = 0;

  const workoutExercises: WorkoutExerciseItem[] = selected.map(ex => {
    let durationMin = 1;
    if (ex.mode === 'reps') {
      const sets = ex.defaultSets ?? 3;
      const reps = ex.defaultReps ?? 10;
      durationMin = (sets * reps * 3) / 60;
    } else {
      durationMin = ex.defaultDurationMin ?? 1;
    }

    const burned = Math.round(ex.met * weightKg * (durationMin / 60));
    totalCalories += burned;
    totalDurationMin += durationMin;

    return {
      ...ex,
      computedDurationMin: Math.max(1, Math.round(durationMin)),
      computedCalories: burned
    };
  });

  return {
    planId,
    exercises: workoutExercises,
    totalCalories,
    totalDurationMin: Math.max(15, Math.round(totalDurationMin))
  };
}
