import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, TrendingUp, Plus,
  Activity, Award, Trophy, BarChart3
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
      const response = await api.get('/api/progress/dashboard');
      setDashboard(response.data);
    } catch (error) {
      console.error('Error fetching progress dashboard:', error);
      // Set default data for development/demo purposes
      setDashboard({
        recentEntries: [],
        weightTrend: [],
        activeGoals: [],
        recentAchievements: [],
        workoutStats: { totalWorkouts: 0, totalDuration: 0, avgDuration: 0 },
        bmi: undefined,
        measurementTrend: [],
        summary: {
          totalEntries: 0,
          totalGoals: 0,
          completedGoals: 0,
          totalAchievements: 0
        }
      });
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="text-center py-12">
        <p className="text-white/70">Failed to load progress data</p>
      </div>
    );
  }

  const { recentEntries, weightTrend, activeGoals, recentAchievements, workoutStats, bmi, measurementTrend, summary } = dashboard;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Progress Dashboard</h1>
          <p className="text-white/80 text-sm sm:text-base">Track your fitness journey and achievements</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <button
            onClick={() => setShowGoalModal(true)}
            className="bg-white/20 text-white hover:bg-white/30 flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 w-full sm:w-auto"
          >
            <Target className="w-4 h-4 mr-2" />
            Add Goal
          </button>
          <button
            onClick={() => {
              setSelectedEntryType('weight');
              setShowProgressEntry(true);
            }}
            className="bg-white text-purple-600 hover:bg-white/90 flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Log Progress
          </button>
        </div>
      </div>

      {/* Progress Summary Cards */}
      <ProgressSummary summary={summary} workoutStats={workoutStats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          {/* Weight Trend Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 sm:p-6 shadow-lg"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
              <h2 className="text-lg sm:text-xl font-semibold text-white text-center sm:text-left">Weight Progress</h2>
              <button
                onClick={() => {
                  setSelectedEntryType('weight');
                  setShowProgressEntry(true);
                }}
                className="text-white/80 hover:text-white text-sm font-medium bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-all duration-200 w-full sm:w-auto"
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
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 sm:p-6 shadow-lg"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
              <h2 className="text-lg sm:text-xl font-semibold text-white text-center sm:text-left">Body Measurements</h2>
              <button
                onClick={() => {
                  setSelectedEntryType('measurements');
                  setShowProgressEntry(true);
                }}
                className="text-white/80 hover:text-white text-sm font-medium bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-all duration-200 w-full sm:w-auto"
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
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 sm:p-6 shadow-lg"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
              <h2 className="text-lg sm:text-xl font-semibold text-white text-center sm:text-left">Workout Frequency</h2>
              <div className="flex items-center justify-center sm:justify-end text-sm text-white/70">
                <Activity className="w-4 h-4 mr-1" />
                Last 30 days
              </div>
            </div>
            <WorkoutFrequencyChart workoutStats={workoutStats} />
          </motion.div>
        </div>

        {/* Right Column - Goals, Achievements, BMI */}
        <div className="space-y-6 sm:space-y-8">
          {/* BMI Card */}
          {bmi && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 sm:p-6 shadow-lg"
            >
              <BMICard bmi={bmi} />
            </motion.div>
          )}

          {/* Active Goals */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 sm:p-6 shadow-lg"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
              <h2 className="text-lg sm:text-xl font-semibold text-white text-center sm:text-left">Active Goals</h2>
              <button
                onClick={() => setShowGoalModal(true)}
                className="text-white/80 hover:text-white text-sm font-medium bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-all duration-200 w-full sm:w-auto"
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
                  <Target className="w-12 h-12 text-white/40 mx-auto mb-2" />
                  <p className="text-white/70">No active goals</p>
                  <button
                    onClick={() => setShowGoalModal(true)}
                    className="text-white/80 hover:text-white text-sm font-medium mt-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-all duration-200"
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
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 sm:p-6 shadow-lg"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
              <h2 className="text-lg sm:text-xl font-semibold text-white text-center sm:text-left">Recent Achievements</h2>
              <div className="flex justify-center sm:justify-end">
                <Trophy className="w-5 h-5 text-yellow-400" />
              </div>
            </div>
            <div className="space-y-3">
              {recentAchievements.length > 0 ? (
                recentAchievements.map((achievement) => (
                  <AchievementCard key={achievement._id} achievement={achievement} />
                ))
              ) : (
                <div className="text-center py-6">
                  <Award className="w-12 h-12 text-white/40 mx-auto mb-2" />
                  <p className="text-white/70">No achievements yet</p>
                  <p className="text-sm text-white/60">Keep working out to earn badges!</p>
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
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 sm:p-6 shadow-lg"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
          <h2 className="text-lg sm:text-xl font-semibold text-white text-center sm:text-left">Recent Progress Entries</h2>
          <button
            onClick={() => {
              setSelectedEntryType('weight');
              setShowProgressEntry(true);
            }}
            className="text-white/80 hover:text-white text-sm font-medium bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-all duration-200 w-full sm:w-auto"
          >
            View All
          </button>
        </div>
        <div className="space-y-3">
          {recentEntries.length > 0 ? (
            recentEntries.map((entry) => (
              <div key={entry._id} className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-white capitalize">{entry.type.replace('-', ' ')}</p>
                    <p className="text-sm text-white/70">
                      {new Date(entry.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {entry.weight && <p className="font-medium text-white">{entry.weight} kg</p>}
                  {entry.notes && <p className="text-sm text-white/70 truncate max-w-32">{entry.notes}</p>}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <BarChart3 className="w-12 h-12 text-white/40 mx-auto mb-2" />
              <p className="text-white/70">No progress entries yet</p>
              <button
                onClick={() => {
                  setSelectedEntryType('weight');
                  setShowProgressEntry(true);
                }}
                className="text-white/80 hover:text-white text-sm font-medium mt-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-all duration-200"
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
