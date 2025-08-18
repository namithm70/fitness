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
import HistorySection from '../../components/Progress/HistorySection';

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
    },
    {
      id: 4,
      name: 'Core Training',
      date: '2024-01-09',
      duration: 25,
      calories: 180,
      completed: true
    },
    {
      id: 5,
      name: 'Full Body Circuit',
      date: '2024-01-07',
      duration: 55,
      calories: 420,
      completed: true
    },
    {
      id: 6,
      name: 'Yoga Flow',
      date: '2024-01-05',
      duration: 40,
      calories: 150,
      completed: true
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
    },
    {
      id: 4,
      name: 'Cardio Blast',
      time: 'Thursday, 6:30 AM',
      duration: 40,
      difficulty: 'Intermediate'
    },
    {
      id: 5,
      name: 'Core Power',
      time: 'Friday, 5:00 PM',
      duration: 35,
      difficulty: 'Beginner'
    },
    {
      id: 6,
      name: 'HIIT Training',
      time: 'Saturday, 8:00 AM',
      duration: 50,
      difficulty: 'Advanced'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Section */}
      <motion.div 
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        whileHover={{ scale: 1.02 }}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-white/5 animate-pulse"></div>
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
            className="text-xl text-white/80"
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
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-lg hover:bg-white/15 hover:shadow-2xl transition-all duration-300 group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-white/70 mb-2 group-hover:text-white/90 transition-colors">{stat.title}</p>
                <motion.p 
                  className="text-3xl font-bold text-white mb-2"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 5 }}
                >
                  {stat.value}
                </motion.p>
                <p className={`text-xs font-medium flex items-center ${
                  stat.changeType === 'positive' ? 'text-green-300' : 
                  stat.changeType === 'negative' ? 'text-red-300' : 'text-white/60'
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
                className="p-4 rounded-xl bg-white/20 text-white shadow-lg group-hover:bg-white/30 group-hover:shadow-xl transition-all duration-300"
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
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <motion.span
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
            className="mr-3"
          >
            ⚡
          </motion.span>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
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
              className="h-full"
            >
              <Link to={action.href} className="block h-full">
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-lg hover:bg-white/15 hover:shadow-2xl transition-all duration-300 text-center group relative overflow-hidden h-full flex flex-col justify-between">
                  {/* Glass overlay on hover */}
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10 flex flex-col items-center h-full gap-3">
                    <motion.div 
                      className="inline-flex p-4 rounded-xl bg-white/20 text-white mb-4 shadow-lg group-hover:bg-white/30 group-hover:shadow-xl transition-all duration-300"
                      whileHover={{ 
                        scale: 1.15,
                        rotate: 5,
                        transition: { duration: 0.2 }
                      }}
                    >
                      {action.icon}
                    </motion.div>
                    <h3 className="font-bold text-white mb-3 text-lg group-hover:text-white/90 transition-colors">{action.title}</h3>
                    <p className="text-sm text-white/70 leading-relaxed group-hover:text-white/80 transition-colors">{action.description}</p>
                  </div>
                  
                  {/* Animated border */}
                  <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-white/30 transition-all duration-300"></div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <motion.div 
        className="grid grid-cols-1 xl:grid-cols-3 gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {/* Recent Workouts */}
        <motion.div 
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-lg hover:bg-white/15 hover:shadow-xl transition-all duration-300"
          whileHover={{ y: -5 }}
        >
          <div className="flex items-center justify-between p-6 border-b border-white/20 bg-white/5">
            <h2 className="text-xl font-bold text-white flex items-center">
              <motion.span
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
                className="mr-2"
              >
                🏋️
              </motion.span>
              Recent Workouts
            </h2>
            <Link to="/workouts" className="text-white/80 hover:text-white text-sm font-medium transition-colors hover:underline">
              View all →
            </Link>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentWorkouts.slice(0, 5).map((workout, index) => (
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
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-center space-x-4">
                    <motion.div 
                      className={`w-4 h-4 rounded-full ${
                        workout.completed ? 'bg-green-400' : 'bg-white/40'
                      }`}
                      animate={workout.completed ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                    />
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-white/90 transition-colors">{workout.name}</h3>
                      <p className="text-sm text-white/70 group-hover:text-white/80 transition-colors">{workout.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white group-hover:text-white/90 transition-colors">{workout.duration}min</p>
                    <p className="text-xs text-white/70 group-hover:text-white/80 transition-colors">{workout.calories} cal</p>
                  </div>
                </motion.div>
              ))}
              
              {/* Show more workouts button if there are more than 5 */}
              {recentWorkouts.length > 5 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="text-center pt-2"
                >
                  <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-white/20 rounded-lg hover:bg-white/30 transition-colors duration-200">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View All Workouts ({recentWorkouts.length})
                  </button>
                </motion.div>
              )}
            </div>
            <div className="mt-6 pt-4 border-t border-white/20">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link to="/workouts" className="w-full bg-white text-purple-600 hover:bg-white/90 font-bold py-3 px-4 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl">
                  <Plus className="w-4 h-4 mr-2" />
                  Start New Workout
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Upcoming Workouts */}
        <motion.div 
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-lg hover:bg-white/15 hover:shadow-xl transition-all duration-300"
          whileHover={{ y: -5 }}
        >
          <div className="flex items-center justify-between p-6 border-b border-white/20 bg-white/5">
            <h2 className="text-xl font-bold text-white flex items-center">
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                className="mr-2"
              >
                📅
              </motion.span>
              Upcoming Workouts
            </h2>
            <Link to="/workouts" className="text-white/80 hover:text-white text-sm font-medium transition-colors hover:underline">
              Schedule →
            </Link>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingWorkouts.slice(0, 5).map((workout, index) => (
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
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-center space-x-4">
                    <motion.div 
                      className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-all duration-300"
                      whileHover={{ rotate: 5, scale: 1.1 }}
                    >
                      <Calendar className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-white/90 transition-colors">{workout.name}</h3>
                      <p className="text-sm text-white/70 group-hover:text-white/80 transition-colors">{workout.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white mb-1 group-hover:text-white/90 transition-colors">{workout.duration}min</p>
                    <motion.span 
                      className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                        workout.difficulty === 'Beginner' ? 'bg-green-400/20 text-green-300' :
                        workout.difficulty === 'Intermediate' ? 'bg-yellow-400/20 text-yellow-300' :
                        'bg-red-400/20 text-red-300'
                      }`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {workout.difficulty}
                    </motion.span>
                  </div>
                </motion.div>
              ))}
              
              {/* Show more workouts button if there are more than 5 */}
              {upcomingWorkouts.length > 5 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="text-center pt-2"
                >
                  <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-white/20 rounded-lg hover:bg-white/30 transition-colors duration-200">
                    <Calendar className="w-4 h-4 mr-2" />
                    View All Workouts ({upcomingWorkouts.length})
                  </button>
                </motion.div>
              )}
            </div>
            <div className="mt-6 pt-4 border-t border-white/20">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link to="/workouts" className="w-full bg-white text-purple-600 hover:bg-white/90 font-bold py-3 px-4 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Workout
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Activity History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <HistorySection />
        </motion.div>
      </motion.div>

      {/* Motivation Section */}
      <motion.div 
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        whileHover={{ scale: 1.02 }}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-white/5 animate-pulse"></div>
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
            <Trophy className="w-16 h-16 mx-auto mb-6 drop-shadow-lg text-white" />
          </motion.div>
          <h3 className="text-3xl font-bold mb-4">You're doing great! 🎉</h3>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            Consistency is the key to success. Keep pushing forward and you'll reach your goals!
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/progress" className="inline-flex items-center bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl">
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
    </div>
  );
};

export default DashboardPage;