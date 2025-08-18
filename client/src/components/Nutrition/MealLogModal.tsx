import React, { useState } from 'react';
import { X, Plus, Search, Trash2 } from 'lucide-react';
import { Food, MealLogParams } from '../../types/nutrition';
import { api } from '../../config/api';
import FoodSearchModal from './FoodSearchModal';
import { logNutritionEntry } from '../../utils/activityLogger';
import { useAuth } from '../../contexts/AuthContext';

interface MealLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMealLogged: () => void;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

interface MealEntry {
  food: Food;
  servingAmount: number;
  servingUnit: 'g' | 'ml' | 'oz' | 'cup' | 'tbsp' | 'tsp' | 'piece' | 'slice';
  multiplier: number;
  notes?: string;
}

const MealLogModal: React.FC<MealLogModalProps> = ({
  isOpen,
  onClose,
  onMealLogged,
  mealType
}) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<MealEntry[]>([]);
  const [mealName, setMealName] = useState('');
  const [notes, setNotes] = useState('');
  const [showFoodSearch, setShowFoodSearch] = useState(false);
  const [loading, setLoading] = useState(false);

  const addFood = (food: Food) => {
    const newEntry: MealEntry = {
      food,
      servingAmount: food.servingSize.amount,
      servingUnit: food.servingSize.unit,
      multiplier: 1,
      notes: ''
    };
    setEntries([...entries, newEntry]);
  };

  const removeEntry = (index: number) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const updateEntry = (index: number, field: keyof MealEntry, value: any) => {
    const updatedEntries = [...entries];
    updatedEntries[index] = { ...updatedEntries[index], [field]: value };
    setEntries(updatedEntries);
  };

  const calculateTotalNutrition = () => {
    return entries.reduce((total, entry) => {
      const multiplier = entry.multiplier;
      return {
        calories: total.calories + (entry.food.nutrition.calories * multiplier),
        protein: total.protein + (entry.food.nutrition.protein * multiplier),
        carbohydrates: total.carbohydrates + (entry.food.nutrition.carbohydrates * multiplier),
        fat: total.fat + (entry.food.nutrition.fat * multiplier),
        fiber: total.fiber + (entry.food.nutrition.fiber * multiplier),
        sugar: total.sugar + (entry.food.nutrition.sugar * multiplier),
        sodium: total.sodium + (entry.food.nutrition.sodium * multiplier)
      };
    }, {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0
    });
  };

  const handleSubmit = async () => {
    if (entries.length === 0) return;

    try {
      setLoading(true);
      const mealData: MealLogParams = {
        mealType,
        entries: entries.map(entry => ({
          food: entry.food._id,
          servingAmount: entry.servingAmount,
          servingUnit: entry.servingUnit,
          multiplier: entry.multiplier,
          notes: entry.notes
        })),
        name: mealName,
        notes,
        date: new Date().toISOString()
      };

      await api.post('/nutrition/meals', mealData);
      
      // Log nutrition activity
      if (user?.id && entries.length > 0) {
        const totalCalories = calculateTotalNutrition().calories;
        const foodNames = entries.map(entry => entry.food.name).join(', ');
        await logNutritionEntry(user.id, mealType, foodNames, totalCalories);
      }
      
      onMealLogged();
    } catch (error) {
      console.error('Error logging meal:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalNutrition = calculateTotalNutrition();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20 bg-white/5">
          <h2 className="text-xl font-semibold text-white">
            Log {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
          </h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Meal Name */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Meal Name (Optional)
            </label>
            <input
              type="text"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              placeholder="e.g., Protein Bowl, Smoothie"
              className="w-full px-3 py-2 border border-white/20 bg-white/10 text-white placeholder-white/60 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
            />
          </div>

          {/* Food Entries */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Food Items</h3>
              <button
                onClick={() => setShowFoodSearch(true)}
                className="bg-white text-purple-600 hover:bg-white/90 px-4 py-2 rounded-lg font-semibold flex items-center transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Food
              </button>
            </div>

            {entries.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-white/30 rounded-lg bg-white/5">
                <Search className="w-12 h-12 text-white/40 mx-auto mb-3" />
                <p className="text-white/80">No foods added yet</p>
                <button
                  onClick={() => setShowFoodSearch(true)}
                  className="bg-white text-purple-600 hover:bg-white/90 px-4 py-2 rounded-lg font-semibold mt-3 transition-all duration-200"
                >
                  Search and Add Foods
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {entries.map((entry, index) => (
                  <div key={index} className="border border-white/20 rounded-lg p-4 bg-white/5 backdrop-blur-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{entry.food.name}</h4>
                        <p className="text-sm text-white/80">
                          {entry.food.brand && `${entry.food.brand} • `}
                          {entry.food.nutrition.calories} cal per {entry.food.servingSize.amount}{entry.food.servingSize.unit}
                        </p>
                      </div>
                      <button
                        onClick={() => removeEntry(index)}
                        className="text-red-400 hover:text-red-300 ml-2 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <label className="block text-xs font-medium text-white/80 mb-1">
                          Serving Amount
                        </label>
                        <input
                          type="number"
                          value={entry.servingAmount}
                          onChange={(e) => updateEntry(index, 'servingAmount', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1 text-sm border border-white/20 bg-white/10 text-white rounded focus:outline-none focus:ring-1 focus:ring-purple-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-white/80 mb-1">
                          Unit
                        </label>
                        <select
                          value={entry.servingUnit}
                          onChange={(e) => updateEntry(index, 'servingUnit', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-white/20 bg-white/10 text-white rounded focus:outline-none focus:ring-1 focus:ring-purple-400"
                        >
                          <option value="g">g</option>
                          <option value="ml">ml</option>
                          <option value="oz">oz</option>
                          <option value="cup">cup</option>
                          <option value="tbsp">tbsp</option>
                          <option value="tsp">tsp</option>
                          <option value="piece">piece</option>
                          <option value="slice">slice</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="block text-xs font-medium text-white/80 mb-1">
                        Multiplier
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={entry.multiplier}
                        onChange={(e) => updateEntry(index, 'multiplier', parseFloat(e.target.value) || 1)}
                        className="w-full px-2 py-1 text-sm border border-white/20 bg-white/10 text-white rounded focus:outline-none focus:ring-1 focus:ring-purple-400"
                      />
                    </div>

                    <div className="mt-3">
                      <label className="block text-xs font-medium text-white/80 mb-1">
                        Notes (Optional)
                      </label>
                      <input
                        type="text"
                        value={entry.notes || ''}
                        onChange={(e) => updateEntry(index, 'notes', e.target.value)}
                        placeholder="e.g., cooked, raw, etc."
                        className="w-full px-2 py-1 text-sm border border-white/20 bg-white/10 text-white placeholder-white/60 rounded focus:outline-none focus:ring-1 focus:ring-purple-400"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Total Nutrition */}
          {entries.length > 0 && (
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-4">
              <h3 className="font-medium text-white mb-3">Total Nutrition</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-white/70">Calories:</span>
                  <span className="font-medium ml-1 text-white">{Math.round(totalNutrition.calories)}</span>
                </div>
                <div>
                  <span className="text-white/70">Protein:</span>
                  <span className="font-medium ml-1 text-white">{Math.round(totalNutrition.protein)}g</span>
                </div>
                <div>
                  <span className="text-white/70">Carbs:</span>
                  <span className="font-medium ml-1 text-white">{Math.round(totalNutrition.carbohydrates)}g</span>
                </div>
                <div>
                  <span className="text-white/70">Fat:</span>
                  <span className="font-medium ml-1 text-white">{Math.round(totalNutrition.fat)}g</span>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes about this meal..."
              rows={3}
              className="w-full px-3 py-2 border border-white/20 bg-white/10 text-white placeholder-white/60 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-white/20 bg-white/5">
          <button
            onClick={onClose}
            className="bg-white/20 text-white hover:bg-white/30 px-4 py-2 rounded-lg font-semibold transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={entries.length === 0 || loading}
            className="bg-white text-purple-600 hover:bg-white/90 px-4 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? 'Saving...' : 'Log Meal'}
          </button>
        </div>
      </div>

      {/* Food Search Modal */}
      {showFoodSearch && (
        <FoodSearchModal
          isOpen={showFoodSearch}
          onClose={() => setShowFoodSearch(false)}
          onFoodSelected={addFood}
        />
      )}
    </div>
  );
};

export default MealLogModal;
