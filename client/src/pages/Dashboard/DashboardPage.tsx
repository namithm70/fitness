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
  Users,
  ArrowUpRight,
  MoreHoriz
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
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Current Streak',
      value: user?.streakDays || 0,
      icon: <Flame className="w-6 h-6" />,
      change: '+3 days',
      changeType: 'positive'
    },
    {
      title: 'Total Time',
      value: `${Math.floor((user?.totalWorkoutTime || 0) / 60)}h`,
      icon: <Clock className="w-6 h-6" />,
      change: '+45min',
      changeType: 'positive'
    },
    {
      title: 'Goals Completed',
      value: '3/5',
      icon: <Target className="w-6 h-6" />,
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
      href: '/workouts'
    },
    {
      title: 'Log Nutrition',
      description: 'Track your daily food intake',
      icon: <BookOpen className="w-8 h-8" />,
      href: '/nutrition'
    },
    {
      title: 'View Progress',
      description: 'Check your fitness journey',
      icon: <TrendingUp className="w-8 h-8" />,
      href: '/progress'
    },
    {
      title: 'Join Community',
      description: 'Connect with other fitness enthusiasts',
      icon: <Users className="w-8 h-8" />,
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
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Material 3 Hero Section */}
      <motion.div 
        className="card-elevated p-8 bg-primary text-white relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h1 className="display-small mb-4">
              Welcome back, {user?.firstName}! 👋
            </h1>
          </motion.div>
          <motion.p 
            className="headline-small text-white text-opacity-90 mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            Ready to crush your fitness goals today? You're on a{' '}
            <span className="font-bold text-yellow-300">
              {user?.streakDays || 0}-day streak
            </span>!
          </motion.p>
        </div>
      </motion.div>

      {/* Material 3 Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="card-elevated p-6 hover:elevation-3 motion-standard cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-surface-container rounded-2xl">
                {stat.icon}
              </div>
              <button className="p-2 rounded-xl hover:bg-state-layers-hover motion-standard">
                <MoreHoriz className="w-5 h-5 text-surface-on-surface-variant" />
              </button>
            </div>
            
            <div className="space-y-2">
              <p className="body-medium text-surface-on-surface-variant">{stat.title}</p>
              <p className="display-small text-surface-on-surface font-normal">{stat.value}</p>
              <div className="flex items-center space-x-1">
                <ArrowUpRight className={`w-4 h-4 ${
                  stat.changeType === 'positive' ? 'text-green-600' : 
                  stat.changeType === 'negative' ? 'text-red-600' : 'text-surface-on-surface-variant'
                }`} />
                <span className={`body-small ${
                  stat.changeType === 'positive' ? 'text-green-600' : 
                  stat.changeType === 'negative' ? 'text-red-600' : 'text-surface-on-surface-variant'
                }`}>
                  {stat.change} from last week
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Material 3 Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <h2 className="headline-medium text-surface-on-surface mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="motion-standard"
            >
              <Link to={action.href} className="block h-full">
                <div className="card-outlined p-6 h-full flex flex-col items-center text-center space-y-4 hover:elevation-2 motion-standard">
                  <div className="p-4 bg-surface-container rounded-2xl">
                    {action.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="title-medium text-surface-on-surface">{action.title}</h3>
                    <p className="body-small text-surface-on-surface-variant">{action.description}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Material 3 Main Content Grid */}
      <motion.div 
        className="grid grid-cols-1 xl:grid-cols-3 gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        
        {/* Recent Workouts */}
        <div className="card-elevated">
          <div className="flex items-center justify-between p-6 border-b border-outline-variant">
            <h2 className="title-large text-surface-on-surface">Recent Workouts</h2>
            <Link to="/workouts" className="btn-text">
              View all
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {recentWorkouts.slice(0, 5).map((workout, index) => (
                <motion.div
                  key={workout.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 surface-container-high rounded-2xl hover:elevation-1 motion-standard cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      workout.completed ? 'bg-green-600' : 'bg-outline-variant'
                    }`} />
                    <div>
                      <h3 className="title-small text-surface-on-surface">{workout.name}</h3>
                      <p className="body-small text-surface-on-surface-variant">{workout.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="body-medium font-medium text-surface-on-surface">{workout.duration}min</p>
                    <p className="body-small text-surface-on-surface-variant">{workout.calories} cal</p>
                  </div>
                </motion.div>
              ))}
              
              {recentWorkouts.length > 5 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="text-center pt-2"
                >
                  <button className="btn-text">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View All Workouts ({recentWorkouts.length})
                  </button>
                </motion.div>
              )}
            </div>
            
            <div className="mt-6 pt-4 border-t border-outline-variant">
              <Link to="/workouts" className="btn-filled w-full flex items-center justify-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Start New Workout</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Upcoming Workouts */}
        <div className="card-elevated">
          <div className="flex items-center justify-between p-6 border-b border-outline-variant">
            <h2 className="title-large text-surface-on-surface">Upcoming Workouts</h2>
            <Link to="/workouts" className="btn-text">
              Schedule
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {upcomingWorkouts.slice(0, 5).map((workout, index) => (
                <motion.div
                  key={workout.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 surface-container-high rounded-2xl hover:elevation-1 motion-standard cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 surface-container rounded-2xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-surface-on-surface" />
                    </div>
                    <div>
                      <h3 className="title-small text-surface-on-surface">{workout.name}</h3>
                      <p className="body-small text-surface-on-surface-variant">{workout.time}</p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="body-medium font-medium text-surface-on-surface">{workout.duration}min</p>
                    <span className={`inline-flex px-3 py-1 rounded-full body-small font-medium ${
                      workout.difficulty === 'Beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      workout.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {workout.difficulty}
                    </span>
                  </div>
                </motion.div>
              ))}
              
              {upcomingWorkouts.length > 5 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="text-center pt-2"
                >
                  <button className="btn-text">
                    <Calendar className="w-4 h-4 mr-2" />
                    View All Workouts ({upcomingWorkouts.length})
                  </button>
                </motion.div>
              )}
            </div>
            
            <div className="mt-6 pt-4 border-t border-outline-variant">
              <Link to="/workouts" className="btn-outlined w-full flex items-center justify-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Schedule Workout</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Activity History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <HistorySection />
        </motion.div>
      </motion.div>

      {/* Material 3 Motivation Section */}
      <motion.div 
        className="card-elevated p-8 bg-primary text-white relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <motion.div
          className="text-center relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <Trophy className="w-16 h-16 mx-auto mb-6" />
          <h3 className="headline-medium mb-4">You're doing great! 🎉</h3>
          <p className="body-large text-white text-opacity-90 mb-8 max-w-2xl mx-auto">
            Consistency is the key to success. Keep pushing forward and you'll reach your goals!
          </p>
          <Link to="/progress" className="btn-outlined border-white text-white hover:bg-white hover:bg-opacity-10">
            View Progress
            <TrendingUp className="w-5 h-5 ml-2" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;