import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, TrendingUp, Plus, Search, Bell, Settings,
  Activity, Award, Clock, Trophy, BarChart3
} from 'lucide-react';
import { ProgressDashboard as ProgressDashboardType } from '../../types/progress';
import { api } from '../../config/api';
import WeightChart from './WeightChart';
import MeasurementChart from './MeasurementChart';
import GoalCard from './GoalCard';
import AchievementCard from './AchievementCard';
import ProgressEntryModal from './ProgressEntryModal';
import GoalModal from './GoalModal';
import WorkoutFrequencyChart from './WorkoutFrequencyChart';
import BMICard from './BMICard';
import ProgressSummary from './ProgressSummary';

const ProgressDashboard: React.FC = () => {
  const [dashboard, setDashboard] = useState<ProgressDashboardType | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProgressEntry, setShowProgressEntry] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [selectedEntryType, setSelectedEntryType] = useState<'weight' | 'measurements' | 'body-fat' | 'progress-photo' | 'strength' | 'endurance' | 'flexibility'>('weight');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await api.get('/progress/dashboard');
      setDashboard(response.data);
    } catch (error) {
      console.error('Error fetching progress dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProgressEntryCreated = () => {
    fetchDashboard();
    setShowProgressEntry(false);
  };

  const handleGoalCreated = () => {
    fetchDashboard();
    setShowGoalModal(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Failed to load progress data</p>
      </div>
    );
  }

  const { recentEntries, weightTrend, activeGoals, recentAchievements, workoutStats, bmi, measurementTrend, summary } = dashboard;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Progress Dashboard</h1>
          <p className="text-gray-600">Track your fitness journey and achievements</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowGoalModal(true)}
            className="btn-secondary flex items-center"
          >
            <Target className="w-4 h-4 mr-2" />
            Add Goal
          </button>
          <button
            onClick={() => {
              setSelectedEntryType('weight');
              setShowProgressEntry(true);
            }}
            className="btn-primary flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Log Progress
          </button>
        </div>
      </div>

      {/* Progress Summary Cards */}
      <ProgressSummary summary={summary} workoutStats={workoutStats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weight Trend Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Weight Progress</h2>
              <button
                onClick={() => {
                  setSelectedEntryType('weight');
                  setShowProgressEntry(true);
                }}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Add Weight
              </button>
            </div>
            <WeightChart data={weightTrend} />
          </motion.div>

          {/* Measurements Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Body Measurements</h2>
              <button
                onClick={() => {
                  setSelectedEntryType('measurements');
                  setShowProgressEntry(true);
                }}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Add Measurements
              </button>
            </div>
            <MeasurementChart data={measurementTrend} />
          </motion.div>

          {/* Workout Frequency Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Workout Frequency</h2>
              <div className="flex items-center text-sm text-gray-600">
                <Activity className="w-4 h-4 mr-1" />
                Last 30 days
              </div>
            </div>
            <WorkoutFrequencyChart workoutStats={workoutStats} />
          </motion.div>
        </div>

        {/* Right Column - Goals, Achievements, BMI */}
        <div className="space-y-6">
          {/* BMI Card */}
          {bmi && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card"
            >
              <BMICard bmi={bmi} />
            </motion.div>
          )}

          {/* Active Goals */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Active Goals</h2>
              <button
                onClick={() => setShowGoalModal(true)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Add Goal
              </button>
            </div>
            <div className="space-y-3">
              {activeGoals.length > 0 ? (
                activeGoals.map((goal) => (
                  <GoalCard key={goal._id} goal={goal} onUpdate={fetchDashboard} />
                ))
              ) : (
                <div className="text-center py-6">
                  <Target className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No active goals</p>
                  <button
                    onClick={() => setShowGoalModal(true)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2"
                  >
                    Create your first goal
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent Achievements</h2>
              <Trophy className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="space-y-3">
              {recentAchievements.length > 0 ? (
                recentAchievements.map((achievement) => (
                  <AchievementCard key={achievement._id} achievement={achievement} />
                ))
              ) : (
                <div className="text-center py-6">
                  <Award className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No achievements yet</p>
                  <p className="text-sm text-gray-500">Keep working out to earn badges!</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Recent Progress Entries */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Progress Entries</h2>
          <button
            onClick={() => {
              setSelectedEntryType('weight');
              setShowProgressEntry(true);
            }}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View All
          </button>
        </div>
        <div className="space-y-3">
          {recentEntries.length > 0 ? (
            recentEntries.map((entry) => (
              <div key={entry._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 capitalize">{entry.type.replace('-', ' ')}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(entry.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {entry.weight && <p className="font-medium">{entry.weight} kg</p>}
                  {entry.notes && <p className="text-sm text-gray-600 truncate max-w-32">{entry.notes}</p>}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">No progress entries yet</p>
              <button
                onClick={() => {
                  setSelectedEntryType('weight');
                  setShowProgressEntry(true);
                }}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2"
              >
                Log your first entry
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Modals */}
      <ProgressEntryModal
        isOpen={showProgressEntry}
        onClose={() => setShowProgressEntry(false)}
        onEntryCreated={handleProgressEntryCreated}
        entryType={selectedEntryType}
      />

      <GoalModal
        isOpen={showGoalModal}
        onClose={() => setShowGoalModal(false)}
        onGoalCreated={handleGoalCreated}
      />
    </div>
  );
};

export default ProgressDashboard;
