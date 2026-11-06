import { ExerciseDefinition, ExerciseType, DifficultyLevel } from '../types/game';

export const EXERCISE_DEFINITIONS: Record<ExerciseType, ExerciseDefinition> = {
  pushups: {
    id: 'pushups',
    name: 'Push-ups',
    category: 'Strength',
    unit: 'reps',
    baseTarget: {
      beginner: 10,
      intermediate: 20,
      advanced: 35,
    },
    growthPerLevel: 2, // 2 reps increase every 2 levels or safe scaling
    description: 'Builds upper body power in chest, triceps, and shoulders. The foundation of hunter strength.',
    muscleGroups: ['Chest', 'Triceps', 'Anterior Deltoids', 'Core'],
    alternatives: [
      {
        id: 'standard-pushups',
        name: 'Standard Push-ups',
        description: 'Traditional full body plank push-up.',
        multiplier: 1.0,
        instructions: [
          'Place hands shoulder-width apart on the floor.',
          'Keep core tight, back straight, and lower chest until 2 inches from ground.',
          'Press firmly back up while exhaling.',
        ],
      },
      {
        id: 'knee-pushups',
        name: 'Knee Push-ups (Beginner Safe)',
        description: 'Reduced load by resting knees on a mat.',
        multiplier: 1.0,
        instructions: [
          'Rest your knees on a comfortable mat.',
          'Maintain a straight diagonal line from knees to head.',
          'Lower your chest smoothly and press up.',
        ],
      },
      {
        id: 'incline-pushups',
        name: 'Incline / Wall Push-ups (Gentle)',
        description: 'Hands elevated on a couch, bench, or wall for low joint strain.',
        multiplier: 1.0,
        instructions: [
          'Place hands against a sturdy wall or high surface.',
          'Step feet back to form a 45-degree angle.',
          'Press with controlled tempo.',
        ],
      },
      {
        id: 'diamond-pushups',
        name: 'Diamond / Archer Push-ups (Advanced)',
        description: 'Intense tricep focus with hands touching in a diamond shape.',
        multiplier: 0.8, // Fewer reps needed for high intensity
        instructions: [
          'Index fingers and thumbs touch to form a diamond under your chest.',
          'Lower under control and explode upward.',
        ],
      },
    ],
  },
  situps: {
    id: 'situps',
    name: 'Sit-ups',
    category: 'Core',
    unit: 'reps',
    baseTarget: {
      beginner: 10,
      intermediate: 20,
      advanced: 35,
    },
    growthPerLevel: 2,
    description: 'Forges iron core stability and spinal resilience to endure heavy impacts.',
    muscleGroups: ['Rectus Abdominis', 'Obliques', 'Hip Flexors'],
    alternatives: [
      {
        id: 'standard-situps',
        name: 'Standard Sit-ups',
        description: 'Classic abdominal trunk flexion.',
        multiplier: 1.0,
        instructions: [
          'Lie on back with knees bent at 90 degrees.',
          'Cross arms on chest or place fingers near temples.',
          'Engage core and raise torso up to touch thighs.',
        ],
      },
      {
        id: 'crunches',
        name: 'Abdominal Crunches (Neck-Safe)',
        description: 'Focus purely on upper abdominals without pulling the neck.',
        multiplier: 1.0,
        instructions: [
          'Lie flat, curl shoulders off the floor while pressing lower back into ground.',
          'Squeeze for 1 second at peak contraction.',
        ],
      },
      {
        id: 'plank-seconds',
        name: 'Plank Hold (Static Core)',
        description: '1 second plank counts as 1 repetition equivalent.',
        multiplier: 1.0,
        instructions: [
          'Forearms on ground, elbows under shoulders.',
          'Engage glutes and core, hold a flat spine for target count.',
        ],
      },
      {
        id: 'lying-leg-raises',
        name: 'Lying Leg Raises (Lower Abs)',
        description: 'Strengthens lower abs and pelvic stabilizers.',
        multiplier: 1.0,
        instructions: [
          'Hands under hips, raise legs straight up to 90 degrees.',
          'Lower slowly without letting lower back arch off floor.',
        ],
      },
    ],
  },
  squats: {
    id: 'squats',
    name: 'Squats',
    category: 'Legs',
    unit: 'reps',
    baseTarget: {
      beginner: 10,
      intermediate: 20,
      advanced: 35,
    },
    growthPerLevel: 2,
    description: 'The pillar of hunter agility and explosive leaping power.',
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings', 'Calves'],
    alternatives: [
      {
        id: 'bodyweight-squats',
        name: 'Bodyweight Air Squats',
        description: 'Deep full range of motion squats.',
        multiplier: 1.0,
        instructions: [
          'Stand feet shoulder-width, toes slightly flared.',
          'Hinge hips back and descend until thighs are parallel to ground.',
          'Drive through whole foot to return to standing.',
        ],
      },
      {
        id: 'chair-squats',
        name: 'Chair / Box Squats (Beginner)',
        description: 'Sit back onto a chair and stand back up safely.',
        multiplier: 1.0,
        instructions: [
          'Stand in front of a chair.',
          'Sit back lightly onto chair, then immediately stand without rocking.',
        ],
      },
      {
        id: 'lunges',
        name: 'Walking or Reverse Lunges',
        description: 'Single leg strength and balance training.',
        multiplier: 1.0,
        instructions: [
          'Step back into a lunge with back knee hovering above floor.',
          'Alternate legs each repetition.',
        ],
      },
      {
        id: 'jump-squats',
        name: 'Jump Squats (Power Surge)',
        description: 'Explosive vertical jumps from squat depth.',
        multiplier: 0.8,
        instructions: [
          'Squat down, then explode into a jump.',
          'Land softly with bent knees.',
        ],
      },
    ],
  },
  running: {
    id: 'running',
    name: 'Running / Cardio',
    category: 'Cardio',
    unit: 'km',
    baseTarget: {
      beginner: 0.5,
      intermediate: 1.0,
      advanced: 2.0,
    },
    growthPerLevel: 0.05, // +0.05 km per level
    description: 'Expands stamina pool, cardiovascular health, and oxygen efficiency.',
    muscleGroups: ['Heart & Lungs', 'Calves', 'Quads', 'Glutes'],
    alternatives: [
      {
        id: 'outdoor-running',
        name: 'Outdoor / Treadmill Run',
        description: 'Jogging or running at a comfortable pacing.',
        multiplier: 1.0,
        instructions: [
          'Maintain relaxed shoulders, rhythmic breathing.',
          'Land mid-foot and pace yourself consistently.',
        ],
      },
      {
        id: 'brisk-walking',
        name: 'Brisk Walking (Low Impact)',
        description: 'Fast-paced walking that raises heart rate gently.',
        multiplier: 1.0,
        instructions: [
          'Walk at an energetic speed of 5-6 km/h.',
          'Swing arms and keep posture tall.',
        ],
      },
      {
        id: 'jumping-jacks',
        name: 'Indoor Cardio (Jumping Jacks / High Knees)',
        description: '100 jumping jacks or high knees = 0.5 km cardio.',
        multiplier: 1.0,
        instructions: [
          'Stay light on your feet.',
          'Alternate between jumping jacks and high knees to reach target equivalent.',
        ],
      },
      {
        id: 'cycling-indoor',
        name: 'Cycling / Elliptical',
        description: 'Low-impact stationary or outdoor cycling.',
        multiplier: 1.5, // 1.5km cycling = 1km run
        instructions: [
          'Set moderate resistance.',
          'Keep cadence steady at 70-80 RPM.',
        ],
      },
    ],
  },
};

