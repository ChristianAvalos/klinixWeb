import React, { createContext, useContext, useEffect, useState } from 'react';
import clienteAxios from '../config/axios';
import { toast } from 'react-toastify';
import { isConnectionError, isUnauthorizedError } from '../helpers/requestErrors';

const PermisosContext = createContext();
const CONNECTION_TOAST_ID = 'backend-connection-error';

export const PermisosProvider = ({ children }) => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [connectionError, setConnectionError] = useState(false);

  useEffect(() => {
    const fetchPermissions = async () => {
      const token = localStorage.getItem('AUTH_TOKEN');
      if (!token) {
        setPermissions([]);
        setAuthError(false);
        setConnectionError(false);
        setLoading(false);
        return;
      }

      try {
        setAuthError(false);
        setConnectionError(false);
        const { data } = await clienteAxios.get('/api/usuarios/permisos', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (data && data.role && data.role.permissions) {
          setPermissions(data.role.permissions.map(p => p.name));
        }
      } catch (error) {
        if (isUnauthorizedError(error)) {
          localStorage.removeItem('AUTH_TOKEN');
          localStorage.removeItem('AUTH_USER_ID');
          window.dispatchEvent(new Event('auth:userChanged'));
          setAuthError(true);
          setPermissions([]);
        } else if (isConnectionError(error)) {
          setConnectionError(true);
          toast.error('Sin conexion con el servidor. Intenta nuevamente.', { toastId: CONNECTION_TOAST_ID });
        } else {
          setPermissions([]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPermissions();
  }, []);

  const hasPermission = (permissionName) => permissions.includes(permissionName);

  return (
    <PermisosContext.Provider value={{ permissions, hasPermission, loading, authError, connectionError }}>
      {children}
    </PermisosContext.Provider>
  );
};

export const usePermisos = () => useContext(PermisosContext);
