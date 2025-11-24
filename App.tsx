import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import { APP_ROUTES } from './constants';
import { isAuthenticated } from './services/authService';

// Simple Route Guard
const PrivateRoute = ({ children }: { children: React.ReactElement }) => {
  // For demo purposes, we might default to true if no auth logic was previously enforced,
  // but since we added Login, let's try to enforce it.
  // Uncommenting the line below enforces login. For development ease, we can keep it loose or strict.
  // const isAuth = isAuthenticated();
  // return isAuth ? children : <Navigate to={APP_ROUTES.LOGIN} />;
  return children;
};

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path={APP_ROUTES.LOGIN} element={<Login />} />
          <Route path={APP_ROUTES.REGISTER} element={<Register />} />
          <Route path={APP_ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />

          {/* Protected Routes */}
          <Route path={APP_ROUTES.HOME} element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          
          <Route path={APP_ROUTES.PROJECTS} element={<PrivateRoute><ProjectList /></PrivateRoute>} />
          <Route path={APP_ROUTES.PROJECT_NEW} element={<PrivateRoute><ProjectForm /></PrivateRoute>} />
          <Route path={APP_ROUTES.PROJECT_EDIT} element={<PrivateRoute><ProjectForm /></PrivateRoute>} />
          <Route path={APP_ROUTES.PROJECT_DETAILS} element={<PrivateRoute><ProjectDetails /></PrivateRoute>} />
          
          <Route path={APP_ROUTES.INSPECTION_LIST} element={<PrivateRoute><InspectionList /></PrivateRoute>} />
          <Route path={APP_ROUTES.INSPECTION_NEW} element={<PrivateRoute><Inspection /></PrivateRoute>} />
          <Route path={APP_ROUTES.INSPECTION_DETAILS} element={<PrivateRoute><InspectionDetails /></PrivateRoute>} />
          
          <Route path={APP_ROUTES.APR_LIST} element={<PrivateRoute><APRList /></PrivateRoute>} />
          <Route path={APP_ROUTES.APR_DETAILS} element={<PrivateRoute><APRDetails /></PrivateRoute>} />
          <Route path={APP_ROUTES.APR_NEW} element={<PrivateRoute><APRNew /></PrivateRoute>} />
          
          <Route path={APP_ROUTES.PROFILE} element={<PrivateRoute><Profile /></PrivateRoute>} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;