import React, { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import clienteAxios from "../config/axios";

const ModalRolPermisos = ({ roleId, onClose, refrescarRoles }) => {
    const [permissions, setPermissions] = useState([]);
    const [rolePermissions, setRolePermissions] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const token = localStorage.getItem('AUTH_TOKEN');

    useEffect(() => {
        clienteAxios.get(`/api/roles/${roleId}/permisos`, {
            headers: {
                Authorization: `Bearer ${token}` // Configurar el token en los headers
            }
        }).then(response => {
            setPermissions(response.data.permissions);
            setRolePermissions(response.data.rolePermissions);
        });
    }, [roleId]);

    const handleCheckboxChange = (permissionId) => {
        if (rolePermissions.includes(permissionId)) {
            setRolePermissions(rolePermissions.filter(id => id !== permissionId));
        } else {
            setRolePermissions([...rolePermissions, permissionId]);
        }
    };


    // Función para seleccionar todos los permisos
    const handleSelectAll = () => {
        const allPermissionIds = permissions.map(permission => permission.id);
        setRolePermissions(allPermissionIds);
    };

    // Función para desmarcar todos los permisos
    const handleDeselectAll = () => {
        setRolePermissions([]);
    };

    const handleSave = async () => {
        if (isSubmitting) return; // Evita doble click / doble submit
        setIsSubmitting(true);

        try {
            await clienteAxios.post(`/api/roles/${roleId}/permisos`, { permissions: rolePermissions }, {
                headers: {
                    Authorization: `Bearer ${token}` // Configurar el token en los headers
                }
            });

            refrescarRoles?.();

            toast.success('Operación exitosa');
            onClose();
        } catch (error) {
            console.error('Error al guardar permisos', error);
            toast.error('Error al guardar permisos');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
                <div className="flex items-start justify-between gap-4 px-6 pt-6 md:px-8 md:pt-8">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Asignar Permisos</h2>
                        <p className="mt-1 text-sm text-slate-500">Completa la información y guarda los cambios.</p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        aria-label="Cerrar"
                    >
                        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                <div className="px-6 pb-6 md:px-8 md:pb-8" aria-busy={isSubmitting}>
                    <fieldset disabled={isSubmitting} className="contents">
                    <div className="mt-6">

                {/* Botones de seleccionar todo y desmarcar todo */}
                <div className="flex justify-between mb-3 border-b pb-2">
                    <button
                        type="button"
                        onClick={handleSelectAll}
                        className="flex items-center bg-green-500 text-white text-sm px-3 py-1 rounded hover:bg-green-600 transition duration-200"
                    >
                        <img src="/img/checked.png" alt="Seleccionar Todo" className="w-4 h-4 mr-1" />
                        Seleccionar Todo
                    </button>

                    <button
                        type="button"
                        onClick={handleDeselectAll}
                        className="flex items-center bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600 transition duration-200"
                    >
                        <img src="/img/unchecked.png" alt="Desmarcar Todo" className="w-4 h-4 mr-1" />
                        Desmarcar Todo
                    </button>
                </div>




                <ul className="space-y-2">
                    {permissions.map(permission => (
                        <li key={permission.id}>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={rolePermissions.includes(permission.id)}
                                    onChange={() => handleCheckboxChange(permission.id)}
                                    className="mr-2"
                                />
                                {permission.name}
                            </label>
                        </li>
                    ))}
                </ul>
                <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                        onClick={handleSave}
                        type="button"
                        className={`inline-flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-900 px-4 py-2 font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 ${isSubmitting ? 'opacity-60 cursor-not-allowed' : 'hover:from-blue-800 hover:to-cyan-800'}`}
                    >
                        {isSubmitting ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button
                        onClick={onClose}
                        type="button"
                        className={`inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-500 px-4 py-2 font-medium text-white focus:outline-none focus:ring-2 focus:ring-red-200 ${isSubmitting ? 'opacity-60 cursor-not-allowed' : 'hover:bg-red-600'}`}
                    >
                        Cerrar
                    </button>
                </div>
                    </div>
                    </fieldset>
                </div>
            </div>
        </div>
    );
}

export default ModalRolPermisos;
