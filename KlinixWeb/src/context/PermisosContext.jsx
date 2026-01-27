import React, { createContext, useContext, useEffect, useState } from 'react';
import clienteAxios from '../config/axios';

const PermisosContext = createContext();

export const PermisosProvider = ({ children }) => {
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
        if (data && data.role && data.role.permissions) {
          setPermissions(data.role.permissions.map(p => p.name));
        }
      } catch (error) {
        setPermissions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPermissions();
  }, []);

  const hasPermission = (permissionName) => permissions.includes(permissionName);

  return (
    <PermisosContext.Provider value={{ permissions, hasPermission, loading }}>
      {children}
    </PermisosContext.Provider>
  );
};

export const usePermisos = () => useContext(PermisosContext);
