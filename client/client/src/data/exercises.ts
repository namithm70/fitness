import { Exercise } from '../types/workout';

export interface ExerciseCategory {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
}

export const exerciseCategories: ExerciseCategory[] = [
  {
    id: 'strength-upper',
    name: 'Upper Body Strength',
    description: 'Exercises targeting chest, back, shoulders, and arms',
    exercises: [
      { id: 'push-ups', name: 'Push-ups', sets: 3, reps: 12, restTime: 60, notes: 'Keep body straight, lower chest to ground' },
      { id: 'pull-ups', name: 'Pull-ups', sets: 3, reps: 8, restTime: 90, notes: 'Pull chin above bar, control descent' },
      { id: 'dips', name: 'Dips', sets: 3, reps: 10, restTime: 90, notes: 'Lower body until upper arms are parallel to ground' },
      { id: 'bench-press', name: 'Bench Press', sets: 4, reps: 8, restTime: 120, notes: 'Lower bar to chest, press up explosively' },
      { id: 'overhead-press', name: 'Overhead Press', sets: 3, reps: 10, restTime: 90, notes: 'Press weight overhead, keep core tight' },
      { id: 'bent-over-rows', name: 'Bent Over Rows', sets: 3, reps: 12, restTime: 90, notes: 'Pull weight to lower chest, squeeze shoulder blades' },
      { id: 'lat-pulldowns', name: 'Lat Pulldowns', sets: 3, reps: 12, restTime: 90, notes: 'Pull bar to upper chest, squeeze lats' },
      { id: 'shoulder-press', name: 'Shoulder Press', sets: 3, reps: 10, restTime: 90, notes: 'Press dumbbells overhead, control movement' },
      { id: 'bicep-curls', name: 'Bicep Curls', sets: 3, reps: 12, restTime: 60, notes: 'Curl weight up, control descent' },
      { id: 'tricep-dips', name: 'Tricep Dips', sets: 3, reps: 12, restTime: 60, notes: 'Focus on tricep engagement' },
      { id: 'incline-press', name: 'Incline Bench Press', sets: 3, reps: 10, restTime: 120, notes: 'Targets upper chest' },
      { id: 'decline-press', name: 'Decline Bench Press', sets: 3, reps: 10, restTime: 120, notes: 'Targets lower chest' },
      { id: 'flyes', name: 'Dumbbell Flyes', sets: 3, reps: 12, restTime: 90, notes: 'Keep slight bend in elbows' },
      { id: 'hammer-curls', name: 'Hammer Curls', sets: 3, reps: 12, restTime: 60, notes: 'Targets brachialis muscle' },
      { id: 'preacher-curls', name: 'Preacher Curls', sets: 3, reps: 10, restTime: 90, notes: 'Isolates biceps effectively' },
    ]
  },
  {
    id: 'strength-lower',
    name: 'Lower Body Strength',
    description: 'Exercises targeting legs, glutes, and core',
    exercises: [
      { id: 'squats', name: 'Squats', sets: 4, reps: 15, restTime: 90, notes: 'Keep chest up, knees in line with toes' },
      { id: 'deadlifts', name: 'Deadlifts', sets: 4, reps: 8, restTime: 120, notes: 'Keep back straight, drive through heels' },
      { id: 'lunges', name: 'Lunges', sets: 3, reps: 12, restTime: 60, notes: 'Step forward, lower back knee to ground' },
      { id: 'leg-press', name: 'Leg Press', sets: 4, reps: 12, restTime: 90, notes: 'Push through heels, don\'t lock knees' },
      { id: 'calf-raises', name: 'Calf Raises', sets: 4, reps: 20, restTime: 60, notes: 'Raise heels, hold at top' },
      { id: 'leg-curls', name: 'Leg Curls', sets: 3, reps: 15, restTime: 90, notes: 'Curl weight up, control descent' },
      { id: 'leg-extensions', name: 'Leg Extensions', sets: 3, reps: 15, restTime: 90, notes: 'Extend legs fully, squeeze quads' },
      { id: 'glute-bridges', name: 'Glute Bridges', sets: 3, reps: 15, restTime: 60, notes: 'Squeeze glutes at top' },
      { id: 'step-ups', name: 'Step-ups', sets: 3, reps: 12, restTime: 60, notes: 'Step up onto platform, control descent' },
      { id: 'wall-sits', name: 'Wall Sits', sets: 3, reps: 1, duration: 45, restTime: 60, notes: 'Hold position, thighs parallel to ground' },
      { id: 'bulgarian-split-squats', name: 'Bulgarian Split Squats', sets: 3, reps: 10, restTime: 90, notes: 'Back foot on bench, focus on balance' },
      { id: 'romanian-deadlifts', name: 'Romanian Deadlifts', sets: 3, reps: 12, restTime: 90, notes: 'Hinge at hips, feel hamstring stretch' },
      { id: 'box-jumps', name: 'Box Jumps', sets: 3, reps: 8, restTime: 90, notes: 'Jump onto box, step down carefully' },
      { id: 'pistol-squats', name: 'Pistol Squats', sets: 3, reps: 6, restTime: 90, notes: 'Advanced single-leg squat' },
    ]
  },
  {
    id: 'core',
    name: 'Core & Abs',
    description: 'Exercises targeting abdominal muscles and core stability',
    exercises: [
      { id: 'plank', name: 'Plank', sets: 3, reps: 1, duration: 60, restTime: 60, notes: 'Keep body straight, engage core' },
      { id: 'crunches', name: 'Crunches', sets: 3, reps: 20, restTime: 45, notes: 'Lift shoulders off ground, don\'t pull neck' },
      { id: 'sit-ups', name: 'Sit-ups', sets: 3, reps: 15, restTime: 60, notes: 'Full range of motion' },
      { id: 'russian-twists', name: 'Russian Twists', sets: 3, reps: 20, restTime: 45, notes: 'Rotate torso, keep feet off ground' },
      { id: 'leg-raises', name: 'Leg Raises', sets: 3, reps: 15, restTime: 60, notes: 'Lower legs slowly, don\'t arch back' },
      { id: 'mountain-climbers', name: 'Mountain Climbers', sets: 3, reps: 1, duration: 45, restTime: 45, notes: 'Alternate knees to chest' },
      { id: 'bicycle-crunches', name: 'Bicycle Crunches', sets: 3, reps: 20, restTime: 45, notes: 'Alternate elbow to opposite knee' },
      { id: 'side-plank', name: 'Side Plank', sets: 3, reps: 1, duration: 30, restTime: 45, notes: 'Hold each side' },
      { id: 'dead-bug', name: 'Dead Bug', sets: 3, reps: 12, restTime: 45, notes: 'Extend opposite arm and leg' },
      { id: 'flutter-kicks', name: 'Flutter Kicks', sets: 3, reps: 1, duration: 45, restTime: 45, notes: 'Keep legs straight, small movements' },
      { id: 'ab-wheel-rollout', name: 'Ab Wheel Rollout', sets: 3, reps: 8, restTime: 90, notes: 'Roll out slowly, control return' },
      { id: 'hollow-hold', name: 'Hollow Hold', sets: 3, reps: 1, duration: 30, restTime: 60, notes: 'Keep lower back pressed to ground' },
      { id: 'reverse-crunches', name: 'Reverse Crunches', sets: 3, reps: 15, restTime: 45, notes: 'Lift hips off ground' },
      { id: 'plank-to-downward-dog', name: 'Plank to Downward Dog', sets: 3, reps: 10, restTime: 45, notes: 'Flow between positions' },
    ]
  },
  {
    id: 'cardio',
    name: 'Cardio & Endurance',
    description: 'Cardiovascular exercises for heart health and endurance',
    exercises: [
      { id: 'running', name: 'Running', sets: 1, reps: 1, duration: 1800, restTime: 0, notes: '30 minutes at moderate pace' },
      { id: 'cycling', name: 'Cycling', sets: 1, reps: 1, duration: 2400, restTime: 0, notes: '40 minutes on stationary bike' },
      { id: 'jumping-jacks', name: 'Jumping Jacks', sets: 3, reps: 1, duration: 60, restTime: 30, notes: 'Full range of motion' },
      { id: 'burpees', name: 'Burpees', sets: 3, reps: 10, restTime: 60, notes: 'Squat, push-up, jump sequence' },
      { id: 'high-knees', name: 'High Knees', sets: 3, reps: 1, duration: 45, restTime: 30, notes: 'Knees to chest level' },
      { id: 'jump-rope', name: 'Jump Rope', sets: 3, reps: 1, duration: 120, restTime: 60, notes: 'Basic bounce or advanced moves' },
      { id: 'mountain-climbers', name: 'Mountain Climbers', sets: 3, reps: 1, duration: 60, restTime: 45, notes: 'Fast alternating knees' },
      { id: 'butt-kicks', name: 'Butt Kicks', sets: 3, reps: 1, duration: 45, restTime: 30, notes: 'Kick heels to glutes' },
      { id: 'skater-jumps', name: 'Skater Jumps', sets: 3, reps: 20, restTime: 60, notes: 'Side-to-side jumping motion' },
      { id: 'box-jumps', name: 'Box Jumps', sets: 3, reps: 10, restTime: 90, notes: 'Explosive jump onto box' },
      { id: 'sprint-intervals', name: 'Sprint Intervals', sets: 8, reps: 1, duration: 30, restTime: 90, notes: '30s sprint, 90s rest' },
      { id: 'elliptical', name: 'Elliptical', sets: 1, reps: 1, duration: 1800, restTime: 0, notes: '30 minutes moderate intensity' },
      { id: 'rowing', name: 'Rowing', sets: 1, reps: 1, duration: 1200, restTime: 0, notes: '20 minutes on rowing machine' },
      { id: 'stair-climber', name: 'Stair Climber', sets: 1, reps: 1, duration: 900, restTime: 0, notes: '15 minutes climbing' },
      { id: 'swimming', name: 'Swimming', sets: 1, reps: 1, duration: 1800, restTime: 0, notes: '30 minutes freestyle' },
    ]
  },
  {
    id: 'yoga',
    name: 'Yoga & Flexibility',
    description: 'Yoga poses and flexibility exercises',
    exercises: [
      { id: 'downward-dog', name: 'Downward Dog', sets: 3, reps: 1, duration: 60, restTime: 30, notes: 'Press hips back and up' },
      { id: 'warrior-1', name: 'Warrior I', sets: 2, reps: 1, duration: 45, restTime: 30, notes: 'Front knee bent, back leg straight' },
      { id: 'warrior-2', name: 'Warrior II', sets: 2, reps: 1, duration: 45, restTime: 30, notes: 'Arms parallel to ground' },
      { id: 'tree-pose', name: 'Tree Pose', sets: 2, reps: 1, duration: 30, restTime: 30, notes: 'Balance on one leg' },
      { id: 'child-pose', name: 'Child\'s Pose', sets: 2, reps: 1, duration: 60, restTime: 30, notes: 'Relaxing stretch for back' },
      { id: 'cobra-pose', name: 'Cobra Pose', sets: 3, reps: 1, duration: 30, restTime: 30, notes: 'Lift chest, keep hips down' },
      { id: 'bridge-pose', name: 'Bridge Pose', sets: 3, reps: 1, duration: 30, restTime: 45, notes: 'Lift hips, squeeze glutes' },
      { id: 'pigeon-pose', name: 'Pigeon Pose', sets: 2, reps: 1, duration: 60, restTime: 30, notes: 'Hip opener stretch' },
      { id: 'triangle-pose', name: 'Triangle Pose', sets: 2, reps: 1, duration: 45, restTime: 30, notes: 'Side stretch, reach for foot' },
      { id: 'sun-salutation', name: 'Sun Salutation', sets: 3, reps: 1, duration: 120, restTime: 60, notes: 'Complete flow sequence' },
      { id: 'cat-cow', name: 'Cat-Cow', sets: 3, reps: 10, restTime: 30, notes: 'Alternate arching and rounding back' },
      { id: 'seated-forward-bend', name: 'Seated Forward Bend', sets: 2, reps: 1, duration: 60, restTime: 30, notes: 'Fold forward from hips' },
      { id: 'happy-baby', name: 'Happy Baby', sets: 2, reps: 1, duration: 45, restTime: 30, notes: 'Lie on back, hold feet' },
      { id: 'corpse-pose', name: 'Corpse Pose', sets: 1, reps: 1, duration: 300, restTime: 0, notes: 'Final relaxation pose' },
      { id: 'lotus-pose', name: 'Lotus Pose', sets: 2, reps: 1, duration: 60, restTime: 30, notes: 'Advanced seated pose' },
    ]
  },
  {
    id: 'hiit',
    name: 'HIIT & Circuit',
    description: 'High-intensity interval training and circuit exercises',
    exercises: [
      { id: 'burpees', name: 'Burpees', sets: 4, reps: 10, restTime: 30, notes: 'Full burpee with push-up and jump' },
      { id: 'mountain-climbers', name: 'Mountain Climbers', sets: 4, reps: 1, duration: 45, restTime: 30, notes: 'Fast alternating knees' },
      { id: 'jumping-jacks', name: 'Jumping Jacks', sets: 4, reps: 1, duration: 30, restTime: 30, notes: 'Full range jumping jacks' },
      { id: 'high-knees', name: 'High Knees', sets: 4, reps: 1, duration: 30, restTime: 30, notes: 'Run in place, knees to chest' },
      { id: 'plank-jacks', name: 'Plank Jacks', sets: 4, reps: 1, duration: 45, restTime: 30, notes: 'Jump feet in and out in plank' },
      { id: 'squat-jumps', name: 'Squat Jumps', sets: 4, reps: 12, restTime: 45, notes: 'Explosive jump from squat position' },
      { id: 'push-up-jacks', name: 'Push-up Jacks', sets: 4, reps: 8, restTime: 45, notes: 'Push-up with jumping jack legs' },
      { id: 'tuck-jumps', name: 'Tuck Jumps', sets: 4, reps: 10, restTime: 45, notes: 'Jump and bring knees to chest' },
      { id: 'spiderman-push-ups', name: 'Spiderman Push-ups', sets: 4, reps: 8, restTime: 45, notes: 'Push-up with knee to elbow' },
      { id: 'bear-crawls', name: 'Bear Crawls', sets: 3, reps: 1, duration: 30, restTime: 45, notes: 'Crawl on hands and feet' },
      { id: 'inchworm-walks', name: 'Inchworm Walks', sets: 3, reps: 8, restTime: 45, notes: 'Walk hands out, walk feet in' },
      { id: 'diamond-push-ups', name: 'Diamond Push-ups', sets: 4, reps: 6, restTime: 60, notes: 'Hands in diamond shape' },
      { id: 'pike-push-ups', name: 'Pike Push-ups', sets: 4, reps: 8, restTime: 45, notes: 'Push-up with elevated hips' },
      { id: 'wall-balls', name: 'Wall Balls', sets: 4, reps: 12, restTime: 45, notes: 'Squat and throw ball to wall' },
      { id: 'thrusters', name: 'Thrusters', sets: 4, reps: 10, restTime: 60, notes: 'Squat to overhead press' },
    ]
  },
  {
    id: 'functional',
    name: 'Functional Training',
    description: 'Functional movements for everyday activities',
    exercises: [
      { id: 'kettlebell-swings', name: 'Kettlebell Swings', sets: 3, reps: 15, restTime: 90, notes: 'Hip hinge movement, swing between legs' },
      { id: 'clean-and-press', name: 'Clean and Press', sets: 3, reps: 8, restTime: 120, notes: 'Clean weight to shoulders, press overhead' },
      { id: 'snatch', name: 'Snatch', sets: 3, reps: 6, restTime: 120, notes: 'Advanced Olympic lift' },
      { id: 'farmer-walks', name: 'Farmer Walks', sets: 3, reps: 1, duration: 60, restTime: 90, notes: 'Walk with heavy weights' },
      { id: 'turkey-walks', name: 'Turkey Walks', sets: 3, reps: 1, duration: 45, restTime: 90, notes: 'Walk with weight overhead' },
      { id: 'medicine-ball-slams', name: 'Medicine Ball Slams', sets: 3, reps: 12, restTime: 60, notes: 'Slam ball to ground' },
      { id: 'battle-ropes', name: 'Battle Ropes', sets: 3, reps: 1, duration: 45, restTime: 60, notes: 'Wave motion with ropes' },
      { id: 'tire-flips', name: 'Tire Flips', sets: 3, reps: 6, restTime: 120, notes: 'Flip heavy tire end over end' },
      { id: 'sled-pushes', name: 'Sled Pushes', sets: 3, reps: 1, duration: 30, restTime: 90, notes: 'Push weighted sled' },
      { id: 'rope-climbs', name: 'Rope Climbs', sets: 3, reps: 3, restTime: 120, notes: 'Climb rope using arms and legs' },
      { id: 'wall-climbs', name: 'Wall Climbs', sets: 3, reps: 5, restTime: 90, notes: 'Climb up wall in handstand position' },
      { id: 'muscle-ups', name: 'Muscle-ups', sets: 3, reps: 3, restTime: 120, notes: 'Pull-up to dip transition' },
      { id: 'handstand-push-ups', name: 'Handstand Push-ups', sets: 3, reps: 5, restTime: 120, notes: 'Push-up in handstand position' },
      { id: 'pistol-squats', name: 'Pistol Squats', sets: 3, reps: 6, restTime: 90, notes: 'Single-leg squat' },
      { id: 'l-sits', name: 'L-Sits', sets: 3, reps: 1, duration: 30, restTime: 90, notes: 'Hold legs straight out' },
    ]
  }
];

export const getAllExercises = (): Exercise[] => {
  return exerciseCategories.flatMap(category => category.exercises);
};

export const getExercisesByCategory = (categoryId: string): Exercise[] => {
  const category = exerciseCategories.find(cat => cat.id === categoryId);
  return category ? category.exercises : [];
};

export const searchExercises = (query: string): Exercise[] => {
  const allExercises = getAllExercises();
  return allExercises.filter(exercise => 
    exercise.name.toLowerCase().includes(query.toLowerCase()) ||
    exercise.notes?.toLowerCase().includes(query.toLowerCase())
  );
};
