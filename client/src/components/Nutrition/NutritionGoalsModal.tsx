import React, { useState, useEffect } from 'react';
import { X, Target, Save } from 'lucide-react';
import { NutritionGoal, NutritionGoalUpdate } from '../../types/nutrition';
import { api } from '../../config/api';

interface NutritionGoalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoalsUpdated: () => void;
}

const NutritionGoalsModal: React.FC<NutritionGoalsModalProps> = ({
  isOpen,
  onClose,
  onGoalsUpdated
}) => {
  const [goals, setGoals] = useState<NutritionGoal | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchGoals();
    }
  }, [isOpen]);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/nutrition/goals');
      setGoals(response.data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateGoal = (field: string, value: any) => {
    if (!goals) return;
    
    const updatePath = field.split('.');
    const newGoals = { ...goals };
    let current: any = newGoals;
    
    for (let i = 0; i < updatePath.length - 1; i++) {
      current = current[updatePath[i]];
    }
    current[updatePath[updatePath.length - 1]] = value;
    
    setGoals(newGoals);
  };

  const handleSave = async () => {
    if (!goals) return;

    try {
      setSaving(true);
      const updateData: NutritionGoalUpdate = {
        dailyTargets: goals.dailyTargets,
        macroRatios: goals.macroRatios,
        weightGoal: goals.weightGoal,
        targetWeight: goals.targetWeight,
        weeklyWeightChange: goals.weeklyWeightChange,
        dietaryPreferences: goals.dietaryPreferences,
        mealTiming: goals.mealTiming,
        reminders: goals.reminders,
        isActive: goals.isActive
      };

      await api.put('/api/nutrition/goals', updateData);
      onGoalsUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating goals:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!goals) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <Target className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Nutrition Goals</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Daily Targets */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Targets</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Calories
                </label>
                <input
                  type="number"
                  value={goals.dailyTargets.calories}
                  onChange={(e) => updateGoal('dailyTargets.calories', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Protein (g)
                </label>
                <input
                  type="number"
                  value={goals.dailyTargets.protein}
                  onChange={(e) => updateGoal('dailyTargets.protein', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Carbohydrates (g)
                </label>
                <input
                  type="number"
                  value={goals.dailyTargets.carbohydrates}
                  onChange={(e) => updateGoal('dailyTargets.carbohydrates', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fat (g)
                </label>
                <input
                  type="number"
                  value={goals.dailyTargets.fat}
                  onChange={(e) => updateGoal('dailyTargets.fat', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fiber (g)
                </label>
                <input
                  type="number"
                  value={goals.dailyTargets.fiber}
                  onChange={(e) => updateGoal('dailyTargets.fiber', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Water (ml)
                </label>
                <input
                  type="number"
                  value={goals.dailyTargets.water}
                  onChange={(e) => updateGoal('dailyTargets.water', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Macro Ratios */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Macro Ratios (%)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Protein
                </label>
                <input
                  type="number"
                  value={goals.macroRatios.proteinPercentage}
                  onChange={(e) => updateGoal('macroRatios.proteinPercentage', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Carbohydrates
                </label>
                <input
                  type="number"
                  value={goals.macroRatios.carbPercentage}
                  onChange={(e) => updateGoal('macroRatios.carbPercentage', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fat
                </label>
                <input
                  type="number"
                  value={goals.macroRatios.fatPercentage}
                  onChange={(e) => updateGoal('macroRatios.fatPercentage', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Weight Goals */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Weight Goals</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Goal
                </label>
                <select
                  value={goals.weightGoal}
                  onChange={(e) => updateGoal('weightGoal', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="lose">Lose Weight</option>
                  <option value="maintain">Maintain Weight</option>
                  <option value="gain">Gain Weight</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Weight (kg)
                </label>
                <input
                  type="number"
                  value={goals.targetWeight || ''}
                  onChange={(e) => updateGoal('targetWeight', parseFloat(e.target.value) || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weekly Change (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={goals.weeklyWeightChange}
                  onChange={(e) => updateGoal('weeklyWeightChange', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Dietary Preferences */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Dietary Preferences</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                'vegetarian', 'vegan', 'keto', 'paleo', 'mediterranean', 
                'high-protein', 'low-carb', 'gluten-free', 'dairy-free'
              ].map((preference) => (
                <label key={preference} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={goals.dietaryPreferences?.includes(preference) || false}
                    onChange={(e) => {
                      const current = goals.dietaryPreferences || [];
                      const updated = e.target.checked
                        ? [...current, preference]
                        : current.filter(p => p !== preference);
                      updateGoal('dietaryPreferences', updated);
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 capitalize">
                    {preference.replace('-', ' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Reminders */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Reminders</h3>
            <div className="space-y-3">
              {[
                { key: 'mealReminders', label: 'Meal Reminders' },
                { key: 'waterReminders', label: 'Water Reminders' },
                { key: 'weightReminders', label: 'Weight Tracking Reminders' }
              ].map((reminder) => (
                <label key={reminder.key} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={goals.reminders[reminder.key as keyof typeof goals.reminders] || false}
                    onChange={(e) => updateGoal(`reminders.${reminder.key}`, e.target.checked)}
                    className="mr-3"
                  />
                  <span className="text-sm text-gray-700">{reminder.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary flex items-center disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Goals'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NutritionGoalsModal;
