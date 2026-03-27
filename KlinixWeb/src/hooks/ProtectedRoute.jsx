import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePermisos } from "../context/PermisosContext";
import Spinner from '../components/Spinner';

const ProtectedRoute = ({ permission, children }) => {
    const token = localStorage.getItem('AUTH_TOKEN');

    if (!token) {
        return <Navigate to="/auth/login" replace />;
    }

    const { hasPermission, loading, authError, connectionError } = usePermisos();

    if (authError) {
        return <Navigate to="/auth/login" replace />;
    }


        // Mostrar spinner mientras se cargan los permisos
        if (loading) {
            return <Spinner />;
        }

    if (connectionError) {
        return children;
    }


    if (!hasPermission(permission)) {

        return <Navigate to="/error" replace />;
    }

    return (
        <>
            {children}
        </>
    );
};

export default ProtectedRoute;
