import React, { useState, useEffect } from 'react';
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
      case 'workout': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
      case 'exercise': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'nutrition': return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30';
      case 'progress': return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30';
      case 'goal': return 'text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-900/30';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700';
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

    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
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
    <div className="card-elevated hover:elevation-3 motion-standard">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-outline-variant surface-container-high">
        <h2 className="title-large text-surface-on-surface flex items-center">
          <motion.span
            animate={{ rotate: [0, 10, 0] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
            className="mr-3"
          >
            📊
          </motion.span>
          Activity History
        </h2>
        <div className="flex items-center space-x-2 body-small text-surface-on-surface-variant">
          <Clock className="w-4 h-4" />
          <span>Last 7 days</span>
        </div>
      </div>

      {/* Date Tabs */}
      <div className="p-4 border-b border-outline-variant">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {dateTabs.map((tab, index) => (
            <motion.button
              key={tab.date}
              onClick={() => setActiveTab(index)}
              className={`flex flex-col items-center px-4 py-3 rounded-2xl font-medium motion-standard whitespace-nowrap ${
                activeTab === index
                  ? 'bg-primary text-white elevation-1'
                  : 'surface-container text-surface-on-surface hover:elevation-1'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="label-small opacity-80">{tab.month}</span>
              <span className="title-medium">{tab.day}</span>
              <span className="label-small opacity-80">{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Daily Summary */}
      <div className="p-6 border-b border-outline-variant surface-container-high">
        <div className="grid grid-cols-3 gap-4">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="headline-medium text-primary">{currentDayHistory.totalWorkouts}</div>
            <div className="body-small text-surface-on-surface-variant">Workouts</div>
          </motion.div>
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="headline-medium text-primary">{currentDayHistory.totalDuration}min</div>
            <div className="body-small text-surface-on-surface-variant">Duration</div>
          </motion.div>
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="headline-medium text-primary">{currentDayHistory.totalCalories}</div>
            <div className="body-small text-surface-on-surface-variant">Calories</div>
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
                  className="text-center py-8 text-surface-on-surface-variant"
                >
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-outline-variant" />
                  <p className="title-medium text-surface-on-surface">No activities for this day</p>
                  <p className="body-small text-surface-on-surface-variant">Start your fitness journey today!</p>
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
                  className="flex items-center justify-between p-4 surface-container-high rounded-2xl hover:elevation-1 motion-standard cursor-pointer group"
                >
                  <div className="flex items-center space-x-4">
                    <motion.div 
                      className={`p-2 rounded-lg ${getColorForActivity(activity.type)}`}
                      whileHover={{ rotate: 5, scale: 1.1 }}
                    >
                      {getIconForActivity(activity.type)}
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="title-small text-surface-on-surface group-hover:text-primary motion-standard">
                        {activity.action}
                      </h3>
                      <p className="body-small text-surface-on-surface-variant group-hover:text-surface-on-surface motion-standard">
                        {activity.details.workoutName || 
                         activity.details.exerciseName || 
                         activity.details.foodName || 
                         activity.details.measurementType || 
                         'Activity'}
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="label-small text-surface-on-surface-variant">
                          {formatTime(activity.timestamp)}
                        </span>
                        {activity.details.duration && (
                          <span className="label-small text-primary">
                            {activity.details.duration}min
                          </span>
                        )}
                        {(activity.details.workoutCalories || activity.details.nutritionCalories) && (
                          <span className="label-small text-primary">
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
          
          {/* Show more activities button if there are more than 5 */}
          {currentDayHistory.activities.length > 5 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="text-center pt-4"
            >
                                <button className="btn-text">
                    <Activity className="w-4 h-4 mr-2" />
                    View All Activities ({currentDayHistory.activities.length})
                  </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistorySection;
