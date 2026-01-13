import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthPermisos from "./useAuthPermisos";

const ProtectedRoute = ({ permission, children }) => {
    const { hasPermission, loading } = useAuthPermisos();


        // Mostrar un mensaje de carga solo para la parte protegida del contenido
        if (loading) {
            return (
                <div>
                    {/* Contenido básico que no depende de permisos (plugins, etc.) */}
                    <div>Cargando permisos...</div>
                </div>
            );
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
