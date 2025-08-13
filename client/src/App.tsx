import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import WorkoutsPage from './pages/Workouts/WorkoutsPage';
import WorkoutDetailPage from './pages/Workouts/WorkoutDetailPage';
import NutritionPage from './pages/Nutrition/NutritionPage';
import ProgressPage from './pages/Progress/ProgressPage';
import CommunityPage from './pages/Community/CommunityPage';
import ProfilePage from './pages/Profile/ProfilePage';
import LoadingSpinner from './components/UI/LoadingSpinner';

const App: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Helmet>
        <title>FitLife - Your Fitness Journey Starts Here</title>
        <meta name="description" content="Comprehensive health and fitness website for gym members and fitness enthusiasts" />
        <meta name="keywords" content="fitness, gym, workout, nutrition, health, exercise" />
        <meta property="og:title" content="FitLife - Your Fitness Journey Starts Here" />
        <meta property="og:description" content="Track your workouts, plan your nutrition, and achieve your fitness goals with FitLife." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.origin} />
        <link rel="canonical" href={window.location.origin} />
      </Helmet>

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />

        {/* Protected Routes */}
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={user ? <DashboardPage /> : <Navigate to="/login" />} />
          <Route path="workouts" element={user ? <WorkoutsPage /> : <Navigate to="/login" />} />
          <Route path="workouts/:id" element={user ? <WorkoutDetailPage /> : <Navigate to="/login" />} />
          <Route path="nutrition" element={user ? <NutritionPage /> : <Navigate to="/login" />} />
          <Route path="progress" element={user ? <ProgressPage /> : <Navigate to="/login" />} />
          <Route path="community" element={user ? <CommunityPage /> : <Navigate to="/login" />} />
          <Route path="profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;
