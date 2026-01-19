import { useEffect, useState } from 'react';
import clienteAxios from "../config/axios";
import { toast } from "react-toastify";
import {formatearMiles}from "../helpers/HelpersNumeros";

export default function ModalPatient({ onClose, modo, paciente = {}, refrescarPacientes }) {
    const [codigoPaciente, setCodigoPaciente] = useState(paciente.PatientCode || '');
    const [nombre, setNombre] = useState(paciente.FirstName || '');
    const [apellido, setApellido] = useState(paciente.LastName || '');
    const [titulo, setTitulo] = useState(paciente.Title || '');
    const [numeroDocumento, setNumeroDocumento] = useState(paciente.DocumentNo || '');
    const [nacionalidad, setNacionalidad] = useState(paciente.Nationality || '');
    const [fechaNacimiento, setFechaNacimiento] = useState(paciente.Birthday ? paciente.Birthday.split('T')[0] : '');
    const [sexo, setSexo] = useState(paciente.Sex || '');
    const [direccion, setDireccion] = useState(paciente.Address || '');
    const [barrio, setBarrio] = useState(paciente.Neighborhood || '');
    const [ciudadSeleccionado, setCiudadSeleccionado] = useState(paciente.City_Id || '');
    const [ciudades, setCiudades] = useState([]);
    const [distrito, setDistrito] = useState(paciente.District || '');
    const [departamento, setDepartamento] = useState(paciente.Department || '');
    const [telefono, setTelefono] = useState(paciente.PhoneNumber || '');
    const [celular, setCelular] = useState(paciente.CellPhoneNumber || '');
    const [soportaWhatsapp, setSoportaWhatsapp] = useState(paciente.SupportWhatsapp === "1");
    const [correo, setCorreo] = useState(paciente.Email || '');
    const [tipoSangre, setTipoSangre] = useState(paciente.BloodType || '');
    const [factorRH, setFactorRH] = useState(paciente.RHFactor || '');
    const [estadoCivil, setEstadoCivil] = useState(paciente.MaritalStatus || '');
    const [diagnosticoMedico, setDiagnosticoMedico] = useState(paciente.MedicalDiagnosis || '');
    const [seguroMedico, setSeguroMedico] = useState(paciente.MedicalInsurance || '');
    const [fechaFallecimiento, setFechaFallecimiento] = useState(paciente.DeathDate ? paciente.DeathDate.split('T')[0] : '');
    const [causaFallecimiento, setCausaFallecimiento] = useState(paciente.DeathCause || '');
    const [lugarFallecimiento, setLugarFallecimiento] = useState(paciente.DeathPlace || '');
    const [numeroCertificadoDefuncion, setNumeroCertificadoDefuncion] = useState(paciente.DeathCertificateNumber || '');


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


    // Actualizar el estado del formulario cuando cambie el paciente
    useEffect(() => {
        if (modo === 'editar') {
            setCodigoPaciente(paciente.PatientCode || '');
            setNombre(paciente.FirstName || '');
            setApellido(paciente.LastName || '');
            setTitulo(paciente.Title || '');
            setNumeroDocumento(paciente.DocumentNo || '');
            setNacionalidad(paciente.Nationality || '');
            setFechaNacimiento(paciente.Birthday ? paciente.Birthday.split('T')[0] : '');
            setSexo(paciente.Sex || '');
            setDireccion(paciente.Address || '');
            setBarrio(paciente.Neighborhood || '');
            setCiudadSeleccionado(paciente.City_Id || '');
            setDistrito(paciente.District || '');
            setDepartamento(paciente.Department || '');
            setTelefono(paciente.PhoneNumber || '');
            setCelular(paciente.CellPhoneNumber || '');
            setSoportaWhatsapp(paciente.SupportWhatsapp === "1");
            setCorreo(paciente.Email || '');
            setTipoSangre(paciente.BloodType || '');
            setFactorRH(paciente.RHFactor || '');
            setEstadoCivil(paciente.MaritalStatus || '');
            setDiagnosticoMedico(paciente.MedicalDiagnosis || '');
            setSeguroMedico(paciente.MedicalInsurance || '');
            setFechaFallecimiento(paciente.DeathDate ? paciente.DeathDate.split('T')[0] : '');
            setCausaFallecimiento(paciente.DeathCause || '');
            setLugarFallecimiento(paciente.DeathPlace || '');
            setNumeroCertificadoDefuncion(paciente.DeathCertificateNumber || '');
        }

    }, [paciente, modo]); // Dependencia en 'paciente' y 'modo'

    // Función para manejar la creación o edición de los pacientes
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
        setErrores({}); // Resetear errores antes de la validación

        try {
            const userData = {
                PatientCode: codigoPaciente,
                FirstName: nombre,
                LastName: apellido,
                Title: titulo,
                DocumentNo: numeroDocumento,
                Nationality: nacionalidad,
                Birthday: fechaNacimiento, // Debe ser un objeto Date o un string en formato 'YYYY-MM-DD'
                Sex: sexo,
                Address: direccion,
                Neighborhood: barrio,
                City_Id: ciudadSeleccionado, // Asegúrate de que coincida con el ID de la ciudad
                District: distrito,
                Department: departamento,
                PhoneNumber: telefono,
                CellPhoneNumber: celular,
                SupportWhatsapp: soportaWhatsapp ? "1" : "0", // Para mantener la coherencia con la tabla
                Email: correo,
                BloodType: tipoSangre,
                RHFactor: factorRH,
                MaritalStatus: estadoCivil,
                MedicalDiagnosis: diagnosticoMedico,
                MedicalInsurance: seguroMedico,
                DeathDate: fechaFallecimiento ? new Date(fechaFallecimiento).toISOString().split('T')[0] : null,
                DeathCause: causaFallecimiento,
                DeathPlace: lugarFallecimiento,
                DeathCertificateNumber: numeroCertificadoDefuncion
            };


            if (modo === 'crear') {
                // Crear un nuevo paciente
                await clienteAxios.post('api/crearpacientes', userData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                toast.success('Paciente creado exitosamente.');
            } else {
                // Editar paciente existente
                await clienteAxios.put(`api/editarpacientes/${paciente.id}`, userData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                toast.success('Paciente actualizado exitosamente.');
            }

            // Refrescar la lista de paciente
            if (refrescarPacientes !== null && typeof refrescarPacientes === 'function') {
                refrescarPacientes();// Refrescar la lista de pacientes
            }

            // Cerrar el modal después de guardar
            onClose();


        } catch (error) {
            if (error.response && error.response.status === 422) {
                // Si la respuesta es un error de validación, capturamos los errores
                setErrores(error.response.data.errors);

            } else {
                console.error('Error al guardar al paciente', error);
                toast.error('Error al guardar al paciente'); // Mostrar mensaje de error genérico
            }
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-gray-800 opacity-75 absolute inset-0" onClick={onClose}></div>
            <div className="bg-white rounded-lg shadow-lg z-10 p-6 w-full max-w-2xl">
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                    {modo === 'crear' ? 'Crear paciente' : 'Editar paciente'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-3 gap-4">
                        {/* Documento */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Documento Nº</label>
                            <input type="text"
                                className={`w-full px-3 py-2 border ${errores.DocumentNo ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                value={formatearMiles(numeroDocumento)}
                                onChange={(e) => setNumeroDocumento(e.target.value)} />
                            {errores.DocumentNo && <p className="text-red-500 text-sm">{errores.DocumentNo[0]}</p>}
                        </div>

                        {/* Código paciente */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Código Paciente</label>
                            <input type="text"
                                className={`w-full px-3 py-2 border ${errores.PatientCode ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                value={codigoPaciente}
                                onChange={(e) => setCodigoPaciente(e.target.value)} />
                            {errores.PatientCode && <p className="text-red-500 text-sm">{errores.PatientCode[0]}</p>}
                        </div>
                        {/* Nombre(s) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre(s)</label>
                            <input type="text"
                                className={`w-full px-3 py-2 border ${errores.FirstName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)} />
                            {errores.FirstName && <p className="text-red-500 text-sm">{errores.FirstName[0]}</p>}
                        </div>
                        {/* Apellido(s) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Apellido(s)</label>
                            <input type="text"
                                className={`w-full px-3 py-2 border ${errores.LastName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                value={apellido}
                                onChange={(e) => setApellido(e.target.value)} />
                            {errores.LastName && <p className="text-red-500 text-sm">{errores.LastName[0]}</p>}
                        </div>
                        {/* Título */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                            <input type="text"
                                className={`w-full px-3 py-2 border ${errores.Title ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)} />
                            {errores.Title && <p className="text-red-500 text-sm">{errores.Title[0]}</p>}
                        </div>

                         {/* Estado Civil */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Estado Civil</label>
                            <select
                                className={`w-full px-3 py-2 border ${errores.Sex ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                value={sexo}
                                onChange={(e) => setSexo(e.target.value)}>
                                <option value="">Seleccione una opción</option>
                                <option value="M">Masculino</option>
                                <option value="F">Femenino</option>
                            </select>
                            {errores.Sex && <p className="text-red-500 text-sm">{errores.Sex[0]}</p>}
                        </div>



                         {/* Sexo */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
                            <select
                                className={`w-full px-3 py-2 border ${errores.Sex ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                value={sexo}
                                onChange={(e) => setSexo(e.target.value)}>
                                <option value="">Seleccione una opción</option>
                                <option value="M">Masculino</option>
                                <option value="F">Femenino</option>
                            </select>
                            {errores.Sex && <p className="text-red-500 text-sm">{errores.Sex[0]}</p>}
                        </div>
                        {/* Dirección */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                            <input type="text"
                                className={`w-full px-3 py-2 border ${errores.Address ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                value={direccion}
                                onChange={(e) => setDireccion(e.target.value)} />
                            {errores.Address && <p className="text-red-500 text-sm">{errores.Address[0]}</p>}
                        </div>

                        {/* Teléfono */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                            <input type="text"
                                className={`w-full px-3 py-2 border ${errores.PhoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)} />
                            {errores.PhoneNumber && <p className="text-red-500 text-sm">{errores.PhoneNumber[0]}</p>}
                        </div>

                        {/* Celular */}
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

                        {/* Correo */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
                            <input type="email"
                                className={`w-full px-3 py-2 border ${errores.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)} />
                            {errores.email && <p className="text-red-500 text-sm">{errores.email[0]}</p>}
                        </div>

                        {/* Ciudad */}
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


                        {/* Nacionalidad */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nacionalidad</label>
                            <input type="text"
                                className={`w-full px-3 py-2 border ${errores.Nationality ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                value={nacionalidad}
                                onChange={(e) => setNacionalidad(e.target.value)} />
                            {errores.Nationality && <p className="text-red-500 text-sm">{errores.Nationality[0]}</p>}
                        </div>

                        {/* Fecha de nacimiento */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
                            <input type="date"
                                className={`w-full px-3 py-2 border ${errores.Birthday ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                value={fechaNacimiento}
                                onChange={(e) => setFechaNacimiento(e.target.value)} />
                            {errores.Birthday && <p className="text-red-500 text-sm">{errores.Birthday[0]}</p>}
                        </div>

                       

                        {/* Foto 
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Foto</label>
                            <input type="file"
                                className={`w-full px-3 py-2 border ${errores.Photo ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                onChange={handleFileChange} />
                            {errores.Photo && <p className="text-red-500 text-sm">{errores.Photo[0]}</p>}
                        </div>*/}

                        {/* Datos adicionales */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Sangre</label>
                            <input type="text"
                                className={`w-full px-3 py-2 border ${errores.BloodType ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                value={tipoSangre}
                                onChange={(e) => setTipoSangre(e.target.value)} />
                            {errores.BloodType && <p className="text-red-500 text-sm">{errores.BloodType[0]}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Diagnóstico Médico</label>
                            <textarea
                                className={`w-full px-3 py-2 border ${errores.MedicalDiagnosis ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                value={diagnosticoMedico}
                                onChange={(e) => setDiagnosticoMedico(e.target.value)} />
                            {errores.MedicalDiagnosis && <p className="text-red-500 text-sm">{errores.MedicalDiagnosis[0]}</p>}
                        </div>

                        {/* Fecha de Muerte */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Muerte</label>
                            <input type="date"
                                className={`w-full px-3 py-2 border ${errores.DeathDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                value={fechaFallecimiento}
                                onChange={(e) => setFechaFallecimiento(e.target.value)} />
                            {errores.DeathDate && <p className="text-red-500 text-sm">{errores.DeathDate[0]}</p>}
                        </div>

                        {/* Causa de Muerte */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Causa de Muerte</label>
                            <input type="text"
                                className={`w-full px-3 py-2 border ${errores.DeathCause ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                value={causaFallecimiento}
                                onChange={(e) => setCausaFallecimiento(e.target.value)} />
                            {errores.DeathCause && <p className="text-red-500 text-sm">{errores.DeathCause[0]}</p>}
                        </div>

                        {/* Certificado de Muerte */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Certificado de Muerte</label>
                            <input type="text"
                                className={`w-full px-3 py-2 border ${errores.DeathCertificate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                value={numeroCertificadoDefuncion}
                                onChange={(e) => setNumeroCertificadoDefuncion(e.target.value)}/>
                            {errores.DeathCertificate && <p className="text-red-500 text-sm">{errores.DeathCertificate[0]}</p>}
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-4">
                        <button onClick={onClose} className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600">Cancelar</button>
                        <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600">{modo === 'crear' ? 'Crear Paciente' : 'Guardar Cambios'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
