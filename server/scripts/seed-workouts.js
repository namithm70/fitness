/*
  Usage:
  1) Ensure MONGODB_URI is set in environment (same as your server uses)
  2) From repo root, run:
     node server/scripts/seed-workouts.js
*/

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Workout = require('../models/Workout');

async function seed() {
  const uri = process.env.MONGODB_URI || process.env.DATABASE_URL || process.env.MONGO_URI;
  if (!uri) {
    console.error('Missing MONGODB_URI (or DATABASE_URL/MONGO_URI). Aborting.');
    process.exit(1);
  }

  await mongoose.connect(uri, { dbName: process.env.MONGODB_DB || undefined });
  console.log('Connected to MongoDB');

  const workouts = [
    // Beginner
    {
      name: 'Beginner Full Body',
      description: 'Gentle full-body routine focused on form.',
      difficulty: 'beginner',
      duration: 25,
      exercises: [
        { name: 'Bodyweight Squats', description: '3x12', muscleGroups: ['quadriceps','glutes'], equipment: ['bodyweight'], duration: 5 },
        { name: 'Knee Push-ups', description: '3x10', muscleGroups: ['chest','triceps'], equipment: ['bodyweight'], duration: 5 },
        { name: 'Plank', description: '3x30sec', muscleGroups: ['abs'], equipment: ['bodyweight'], duration: 5 }
      ]
    },
    {
      name: 'Beginner Cardio',
      description: 'Low-impact cardio and core activation.',
      difficulty: 'beginner',
      duration: 20,
      exercises: [
        { name: 'March in Place', description: '3x2min', muscleGroups: ['full-body'], equipment: ['bodyweight'], duration: 6 },
        { name: 'Glute Bridges', description: '3x12', muscleGroups: ['glutes','hamstrings'], equipment: ['bodyweight'], duration: 6 }
      ]
    },
    // Intermediate
    {
      name: 'Intermediate Upper Body',
      description: 'Push-pull superset focus.',
      difficulty: 'intermediate',
      duration: 35,
      exercises: [
        { name: 'Push-ups', description: '4x12', muscleGroups: ['chest','triceps'], equipment: ['bodyweight'], duration: 10 },
        { name: 'Bent-over Rows', description: '4x10', muscleGroups: ['back','biceps'], equipment: ['dumbbells'], duration: 10 }
      ]
    },
    {
      name: 'Intermediate Legs',
      description: 'Quads, hams, and glutes.',
      difficulty: 'intermediate',
      duration: 30,
      exercises: [
        { name: 'Goblet Squats', description: '4x10', muscleGroups: ['quadriceps','glutes'], equipment: ['dumbbells'], duration: 10 },
        { name: 'Romanian Deadlift', description: '4x10', muscleGroups: ['hamstrings','glutes'], equipment: ['dumbbells'], duration: 10 }
      ]
    },
    // Advanced
    {
      name: 'Advanced Push Day',
      description: 'High-intensity push session.',
      difficulty: 'advanced',
      duration: 45,
      exercises: [
        { name: 'Barbell Bench Press', description: '5x5', muscleGroups: ['chest','triceps'], equipment: ['barbell','bench'], duration: 15 },
        { name: 'Overhead Press', description: '4x8', muscleGroups: ['shoulders','triceps'], equipment: ['barbell'], duration: 12 }
      ]
    },
    {
      name: 'Advanced Conditioning',
      description: 'High-intensity circuits for conditioning.',
      difficulty: 'advanced',
      duration: 30,
      exercises: [
        { name: 'Burpees', description: '5x15', muscleGroups: ['full-body'], equipment: ['bodyweight'], duration: 10 },
        { name: 'Kettlebell Swings', description: '5x20', muscleGroups: ['glutes','hamstrings','back'], equipment: ['kettlebell'], duration: 10 }
      ]
    }
  ];

  // Upsert by name+difficulty to avoid duplicates on re-run
  for (const w of workouts) {
    const existing = await Workout.findOne({ name: w.name, difficulty: w.difficulty });
    if (existing) {
      await Workout.updateOne({ _id: existing._id }, { $set: w });
      console.log('Updated:', w.name);
    } else {
      await Workout.create(w);
      console.log('Inserted:', w.name);
    }
  }

  console.log('Seeding complete.');
  await mongoose.disconnect();
}

seed().catch(async (err) => {
  console.error(err);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});


