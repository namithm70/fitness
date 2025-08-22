import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Activity,
  Dumbbell,
  Apple,
  Target,
  BarChart3
} from 'lucide-react';
import { Activity as ActivityType, DailyHistory } from '../../types/activity';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../config/api';

const HistorySection: React.FC = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<DailyHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  // Generate date tabs for the last 7 days
  const generateDateTabs = () => {
    const tabs = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      const dateStr = date.toISOString().split('T')[0];
      const dayName = i === 0 ? 'Today' : 
                     i === 1 ? 'Yesterday' : 
                     date.toLocaleDateString('en-US', { weekday: 'short' });
      
      tabs.push({
        date: dateStr,
        label: dayName,
        day: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' })
      });
    }
    
    return tabs;
  };

  const dateTabs = generateDateTabs();

  const generateMockHistory = useCallback((): DailyHistory[] => {
    const mockHistory: DailyHistory[] = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const activities: ActivityType[] = [];
      let totalWorkouts = 0;
      let totalDuration = 0;
      let totalCalories = 0;
      
      // Generate random activities for each day
      const numActivities = Math.floor(Math.random() * 5) + 1;
      
      for (let j = 0; j < numActivities; j++) {
        const activityTypes: ActivityType['type'][] = ['workout', 'exercise', 'nutrition', 'progress'];
        const type = activityTypes[Math.floor(Math.random() * activityTypes.length)];
        
        const activity: ActivityType = {
          id: `activity-${i}-${j}`,
          userId: user?.id || '',
          type,
          action: getActionForType(type),
          details: getDetailsForType(type),
          timestamp: new Date(date.getTime() + j * 3600000).toISOString(),
          completed: Math.random() > 0.2
        };
        
        activities.push(activity);
        
        if (type === 'workout') {
          totalWorkouts++;
          totalDuration += activity.details.duration || 0;
          totalCalories += activity.details.workoutCalories || 0;
        }
      }
      
      mockHistory.push({
        date: dateStr,
        activities,
        totalWorkouts,
        totalDuration,
        totalCalories
      });
    }
    
    return mockHistory;
  }, [user?.id]);

  const getActionForType = (type: ActivityType['type']): string => {
    switch (type) {
      case 'workout': return 'Completed workout';
      case 'exercise': return 'Completed exercise';
      case 'nutrition': return 'Logged meal';
      case 'progress': return 'Updated progress';
      case 'goal': return 'Achieved goal';
      default: return 'Activity';
    }
  };

  const getDetailsForType = (type: ActivityType['type']) => {
    switch (type) {
      case 'workout':
        return {
          workoutName: ['Upper Body Strength', 'Cardio HIIT', 'Lower Body Power', 'Full Body Circuit'][Math.floor(Math.random() * 4)],
          duration: Math.floor(Math.random() * 60) + 20,
          workoutCalories: Math.floor(Math.random() * 400) + 200
        };
      case 'exercise':
        return {
          exerciseName: ['Push-ups', 'Squats', 'Pull-ups', 'Planks', 'Burpees'][Math.floor(Math.random() * 4)],
          sets: Math.floor(Math.random() * 4) + 2,
          reps: Math.floor(Math.random() * 15) + 5,
          weight: Math.floor(Math.random() * 100) + 20
        };
      case 'nutrition':
        return {
          mealType: ['Breakfast', 'Lunch', 'Dinner', 'Snack'][Math.floor(Math.random() * 4)],
          foodName: ['Chicken Breast', 'Salmon', 'Oatmeal', 'Greek Yogurt'][Math.floor(Math.random() * 4)],
          nutritionCalories: Math.floor(Math.random() * 500) + 100
        };
      case 'progress':
        return {
          measurementType: ['Weight', 'Body Fat', 'Muscle Mass'][Math.floor(Math.random() * 3)],
          value: Math.floor(Math.random() * 20) + 70
        };
      default:
        return {};
    }
  };

  const getIconForActivity = (type: ActivityType['type']) => {
    switch (type) {
      case 'workout': return <Dumbbell className="w-4 h-4" />;
      case 'exercise': return <Activity className="w-4 h-4" />;
      case 'nutrition': return <Apple className="w-4 h-4" />;
      case 'progress': return <BarChart3 className="w-4 h-4" />;
      case 'goal': return <Target className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };



  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const token = (typeof window !== 'undefined') ? localStorage.getItem('token') : null;
        if (token && token.startsWith('demo-token-')) {
          // Demo mode: use mock data instead of hitting backend (avoids CORS)
          setHistory(generateMockHistory());
          return;
        }

        const response = await api.get(`/api/activities/user/${user?.id}/history`);
        setHistory(response.data);
      } catch (error) {
        console.error('Error fetching history:', error);
        // For demo purposes, create mock data
        setHistory(generateMockHistory());
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchHistory();
    } else {
      // If no user, just set mock data
      setHistory(generateMockHistory());
      setLoading(false);
    }
  }, [user?.id, generateMockHistory]);

  const currentDayHistory = history.find(h => h.date === dateTabs[activeTab].date) || {
    date: dateTabs[activeTab].date,
    activities: [],
    totalWorkouts: 0,
    totalDuration: 0,
    totalCalories: 0
  };

  if (loading) {
    return (
      <motion.div 
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-lg hover:bg-white/15 hover:shadow-xl transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/20 bg-white/5">
        <h2 className="text-xl font-bold text-white flex items-center">
          <motion.span
            animate={{ rotate: [0, 10, 0] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
            className="mr-2"
          >
            📊
          </motion.span>
          Activity History
        </h2>
        <div className="flex items-center space-x-2 text-sm text-white/70">
          <Clock className="w-4 h-4" />
          <span>Last 7 days</span>
        </div>
      </div>

      {/* Date Tabs */}
      <div className="p-4 border-b border-white/20">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {dateTabs.map((tab, index) => (
            <motion.button
              key={tab.date}
              onClick={() => setActiveTab(index)}
              className={`flex flex-col items-center px-4 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                activeTab === index
                  ? 'bg-white text-purple-600 shadow-lg'
                  : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-xs opacity-80">{tab.month}</span>
              <span className="text-lg font-bold">{tab.day}</span>
              <span className="text-xs opacity-80">{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Daily Summary */}
      <div className="p-6 border-b border-white/20 bg-white/5">
        <div className="grid grid-cols-3 gap-4">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="text-2xl font-bold text-white">{currentDayHistory.totalWorkouts}</div>
            <div className="text-sm text-white/70">Workouts</div>
          </motion.div>
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="text-2xl font-bold text-white">{currentDayHistory.totalDuration}min</div>
            <div className="text-sm text-white/70">Duration</div>
          </motion.div>
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="text-2xl font-bold text-white">{currentDayHistory.totalCalories}</div>
            <div className="text-sm text-white/70">Calories</div>
          </motion.div>
        </div>
      </div>

      {/* Activities List */}
      <div className="p-6">
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {currentDayHistory.activities.length === 0 ? (
                                            <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8 text-white/60"
              >
                <Calendar className="w-12 h-12 mx-auto mb-4 text-white/40" />
                <p className="text-lg font-medium text-white">No activities for this day</p>
                <p className="text-sm text-white/70">Start your fitness journey today!</p>
              </motion.div>
            ) : (
              currentDayHistory.activities.slice(0, 5).map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.02,
                    x: 5,
                    transition: { duration: 0.2 }
                  }}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-center space-x-4">
                    <motion.div 
                      className="p-2 rounded-lg bg-white/20 text-white"
                      whileHover={{ rotate: 5, scale: 1.1 }}
                    >
                      {getIconForActivity(activity.type)}
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white group-hover:text-white/90 transition-colors">
                        {activity.action}
                      </h3>
                      <p className="text-sm text-white/70 group-hover:text-white/80 transition-colors">
                        {activity.details.workoutName || 
                         activity.details.exerciseName || 
                         activity.details.foodName || 
                         activity.details.measurementType || 
                         'Activity'}
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-white/60">
                          {formatTime(activity.timestamp)}
                        </span>
                        {activity.details.duration && (
                          <span className="text-xs text-white/80">
                            {activity.details.duration}min
                          </span>
                        )}
                        {(activity.details.workoutCalories || activity.details.nutritionCalories) && (
                          <span className="text-xs text-white/80">
                            {activity.details.workoutCalories || activity.details.nutritionCalories} cal
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {activity.completed ? (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                      >
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      </motion.div>
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
          
          {/* Show more activities button if there are more than 5 */}
          {currentDayHistory.activities.length > 5 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="text-center pt-4"
            >
                                              <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-white/20 rounded-lg hover:bg-white/30 transition-colors duration-200">
                <Activity className="w-4 h-4 mr-2" />
                View All Activities ({currentDayHistory.activities.length})
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default HistorySection;
