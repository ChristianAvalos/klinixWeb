import { useEffect, useRef, useState } from 'react';
import clienteAxios from "../config/axios";
import { toast } from "react-toastify";
import {formatearMiles}from "../helpers/HelpersNumeros";

function isoADmy(iso) {
    if (!iso) return '';
    const cleaned = String(iso).trim();
    const isoDate = /^\d{4}-\d{2}-\d{2}/.test(cleaned) ? cleaned.slice(0, 10) : cleaned;
    const [yyyy, mm, dd] = String(isoDate).split('-');
    if (!yyyy || !mm || !dd) return '';
    return `${dd.padStart(2, '0')}/${mm.padStart(2, '0')}/${yyyy}`;
}

function dmyAIso(dmy) {
    if (!dmy) return '';
    const match = String(dmy).match(/^\s*(\d{2})\/(\d{2})\/(\d{4})\s*$/);
    if (!match) return '';
    const dd = Number(match[1]);
    const mm = Number(match[2]);
    const yyyy = Number(match[3]);
    if (yyyy < 1900 || yyyy > 2100) return '';
    if (mm < 1 || mm > 12) return '';
    if (dd < 1 || dd > 31) return '';

    const iso = `${String(yyyy).padStart(4, '0')}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`;
    const dt = new Date(`${iso}T00:00:00`);
    if (Number.isNaN(dt.getTime())) return '';
    // Evita fechas inválidas tipo 31/02/2024
    if (dt.getFullYear() !== yyyy || dt.getMonth() + 1 !== mm || dt.getDate() !== dd) return '';
    return iso;
}

function enmascararDmy(raw) {
    const digits = String(raw).replace(/\D/g, '').slice(0, 8);
    const dd = digits.slice(0, 2);
    const mm = digits.slice(2, 4);
    const yyyy = digits.slice(4, 8);
    let out = dd;
    if (mm) out += `/${mm}`;
    if (yyyy) out += `/${yyyy}`;
    return out;
}

function normalizarFechaISO(valor) {
    if (!valor) return '';

    if (valor instanceof Date && !Number.isNaN(valor.getTime())) {
        return valor.toISOString().slice(0, 10);
    }

    const s = String(valor).trim();
    if (!s) return '';

    // "1990-01-01", "1990-01-01T00:00:00...", "1990-01-01 00:00:00.000"
    if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);

    // "01/01/1990"
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) return dmyAIso(s);

    return '';
}

function calcularEdad(fechaNacimientoISO) {
    if (!fechaNacimientoISO) return '';

    const nacimiento = new Date(`${fechaNacimientoISO}T00:00:00`);
    if (Number.isNaN(nacimiento.getTime())) return '';

    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad -= 1;
    }
    return edad >= 0 ? String(edad) : '';
}

