import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  fitnessLevel: string;
  fitnessGoals: string[];
  workoutDaysPerWeek: number;
  preferredWorkoutDuration: number;
}

const RegisterPage: React.FC = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    defaultValues: {
      fitnessLevel: 'beginner',
      fitnessGoals: [],
      workoutDaysPerWeek: 3,
      preferredWorkoutDuration: 45,
    },
  });

  const fitnessLevels = [
    { value: 'beginner', label: 'Beginner', description: 'New to fitness or getting back into it' },
    { value: 'intermediate', label: 'Intermediate', description: 'Regular exercise routine for 6+ months' },
    { value: 'advanced', label: 'Advanced', description: 'Consistent training for 2+ years' },
  ];

  const fitnessGoals = [
    { value: 'weight-loss', label: 'Weight Loss', icon: '⚖️' },
    { value: 'muscle-gain', label: 'Muscle Gain', icon: '💪' },
    { value: 'endurance', label: 'Endurance', icon: '🏃' },
    { value: 'general-fitness', label: 'General Fitness', icon: '❤️' },
    { value: 'strength', label: 'Strength', icon: '🏋️' },
    { value: 'flexibility', label: 'Flexibility', icon: '🧘' },
  ];

  const workoutDays = [
    { value: 2, label: '2 days' },
    { value: 3, label: '3 days' },
    { value: 4, label: '4 days' },
    { value: 5, label: '5 days' },
    { value: 6, label: '6 days' },
  ];

  const workoutDurations = [
    { value: 30, label: '30 minutes' },
    { value: 45, label: '45 minutes' },
    { value: 60, label: '60 minutes' },
    { value: 90, label: '90 minutes' },
  ];

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        fitnessLevel: data.fitnessLevel,
        fitnessGoals: data.fitnessGoals,
      });
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by the auth context
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoalToggle = (goal: string) => {
    const currentGoals = watch('fitnessGoals');
    const updatedGoals = currentGoals.includes(goal)
      ? currentGoals.filter(g => g !== goal)
      : [...currentGoals, goal];
    
    // Update the form value using setValue
    setValue('fitnessGoals', updatedGoals);
  };

  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-2xl"
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl font-bold text-white mb-2"
            >
              Start your fitness journey
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-white/80"
            >
              Create your account and get personalized workout plans
            </motion.p>
          </div>
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    step <= currentStep
                      ? 'bg-white text-purple-600 shadow-lg'
                      : 'bg-white/20 text-white/60'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-16 h-1 mx-2 rounded-full transition-all duration-300 ${
                      step < currentStep ? 'bg-white' : 'bg-white/20'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-2 text-center text-sm text-white/70">
              {currentStep === 1 && 'Account Details'}
              {currentStep === 2 && 'Fitness Profile'}
              {currentStep === 3 && 'Preferences'}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-white/90 mb-2">
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                      <input
                        id="firstName"
                        type="text"
                        {...register('firstName', { required: 'First name is required' })}
                        className="w-full px-4 py-3 pl-10 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/60 transition-all duration-200"
                        placeholder="Enter your first name"
                      />
                    </div>
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-300">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-white/90 mb-2">
                      Last Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                      <input
                        id="lastName"
                        type="text"
                        {...register('lastName', { required: 'Last name is required' })}
                        className="w-full px-4 py-3 pl-10 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/60 transition-all duration-200"
                        placeholder="Enter your last name"
                      />
                    </div>
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-300">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                    <input
                      id="email"
                      type="email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address',
                        },
                      })}
                      className="w-full px-4 py-3 pl-10 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/60 transition-all duration-200"
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-300">{errors.email.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        {...register('password', {
                          required: 'Password is required',
                          minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters',
                          },
                        })}
                        className="w-full px-4 py-3 pl-10 pr-10 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/60 transition-all duration-200"
                        placeholder="Create a password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-200"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-300">{errors.password.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/90 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        {...register('confirmPassword', {
                          required: 'Please confirm your password',
                          validate: (value) => value === watch('password') || 'Passwords do not match',
                        })}
                        className="w-full px-4 py-3 pl-10 pr-10 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/60 transition-all duration-200"
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-200"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-300">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full bg-white text-purple-600 py-3 px-4 rounded-lg font-semibold hover:bg-white/90 focus:ring-2 focus:ring-white/50 transition-all duration-200 flex items-center justify-center"
                >
                  Continue
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-4">
                    What's your current fitness level?
                  </label>
                  <div className="space-y-4">
                    {fitnessLevels.map((level) => {
                      const isSelected = watch('fitnessLevel') === level.value;
                      return (
                        <label 
                          key={level.value} 
                          className={`group flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                            isSelected 
                              ? 'border-white bg-white/10 shadow-md' 
                              : 'border-white/20 hover:border-white/40 hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center justify-center w-6 h-6 mr-4 mt-1">
                            <input
                              type="radio"
                              value={level.value}
                              {...register('fitnessLevel')}
                              className="sr-only"
                            />
                            <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all duration-200 ${
                              isSelected 
                                ? 'border-white' 
                                : 'border-white/40 group-hover:border-white/60'
                            }`}>
                              {isSelected && (
                                <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                              )}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className={`text-sm font-semibold transition-colors duration-200 ${
                              isSelected ? 'text-white' : 'text-white/90'
                            }`}>
                              {level.label}
                            </div>
                            <div className="text-sm text-white/60 mt-1">{level.description}</div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-4">
                    What are your fitness goals? (Select all that apply)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {fitnessGoals.map((goal) => {
                      const isSelected = watch('fitnessGoals').includes(goal.value);
                      return (
                        <label 
                          key={goal.value} 
                          className={`group flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                            isSelected 
                              ? 'border-white bg-white/10 shadow-md' 
                              : 'border-white/20 hover:border-white/40 hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center justify-center w-6 h-6 mr-4">
                            <input
                              type="checkbox"
                              value={goal.value}
                              checked={isSelected}
                              onChange={() => handleGoalToggle(goal.value)}
                              className="sr-only"
                            />
                            <div className={`w-5 h-5 border-2 rounded-md flex items-center justify-center transition-all duration-200 ${
                              isSelected 
                                ? 'border-white bg-white' 
                                : 'border-white/40 group-hover:border-white/60'
                            }`}>
                              {isSelected && (
                                <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center flex-1">
                            <span className="text-2xl mr-3">{goal.icon}</span>
                            <span className={`text-sm font-semibold transition-colors duration-200 ${
                              isSelected ? 'text-white' : 'text-white/90'
                            }`}>
                              {goal.label}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 bg-white/20 text-white py-3 px-4 rounded-lg font-semibold hover:bg-white/30 focus:ring-2 focus:ring-white/50 transition-all duration-200"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 bg-white text-purple-600 py-3 px-4 rounded-lg font-semibold hover:bg-white/90 focus:ring-2 focus:ring-white/50 transition-all duration-200 flex items-center justify-center"
                  >
                    Continue
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-4">
                    How many days per week can you work out?
                  </label>
                  <div className="grid grid-cols-5 gap-3">
                    {workoutDays.map((day) => (
                      <label key={day.value} className="flex items-center justify-center p-3 border border-white/20 rounded-lg hover:bg-white/10 cursor-pointer transition-all duration-200">
                        <input
                          type="radio"
                          value={day.value}
                          {...register('workoutDaysPerWeek')}
                          className="h-4 w-4 text-white focus:ring-white/50 border-white/40 bg-white/10"
                        />
                        <span className="ml-2 text-sm font-medium text-white/90">{day.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-4">
                    How long do you prefer your workouts to be?
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {workoutDurations.map((duration) => (
                      <label key={duration.value} className="flex items-center justify-center p-3 border border-white/20 rounded-lg hover:bg-white/10 cursor-pointer transition-all duration-200">
                        <input
                          type="radio"
                          value={duration.value}
                          {...register('preferredWorkoutDuration')}
                          className="h-4 w-4 text-white focus:ring-white/50 border-white/40 bg-white/10"
                        />
                        <span className="ml-2 text-sm font-medium text-white/90">{duration.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 bg-white/20 text-white py-3 px-4 rounded-lg font-semibold hover:bg-white/30 focus:ring-2 focus:ring-white/50 transition-all duration-200"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-white text-purple-600 py-3 px-4 rounded-lg font-semibold hover:bg-white/90 focus:ring-2 focus:ring-white/50 transition-all duration-200 flex items-center justify-center disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-white/70">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-white hover:text-white/80 underline transition-colors duration-200">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
