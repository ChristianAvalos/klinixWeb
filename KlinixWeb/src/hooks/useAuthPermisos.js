import React, { useEffect, useState } from 'react';
import clienteAxios from "../config/axios";

const useAuthPermisos = () => {
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPermissions = async () => {
            const token = localStorage.getItem('AUTH_TOKEN');
            try {
                const { data } = await clienteAxios.get('/api/usuarios/permisos', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });


                if (data && data.role.permissions) {
                    const permissionNames = data.role.permissions.map(permission => permission.name);
                    setPermissions(permissionNames);
                }
            } catch (error) {
                console.error('Error al obtener los permisos:', error);
            }finally {
                setLoading(false); 
            }
        };  

        fetchPermissions();
    }, []);

    // Función de utilidad para verificar permisos
    const hasPermission = (permissionName) => {
        return permissions.includes(permissionName);
    };

    return { permissions, hasPermission,loading };
};

export default useAuthPermisos;
