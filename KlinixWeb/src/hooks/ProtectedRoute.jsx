import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthPermisos from "./useAuthPermisos";
import Spinner from '../components/Spinner';

const ProtectedRoute = ({ permission, children }) => {
    const { hasPermission, loading } = useAuthPermisos();


        // Mostrar spinner mientras se cargan los permisos
        if (loading) {
            return <Spinner />;
        }


    if (!hasPermission(permission)) {

        return <Navigate to="/error" />;
    }

    return (
        <>
            {children}
        </>
    );
};

export default ProtectedRoute;
