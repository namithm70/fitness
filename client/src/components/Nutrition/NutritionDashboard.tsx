import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, Plus, Search,
  Utensils, Droplets, Scale, Activity
} from 'lucide-react';
import { NutritionDashboard as NutritionDashboardType } from '../../types/nutrition';
import { api } from '../../config/api';
import CalorieCircle from './CalorieCircle';
import MacroChart from './MacroChart';
import MealLogModal from './MealLogModal';
import FoodSearchModal from './FoodSearchModal';
import WeeklyChart from './WeeklyChart';
import WaterTracker from './WaterTracker';

const NutritionDashboard: React.FC = () => {
  const [dashboard, setDashboard] = useState<NutritionDashboardType | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMealLog, setShowMealLog] = useState(false);
  const [showFoodSearch, setShowFoodSearch] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await api.get('/nutrition/dashboard');
      setDashboard(response.data);
    } catch (error) {
      console.error('Error fetching nutrition dashboard:', error);
      // Set default data for development/demo purposes
      setDashboard({
        dailyTotals: {
          calories: 0,
          protein: 0,
          carbohydrates: 0,
          fat: 0,
          fiber: 0,
          sugar: 0,
          sodium: 0,
          water: 0
        },
        nutritionGoal: {
          _id: 'default-goal',
          user: 'default-user',
          dailyTargets: {
            calories: 2000,
            protein: 150,
            carbohydrates: 250,
            fat: 65,
            fiber: 25,
            sugar: 50,
            sodium: 2300,
            water: 8
          },
          macroRatios: {
            proteinPercentage: 30,
            carbPercentage: 50,
            fatPercentage: 20
          },
          weightGoal: 'maintain',
          targetWeight: 70,
          weeklyWeightChange: 0,
          dietaryPreferences: [],
          mealTiming: {
            breakfastTime: '08:00',
            lunchTime: '12:00',
            dinnerTime: '18:00',
            snackTimes: ['10:00', '15:00']
          },
          reminders: {
            mealReminders: true,
            waterReminders: true,
            weightReminders: false
          },
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        recentMeals: [],
        weeklyData: [],
        todaysMeals: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMealLogged = () => {
    setShowMealLog(false);
    fetchDashboard();
  };

  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 90 && percentage <= 110) return 'text-green-600';
    if (percentage > 110) return 'text-red-600';
    return 'text-blue-600';
  };

  const getProgressBarColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 90 && percentage <= 110) return 'bg-green-500';
    if (percentage > 110) return 'bg-red-500';
    return 'bg-blue-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="text-center py-12">
        <p className="text-white/70">Failed to load nutrition data</p>
      </div>
    );
  }

  const { dailyTotals, nutritionGoal, recentMeals, weeklyData } = dashboard;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Nutrition Dashboard</h1>
          <p className="text-white/80">Track your daily nutrition and meal intake</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowFoodSearch(true)}
            className="bg-white/20 text-white hover:bg-white/30 flex items-center px-4 py-2 rounded-lg font-semibold transition-all duration-200"
          >
            <Search className="w-4 h-4 mr-2" />
            Search Foods
          </button>
          <button 
            onClick={() => setShowMealLog(true)}
            className="bg-white text-purple-600 hover:bg-white/90 flex items-center px-4 py-2 rounded-lg font-semibold transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Log Meal
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calorie Circle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Daily Calories</h2>
            <Target className="w-5 h-5 text-white/70" />
          </div>
          <CalorieCircle 
            current={dailyTotals.calories}
            target={nutritionGoal.dailyTargets.calories}
          />
          <div className="mt-4 text-center">
            <p className="text-lg font-bold text-white">
              {dailyTotals.calories} / {nutritionGoal.dailyTargets.calories} cal
            </p>
            <p className="text-sm text-white/70">
              {Math.round((dailyTotals.calories / nutritionGoal.dailyTargets.calories) * 100)}% of daily goal
            </p>
          </div>
        </motion.div>

        {/* Macro Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Macros</h2>
            <Scale className="w-5 h-5 text-white/70" />
          </div>
          <MacroChart 
            protein={dailyTotals.protein}
            carbs={dailyTotals.carbohydrates}
            fat={dailyTotals.fat}
            proteinTarget={nutritionGoal.dailyTargets.protein}
            carbsTarget={nutritionGoal.dailyTargets.carbohydrates}
            fatTarget={nutritionGoal.dailyTargets.fat}
          />
        </motion.div>

        {/* Water Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Water Intake</h2>
            <Droplets className="w-5 h-5 text-white/70" />
          </div>
          <WaterTracker 
            current={dailyTotals.water}
            target={nutritionGoal.dailyTargets.water}
          />
        </motion.div>
      </div>

      {/* Progress Bars */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-lg"
      >
        <h2 className="text-xl font-semibold text-white mb-4">Daily Progress</h2>
        <div className="space-y-4">
          {[
            { label: 'Protein', current: dailyTotals.protein, target: nutritionGoal.dailyTargets.protein, unit: 'g' },
            { label: 'Carbs', current: dailyTotals.carbohydrates, target: nutritionGoal.dailyTargets.carbohydrates, unit: 'g' },
            { label: 'Fat', current: dailyTotals.fat, target: nutritionGoal.dailyTargets.fat, unit: 'g' },
            { label: 'Fiber', current: dailyTotals.fiber, target: nutritionGoal.dailyTargets.fiber, unit: 'g' },
            { label: 'Sugar', current: dailyTotals.sugar, target: nutritionGoal.dailyTargets.sugar, unit: 'g' },
            { label: 'Sodium', current: dailyTotals.sodium, target: nutritionGoal.dailyTargets.sodium, unit: 'mg' }
          ].map((item) => (
            <div key={item.label} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/90">{item.label}</span>
                <span className="font-medium text-white">
                  {item.current} / {item.target} {item.unit}
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-300 bg-white"
                  style={{ width: `${Math.min((item.current / item.target) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Weekly Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-lg"
      >
        <h2 className="text-xl font-semibold text-white mb-4">Weekly Calories</h2>
        <WeeklyChart data={weeklyData} target={nutritionGoal.dailyTargets.calories} />
      </motion.div>

      {/* Recent Meals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Recent Meals</h2>
          <Utensils className="w-5 h-5 text-white/70" />
        </div>
        {recentMeals.length > 0 ? (
          <div className="space-y-3">
            {recentMeals.map((meal) => (
              <div key={meal._id} className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-white capitalize">{meal.mealType}</p>
                    <p className="text-sm text-white/70">
                      {new Date(meal.date).toLocaleDateString()} • {meal.entries.length} items
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-white">{Math.round(meal.totalNutrition.calories)} cal</p>
                  <p className="text-sm text-white/70">
                    P: {Math.round(meal.totalNutrition.protein)}g • C: {Math.round(meal.totalNutrition.carbohydrates)}g • F: {Math.round(meal.totalNutrition.fat)}g
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-white/40 mx-auto mb-3" />
            <p className="text-white/70">No meals logged yet</p>
            <button 
              onClick={() => setShowMealLog(true)}
              className="bg-white text-purple-600 hover:bg-white/90 mt-3 px-4 py-2 rounded-lg font-semibold transition-all duration-200"
            >
              Log Your First Meal
            </button>
          </div>
        )}
      </motion.div>

      {/* Modals */}
      {showMealLog && (
        <MealLogModal 
          isOpen={showMealLog}
          onClose={() => setShowMealLog(false)}
          onMealLogged={handleMealLogged}
          mealType={selectedMealType}
        />
      )}

      {showFoodSearch && (
        <FoodSearchModal 
          isOpen={showFoodSearch}
          onClose={() => setShowFoodSearch(false)}
          onFoodSelected={(food) => {
            setShowFoodSearch(false);
            setSelectedMealType('snack');
            setShowMealLog(true);
          }}
        />
      )}
    </div>
  );
};

export default NutritionDashboard;
