import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Apple, 
  Plus, 
  Search, 
  Target, 
  TrendingUp, 
  Droplets, 
  Calendar,
  Clock,
  BarChart3,
  Utensils
} from 'lucide-react';
import { NutritionDashboard as NutritionDashboardType, DailyTotals, NutritionGoal } from '../../types/nutrition';
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Failed to load nutrition data</p>
      </div>
    );
  }

  const { dailyTotals, nutritionGoal, recentMeals, weeklyData } = dashboard;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nutrition Dashboard</h1>
          <p className="text-gray-600">Track your daily nutrition and meal intake</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowFoodSearch(true)}
            className="btn-secondary flex items-center"
          >
            <Search className="w-4 h-4 mr-2" />
            Search Foods
          </button>
          <button 
            onClick={() => setShowMealLog(true)}
            className="btn-primary flex items-center"
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
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Daily Calories</h2>
            <Target className="w-5 h-5 text-gray-500" />
          </div>
          <CalorieCircle 
            current={dailyTotals.calories}
            target={nutritionGoal.dailyTargets.calories}
          />
          <div className="mt-4 text-center">
            <p className={`text-lg font-bold ${getProgressColor(dailyTotals.calories, nutritionGoal.dailyTargets.calories)}`}>
              {dailyTotals.calories} / {nutritionGoal.dailyTargets.calories} cal
            </p>
            <p className="text-sm text-gray-600">
              {Math.round((dailyTotals.calories / nutritionGoal.dailyTargets.calories) * 100)}% of daily goal
            </p>
          </div>
        </motion.div>

        {/* Macro Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Macros</h2>
            <BarChart3 className="w-5 h-5 text-gray-500" />
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
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Water Intake</h2>
            <Droplets className="w-5 h-5 text-gray-500" />
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
        className="card"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Daily Progress</h2>
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
                <span className="text-gray-700">{item.label}</span>
                <span className={`font-medium ${getProgressColor(item.current, item.target)}`}>
                  {item.current} / {item.target} {item.unit}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(item.current, item.target)}`}
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
        className="card"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Weekly Calories</h2>
        <WeeklyChart data={weeklyData} target={nutritionGoal.dailyTargets.calories} />
      </motion.div>

      {/* Recent Meals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Meals</h2>
          <Utensils className="w-5 h-5 text-gray-500" />
        </div>
        {recentMeals.length > 0 ? (
          <div className="space-y-3">
            {recentMeals.map((meal) => (
              <div key={meal._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 capitalize">{meal.mealType}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(meal.date).toLocaleDateString()} • {meal.entries.length} items
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{Math.round(meal.totalNutrition.calories)} cal</p>
                  <p className="text-sm text-gray-600">
                    P: {Math.round(meal.totalNutrition.protein)}g • C: {Math.round(meal.totalNutrition.carbohydrates)}g • F: {Math.round(meal.totalNutrition.fat)}g
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Apple className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No meals logged yet</p>
            <button 
              onClick={() => setShowMealLog(true)}
              className="btn-primary mt-3"
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
