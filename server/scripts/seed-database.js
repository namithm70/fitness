const mongoose = require('mongoose');
const Food = require('../models/Food');
const NutritionGoal = require('../models/NutritionGoal');
const User = require('../models/User');
require('dotenv').config();

// Sample food data
const sampleFoods = [
  {
    name: 'Chicken Breast',
    brand: 'Organic Valley',
    category: 'protein',
    servingSize: { amount: 100, unit: 'g' },
    nutrition: {
      calories: 165,
      protein: 31,
      carbohydrates: 0,
      fat: 3.6,
      fiber: 0,
      sugar: 0,
      sodium: 74,
      cholesterol: 85,
      saturatedFat: 1.1,
      transFat: 0
    },
    vitamins: {
      vitaminA: 0,
      vitaminC: 0,
      vitaminD: 0,
      vitaminE: 0.2,
      vitaminK: 0,
      vitaminB1: 0.1,
      vitaminB2: 0.1,
      vitaminB3: 13.7,
      vitaminB6: 0.6,
      vitaminB12: 0.3,
      folate: 4
    },
    minerals: {
      calcium: 15,
      iron: 1.0,
      magnesium: 29,
      phosphorus: 228,
      potassium: 256,
      sodium: 74,
      zinc: 1.0
    }
  },
  {
    name: 'Brown Rice',
    brand: 'Uncle Ben\'s',
    category: 'grains',
    servingSize: { amount: 100, unit: 'g' },
    nutrition: {
      calories: 111,
      protein: 2.6,
      carbohydrates: 23,
      fat: 0.9,
      fiber: 1.8,
      sugar: 0.4,
      sodium: 5,
      cholesterol: 0,
      saturatedFat: 0.2,
      transFat: 0
    },
    vitamins: {
      vitaminA: 0,
      vitaminC: 0,
      vitaminD: 0,
      vitaminE: 0.6,
      vitaminK: 0,
      vitaminB1: 0.1,
      vitaminB2: 0.1,
      vitaminB3: 2.6,
      vitaminB6: 0.2,
      vitaminB12: 0,
      folate: 9
    },
    minerals: {
      calcium: 10,
      iron: 0.4,
      magnesium: 43,
      phosphorus: 83,
      potassium: 86,
      sodium: 5,
      zinc: 0.6
    }
  },
  {
    name: 'Broccoli',
    brand: 'Fresh Market',
    category: 'vegetables',
    servingSize: { amount: 100, unit: 'g' },
    nutrition: {
      calories: 34,
      protein: 2.8,
      carbohydrates: 7,
      fat: 0.4,
      fiber: 2.6,
      sugar: 1.5,
      sodium: 33,
      cholesterol: 0,
      saturatedFat: 0.1,
      transFat: 0
    },
    vitamins: {
      vitaminA: 623,
      vitaminC: 89.2,
      vitaminD: 0,
      vitaminE: 0.8,
      vitaminK: 101.6,
      vitaminB1: 0.1,
      vitaminB2: 0.1,
      vitaminB3: 0.6,
      vitaminB6: 0.2,
      vitaminB12: 0,
      folate: 63
    },
    minerals: {
      calcium: 47,
      iron: 0.7,
      magnesium: 21,
      phosphorus: 66,
      potassium: 316,
      sodium: 33,
      zinc: 0.4
    }
  },
  {
    name: 'Salmon',
    brand: 'Wild Alaskan',
    category: 'protein',
    servingSize: { amount: 100, unit: 'g' },
    nutrition: {
      calories: 208,
      protein: 25,
      carbohydrates: 0,
      fat: 12,
      fiber: 0,
      sugar: 0,
      sodium: 59,
      cholesterol: 55,
      saturatedFat: 2.3,
      transFat: 0
    },
    vitamins: {
      vitaminA: 149,
      vitaminC: 3.9,
      vitaminD: 11.1,
      vitaminE: 3.6,
      vitaminK: 0.7,
      vitaminB1: 0.2,
      vitaminB2: 0.4,
      vitaminB3: 8.5,
      vitaminB6: 0.9,
      vitaminB12: 3.2,
      folate: 25
    },
    minerals: {
      calcium: 9,
      iron: 0.3,
      magnesium: 27,
      phosphorus: 240,
      potassium: 363,
      sodium: 59,
      zinc: 0.4
    }
  },
  {
    name: 'Sweet Potato',
    brand: 'Organic',
    category: 'vegetables',
    servingSize: { amount: 100, unit: 'g' },
    nutrition: {
      calories: 86,
      protein: 1.6,
      carbohydrates: 20,
      fat: 0.1,
      fiber: 3,
      sugar: 4.2,
      sodium: 55,
      cholesterol: 0,
      saturatedFat: 0,
      transFat: 0
    },
    vitamins: {
      vitaminA: 14187,
      vitaminC: 2.4,
      vitaminD: 0,
      vitaminE: 0.3,
      vitaminK: 1.8,
      vitaminB1: 0.1,
      vitaminB2: 0.1,
      vitaminB3: 0.6,
      vitaminB6: 0.2,
      vitaminB12: 0,
      folate: 11
    },
    minerals: {
      calcium: 30,
      iron: 0.6,
      magnesium: 25,
      phosphorus: 47,
      potassium: 337,
      sodium: 55,
      zinc: 0.3
    }
  },
  {
    name: 'Greek Yogurt',
    brand: 'Chobani',
    category: 'dairy',
    servingSize: { amount: 100, unit: 'g' },
    nutrition: {
      calories: 59,
      protein: 10,
      carbohydrates: 3.6,
      fat: 0.4,
      fiber: 0,
      sugar: 3.2,
      sodium: 36,
      cholesterol: 5,
      saturatedFat: 0.1,
      transFat: 0
    },
    vitamins: {
      vitaminA: 27,
      vitaminC: 0,
      vitaminD: 0.1,
      vitaminE: 0.1,
      vitaminK: 0.2,
      vitaminB1: 0.1,
      vitaminB2: 0.2,
      vitaminB3: 0.1,
      vitaminB6: 0.1,
      vitaminB12: 0.4,
      folate: 12
    },
    minerals: {
      calcium: 110,
      iron: 0.1,
      magnesium: 11,
      phosphorus: 135,
      potassium: 141,
      sodium: 36,
      zinc: 0.5
    }
  },
  {
    name: 'Quinoa',
    brand: 'Ancient Harvest',
    category: 'grains',
    servingSize: { amount: 100, unit: 'g' },
    nutrition: {
      calories: 120,
      protein: 4.4,
      carbohydrates: 22,
      fat: 1.9,
      fiber: 2.8,
      sugar: 0.9,
      sodium: 7,
      cholesterol: 0,
      saturatedFat: 0.2,
      transFat: 0
    },
    vitamins: {
      vitaminA: 0,
      vitaminC: 0,
      vitaminD: 0,
      vitaminE: 0.6,
      vitaminK: 0,
      vitaminB1: 0.1,
      vitaminB2: 0.1,
      vitaminB3: 0.4,
      vitaminB6: 0.1,
      vitaminB12: 0,
      folate: 42
    },
    minerals: {
      calcium: 17,
      iron: 1.5,
      magnesium: 64,
      phosphorus: 152,
      potassium: 172,
      sodium: 7,
      zinc: 1.1
    }
  },
  {
    name: 'Spinach',
    brand: 'Fresh Market',
    category: 'vegetables',
    servingSize: { amount: 100, unit: 'g' },
    nutrition: {
      calories: 23,
      protein: 2.9,
      carbohydrates: 3.6,
      fat: 0.4,
      fiber: 2.2,
      sugar: 0.4,
      sodium: 79,
      cholesterol: 0,
      saturatedFat: 0.1,
      transFat: 0
    },
    vitamins: {
      vitaminA: 469,
      vitaminC: 28.1,
      vitaminD: 0,
      vitaminE: 2.0,
      vitaminK: 483,
      vitaminB1: 0.1,
      vitaminB2: 0.2,
      vitaminB3: 0.7,
      vitaminB6: 0.2,
      vitaminB12: 0,
      folate: 194
    },
    minerals: {
      calcium: 99,
      iron: 2.7,
      magnesium: 79,
      phosphorus: 49,
      potassium: 558,
      sodium: 79,
      zinc: 0.5
    }
  }
];

