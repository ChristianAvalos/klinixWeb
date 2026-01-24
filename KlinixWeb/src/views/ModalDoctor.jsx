import { useEffect, useState,useRef } from 'react';
import clienteAxios from "../config/axios";
import { toast } from "react-toastify";

export default function ModalDoctor({ onClose, modo, doctor = {}, refrescarDoctores }) {
    const [nombre, setNombre] = useState(doctor.FirstName || '');
    const [apellido, setApellido] = useState(doctor.LastName || '');
    const [direccion, setDireccion] = useState(doctor.Address || '');
    const [celular, setCelular] = useState(doctor.CellPhoneNumber || '');
    const [soportaWhatsapp, setSoportaWhatsapp] = useState(doctor.SupportWhatsapp === "1");
    const [telefono, setTelefono] = useState(doctor.PhoneNumber || '');
    const [correo, setCorreo] = useState(doctor.Email || '');
    const [ciudadSeleccionado, setCiudadSeleccionado] = useState(doctor.City_Id || '');
    const [ciudades, setCiudades] = useState([]);
    const nombreRef = useRef(null);

    const [isSubmitting, setIsSubmitting] = useState(false);

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


    // Enfocar el campo de nombre al abrir el modal
    useEffect(() => {
        if (nombreRef.current) {
            nombreRef.current.focus();
        }
    }, []);


    // Actualizar el estado del formulario cuando cambie el doctor
    useEffect(() => {
        if (modo === 'editar') {
            setNombre(doctor.FirstName || '');
            setApellido(doctor.LastName || '');
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
        if (isSubmitting) return; // Evita doble click / doble submit

        setErrores({}); // Resetear errores antes de la validación
        setIsSubmitting(true);

        try {
            const userData = {
                FirstName: nombre,
                LastName: apellido,
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
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
                <div className="flex items-start justify-between gap-4 px-6 pt-6 md:px-8 md:pt-8">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                            {modo === 'crear' ? 'Crear doctor' : 'Editar doctor'}
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

                <form onSubmit={handleSubmit} className="px-6 pb-6 md:px-8 md:pb-8" aria-busy={isSubmitting}>
                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre(s)</label>
                            <input type="text" 
                            ref={nombreRef}
                            disabled={isSubmitting}
                            className={`w-full px-3 py-2 border ${errores.FirstName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            value={nombre} 
                            onChange={(e) => setNombre(e.target.value)} />
                            {errores.FirstName && <p className="text-red-500 text-sm">{errores.FirstName[0]}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Apellido(s)</label>
                            <input type="text" 
                            disabled={isSubmitting}
                            className={`w-full px-3 py-2 border ${errores.LastName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            value={apellido} 
                            onChange={(e) => setApellido(e.target.value)} />
                            {errores.LastName && <p className="text-red-500 text-sm">{errores.LastName[0]}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                            <input type="text"
                            disabled={isSubmitting}
                            className={`w-full px-3 py-2 border ${errores.Address ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`} 
                            value={direccion} 
                            onChange={(e) => setDireccion(e.target.value)} />
                            {errores.Address && <p className="text-red-500 text-sm">{errores.Address[0]}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                            <input type="text" 
                            disabled={isSubmitting}
                            className={`w-full px-3 py-2 border ${errores.PhoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            value={telefono} 
                            onChange={(e) => setTelefono(e.target.value)} />
                            {errores.PhoneNumber && <p className="text-red-500 text-sm">{errores.PhoneNumber[0]}</p>}
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Celular</label>
                            <div className="flex items-center gap-2">
                                <input type="text" 
                                disabled={isSubmitting}
                                className={`px-3 py-2 border ${errores.CellPhoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                value={celular} onChange={(e) => setCelular(e.target.value)} />
                                <input type="checkbox" id="whatsapp" className="h-5 w-5" checked={soportaWhatsapp} disabled={isSubmitting} onChange={(e) => setSoportaWhatsapp(e.target.checked)} />
                                <label htmlFor="whatsapp" className="text-sm text-gray-700">¿Soporta WhatsApp?</label>
                            </div>
                            {errores.CellPhoneNumber && <p className="text-red-500 text-sm">{errores.CellPhoneNumber[0]}</p>}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
                            <input type="email" 
                            disabled={isSubmitting}
                            className={`w-full px-3 py-2 border ${errores.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`} 
                            value={correo} 
                            onChange={(e) => setCorreo(e.target.value)} />
                            {errores.email && <p className="text-red-500 text-sm">{errores.email[0]}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                            <select 
                            disabled={isSubmitting}
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
                    <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className={`inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-500 px-4 py-2 font-medium text-white focus:outline-none focus:ring-2 focus:ring-red-200 ${isSubmitting ? 'opacity-60 cursor-not-allowed' : 'hover:bg-red-600'}`}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`inline-flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-900 px-4 py-2 font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 ${isSubmitting ? 'opacity-60 cursor-not-allowed' : 'hover:from-blue-800 hover:to-cyan-800'}`}
                        >
                            {isSubmitting ? 'Guardando...' : (modo === 'crear' ? 'Crear Doctor' : 'Guardar Cambios')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
