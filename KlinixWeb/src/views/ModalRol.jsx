import { useEffect, useRef, useState } from 'react';
import clienteAxios from "../config/axios";
import { toast } from "react-toastify";

export default function ModalRol({ onClose, modo, rol = {}, refrescarRoles }) {
    const [nombre, setNombre] = useState(rol.name || '');
    const [errores, setErrores] = useState({});
    const nombreRef = useRef(null);
    // Obtener el token de autenticación
    const token = localStorage.getItem('AUTH_TOKEN');
    // Enfocar el campo de nombre al abrir el modal (y cuando cambia crear/editar)
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (!nombreRef.current) return;

            nombreRef.current.focus();

            if (modo === 'editar') {
                nombreRef.current.select?.();
            }
        }, 0);

        return () => clearTimeout(timeoutId);
    }, [modo, rol?.id]);

    // Actualizar el estado del formulario cuando cambie el usuario
    useEffect(() => {
        if (modo === 'editar') {
            setNombre(rol.name || '');
        }
    }, [rol, modo]); // Dependencia en 'rol' y 'modo'

    // Función para manejar la creación o edición del rol
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
        setErrores({}); // Resetear errores antes de la validación

        try {
            const rolData = {
                name: nombre,
            };

            if (modo === 'crear') {

                // Crear un nuevo rol
                await clienteAxios.post('api/crearrol', rolData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                toast.success('Rol creado exitosamente.');
            } else {
                // Editar rol existente
                await clienteAxios.put(`api/rolUpdate/${rol.id}`, rolData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                toast.success('Rol actualizado exitosamente.');
            }

            // Refrescar la lista de roles
            if (refrescarRoles !== null && typeof refrescarRoles === 'function'){
                refrescarRoles();
            } 
            
            // Cerrar el modal después de guardar
            onClose();


        } catch (error) {
            if (error.response && error.response.status === 422) {
                // Si la respuesta es un error de validación, capturamos los errores
                setErrores(error.response.data.errors);

            } else {
                console.error('Error al guardar el rol', error);
                toast.error('Error al guardar el rol'); // Mostrar mensaje de error genérico
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
                <div className="flex items-start justify-between gap-4 px-6 pt-6 md:px-8 md:pt-8">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                            {modo === 'crear' ? 'Crear Rol' : 'Editar Rol'}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Completa la información y guarda los cambios.
                        </p>
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

                <form onSubmit={handleSubmit} className="px-6 pb-6 md:px-8 md:pb-8">
                    <div className="mt-6">
                    {/* Campo para Nombre */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                        <input
                            type="text"
                            ref={nombreRef}
                            className={`w-full px-3 py-2 border ${errores.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Introduce el nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                        {errores.name && <p className="text-red-500 text-sm">{errores.name[0]}</p>}
                    </div>

                    </div>
                    {/* Botones para cerrar y guardar */}
                    <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-200"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-900 px-4 py-2 font-semibold text-white shadow-sm hover:from-blue-800 hover:to-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        >
                            {modo === 'crear' ? 'Crear Rol' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
