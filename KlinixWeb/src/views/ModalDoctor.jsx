import { useEffect, useState } from 'react';
import clienteAxios from "../config/axios";
import { toast } from "react-toastify";

export default function ModalDoctor({ onClose, modo, doctor = {}, refrescarDoctores }) {
    const [nombre, setNombre] = useState(doctor.Firstname || '');
    const [apellido, setApellido] = useState(doctor.Lastname || '');
    const [direccion, setDireccion] = useState(doctor.Address || '');
    const [celular, setCelular] = useState(doctor.CellPhoneNumber || '');
    const [soportaWhatsapp, setSoportaWhatsapp] = useState(doctor.SupportWhatsapp === "1");
    const [telefono, setTelefono] = useState(doctor.PhoneNumber || '');
    const [correo, setCorreo] = useState(doctor.Email || '');
    const [ciudadSeleccionado, setCiudadSeleccionado] = useState(doctor.City_Id || '');
    const [ciudades, setCiudades] = useState([]);

    const [errores, setErrores] = useState({});
    // Obtener el token de autenticación
    const token = localStorage.getItem('AUTH_TOKEN');

    // Cargar las ciudades desde la API al cargar el componente
    useEffect(() => {
        const fetchCiudades = async () => {
            try {

                const { data } = await clienteAxios.get('api/ciudades', {
                    headers: {
                        Authorization: `Bearer ${token}` // Configurar el token en los headers
                    }
                });
                setCiudades(data);
            } catch (error) {
                console.error("Error al cargar las ciudades", error);
            }
        };

        fetchCiudades();
    }, []);


    // Actualizar el estado del formulario cuando cambie el doctor
    useEffect(() => {
        if (modo === 'editar') {
            setNombre(doctor.Firstname || '');
            setApellido(doctor.Lastname || '');
            setDireccion(doctor.Address || '');
            setCelular(doctor.CellPhoneNumber || '');
            //setSoportaWhatsapp(doctor.SupportWhatsapp || false);
            setSoportaWhatsapp(doctor.SupportWhatsapp === "1");
            setTelefono(doctor.PhoneNumber || '');
            setCorreo(doctor.Email || '');
            setCiudadSeleccionado(doctor.City_Id || '');
        }
    }, [doctor, modo]); // Dependencia en 'doctor' y 'modo'

    // Función para manejar la creación o edición de los doctores
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
        setErrores({}); // Resetear errores antes de la validación

        try {
            const userData = {
                Firstname: nombre,
                Lastname: apellido,
                Address: direccion,
                CellPhoneNumber: celular,
                SupportWhatsapp: soportaWhatsapp,
                PhoneNumber: telefono,
                email: correo,
                City_Id: ciudadSeleccionado
            };

            if (modo === 'crear') {
                // Crear un nuevo doctor
                await clienteAxios.post('api/creardoctores', userData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                toast.success('Doctor creado exitosamente.');
            } else {
                // Editar doctor existente
                await clienteAxios.put(`api/editardoctores/${doctor.id}`, userData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                toast.success('Doctor actualizado exitosamente.');
            }

            // Refrescar la lista de doctores
            if (refrescarDoctores !== null && typeof refrescarDoctores === 'function') {
                refrescarDoctores();// Refrescar la lista de doctores
            }

            // Cerrar el modal después de guardar
            onClose();


        } catch (error) {
            if (error.response && error.response.status === 422) {
                // Si la respuesta es un error de validación, capturamos los errores
                setErrores(error.response.data.errors);

            } else {
                console.error('Error al guardar al doctor', error);
                toast.error('Error al guardar al doctor'); // Mostrar mensaje de error genérico
            }
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-gray-800 opacity-75 absolute inset-0" onClick={onClose}></div>
            <div className="bg-white rounded-lg shadow-lg z-10 p-6 w-full max-w-2xl">
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                    {modo === 'crear' ? 'Crear doctor' : 'Editar doctor'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre(s)</label>
                            <input type="text" 
                            className={`w-full px-3 py-2 border ${errores.Firstname ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            value={nombre} 
                            onChange={(e) => setNombre(e.target.value)} />
                            {errores.Firstname && <p className="text-red-500 text-sm">{errores.Firstname[0]}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Apellido(s)</label>
                            <input type="text" 
                            className={`w-full px-3 py-2 border ${errores.Lastname ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            value={apellido} 
                            onChange={(e) => setApellido(e.target.value)} />
                            {errores.Lastname && <p className="text-red-500 text-sm">{errores.Lastname[0]}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                            <input type="text"
                            className={`w-full px-3 py-2 border ${errores.Address ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`} 
                            value={direccion} 
                            onChange={(e) => setDireccion(e.target.value)} />
                            {errores.Address && <p className="text-red-500 text-sm">{errores.Address[0]}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                            <input type="text" 
                            className={`w-full px-3 py-2 border ${errores.PhoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            value={telefono} 
                            onChange={(e) => setTelefono(e.target.value)} />
                            {errores.PhoneNumber && <p className="text-red-500 text-sm">{errores.PhoneNumber[0]}</p>}
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Celular</label>
                            <div className="flex items-center gap-2">
                                <input type="text" 
                                className={`px-3 py-2 border ${errores.CellPhoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                value={celular} onChange={(e) => setCelular(e.target.value)} />
                                <input type="checkbox" id="whatsapp" className="h-5 w-5" checked={soportaWhatsapp} onChange={(e) => setSoportaWhatsapp(e.target.checked)} />
                                <label htmlFor="whatsapp" className="text-sm text-gray-700">¿Soporta WhatsApp?</label>
                            </div>
                            {errores.CellPhoneNumber && <p className="text-red-500 text-sm">{errores.CellPhoneNumber[0]}</p>}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
                            <input type="email" 
                            className={`w-full px-3 py-2 border ${errores.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`} 
                            value={correo} 
                            onChange={(e) => setCorreo(e.target.value)} />
                            {errores.email && <p className="text-red-500 text-sm">{errores.email[0]}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                            <select 
                            className={`w-full px-3 py-2 border ${errores.City_Id ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`} 
                            value={ciudadSeleccionado} 
                            onChange={(e) => setCiudadSeleccionado(e.target.value)}>
                                <option value="">Seleccione una ciudad</option>
                                {ciudades.map((ciudad) => (
                                    <option key={ciudad.id} value={ciudad.id}>{ciudad.nombre}</option>
                                ))}
                            </select>
                            {errores.City_Id && <p className="text-red-500 text-sm">{errores.City_Id[0]}</p>}
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-4">
                        <button onClick={onClose} className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600">Cancelar</button>
                        <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600">{modo === 'crear' ? 'Crear Doctor' : 'Guardar Cambios'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
