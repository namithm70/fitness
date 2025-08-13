import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import LoadingSpinner from './components/UI/LoadingSpinner';
import ErrorBoundary from './components/UI/ErrorBoundary';

// Lazy load pages for code splitting
const HomePage = React.lazy(() => import('./pages/HomePage'));
const LoginPage = React.lazy(() => import('./pages/Auth/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/Auth/RegisterPage'));
const DashboardPage = React.lazy(() => import('./pages/Dashboard/DashboardPage'));
const WorkoutsPage = React.lazy(() => import('./pages/Workouts/WorkoutsPage'));
const WorkoutDetailPage = React.lazy(() => import('./pages/Workouts/WorkoutDetailPage'));
const NutritionPage = React.lazy(() => import('./pages/Nutrition/NutritionPage'));
const ProgressPage = React.lazy(() => import('./pages/Progress/ProgressPage'));
const CommunityPage = React.lazy(() => import('./pages/Community/CommunityPage'));
const ProfilePage = React.lazy(() => import('./pages/Profile/ProfilePage'));

const App: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ErrorBoundary>
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

      <Suspense fallback={<LoadingSpinner />}>
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
      </Suspense>
    </ErrorBoundary>
  );
};

export default App;
