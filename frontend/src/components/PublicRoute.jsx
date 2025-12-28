import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';

const PublicRoute = ({ children }) => {
  const { token, isSignedIn, role } = useContext(StoreContext);

  if (isSignedIn && token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;