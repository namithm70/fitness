import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Clock, 
  Flame, 
  Trophy,
  Plus,
  Play,
  BookOpen,
  Users
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Total Workouts',
      value: user?.totalWorkouts || 0,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Current Streak',
      value: user?.streakDays || 0,
      icon: <Flame className="w-6 h-6" />,
      color: 'bg-orange-500',
      change: '+3 days',
      changeType: 'positive'
    },
    {
      title: 'Total Time',
      value: `${Math.floor((user?.totalWorkoutTime || 0) / 60)}h`,
      icon: <Clock className="w-6 h-6" />,
      color: 'bg-green-500',
      change: '+45min',
      changeType: 'positive'
    },
    {
      title: 'Goals Completed',
      value: '3/5',
      icon: <Target className="w-6 h-6" />,
      color: 'bg-purple-500',
      change: '60%',
      changeType: 'neutral'
    }
  ];

  const recentWorkouts = [
    {
      id: 1,
      name: 'Upper Body Strength',
      date: '2024-01-15',
      duration: 45,
      calories: 320,
      completed: true
    },
    {
      id: 2,
      name: 'Cardio HIIT',
      date: '2024-01-13',
      duration: 30,
      calories: 280,
      completed: true
    },
    {
      id: 3,
      name: 'Lower Body Power',
      date: '2024-01-11',
      duration: 50,
      calories: 350,
      completed: false
    }
  ];

  const quickActions = [
    {
      title: 'Start Workout',
      description: 'Begin a new training session',
      icon: <Play className="w-8 h-8" />,
      color: 'bg-fitness-500',
      href: '/workouts'
    },
    {
      title: 'Log Nutrition',
      description: 'Track your daily food intake',
      icon: <BookOpen className="w-8 h-8" />,
      color: 'bg-nutrition-500',
      href: '/nutrition'
    },
    {
      title: 'View Progress',
      description: 'Check your fitness journey',
      icon: <TrendingUp className="w-8 h-8" />,
      color: 'bg-blue-500',
      href: '/progress'
    },
    {
      title: 'Join Community',
      description: 'Connect with other fitness enthusiasts',
      icon: <Users className="w-8 h-8" />,
      color: 'bg-purple-500',
      href: '/community'
    }
  ];

  const upcomingWorkouts = [
    {
      id: 1,
      name: 'Full Body Circuit',
      time: 'Today, 6:00 PM',
      duration: 45,
      difficulty: 'Intermediate'
    },
    {
      id: 2,
      name: 'Yoga Flow',
      time: 'Tomorrow, 7:00 AM',
      duration: 30,
      difficulty: 'Beginner'
    },
    {
      id: 3,
      name: 'Strength Training',
      time: 'Wednesday, 5:30 PM',
      duration: 60,
      difficulty: 'Advanced'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Section */}
      <motion.div 
        className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        whileHover={{ scale: 1.02 }}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold mb-3 flex items-center">
              Welcome back, {user?.firstName}! 
              <motion.span 
                className="ml-3 text-3xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              >
                👋
              </motion.span>
            </h1>
          </motion.div>
          <motion.p 
            className="text-xl text-white/90"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Ready to crush your fitness goals today? You're on a{' '}
            <motion.span 
              className="font-bold text-yellow-300 inline-block"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
            >
              {user?.streakDays || 0}-day streak
            </motion.span>!
          </motion.p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ 
              scale: 1.05,
              y: -5,
              transition: { duration: 0.2 }
            }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-2 group-hover:text-gray-800 transition-colors">{stat.title}</p>
                <motion.p 
                  className="text-3xl font-bold text-gray-900 mb-2"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 5 }}
                >
                  {stat.value}
                </motion.p>
                <p className={`text-xs font-medium flex items-center ${
                  stat.changeType === 'positive' ? 'text-green-600' : 
                  stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  <motion.span
                    animate={{ x: [0, 2, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                    className="mr-1"
                  >
                    {stat.changeType === 'positive' ? '↗' : stat.changeType === 'negative' ? '↘' : '→'}
                  </motion.span>
                  {stat.change} from last week
                </p>
              </div>
              <motion.div 
                className={`p-4 rounded-xl ${stat.color} text-white shadow-lg group-hover:shadow-xl transition-all duration-300`}
                whileHover={{ rotate: 5, scale: 1.1 }}
              >
                {stat.icon}
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <motion.span
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
            className="mr-3"
          >
            ⚡
          </motion.span>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.05,
                y: -8,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to={action.href} className="block">
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 text-center group relative overflow-hidden">
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10">
                    <motion.div 
                      className={`inline-flex p-4 rounded-xl ${action.color} text-white mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                      whileHover={{ 
                        scale: 1.15,
                        rotate: 5,
                        transition: { duration: 0.2 }
                      }}
                    >
                      {action.icon}
                    </motion.div>
                    <h3 className="font-bold text-gray-900 mb-3 text-lg group-hover:text-gray-800 transition-colors">{action.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">{action.description}</p>
                  </div>
                  
                  {/* Animated border */}
                  <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-blue-200 transition-all duration-300"></div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <motion.div 
        className="grid grid-cols-1 xl:grid-cols-2 gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {/* Recent Workouts */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
          whileHover={{ y: -5 }}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <motion.span
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
                className="mr-2"
              >
                🏋️
              </motion.span>
              Recent Workouts
            </h2>
            <Link to="/workouts" className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors hover:underline">
              View all →
            </Link>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentWorkouts.map((workout, index) => (
                <motion.div
                  key={workout.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
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
                      className={`w-4 h-4 rounded-full ${
                        workout.completed ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                      animate={workout.completed ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-800 transition-colors">{workout.name}</h3>
                      <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">{workout.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900 group-hover:text-blue-800 transition-colors">{workout.duration}min</p>
                    <p className="text-xs text-gray-600 group-hover:text-gray-700 transition-colors">{workout.calories} cal</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link to="/workouts" className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl">
                  <Plus className="w-4 h-4 mr-2" />
                  Start New Workout
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Upcoming Workouts */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
          whileHover={{ y: -5 }}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-purple-50">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                className="mr-2"
              >
                📅
              </motion.span>
              Upcoming Workouts
            </h2>
            <Link to="/workouts" className="text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors hover:underline">
              Schedule →
            </Link>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingWorkouts.map((workout, index) => (
                <motion.div
                  key={workout.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.02,
                    x: -5,
                    transition: { duration: 0.2 }
                  }}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-purple-50 hover:to-purple-100 transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-center space-x-4">
                    <motion.div 
                      className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center group-hover:from-purple-200 group-hover:to-purple-300 transition-all duration-300"
                      whileHover={{ rotate: 5, scale: 1.1 }}
                    >
                      <Calendar className="w-6 h-6 text-purple-600" />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-purple-800 transition-colors">{workout.name}</h3>
                      <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">{workout.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900 mb-1 group-hover:text-purple-800 transition-colors">{workout.duration}min</p>
                    <motion.span 
                      className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                        workout.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                        workout.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {workout.difficulty}
                    </motion.span>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link to="/workouts" className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Workout
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Motivation Section */}
      <motion.div 
        className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        whileHover={{ scale: 1.02 }}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 -translate-x-16"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 translate-x-12"></div>
        
        <motion.div
          className="text-center relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Trophy className="w-16 h-16 mx-auto mb-6 drop-shadow-lg" />
          </motion.div>
          <h3 className="text-3xl font-bold mb-4">You're doing great! 🎉</h3>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Consistency is the key to success. Keep pushing forward and you'll reach your goals!
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/progress" className="inline-flex items-center bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl">
              View Progress
              <motion.span
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
              >
                <TrendingUp className="w-5 h-5 ml-2" />
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
