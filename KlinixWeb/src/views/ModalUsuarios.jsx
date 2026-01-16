import { useEffect, useState } from 'react';
import clienteAxios from "../config/axios";
import { toast } from "react-toastify";

export default function ModalUsuarios({ onClose, modo, usuario = {}, refrescarUsuarios, ocultarRolesYOrganizaciones }) {
    const [nombre, setNombre] = useState(usuario.name || '');
    const [correo, setCorreo] = useState(usuario.email || '');
    const [rolSeleccionado, setRolSeleccionado] = useState(usuario.rol_id || '');
    const [roles, setRoles] = useState([]);
    const [organizacionSeleccionada, setorganizacionSeleccionada] = useState(usuario.id_organizacion || '');
    const [organizaciones, setOrganizacion] = useState([]);
    const [errores, setErrores] = useState({});
    // Obtener el token de autenticación
    const token = localStorage.getItem('AUTH_TOKEN');

    // Cargar los roles desde la API al cargar el componente
    useEffect(() => {
        const fetchRoles = async () => {
            try {

                const { data } = await clienteAxios.get('api/roles?all=true', {
                    headers: {
                        Authorization: `Bearer ${token}` // Configurar el token en los headers
                    }
                });
                setRoles(data);
            } catch (error) {
                console.error("Error al cargar los roles", error);
            }
        };

        fetchRoles();
    }, []);

    // Cargar los roles desde la API al cargar el componente
    useEffect(() => {
        const fetchOrganizacion = async () => {
            try {

                const { data } = await clienteAxios.get('api/organizacion?all=true', {
                    headers: {
                        Authorization: `Bearer ${token}` // Configurar el token en los headers
                    }
                });
                setOrganizacion(data);
            } catch (error) {
                console.error("Error al cargar las organizaciones", error);
            }
        };

        fetchOrganizacion();
    }, []);

    // Actualizar el estado del formulario cuando cambie el usuario
    useEffect(() => {
        if (modo === 'editar') {
            setNombre(usuario.name || '');
            setCorreo(usuario.email || '');
            setRolSeleccionado(usuario.rol_id || '');
            setorganizacionSeleccionada(usuario.id_organizacion || '');
        }
    }, [usuario, modo]); // Dependencia en 'usuario' y 'modo'

    // Función para manejar la creación o edición del usuario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
        setErrores({}); // Resetear errores antes de la validación

        try {
            const userData = {
                name: nombre,
                email: correo,
                rol_id: rolSeleccionado,
                id_organizacion: organizacionSeleccionada
            };

            if (modo === 'crear') {

                // Crear un nuevo usuario
                await clienteAxios.post('api/crearusuarios', userData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                toast.success('Usuario creado exitosamente.');
            } else {
                // Editar usuario existente
                await clienteAxios.put(`api/usuarioUpdate/${usuario.id}`, userData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                toast.success('Usuario actualizado exitosamente.');
            }

            // Refrescar la lista de usuarios
            if (refrescarUsuarios !== null && typeof refrescarUsuarios === 'function') {
                refrescarUsuarios();// Refrescar la lista de usuarios
            }

            // Cerrar el modal después de guardar
            onClose();


        } catch (error) {
            if (error.response && error.response.status === 422) {
                // Si la respuesta es un error de validación, capturamos los errores
                setErrores(error.response.data.errors);

            } else {
                console.error('Error al guardar el usuario', error);
                toast.error('Error al guardar el usuario'); // Mostrar mensaje de error genérico
            }
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Fondo oscuro semi-transparente */}
            <div className="bg-gray-800 opacity-75 absolute inset-0" onClick={onClose}></div>

            {/* Contenido del modal */}
            <div className="bg-white rounded-lg shadow-lg z-10 p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                    {modo === 'perfil'
                        ? 'Mi perfil'
                        : modo === 'crear'
                            ? 'Crear Usuario'
                            : 'Editar Usuario'}

                </h2>

                <form onSubmit={handleSubmit}>
                    {/* Campo para Nombre */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                        <input
                            type="text"
                            className={`w-full px-3 py-2 border ${errores.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Introduce el nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                        {errores.name && <p className="text-red-500 text-sm">{errores.name[0]}</p>}
                    </div>

                    {/* Campo para Correo */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
                        <input
                            type="email"
                            className={`w-full px-3 py-2 border ${errores.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Introduce el correo"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                        />
                        {errores.email && <p className="text-red-500 text-sm">{errores.email[0]}</p>}
                    </div>


                    {/* Combo para seleccionar Rol */}
                    {!ocultarRolesYOrganizaciones && (
                        <>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                                <select
                                    className={`w-full px-3 py-2 border ${errores.rol_id ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    value={rolSeleccionado}
                                    onChange={(e) => setRolSeleccionado(e.target.value)}
                                >
                                    <option value="">Seleccione un rol</option>
                                    {roles.map((rol) => (
                                        <option key={rol.id} value={rol.id}>
                                            {rol.name}
                                        </option>
                                    ))}
                                </select>
                                {errores.rol_id && <p className="text-red-500 text-sm">{errores.rol_id[0]}</p>}
                            </div>

                        </>
                    )}

                    {/* Combo para seleccionar Rol */}
                    {!ocultarRolesYOrganizaciones && (
                        <>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Organizacion</label>
                                <select
                                    className={`w-full px-3 py-2 border ${errores.id_organizacion ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    value={organizacionSeleccionada}
                                    onChange={(e) => setorganizacionSeleccionada(e.target.value)}
                                >
                                    <option value="">Seleccione una organizacion</option>
                                    {organizaciones.map((organizacion) => (
                                        <option key={organizacion.id} value={organizacion.id}>
                                            {organizacion.RazonSocial}
                                        </option>
                                    ))}
                                </select>
                                {errores.id_organizacion && <p className="text-red-500 text-sm">{errores.id_organizacion[0]}</p>}
                            </div>

                        </>
                    )}

                    {/* Botones para cerrar y guardar */}
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition"
                        >
                            {modo === 'crear' ? 'Crear Usuario' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
