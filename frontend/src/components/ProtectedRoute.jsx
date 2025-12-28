import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { token, user, role, isSignedIn, isProfileComplete } = useContext(StoreContext);
  const location = useLocation();

  if (!isSignedIn || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isProfileComplete && location.pathname !== '/complete-profile') {
     return <Navigate to="/complete-profile" state={{ 
         name: user?.name, 
         email: user?.email 
     }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;