/**
 * Calculates progressive workout target for a given level, difficulty, and recovery state.
 * Important: Progression scales safely and caps appropriately to prevent overtraining!
 */
export function calculateWorkoutTarget(
  exercise: ExerciseType,
  level: number,
  difficulty: DifficultyLevel,
  isRecoveryDay: boolean
): number {
  const def = EXERCISE_DEFINITIONS[exercise];
  const base = def.baseTarget[difficulty];

  if (isRecoveryDay) {
    // Recovery days are light: 30-40% of normal target
    if (exercise === 'running') {
      return Number(Math.max(0.2, (base * 0.4)).toFixed(1));
    }
    return Math.max(5, Math.round(base * 0.4));
  }

  // Safe progressive scaling:
  // Growth slows down at higher levels to ensure human safety and consistency
  // Level 1: 15 pushups (intermediate: 20)
  // Progressive step: every level adds modest amount, with deload milestones
  if (exercise === 'running') {
    // running distance in km: base + (level - 1) * 0.05
    // Caps at reasonable max: beginner 3km, intermediate 5km, advanced 10km
    const maxKm = difficulty === 'beginner' ? 3.0 : difficulty === 'intermediate' ? 5.0 : 10.0;
    const computed = base + (level - 1) * 0.05;
    return Number(Math.min(maxKm, computed).toFixed(1));
  } else {
    // Rep exercises (Pushups, Situps, Squats)
    // Caps at reasonable daily targets: beginner 50, intermediate 80, advanced 120
    const maxReps = difficulty === 'beginner' ? 50 : difficulty === 'intermediate' ? 80 : 120;
    // Add 1 rep every level, plus 1 extra rep every 3 levels
    const increase = Math.floor((level - 1) * 1.2);
    const computed = base + increase;
    return Math.min(maxReps, computed);
  }
}
