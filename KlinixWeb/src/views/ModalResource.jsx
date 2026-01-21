import { useEffect, useState,useRef } from 'react';
import clienteAxios from "../config/axios";
import { toast } from "react-toastify";

export default function ModalResource({ onClose, modo, resource = {}, refrescarResources }) {
    const labelClass = 'block text-sm font-medium text-slate-700 mb-1';
    const inputClass = (hasError = false) => (
        `w-full px-3 py-2 border ${hasError ? 'border-red-500' : 'border-slate-300'} rounded-lg shadow-sm ` +
        'bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400'
    );
    const extractHHMM = (value) => {
        if (!value) return '';
        const str = String(value);
        const match = str.match(/(\d{2}:\d{2})/);
        return match ? match[1] : '';
    };

    const intToHexColor = (value) => {
        if (value === null || value === undefined || value === '') return null;
        const n = Number(value);
        if (Number.isNaN(n)) return null;
        const unsigned = n >>> 0;
        const rgb = unsigned & 0xFFFFFF;
        return `#${rgb.toString(16).padStart(6, '0').toUpperCase()}`;
    };

    const hexToIntColor = (hex) => {
        if (!hex) return null;
        const normalized = String(hex).trim();
        const match = normalized.match(/^#?([0-9a-fA-F]{6})$/);
        if (!match) return null;
        return parseInt(match[1], 16); // guarda como 0x00RRGGBB (entero positivo)
    };

    const toBaseDateTime = (hhmm) => {
        if (!hhmm) return null;
        return `1899-12-30 ${hhmm}:00`;
    };

    const presetColors = [
        '#1D4ED8', // azul
        '#0EA5E9', // celeste
        '#10B981', // verde
        '#22C55E', // verde claro
        '#F59E0B', // ámbar
        '#EF4444', // rojo
        '#EC4899', // rosa
        '#A855F7', // violeta
        '#111827', // gris oscuro
        '#FFFFFF', // blanco
    ];

    const [nombreConsultorio, setNombreConsultorio] = useState(resource.ResourceName || '');
    const [numeroConsultorio, setNumeroConsultorio] = useState(resource.ResourceNumber || '');
    const [colorHex, setColorHex] = useState(intToHexColor(resource.ResourceColor) ?? '#0EA5E9');
    const [colorConsultorio, setColorConsultorio] = useState(resource.ResourceColor ?? hexToIntColor(intToHexColor(resource.ResourceColor) ?? '#0EA5E9'));
    const [visible, setVisible] = useState(resource.ResourceVisible === '1' || resource.ResourceVisible === 1 || resource.ResourceVisible === true);
    const [doctorSeleccionado, setDoctorSeleccionado] = useState(resource.Id_Doctor || '');
    const [doctors, setDoctors] = useState([]);
    const [consultorioInicio, setConsultorioInicio] = useState(extractHHMM(resource.ResourceWorkStart));
    const [consultorioFin, setConsultorioFin] = useState(extractHHMM(resource.ResourceWorkFinish));


    const nombreRef = useRef(null);

    const [errores, setErrores] = useState({});
    // Obtener el token de autenticación
    const token = localStorage.getItem('AUTH_TOKEN');

    // Cargar los doctores desde la API al cargar el componente
    useEffect(() => {
        const fetchDoctores = async () => {
            try {

                const { data } = await clienteAxios.get('api/doctores', {
                    headers: {
                        Authorization: `Bearer ${token}` // Configurar el token en los headers
                    }
                });
                const doctorsList = Array.isArray(data)
                    ? data
                    : (Array.isArray(data?.data) ? data.data : []);
                setDoctors(doctorsList);
            } catch (error) {
                console.error("Error al cargar los doctores", error);
                setDoctors([]);
            }
        };

        fetchDoctores();
    }, []);


    // Enfocar el campo de nombre al abrir el modal
    useEffect(() => {
        if (nombreRef.current) {
            nombreRef.current.focus();
        }
    }, []);


    // Actualizar el estado del formulario cuando cambie el consultorio
    useEffect(() => {
        if (modo === 'editar') {
            setNombreConsultorio(resource.ResourceName || '');
            setNumeroConsultorio(resource.ResourceNumber || '');
            const hex = intToHexColor(resource.ResourceColor) ?? '#0EA5E9';
            setColorHex(hex);
            setColorConsultorio(resource.ResourceColor ?? hexToIntColor(hex));
            setVisible(resource.ResourceVisible === '1' || resource.ResourceVisible === 1 || resource.ResourceVisible === true);
            setDoctorSeleccionado(resource.Id_Doctor || '');
            setConsultorioInicio(extractHHMM(resource.ResourceWorkStart));
            setConsultorioFin(extractHHMM(resource.ResourceWorkFinish));
        }
    }, [resource, modo]); // Dependencia en 'resource' y 'modo'

    // Función para manejar la creación o edición de los consultorios
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
        setErrores({}); // Resetear errores antes de la validación

        try {
            const userData = {
                ResourceName: nombreConsultorio,
                ResourceNumber: numeroConsultorio,
                ResourceColor: colorConsultorio,
                ResourceVisible: visible ? '1' : '0',
                Id_Doctor: doctorSeleccionado,
                ResourceWorkStart: toBaseDateTime(consultorioInicio),
                ResourceWorkFinish: toBaseDateTime(consultorioFin)
            };

            if (modo === 'crear') {
                // Crear un nuevo consultorio
                await clienteAxios.post('api/crearconsultorios', userData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                toast.success('Consultorio creado exitosamente.');
            } else {
                // Editar consultorio existente
                await clienteAxios.put(`api/editarconsultorios/${resource.id}`, userData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                toast.success('Consultorio actualizado exitosamente.');
            }

            // Refrescar la lista de consultorios
            if (refrescarResources !== null && typeof refrescarResources === 'function') {
                refrescarResources();// Refrescar la lista de consultorios
            }

            // Cerrar el modal después de guardar
            onClose();


        } catch (error) {
            if (error.response && error.response.status === 422) {
                // Si la respuesta es un error de validación, capturamos los errores
                setErrores(error.response.data.errors);

            } else {
                console.error('Error al guardar el consultorio', error);
                toast.error('Error al guardar el consultorio'); // Mostrar mensaje de error genérico
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
                <div className="flex items-start justify-between gap-4 px-6 pt-6 md:px-8 md:pt-8">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                            {modo === 'crear' ? 'Crear consultorio' : 'Editar consultorio'}
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
                    <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                        {/* nombre de consultorio */}
                        <div>
                            <label className={labelClass}>Nombre</label>
                            <input type="text" 
                            ref={nombreRef}
                            className={inputClass(!!errores.ResourceName)}
                            value={nombreConsultorio} 
                            onChange={(e) => setNombreConsultorio(e.target.value)} />
                            {errores.ResourceName && <p className="text-red-500 text-sm">{errores.ResourceName[0]}</p>}
                        </div>

                        {/* numero de consultorio */}
                        <div>
                            <label className={labelClass}>Numero</label>
                            <input type="text" 
                            className={inputClass(!!errores.ResourceNumber)}
                            value={numeroConsultorio} 
                            onChange={(e) => setNumeroConsultorio(e.target.value)} />
                            {errores.ResourceNumber && <p className="text-red-500 text-sm">{errores.ResourceNumber[0]}</p>}
                        </div>

                       

                       
                        
                        {/* doctor */}
                        <div>
                            <label className={labelClass}>Doctor</label>
                            <select 
                            className={inputClass(!!errores.Id_Doctor)} 
                            value={doctorSeleccionado} 
                            onChange={(e) => setDoctorSeleccionado(e.target.value)}>
                                <option value="">Seleccione un doctor</option>
                                {Array.isArray(doctors) && doctors.map((doctor) => (
                                    <option key={doctor.id} value={doctor.id}>
                                        {`${doctor.FirstName ?? ''} ${doctor.LastName ?? ''}`.trim()}
                                    </option>
                                ))}
                            </select>
                            {errores.Id_Doctor && <p className="text-red-500 text-sm">{errores.Id_Doctor[0]}</p>}
                        </div>

                        {/* inicio */}
                        <div>
                            <label className={labelClass}>Inicio</label>
                            <input type="time" step="60"
                            className={inputClass(!!errores.ResourceWorkStart)}
                            value={consultorioInicio} 
                            onChange={(e) => setConsultorioInicio(e.target.value)} />
                            {errores.ResourceWorkStart && <p className="text-red-500 text-sm">{errores.ResourceWorkStart[0]}</p>}
                        </div>

                        {/* fin */}
                        <div>
                            <label className={labelClass}>Fin</label>
                            <input type="time" step="60"
                            className={inputClass(!!errores.ResourceWorkFinish)}
                            value={consultorioFin} 
                            onChange={(e) => setConsultorioFin(e.target.value)} />
                            {errores.ResourceWorkFinish && <p className="text-red-500 text-sm">{errores.ResourceWorkFinish[0]}</p>}
                        </div>
                        
                        <div>
                            <label className={labelClass}>Visible</label>
                            <div className="flex h-10 items-center rounded-lg border border-slate-300 bg-white px-3">
                                <label htmlFor="visible" className="inline-flex items-center cursor-pointer select-none">
                                    <input
                                        id="visible"
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={!!visible}
                                        onChange={(e) => setVisible(e.target.checked)}
                                    />
                                    <div className="relative w-11 h-6 bg-gray-200 rounded-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-400 peer-checked:bg-gradient-to-br peer-checked:from-blue-900 peer-checked:to-cyan-900 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></div>
                                    <span className="ml-3 text-sm font-medium text-slate-700">
                                        {visible ? 'Sí' : 'No'}
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* color */}
                        <div className="md:col-span-2">
                            <label className={labelClass}>Color</label>
                            <div className="flex flex-col gap-3 md:flex-row md:items-center">
                                <input
                                    type="color"
                                    value={colorHex}
                                    onChange={(e) => {
                                        const hex = e.target.value.toUpperCase();
                                        setColorHex(hex);
                                        setColorConsultorio(hexToIntColor(hex));
                                    }}
                                    className={`h-11 w-20 p-1 border ${errores.ResourceColor ? 'border-red-500' : 'border-slate-300'} rounded-lg shadow-sm bg-white cursor-pointer`}
                                    title={colorHex}
                                />
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        readOnly
                                        value={colorHex}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-700"
                                    />
                                </div>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                                {presetColors.map((c) => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => {
                                            const hex = c.toUpperCase();
                                            setColorHex(hex);
                                            setColorConsultorio(hexToIntColor(hex));
                                        }}
                                        className={`h-8 w-8 rounded-full border border-black/10 shadow-sm hover:scale-105 transition ${colorHex.toUpperCase() === c.toUpperCase() ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-50' : 'ring-0'}`}
                                        style={{ backgroundColor: c }}
                                        title={c}
                                    />
                                ))}
                            </div>
                            {errores.ResourceColor && <p className="text-red-500 text-sm">{errores.ResourceColor[0]}</p>}
                        </div>
                        
                    </div>

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
                            {modo === 'crear' ? 'Crear consultorio' : 'Guardar cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
