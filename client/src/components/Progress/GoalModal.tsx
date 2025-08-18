import React, { useState } from 'react';
import { X, Target, Calendar, Award } from 'lucide-react';
import { GoalCreate } from '../../types/progress';
import { api } from '../../config/api';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoalCreated: () => void;
}

const GoalModal: React.FC<GoalModalProps> = ({
  isOpen,
  onClose,
  onGoalCreated
}) => {
  const [formData, setFormData] = useState<Partial<GoalCreate>>({
    type: 'weight',
    unit: 'kg',
    priority: 'medium',
    targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/progress/goals', formData);
      onGoalCreated();
    } catch (error) {
      console.error('Error creating goal:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGoalTypeOptions = () => {
    switch (formData.type) {
      case 'weight':
        return { units: ['kg', 'lbs'], placeholder: 'Target weight' };
      case 'strength':
        return { units: ['kg', 'lbs'], placeholder: 'Target weight for exercise' };
      case 'endurance':
        return { units: ['minutes', 'km', 'miles'], placeholder: 'Target duration/distance' };
      case 'flexibility':
        return { units: ['cm', 'degrees'], placeholder: 'Target flexibility measure' };
      case 'measurements':
        return { units: ['cm', 'inches'], placeholder: 'Target measurement' };
      case 'workout-frequency':
        return { units: ['workouts', 'days'], placeholder: 'Target frequency' };
      default:
        return { units: ['custom'], placeholder: 'Target value' };
    }
  };

  const goalTypeOptions = getGoalTypeOptions();

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20 bg-white/5">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
              <Target className="w-5 h-5 text-green-300" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Create New Goal</h2>
              <p className="text-sm text-white/80">Set a fitness target to work towards</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Goal Title */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-1">
              Goal Title *
            </label>
            <input
              type="text"
              required
              value={formData.title || ''}
              onChange={(e) => updateFormData('title', e.target.value)}
              className="w-full px-3 py-2 border border-white/20 bg-white/10 text-white placeholder-white/60 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
              placeholder="e.g., Lose 10kg, Run 5K, Bench Press 100kg"
            />
          </div>

          {/* Goal Description */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-1">
              Description (optional)
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => updateFormData('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-white/20 bg-white/10 text-white placeholder-white/60 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
              placeholder="Why is this goal important to you?"
            />
          </div>

          {/* Goal Type */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-1">
              Goal Type *
            </label>
            <select
              required
              value={formData.type || ''}
              onChange={(e) => {
                updateFormData('type', e.target.value);
                // Reset unit based on type
                const newUnit = getGoalTypeOptions().units[0];
                updateFormData('unit', newUnit);
              }}
              className="w-full px-3 py-2 border border-white/20 bg-white/10 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
            >
              <option value="weight">Weight Goal</option>
              <option value="strength">Strength Goal</option>
              <option value="endurance">Endurance Goal</option>
              <option value="flexibility">Flexibility Goal</option>
              <option value="measurements">Measurement Goal</option>
              <option value="workout-frequency">Workout Frequency Goal</option>
              <option value="custom">Custom Goal</option>
            </select>
          </div>

          {/* Exercise (for strength goals) */}
          {formData.type === 'strength' && (
            <div>
              <label className="block text-sm font-medium text-white/90 mb-1">
                Exercise
              </label>
              <input
                type="text"
                value={formData.exercise || ''}
                onChange={(e) => updateFormData('exercise', e.target.value)}
                className="w-full px-3 py-2 border border-white/20 bg-white/10 text-white placeholder-white/60 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                placeholder="e.g., Bench Press, Squat, Deadlift"
              />
            </div>
          )}

          {/* Measurement Type (for measurement goals) */}
          {formData.type === 'measurements' && (
            <div>
              <label className="block text-sm font-medium text-white/90 mb-1">
                Measurement Type
              </label>
              <select
                value={formData.measurementType || ''}
                onChange={(e) => updateFormData('measurementType', e.target.value)}
                className="w-full px-3 py-2 border border-white/20 bg-white/10 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
              >
                <option value="">Select measurement</option>
                <option value="chest">Chest</option>
                <option value="waist">Waist</option>
                <option value="hips">Hips</option>
                <option value="biceps">Biceps</option>
                <option value="forearms">Forearms</option>
                <option value="thighs">Thighs</option>
                <option value="calves">Calves</option>
                <option value="neck">Neck</option>
                <option value="shoulders">Shoulders</option>
              </select>
            </div>
          )}

          {/* Target Value and Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-1">
                Target Value *
              </label>
              <input
                type="number"
                required
                step="0.1"
                min="0"
                value={formData.targetValue || ''}
                onChange={(e) => updateFormData('targetValue', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-white/20 bg-white/10 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                placeholder={goalTypeOptions.placeholder}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/90 mb-1">
                Unit *
              </label>
              <select
                required
                value={formData.unit || ''}
                onChange={(e) => updateFormData('unit', e.target.value)}
                className="w-full px-3 py-2 border border-white/20 bg-white/10 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
              >
                {goalTypeOptions.units.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Target Date */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-1">
              Target Date *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-white/60" />
              <input
                type="date"
                required
                value={formData.targetDate || ''}
                onChange={(e) => updateFormData('targetDate', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-white/20 bg-white/10 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
              />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-1">
              Priority
            </label>
            <select
              value={formData.priority || 'medium'}
              onChange={(e) => updateFormData('priority', e.target.value)}
              className="w-full px-3 py-2 border border-white/20 bg-white/10 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-1">
              Tags (optional)
            </label>
            <input
              type="text"
              value={formData.tags?.join(', ') || ''}
              onChange={(e) => updateFormData('tags', e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag))}
              className="w-full px-3 py-2 border border-white/20 bg-white/10 text-white placeholder-white/60 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
              placeholder="e.g., weight-loss, strength, cardio"
            />
            <p className="text-xs text-white/60 mt-1">Separate tags with commas</p>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-1">
              Notes (optional)
            </label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => updateFormData('notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-white/20 bg-white/10 text-white placeholder-white/60 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
              placeholder="Additional notes about your goal..."
            />
          </div>

          {/* Footer */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-white/20 bg-white/20 text-white rounded-md hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-white text-purple-600 rounded-md hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
              ) : (
                <>
                  <Award className="w-4 h-4 mr-2" />
                  Create Goal
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalModal;
