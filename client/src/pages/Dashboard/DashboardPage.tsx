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
      <div className="bg-gradient-to-r from-fitness-500 to-fitness-600 rounded-2xl p-8 text-white shadow-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-3">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-xl text-fitness-100">
            Ready to crush your fitness goals today? You're on a <span className="font-semibold">{user?.streakDays || 0}-day streak</span>!
          </p>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className={`text-xs font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 
                  stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {stat.change} from last week
                </p>
              </div>
              <div className={`p-4 rounded-xl ${stat.color} text-white shadow-md`}>
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link to={action.href} className="block">
                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200 text-center group">
                  <div className={`inline-flex p-4 rounded-xl ${action.color} text-white mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                    {action.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-lg">{action.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{action.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Recent Workouts */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Recent Workouts</h2>
            <Link to="/workouts" className="text-fitness-600 hover:text-fitness-700 text-sm font-medium transition-colors">
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
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-4 h-4 rounded-full ${
                      workout.completed ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                    <div>
                      <h3 className="font-medium text-gray-900">{workout.name}</h3>
                      <p className="text-sm text-gray-600">{workout.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{workout.duration}min</p>
                    <p className="text-xs text-gray-600">{workout.calories} cal</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100">
              <Link to="/workouts" className="w-full bg-fitness-500 hover:bg-fitness-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Start New Workout
              </Link>
            </div>
          </div>
        </div>

        {/* Upcoming Workouts */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Upcoming Workouts</h2>
            <Link to="/workouts" className="text-fitness-600 hover:text-fitness-700 text-sm font-medium transition-colors">
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
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-fitness-100 rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-fitness-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{workout.name}</h3>
                      <p className="text-sm text-gray-600">{workout.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 mb-1">{workout.duration}min</p>
                    <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                      workout.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                      workout.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {workout.difficulty}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100">
              <Link to="/workouts" className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Workout
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Motivation Section */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-white shadow-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <Trophy className="w-16 h-16 mx-auto mb-6" />
          <h3 className="text-2xl font-bold mb-3">You're doing great!</h3>
          <p className="text-lg text-purple-100 mb-6 max-w-2xl mx-auto leading-relaxed">
            Consistency is the key to success. Keep pushing forward and you'll reach your goals!
          </p>
          <Link to="/progress" className="inline-flex items-center bg-white text-purple-600 px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors shadow-md">
            View Progress
            <TrendingUp className="w-5 h-5 ml-2" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