// Sample nutrition goals
const sampleNutritionGoals = [
  {
    dailyTargets: {
      calories: 2000,
      protein: 150,
      carbohydrates: 200,
      fat: 67,
      fiber: 25,
      sugar: 50,
      sodium: 2300,
      water: 2500
    },
    macroRatios: {
      proteinPercentage: 30,
      carbPercentage: 40,
      fatPercentage: 30
    },
    weightGoal: 'maintain',
    dietaryPreferences: ['high-protein'],
    mealTiming: {
      breakfast: { time: '08:00', calories: 500 },
      lunch: { time: '13:00', calories: 600 },
      dinner: { time: '19:00', calories: 600 },
      snacks: [{ time: '10:00', calories: 150 }, { time: '16:00', calories: 150 }]
    }
  },
  {
    dailyTargets: {
      calories: 1800,
      protein: 120,
      carbohydrates: 180,
      fat: 60,
      fiber: 30,
      sugar: 45,
      sodium: 2000,
      water: 2200
    },
    macroRatios: {
      proteinPercentage: 27,
      carbPercentage: 40,
      fatPercentage: 33
    },
    weightGoal: 'lose',
    weeklyWeightChange: -0.5,
    dietaryPreferences: ['vegetarian'],
    mealTiming: {
      breakfast: { time: '07:30', calories: 400 },
      lunch: { time: '12:30', calories: 500 },
      dinner: { time: '18:30', calories: 500 },
      snacks: [{ time: '10:30', calories: 200 }, { time: '15:30', calories: 200 }]
    }
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitness-app';
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️ Clearing existing data...');
    await Food.deleteMany({});
    await NutritionGoal.deleteMany({});

    // Seed foods
    console.log('🥗 Seeding food data...');
    const createdFoods = await Food.insertMany(sampleFoods);
    console.log(`✅ Created ${createdFoods.length} food items`);

    // Seed nutrition goals (these will be assigned to users when they create accounts)
    console.log('📊 Seeding nutrition goal templates...');
    const createdGoals = await NutritionGoal.insertMany(sampleNutritionGoals);
    console.log(`✅ Created ${createdGoals.length} nutrition goal templates`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`- ${createdFoods.length} food items added`);
    console.log(`- ${createdGoals.length} nutrition goal templates added`);
    console.log('\n💡 Next steps:');
    console.log('1. Set MONGODB_URI in your Render environment variables');
    console.log('2. Redeploy your backend');
    console.log('3. Test user registration and profile updates');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the seeding script
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
