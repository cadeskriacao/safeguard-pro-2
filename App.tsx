import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Inspection from './pages/Inspection';
import InspectionList from './pages/InspectionList';
import InspectionDetails from './pages/InspectionDetails';
import APRList from './pages/APRList';
import APRDetails from './pages/APRDetails';
import APRNew from './pages/APRNew';
import ProjectList from './pages/ProjectList';
import ProjectDetails from './pages/ProjectDetails';
import ProjectForm from './pages/ProjectForm';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import LandingPage from './pages/LandingPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { APP_ROUTES } from './constants';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path={APP_ROUTES.LANDING} element={<LandingPage />} />
            <Route path={APP_ROUTES.LOGIN} element={<Login />} />
            <Route path={APP_ROUTES.REGISTER} element={<Register />} />
            <Route path={APP_ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
            <Route path={APP_ROUTES.RESET_PASSWORD} element={<ResetPassword />} />

            {/* Protected Routes */}
            <Route path={APP_ROUTES.HOME} element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

            <Route path={APP_ROUTES.PROJECTS} element={<ProtectedRoute><ProjectList /></ProtectedRoute>} />
            <Route path={APP_ROUTES.PROJECT_NEW} element={<ProtectedRoute><ProjectForm /></ProtectedRoute>} />
            <Route path={APP_ROUTES.PROJECT_EDIT} element={<ProtectedRoute><ProjectForm /></ProtectedRoute>} />
            <Route path={APP_ROUTES.PROJECT_DETAILS} element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />

            <Route path={APP_ROUTES.INSPECTION_LIST} element={<ProtectedRoute><InspectionList /></ProtectedRoute>} />
            <Route path={APP_ROUTES.INSPECTION_NEW} element={<ProtectedRoute><Inspection /></ProtectedRoute>} />
            <Route path={APP_ROUTES.INSPECTION_DETAILS} element={<ProtectedRoute><InspectionDetails /></ProtectedRoute>} />

            <Route path={APP_ROUTES.APR_LIST} element={<ProtectedRoute><APRList /></ProtectedRoute>} />
            <Route path={APP_ROUTES.APR_DETAILS} element={<ProtectedRoute><APRDetails /></ProtectedRoute>} />
            <Route path={APP_ROUTES.APR_NEW} element={<ProtectedRoute><APRNew /></ProtectedRoute>} />

            <Route path={APP_ROUTES.PROFILE} element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          </Routes>
        </Layout>
      </Router>
      <SpeedInsights />
    </AuthProvider>
  );
};

export default App;