export default function ModalVisit({ onClose, modo, visita = {}, refrescarVisitas }) {
    const birthdayIsoInicial = normalizarFechaISO(visita.Birthday);
    const deathIsoInicial = normalizarFechaISO(visita.DeathDate);

    const [codigoVisita, setCodigoVisita] = useState(visita.PatientCode || '');
    const [nombre, setNombre] = useState(visita.FirstName || '');
    const [apellido, setApellido] = useState(visita.LastName || '');
    const [titulo, setTitulo] = useState(visita.Title || '');
    const [numeroDocumento, setNumeroDocumento] = useState(visita.DocumentNo || '');
    const [nacionalidad, setNacionalidad] = useState(visita.Nationality || '');

    const [fechaNacimiento, setFechaNacimiento] = useState(birthdayIsoInicial);
    const [fechaNacimientoInput, setFechaNacimientoInput] = useState(isoADmy(birthdayIsoInicial));

    const [sexos, setSexos] = useState([]);
    const [sexoSeleccionado, setSexoSeleccionado] = useState(visita.Id_Sex || '');

    const [direccion, setDireccion] = useState(visita.Address || '');
    const [barrio, setBarrio] = useState(visita.Neighborhood || '');
    const [ciudadSeleccionado, setCiudadSeleccionado] = useState(visita.City_Id || '');
    const [ciudades, setCiudades] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState('');
    const [distrito, setDistrito] = useState(visita.District || '');
    const [departamento, setDepartamento] = useState(visita.Department || '');

    const [telefono, setTelefono] = useState(visita.PhoneNumber || '');
    const [celular, setCelular] = useState(visita.CellPhoneNumber || '');
    const [soportaWhatsapp, setSoportaWhatsapp] = useState(visita.SupportWhatsapp === "1");
    const [correo, setCorreo] = useState(visita.Email || '');
    const [notas, setNotas] = useState(visita.Notes || '');
    const [factorRH, setFactorRH] = useState(visita.RhFactor || '');
    const [alergias, setAlergias] = useState(visita.Allergies || '');

    const [tipoSangre, setTipoSangre] = useState(visita.BloodType || '');

    const [estadoCiviles, setEstadoCiviles] = useState([]);
    const [estadoCivilSeleccionado, setEstadoCivilSeleccionado] = useState(visita.Id_Marital_Status || '');

    const [diagnosticoMedico, setDiagnosticoMedico] = useState(visita.MedicalDiagnosis || '');
    const [seguroMedico, setSeguroMedico] = useState(visita.MedicalInsurance || '');

    const [fechaFallecimiento, setFechaFallecimiento] = useState(deathIsoInicial);
    const [fechaFallecimientoInput, setFechaFallecimientoInput] = useState(isoADmy(deathIsoInicial));
    const [causaFallecimiento, setCausaFallecimiento] = useState(visita.DeathCause || '');
    const [lugarFallecimiento, setLugarFallecimiento] = useState(visita.DeathPlace || '');
    const [numeroCertificadoDefuncion, setNumeroCertificadoDefuncion] = useState(visita.DeathCertificateNumber || '');

    const [edad, setEdad] = useState(visita.Age || '');

    const [errores, setErrores] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fechaNacimientoRef = useRef(null);
    const fechaFallecimientoRef = useRef(null);

    const abrirSelectorFechaNacimiento = () => {
        const el = fechaNacimientoRef.current;
        if (!el) return;
        if (typeof el.showPicker === 'function') {
            el.showPicker();
            return;
        }
        el.focus();
        el.click();
    };

    const abrirSelectorFechaFallecimiento = () => {
        const el = fechaFallecimientoRef.current;
        if (!el) return;
        if (typeof el.showPicker === 'function') {
            el.showPicker();
            return;
        }
        el.focus();
        el.click();
    };

    // Obtener el token de autenticación
    const token = localStorage.getItem('AUTH_TOKEN');

    // Optimización: las ciudades vienen dentro de /departamentos (with('ciudades'))

    // Cargar las departamentos desde la API al cargar el componente
    useEffect(() => {
        const fetchDepartamentos = async () => {
            try {

                const { data } = await clienteAxios.get('api/departamentos', {
                    headers: {
                        Authorization: `Bearer ${token}` // Configurar el token en los headers
                    }
                });
                setDepartamentos(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error al cargar los departamentos", error);
                setDepartamentos([]);
            }
        };

        fetchDepartamentos();
    }, []);

    // Cuando cambia el departamento, filtrar ciudades y sincronizar el nombre del departamento.
    useEffect(() => {
        if (!departamentoSeleccionado) {
            setCiudades([]);
            return;
        }

        const dep = departamentos.find((d) => String(d.id) === String(departamentoSeleccionado));
        const ciudadesDep = Array.isArray(dep?.ciudades) ? dep.ciudades : [];
        setCiudades(ciudadesDep);

        if (dep?.nombre) setDepartamento(dep.nombre);

        if (ciudadSeleccionado && !ciudadesDep.some((c) => String(c.id) === String(ciudadSeleccionado))) {
            setCiudadSeleccionado('');
        }
    }, [departamentoSeleccionado, departamentos]);

    // En edición: intentar seleccionar el departamento correcto usando Department (nombre) o City_Id.
    useEffect(() => {
        if (!Array.isArray(departamentos) || departamentos.length === 0) return;
        if (departamentoSeleccionado) return;

        // 1) Por nombre (People.Department)
        if (visita?.Department) {
            const depByName = departamentos.find((d) => String(d?.nombre).toLowerCase() === String(visita.Department).toLowerCase());
            if (depByName?.id) {
                setDepartamentoSeleccionado(String(depByName.id));
                return;
            }
        }

        // 2) Por ciudad (People.City_Id)
        if (visita?.City_Id) {
            const depByCity = departamentos.find((d) => Array.isArray(d?.ciudades) && d.ciudades.some((c) => String(c.id) === String(visita.City_Id)));
            if (depByCity?.id) {
                setDepartamentoSeleccionado(String(depByCity.id));
            }
        }
    }, [departamentos, visita, departamentoSeleccionado]);


     // Cargar los estados de civiles
    useEffect(() => {
        const fetchEstadosCiviles = async () => {
            try {

                const { data } = await clienteAxios.get('api/estadocivil', {
                    headers: {
                        Authorization: `Bearer ${token}` // Configurar el token en los headers
                    }
                });
                setEstadoCiviles(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error al cargar los estados civiles", error);
                setEstadoCiviles([]);
            }
        };

        fetchEstadosCiviles();
    }, []);


    // Cargar los sexos
    useEffect(() => {
        const fetchSexos = async () => {
            try {

                const { data } = await clienteAxios.get('api/sexos', {
                    headers: {
                        Authorization: `Bearer ${token}` // Configurar el token en los headers
                    }
                });
                setSexos(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error al cargar los sexos", error);
                setSexos([]);
            }
        };

        fetchSexos();
    }, []);


    // Edad referencial: recalcular cuando cambie la fecha de nacimiento
    useEffect(() => {
        setEdad(calcularEdad(fechaNacimiento));
    }, [fechaNacimiento]);

    // Mantener sincronizado el input dd/mm/aaaa cuando cambie la fecha ISO
    useEffect(() => {
        setFechaNacimientoInput(isoADmy(fechaNacimiento));
    }, [fechaNacimiento]);

    // Mantener sincronizado el input dd/mm/aaaa cuando cambie la fecha de muerte ISO
    useEffect(() => {
        setFechaFallecimientoInput(isoADmy(fechaFallecimiento));
    }, [fechaFallecimiento]);


    // Actualizar el estado del formulario cuando cambie las visitas
    useEffect(() => {
        if (modo === 'editar') {
            const birthdayIso = normalizarFechaISO(visita.Birthday);
            const deathIso = normalizarFechaISO(visita.DeathDate);
            setCodigoVisita(visita.PatientCode || '');
            setNombre(visita.FirstName || '');
            setApellido(visita.LastName || '');
            setTitulo(visita.Title || '');
            setNumeroDocumento(visita.DocumentNo || '');
            setNacionalidad(visita.Nationality || '');
            setFechaNacimiento(birthdayIso);
            setFechaNacimientoInput(isoADmy(birthdayIso));
            setSexoSeleccionado(visita.Id_Sex || '');
            setDireccion(visita.Address || '');
            setBarrio(visita.Neighborhood || '');
            setCiudadSeleccionado(visita.City_Id || '');
            // Si el backend guarda Department (texto), lo usamos; si no, el efecto de arriba intentará inferirlo.
            setDistrito(visita.District || '');
            setDepartamento(visita.Department || '');
            setTelefono(visita.PhoneNumber || '');
            setCelular(visita.CellPhoneNumber || '');
            setSoportaWhatsapp(visita.SupportWhatsapp === "1");
            setCorreo(visita.Email || '');
            setTipoSangre(visita.BloodType || '');
            setFactorRH(visita.RhFactor || '');
            setEstadoCivilSeleccionado(visita.Id_Marital_Status || '');
            setDiagnosticoMedico(visita.MedicalDiagnosis || '');
            setSeguroMedico(visita.MedicalInsurance || '');
            setFechaFallecimiento(deathIso);
            setFechaFallecimientoInput(isoADmy(deathIso));
            setCausaFallecimiento(visita.DeathCause || '');
            setLugarFallecimiento(visita.DeathPlace || '');
            setNumeroCertificadoDefuncion(visita.DeathCertificateNumber || '');
            setEdad(calcularEdad(birthdayIso));
            setNotas(visita.Notes || '');
            setAlergias(visita.Allergies || '');
        }

    }, [visita, modo]); // Dependencia en 'visita' y 'modo'

    // Función para manejar la creación o edición de las visitas
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
        if (isSubmitting) return; // Evita doble click / doble submit

        setErrores({}); // Resetear errores antes de la validación
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('Id_Type_People', '2');
        formData.append('PatientCode', codigoVisita || '');
        formData.append('FirstName', nombre || '');
        formData.append('LastName', apellido || '');
        formData.append('Title', titulo || '');
        formData.append('DocumentNo', numeroDocumento || '');
        formData.append('Nationality', nacionalidad || '');
        formData.append('Birthday', fechaNacimiento || '');
        formData.append('Id_Sex', sexoSeleccionado || '');
        formData.append('Address', direccion || '');
        formData.append('Neighborhood', barrio || '');
        formData.append('City_Id', ciudadSeleccionado || '');
        formData.append('District', distrito || '');

        // Obligatorio para backend
        formData.append('Department_Id', departamentoSeleccionado || '');

        formData.append('PhoneNumber', telefono || '');
        formData.append('CellPhoneNumber', celular || '');
        formData.append('SupportWhatsapp', soportaWhatsapp ? '1' : '0');
        formData.append('Email', correo || '');
        formData.append('BloodType', tipoSangre || '');
        formData.append('RHFactor', factorRH || '');
        formData.append('MaritalStatus_Id', estadoCivilSeleccionado || '');
        formData.append('MedicalDiagnosis', diagnosticoMedico || '');
        formData.append('MedicalInsurance', seguroMedico || '');
        formData.append('DeathDate', fechaFallecimiento || '');
        formData.append('DeathCause', causaFallecimiento || '');
        formData.append('DeathPlace', lugarFallecimiento || '');
        formData.append('DeathCertificateNumber', numeroCertificadoDefuncion || '');
        formData.append('Notes', notas || '');
        formData.append('Allergies', alergias || '');

        try {


            if (modo === 'crear') {
                // Crear un nueva visita
                await clienteAxios.post('api/crearvisitas', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                toast.success('Visita creada exitosamente.');
            } else {
                // Editar visita existente
                await clienteAxios.post(`api/editarvisitas/${visita.id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'X-HTTP-Method-Override': 'PUT'
                    }
                });
                toast.success('Visita actualizada exitosamente.');
            }

            // Refrescar la lista de visita
            if (refrescarVisitas !== null && typeof refrescarVisitas === 'function') {
                refrescarVisitas();// Refrescar la lista de visitas
            }

            // Cerrar el modal después de guardar
            onClose();


        } catch (error) {
            if (error.response && error.response.status === 422) {
                // Si la respuesta es un error de validación, capturamos los errores
                setErrores(error.response.data.errors);

            } else {
                console.error('Error al guardar la visita', error);
                toast.error('Error al guardar la visita'); // Mostrar mensaje de error genérico
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative z-10 w-full max-w-6xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
                <div className="flex items-start justify-between gap-4 px-6 pt-6 md:px-8 md:pt-8">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                            {modo === 'crear' ? 'Crear visita' : 'Editar visita'}
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
                    <fieldset disabled={isSubmitting} className="contents">
                    <div className="mt-6 grid grid-cols-3 gap-4">
                        {/* Documento */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Documento Nº</label>
                            <input type="text"
                                className={`w-full px-3 py-2 border ${errores.DocumentNo ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                value={formatearMiles(numeroDocumento)}
                                onChange={(e) => setNumeroDocumento(e.target.value)} />
                            {errores.DocumentNo && <p className="text-red-500 text-sm">{errores.DocumentNo[0]}</p>}
                        </div>

                        {/* Código visita */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Código Visita</label>
                            <input type="text"
                                className={`w-full px-3 py-2 border ${errores.PatientCode ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                value={codigoVisita}
                                onChange={(e) => setCodigoVisita(e.target.value)} />
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

                         {/* Estado civil */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Estado Civil</label>
                            <select
                                className={`w-full px-3 py-2 border ${errores.MaritalStatus_Id ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                value={estadoCivilSeleccionado}
                                onChange={(e) => setEstadoCivilSeleccionado(e.target.value)}>
                                <option value="">Seleccione un estado</option>
                                {estadoCiviles.map((estadoCivil) => (
                                    <option key={estadoCivil.id} value={estadoCivil.id}>{estadoCivil.name}</option>
                                ))}
                            </select>
                            {errores.MaritalStatus_Id && <p className="text-red-500 text-sm">{errores.MaritalStatus_Id[0]}</p>}
                        </div>



                         {/* Sexo */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
                            <select
                                className={`w-full px-3 py-2 border ${errores.Id_Sex ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                value={sexoSeleccionado}
                                onChange={(e) => setSexoSeleccionado(e.target.value)}>
                                <option value="">Seleccione el sexo</option>
                                {sexos.map((sexo) => (
                                    <option key={sexo.id} value={sexo.id}>{sexo.name}</option>
                                ))}
                            </select>
                            {errores.Id_Sex && <p className="text-red-500 text-sm">{errores.Id_Sex[0]}</p>}
                        </div>

                         {/* Fecha de nacimiento */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    className={`w-full pr-10 px-3 py-2 border ${errores.Birthday ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    placeholder="dd/mm/aaaa"
                                    inputMode="numeric"
                                    value={fechaNacimientoInput}
                                    onChange={(e) => {
                                        const masked = enmascararDmy(e.target.value);
                                        setFechaNacimientoInput(masked);

                                        if (!masked) {
                                            setFechaNacimiento('');
                                            return;
                                        }

                                        const iso = dmyAIso(masked);
                                        if (iso) setFechaNacimiento(iso);
                                    }}
                                />

                                <button
                                    type="button"
                                    onClick={abrirSelectorFechaNacimiento}
                                    className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-600 hover:text-gray-900"
                                    aria-label="Abrir calendario">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                                        <path d="M7.5 2.25a.75.75 0 0 1 .75.75V4.5h7.5V3a.75.75 0 0 1 1.5 0v1.5h.75A2.25 2.25 0 0 1 20.25 6.75v13.5A2.25 2.25 0 0 1 18 22.5H6A2.25 2.25 0 0 1 3.75 20.25V6.75A2.25 2.25 0 0 1 6 4.5h.75V3a.75.75 0 0 1 .75-.75Zm10.5 6H6a.75.75 0 0 0-.75.75v11.25c0 .414.336.75.75.75h12c.414 0 .75-.336.75-.75V9a.75.75 0 0 0-.75-.75Z" />
                                    </svg>
                                </button>

                                <input
                                    ref={fechaNacimientoRef}
                                    type="date"
                                    value={fechaNacimiento}
                                    onChange={(e) => setFechaNacimiento(e.target.value)}
                                    className="absolute left-0 top-0 h-0 w-0 opacity-0"
                                    tabIndex={-1}
                                    aria-hidden="true"
                                />
                            </div>
                            {errores.Birthday && <p className="text-red-500 text-sm">{errores.Birthday[0]}</p>}
                        </div>

                        {/* Edad */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Edad</label>
                            <input type="text"
                                className={`w-full text-center px-3 py-2 border ${errores.Age ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 `}
                                value={edad}
                                readOnly />
                            {errores.Age && <p className="text-red-500 text-sm">{errores.Age[0]}</p>}
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

                        
                        {/* Dirección */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                            <input type="text"
                                className={`w-full px-3 py-2 border ${errores.Address ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                value={direccion}
                                onChange={(e) => setDireccion(e.target.value)} />
                            {errores.Address && <p className="text-red-500 text-sm">{errores.Address[0]}</p>}
                        </div>


                        {/* Departamento */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                            <select
                                className={`w-full px-3 py-2 border ${errores.Department_Id ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                value={departamentoSeleccionado}
                                onChange={(e) => {
                                    const nextId = e.target.value;
                                    setDepartamentoSeleccionado(nextId);
                                    setCiudadSeleccionado('');
                                }}>
                                <option value="">Seleccione un departamento</option>
                                {departamentos.map((departamento) => (
                                    <option key={departamento.id} value={departamento.id}>{departamento.nombre}</option>
                                ))}
                            </select>
                            {errores.Department_Id && <p className="text-red-500 text-sm">{errores.Department_Id[0]}</p>}
                        </div>

                        {/* Ciudad */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                            <select
                                className={`w-full px-3 py-2 border ${errores.City_Id ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                value={ciudadSeleccionado}
                                onChange={(e) => setCiudadSeleccionado(e.target.value)}>
                                <option value="">{departamentoSeleccionado ? 'Seleccione una ciudad' : 'Seleccione un departamento primero'}</option>
                                {ciudades.map((ciudad) => (
                                    <option key={ciudad.id} value={ciudad.id}>{ciudad.nombre}</option>
                                ))}
                            </select>
                            {errores.City_Id && <p className="text-red-500 text-sm">{errores.City_Id[0]}</p>}
                        </div>

                        {/* Barrio */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Barrio</label>
                            <input type="text"
                                className={`w-full px-3 py-2 border ${errores.Neighborhood ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                value={barrio}
                                onChange={(e) => setBarrio(e.target.value)} />
                            {errores.Neighborhood && <p className="text-red-500 text-sm">{errores.Neighborhood[0]}</p>}
                        </div>

                        {/* Distrito */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Distrito</label>
                            <input type="text"
                                className={`w-full px-3 py-2 border ${errores.District ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                value={distrito}
                                onChange={(e) => setDistrito(e.target.value)} />
                            {errores.District && <p className="text-red-500 text-sm">{errores.District[0]}</p>}
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


                        {/* Notas */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                            <input type="text"
                                className={`w-full px-3 py-2 border ${errores.Notes ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                value={notas}
                                onChange={(e) => setNotas(e.target.value)} />
                            {errores.Notes && <p className="text-red-500 text-sm">{errores.Notes[0]}</p>}
                        </div>

                        
                        {/* Grupo sanguineo */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Sangre</label>
                            <input type="text"
                                className={`w-full px-3 py-2 border ${errores.BloodType ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                value={tipoSangre}
                                onChange={(e) => setTipoSangre(e.target.value)} />
                            {errores.BloodType && <p className="text-red-500 text-sm">{errores.BloodType[0]}</p>}
                        </div>


                        {/* Factor RH */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Factor RH</label>
                            <input type="text"
                                className={`w-full px-3 py-2 border ${errores.RHFactor ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                value={factorRH}
                                onChange={(e) => setFactorRH(e.target.value)} />
                            {errores.RHFactor && <p className="text-red-500 text-sm">{errores.RHFactor[0]}</p>}
                        </div>
                        
                        {/* Diagnóstico Médico */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Diagnóstico Médico</label>
                            <input type='text'
                                className={`w-full h-10 px-3 py-2 border ${errores.MedicalDiagnosis ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                value={diagnosticoMedico}
                                onChange={(e) => setDiagnosticoMedico(e.target.value)} />
                            {errores.MedicalDiagnosis && <p className="text-red-500 text-sm">{errores.MedicalDiagnosis[0]}</p>}
                        </div>


                        {/*Seguro Médico*/}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Seguro Médico</label>
                            <input type='text'
                                className={`w-full h-10 px-3 py-2 border ${errores.MedicalInsurance ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                value={seguroMedico}
                                onChange={(e) => setSeguroMedico(e.target.value)} />
                            {errores.MedicalInsurance && <p className="text-red-500 text-sm">{errores.MedicalInsurance[0]}</p>}
                        </div>

                        {/*Alergias*/}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Alergias</label>
                            <input type='text'
                                className={`w-full h-10 px-3 py-2 border ${errores.Allergies ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                value={alergias}
                                onChange={(e) => setAlergias(e.target.value)} />
                            {errores.Allergies && <p className="text-red-500 text-sm">{errores.Allergies[0]}</p>}
                        </div>

                        {/* Fecha de Muerte */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Muerte</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    className={`w-full pr-10 px-3 py-2 border ${errores.DeathDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    placeholder="dd/mm/aaaa"
                                    inputMode="numeric"
                                    value={fechaFallecimientoInput}
                                    onChange={(e) => {
                                        const masked = enmascararDmy(e.target.value);
                                        setFechaFallecimientoInput(masked);

                                        if (!masked) {
                                            setFechaFallecimiento('');
                                            return;
                                        }

                                        const iso = dmyAIso(masked);
                                        if (iso) setFechaFallecimiento(iso);
                                    }}
                                />

                                <button
                                    type="button"
                                    onClick={abrirSelectorFechaFallecimiento}
                                    className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-600 hover:text-gray-900"
                                    aria-label="Abrir calendario">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                                        <path d="M7.5 2.25a.75.75 0 0 1 .75.75V4.5h7.5V3a.75.75 0 0 1 1.5 0v1.5h.75A2.25 2.25 0 0 1 20.25 6.75v13.5A2.25 2.25 0 0 1 18 22.5H6A2.25 2.25 0 0 1 3.75 20.25V6.75A2.25 2.25 0 0 1 6 4.5h.75V3a.75.75 0 0 1 .75-.75Zm10.5 6H6a.75.75 0 0 0-.75.75v11.25c0 .414.336.75.75.75h12c.414 0 .75-.336.75-.75V9a.75.75 0 0 0-.75-.75Z" />
                                    </svg>
                                </button>

                                <input
                                    ref={fechaFallecimientoRef}
                                    type="date"
                                    value={fechaFallecimiento}
                                    onChange={(e) => setFechaFallecimiento(e.target.value)}
                                    className="absolute left-0 top-0 h-0 w-0 opacity-0"
                                    tabIndex={-1}
                                    aria-hidden="true"
                                />
                            </div>
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

                        {/*Lugar de fallecimiento*/}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Lugar de fallecimiento</label>
                            <input type='text'
                                className={`w-full h-10 px-3 py-2 border ${errores.PlaceOfDeath ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                value={lugarFallecimiento}
                                onChange={(e) => setLugarFallecimiento(e.target.value)} />
                            {errores.PlaceOfDeath && <p className="text-red-500 text-sm">{errores.PlaceOfDeath[0]}</p>}
                        </div>
                    </div>
                    <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className={`inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-500 px-4 py-2 font-medium text-white focus:outline-none focus:ring-2 focus:ring-red-200 ${isSubmitting ? 'opacity-60 cursor-not-allowed' : 'hover:bg-red-600'}`}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className={`inline-flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-900 px-4 py-2 font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 ${isSubmitting ? 'opacity-60 cursor-not-allowed' : 'hover:from-blue-800 hover:to-cyan-800'}`}
                        >
                            {isSubmitting ? 'Guardando...' : (modo === 'crear' ? 'Crear visita' : 'Guardar Cambios')}
                        </button>
                    </div>
                    </fieldset>
                </form>
            </div>
        </div>
    );
}
