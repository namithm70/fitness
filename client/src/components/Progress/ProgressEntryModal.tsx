import React, { useState } from 'react';
import { X, Save, Calendar, Activity, Target, TrendingUp } from 'lucide-react';
import { ProgressEntryCreate } from '../../types/progress';
import { api } from '../../config/api';
import { logProgressUpdate } from '../../utils/activityLogger';
import { useAuth } from '../../contexts/AuthContext';

interface ProgressEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEntryCreated: () => void;
  entryType: 'weight' | 'measurements' | 'body-fat' | 'progress-photo' | 'strength' | 'endurance' | 'flexibility';
}

const ProgressEntryModal: React.FC<ProgressEntryModalProps> = ({
  isOpen,
  onClose,
  onEntryCreated,
  entryType
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<Partial<ProgressEntryCreate>>({
    type: entryType,
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/progress/entries', formData);
      
      // Log progress activity
      if (user?.id) {
        let measurementType = entryType;
        let value = 0;
        
        switch (entryType) {
          case 'weight':
            value = formData.weight || 0;
            break;
          case 'measurements':
            measurementType = 'measurements';
            value = Object.values(formData.measurements || {}).reduce((sum, val) => sum + (val || 0), 0);
            break;
          case 'body-fat':
            value = formData.bodyFatPercentage || 0;
            break;
          case 'strength':
            measurementType = 'strength';
            value = formData.strengthMetrics?.[0]?.weight || 0;
            break;
          case 'endurance':
            measurementType = 'endurance';
            value = formData.enduranceMetrics?.distance || 0;
            break;
          case 'flexibility':
            measurementType = 'flexibility';
            value = formData.flexibilityMetrics?.sitAndReach || 0;
            break;
          default:
            value = 0;
        }
        
        await logProgressUpdate(user.id, measurementType, value);
      }
      
      onEntryCreated();
    } catch (error) {
      console.error('Error creating progress entry:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderWeightForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white/90 mb-1">
          Weight (kg)
        </label>
        <input
          type="number"
          step="0.1"
          min="30"
          max="300"
          value={formData.weight || ''}
          onChange={(e) => updateFormData('weight', parseFloat(e.target.value))}
          className="w-full px-3 py-2 border border-white/20 bg-white/10 text-white placeholder-white/60 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
          placeholder="Enter your weight"
        />
      </div>
    </div>
  );

  const renderMeasurementsForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/90 mb-1">
            Chest (cm)
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.measurements?.chest || ''}
            onChange={(e) => updateFormData('measurements', {
              ...formData.measurements,
              chest: parseFloat(e.target.value)
            })}
            className="w-full px-3 py-2 border border-white/20 bg-white/10 text-white placeholder-white/60 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
            placeholder="Chest"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/90 mb-1">
            Waist (cm)
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.measurements?.waist || ''}
            onChange={(e) => updateFormData('measurements', {
              ...formData.measurements,
              waist: parseFloat(e.target.value)
            })}
            className="w-full px-3 py-2 border border-white/20 bg-white/10 text-white placeholder-white/60 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
            placeholder="Waist"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/90 mb-1">
            Hips (cm)
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.measurements?.hips || ''}
            onChange={(e) => updateFormData('measurements', {
              ...formData.measurements,
              hips: parseFloat(e.target.value)
            })}
            className="w-full px-3 py-2 border border-white/20 bg-white/10 text-white placeholder-white/60 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
            placeholder="Hips"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/90 mb-1">
            Biceps (cm)
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.measurements?.biceps || ''}
            onChange={(e) => updateFormData('measurements', {
              ...formData.measurements,
              biceps: parseFloat(e.target.value)
            })}
            className="w-full px-3 py-2 border border-white/20 bg-white/10 text-white placeholder-white/60 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
            placeholder="Biceps"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/90 mb-1">
            Thighs (cm)
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.measurements?.thighs || ''}
            onChange={(e) => updateFormData('measurements', {
              ...formData.measurements,
              thighs: parseFloat(e.target.value)
            })}
            className="w-full px-3 py-2 border border-white/20 bg-white/10 text-white placeholder-white/60 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
            placeholder="Thighs"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/90 mb-1">
            Calves (cm)
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.measurements?.calves || ''}
            onChange={(e) => updateFormData('measurements', {
              ...formData.measurements,
              calves: parseFloat(e.target.value)
            })}
            className="w-full px-3 py-2 border border-white/20 bg-white/10 text-white placeholder-white/60 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
            placeholder="Calves"
          />
        </div>
      </div>
    </div>
  );

  const renderBodyFatForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white/90 mb-1">
          Body Fat Percentage (%)
        </label>
        <input
          type="number"
          step="0.1"
          min="0"
          max="50"
          value={formData.bodyFatPercentage || ''}
          onChange={(e) => updateFormData('bodyFatPercentage', parseFloat(e.target.value))}
          className="w-full px-3 py-2 border border-white/20 bg-white/10 text-white placeholder-white/60 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
          placeholder="Enter body fat percentage"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white/90 mb-1">
          Muscle Mass (kg)
        </label>
        <input
          type="number"
          step="0.1"
          min="0"
          max="200"
          value={formData.muscleMass || ''}
          onChange={(e) => updateFormData('muscleMass', parseFloat(e.target.value))}
          className="w-full px-3 py-2 border border-white/20 bg-white/10 text-white placeholder-white/60 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
          placeholder="Enter muscle mass"
        />
      </div>
    </div>
  );

  const renderStrengthForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white/90 mb-1">
          Exercise
        </label>
        <input
          type="text"
          value={formData.strengthMetrics?.[0]?.exercise || ''}
          onChange={(e) => updateFormData('strengthMetrics', [{
            exercise: e.target.value,
            weight: formData.strengthMetrics?.[0]?.weight || 0,
            reps: formData.strengthMetrics?.[0]?.reps || 0,
            sets: formData.strengthMetrics?.[0]?.sets || 0,
            isPR: formData.strengthMetrics?.[0]?.isPR || false
          }])}
          className="w-full px-3 py-2 border border-white/20 bg-white/10 text-white placeholder-white/60 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
          placeholder="e.g., Bench Press"
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/90 mb-1">
            Weight (kg)
          </label>
          <input
            type="number"
            step="0.5"
            min="0"
            value={formData.strengthMetrics?.[0]?.weight || ''}
            onChange={(e) => updateFormData('strengthMetrics', [{
              ...formData.strengthMetrics?.[0],
              weight: parseFloat(e.target.value)
            }])}
            className="w-full px-3 py-2 border border-white/20 bg-white/10 text-white placeholder-white/60 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
            placeholder="Weight"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/90 mb-1">
            Reps
          </label>
          <input
            type="number"
            min="0"
            value={formData.strengthMetrics?.[0]?.reps || ''}
            onChange={(e) => updateFormData('strengthMetrics', [{
              ...formData.strengthMetrics?.[0],
              reps: parseInt(e.target.value)
            }])}
            className="w-full px-3 py-2 border border-white/20 bg-white/10 text-white placeholder-white/60 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
            placeholder="Reps"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/90 mb-1">
            Sets
          </label>
          <input
            type="number"
            min="0"
            value={formData.strengthMetrics?.[0]?.sets || ''}
            onChange={(e) => updateFormData('strengthMetrics', [{
              ...formData.strengthMetrics?.[0],
              sets: parseInt(e.target.value)
            }])}
            className="w-full px-3 py-2 border border-white/20 bg-white/10 text-white placeholder-white/60 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
            placeholder="Sets"
          />
        </div>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isPR"
          checked={formData.strengthMetrics?.[0]?.isPR || false}
          onChange={(e) => updateFormData('strengthMetrics', [{
            ...formData.strengthMetrics?.[0],
            isPR: e.target.checked
          }])}
          className="h-4 w-4 text-purple-400 focus:ring-purple-400 border-white/20 bg-white/10 rounded"
        />
        <label htmlFor="isPR" className="ml-2 block text-sm text-white/90">
          Personal Record
        </label>
      </div>
    </div>
  );

  const renderEnduranceForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white/90 mb-1">
          Cardio Type
        </label>
        <select
          value={formData.enduranceMetrics?.cardioType || ''}
          onChange={(e) => updateFormData('enduranceMetrics', {
            ...formData.enduranceMetrics,
            cardioType: e.target.value as any
          })}
          className="w-full px-3 py-2 border border-white/20 bg-white/10 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
        >
          <option value="">Select cardio type</option>
          <option value="running">Running</option>
          <option value="cycling">Cycling</option>
          <option value="swimming">Swimming</option>
          <option value="rowing">Rowing</option>
          <option value="elliptical">Elliptical</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/90 mb-1">
            Duration (minutes)
          </label>
          <input
            type="number"
            min="0"
            value={formData.enduranceMetrics?.duration || ''}
            onChange={(e) => updateFormData('enduranceMetrics', {
              ...formData.enduranceMetrics,
              duration: parseInt(e.target.value)
            })}
            className="w-full px-3 py-2 border border-white/20 bg-white/10 text-white placeholder-white/60 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
            placeholder="Duration"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/90 mb-1">
            Distance (km)
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={formData.enduranceMetrics?.distance || ''}
            onChange={(e) => updateFormData('enduranceMetrics', {
              ...formData.enduranceMetrics,
              distance: parseFloat(e.target.value)
            })}
            className="w-full px-3 py-2 border border-white/20 bg-white/10 text-white placeholder-white/60 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
            placeholder="Distance"
          />
        </div>
      </div>
    </div>
  );

  const renderFlexibilityForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white/90 mb-1">
          Sit and Reach (cm)
        </label>
        <input
          type="number"
          step="0.1"
          min="-50"
          max="50"
          value={formData.flexibilityMetrics?.sitAndReach || ''}
          onChange={(e) => updateFormData('flexibilityMetrics', {
            ...formData.flexibilityMetrics,
            sitAndReach: parseFloat(e.target.value)
          })}
          className="w-full px-3 py-2 border border-white/20 bg-white/10 text-white placeholder-white/60 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
          placeholder="Sit and reach distance"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/90 mb-1">
            Shoulder Flexibility (degrees)
          </label>
          <input
            type="number"
            min="0"
            max="180"
            value={formData.flexibilityMetrics?.shoulderFlexibility || ''}
            onChange={(e) => updateFormData('flexibilityMetrics', {
              ...formData.flexibilityMetrics,
              shoulderFlexibility: parseInt(e.target.value)
            })}
            className="w-full px-3 py-2 border border-white/20 bg-white/10 text-white placeholder-white/60 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
            placeholder="Shoulder flexibility"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/90 mb-1">
            Hip Flexibility (degrees)
          </label>
          <input
            type="number"
            min="0"
            max="180"
            value={formData.flexibilityMetrics?.hipFlexibility || ''}
            onChange={(e) => updateFormData('flexibilityMetrics', {
              ...formData.flexibilityMetrics,
              hipFlexibility: parseInt(e.target.value)
            })}
            className="w-full px-3 py-2 border border-white/20 bg-white/10 text-white placeholder-white/60 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
            placeholder="Hip flexibility"
          />
        </div>
      </div>
    </div>
  );

  const renderFormContent = () => {
    switch (entryType) {
      case 'weight':
        return renderWeightForm();
      case 'measurements':
        return renderMeasurementsForm();
      case 'body-fat':
        return renderBodyFatForm();
      case 'strength':
        return renderStrengthForm();
      case 'endurance':
        return renderEnduranceForm();
      case 'flexibility':
        return renderFlexibilityForm();
      default:
        return <div>Form not implemented for this type</div>;
    }
  };

  const getEntryTypeIcon = () => {
    switch (entryType) {
      case 'weight':
        return <TrendingUp className="w-5 h-5" />;
      case 'measurements':
        return <Target className="w-5 h-5" />;
      case 'body-fat':
        return <Activity className="w-5 h-5" />;
      case 'strength':
        return <Target className="w-5 h-5" />;
      case 'endurance':
        return <Activity className="w-5 h-5" />;
      case 'flexibility':
        return <Activity className="w-5 h-5" />;
      default:
        return <TrendingUp className="w-5 h-5" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20 bg-white/5">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
              {getEntryTypeIcon()}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                Log {entryType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </h2>
              <p className="text-sm text-white/80">Track your progress</p>
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
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-1">
              Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-white/60" />
              <input
                type="date"
                value={formData.date || ''}
                onChange={(e) => updateFormData('date', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-white/20 bg-white/10 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
              />
            </div>
          </div>

          {/* Dynamic Form Content */}
          {renderFormContent()}

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
              placeholder="Add any notes about this entry..."
            />
          </div>

          {/* Mood and Energy */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-1">
                Mood
              </label>
              <select
                value={formData.mood || ''}
                onChange={(e) => updateFormData('mood', e.target.value)}
                className="w-full px-3 py-2 border border-white/20 bg-white/10 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
              >
                <option value="">Select mood</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="okay">Okay</option>
                <option value="poor">Poor</option>
                <option value="terrible">Terrible</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/90 mb-1">
                Energy Level (1-10)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.energyLevel || ''}
                onChange={(e) => updateFormData('energyLevel', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-white/20 bg-white/10 text-white placeholder-white/60 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                placeholder="Energy level"
              />
            </div>
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
                  <Save className="w-4 h-4 mr-2" />
                  Save Entry
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProgressEntryModal;
