import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (adminOnly && user.email !== 'gruheshkurra2@gmail.com') {
        return <Navigate to="/restricted" replace />;
    }

    return children;
};

export default ProtectedRoute;