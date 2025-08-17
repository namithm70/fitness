import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Flame, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
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
  const [selectedDate, setSelectedDate] = useState<string>('today');
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

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
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

  const generateMockHistory = (): DailyHistory[] => {
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
  };

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

  const getColorForActivity = (type: ActivityType['type']) => {
    switch (type) {
      case 'workout': return 'text-blue-600 bg-blue-100';
      case 'exercise': return 'text-green-600 bg-green-100';
      case 'nutrition': return 'text-orange-600 bg-orange-100';
      case 'progress': return 'text-purple-600 bg-purple-100';
      case 'goal': return 'text-pink-600 bg-pink-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

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
        className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <motion.span
            animate={{ rotate: [0, 10, 0] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
            className="mr-2"
          >
            📊
          </motion.span>
          Activity History
        </h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>Last 7 days</span>
        </div>
      </div>

      {/* Date Tabs */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {dateTabs.map((tab, index) => (
            <motion.button
              key={tab.date}
              onClick={() => setActiveTab(index)}
              className={`flex flex-col items-center px-4 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                activeTab === index
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="grid grid-cols-3 gap-4">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="text-2xl font-bold text-blue-600">{currentDayHistory.totalWorkouts}</div>
            <div className="text-sm text-gray-600">Workouts</div>
          </motion.div>
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="text-2xl font-bold text-green-600">{currentDayHistory.totalDuration}min</div>
            <div className="text-sm text-gray-600">Duration</div>
          </motion.div>
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="text-2xl font-bold text-orange-600">{currentDayHistory.totalCalories}</div>
            <div className="text-sm text-gray-600">Calories</div>
          </motion.div>
        </div>
      </div>

      {/* Activities List */}
      <div className="p-6">
        <div className="space-y-4 max-h-96 overflow-y-auto">
          <AnimatePresence mode="wait">
            {currentDayHistory.activities.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8 text-gray-500"
              >
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No activities for this day</p>
                <p className="text-sm">Start your fitness journey today!</p>
              </motion.div>
            ) : (
              currentDayHistory.activities.map((activity, index) => (
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
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-blue-50 hover:to-blue-100 transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-center space-x-4">
                    <motion.div 
                      className={`p-2 rounded-lg ${getColorForActivity(activity.type)}`}
                      whileHover={{ rotate: 5, scale: 1.1 }}
                    >
                      {getIconForActivity(activity.type)}
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-800 transition-colors">
                        {activity.action}
                      </h3>
                      <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                        {activity.details.workoutName || 
                         activity.details.exerciseName || 
                         activity.details.foodName || 
                         activity.details.measurementType || 
                         'Activity'}
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-500">
                          {formatTime(activity.timestamp)}
                        </span>
                        {activity.details.duration && (
                          <span className="text-xs text-blue-600">
                            {activity.details.duration}min
                          </span>
                        )}
                        {(activity.details.workoutCalories || activity.details.nutritionCalories) && (
                          <span className="text-xs text-orange-600">
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
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </motion.div>
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default HistorySection;
