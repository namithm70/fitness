import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Apple, Plus } from 'lucide-react';

const NutritionPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nutrition</h1>
          <p className="text-gray-600">Track your meals and plan your nutrition</p>
        </div>
        <button className="btn-primary flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Log Meal
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card text-center py-12"
      >
        <Apple className="w-16 h-16 text-nutrition-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Nutrition Tracking Coming Soon</h2>
        <p className="text-gray-600 mb-6">
          Comprehensive meal planning, calorie tracking, and nutrition analytics will be available soon!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-nutrition-600">10k+</div>
            <div className="text-sm text-gray-600">Food Database</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-nutrition-600">500+</div>
            <div className="text-sm text-gray-600">Recipes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-nutrition-600">AI</div>
            <div className="text-sm text-gray-600">Meal Suggestions</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NutritionPage;
