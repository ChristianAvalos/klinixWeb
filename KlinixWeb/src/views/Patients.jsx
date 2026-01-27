import clienteAxios from "../config/axios";
import { useEffect, useMemo, useState } from 'react';
import { toast } from "react-toastify";
import AlertaModal from "../components/AlertaModal";
import SearchBar from "../components/SearchBar";
import ModalPatient from './ModalPatient';
import {formatearMiles}from "../helpers/HelpersNumeros";

function isoADmy(iso) {
    if (!iso) return '';
    const cleaned = String(iso).trim();
    const isoDate = /^\d{4}-\d{2}-\d{2}/.test(cleaned) ? cleaned.slice(0, 10) : cleaned;
    const [yyyy, mm, dd] = String(isoDate).split('-');
    if (!yyyy || !mm || !dd) return '';
    return `${dd.padStart(2, '0')}/${mm.padStart(2, '0')}/${yyyy}`;
}

function normalizarFechaISO(valor) {
    if (!valor) return '';
    if (valor instanceof Date && !Number.isNaN(valor.getTime())) return valor.toISOString().slice(0, 10);
    const s = String(valor).trim();
    if (!s) return '';
    // "1990-01-01", "1990-01-01T00:00:00...", "1990-01-01 00:00:00.000"
    if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
    return '';
}

function calcularEdad(fechaNacimientoISO) {
    if (!fechaNacimientoISO) return '';
    const nacimiento = new Date(`${fechaNacimientoISO}T00:00:00`);
    if (Number.isNaN(nacimiento.getTime())) return '';
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad -= 1;
    return edad >= 0 ? String(edad) : '';
}


export default function Pacientes() {
    //grilla del paciente
    const [paciente, setPacientes,] = useState([]);
    const [pacienteSeleccionado, setpacienteSeleccionado] = useState(null);

    //Esta parte es de las alertas
    const [mostrarAlertaModal, setMostrarAlertaModal] = useState(false);
    const [tipoAlertaModal, setTipoAlertaModal] = useState('informativo');
    const [mensajeAlertaModal, setMensajeAlertaModal] = useState('');
    const [accionConfirmadaModal, setAccionConfirmadaModal] = useState(null);
    const [pacienteAEliminar, setpacienteAEliminar] = useState(null);


    //paginacion
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);

    //session total
    const [totalRegistros, setTotalRegistros] = useState(0);

    //buscador 
    const [searchTerm, setSearchTerm] = useState('');
    // Obtener el token de autenticación
    const token = localStorage.getItem('AUTH_TOKEN');

    //funcion para obtener los pacientes
    const fetchPacientes = async (page = 1, search = '') => {
        try {

            // Realizar la solicitud a la API
            // Solo pacientes
            const tipoPaciente = 2;
            const { data } = await clienteAxios.get(
                `api/pacientes?page=${page}&search=${encodeURIComponent(search)}&id_type_people=${tipoPaciente}`,
                {
                headers: {
                    Authorization: `Bearer ${token}` // Configurar el token en los headers
                }
                }
            );

            // Actualizar el estado con la lista de los pacientes
            setPacientes(data.data);
            setTotalPaginas(data.last_page);
            setTotalRegistros(data.total);
            setPaginaActual(data.current_page);

        } catch (error) {
            console.error('Error al obtener los pacientes:', error);
            throw error; // Lanza el error para manejarlo donde sea llamado
        }
    };

    //llamo con la pagina para obtener la lista 
    useEffect(() => {

        fetchPacientes(paginaActual);
    }, [paginaActual]);




    // Función para manejar el cambio de página
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPaginas) {
            setPaginaActual(newPage); // Actualizar la página actual
        }
    };

    //apertura del modal
    const [isModalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('crear');

    const pacientesRender = useMemo(() => {
        if (!Array.isArray(paciente)) return [];

        return paciente.map((p) => {
            const birthdayIso = normalizarFechaISO(p?.Birthday);
            const deathIso = normalizarFechaISO(p?.DeathDate);

            return {
                ...p,
                __birthdayDmy: isoADmy(birthdayIso),
                __deathDmy: isoADmy(deathIso),
                __age: calcularEdad(birthdayIso),
            };
        });
    }, [paciente]);

    const openModal = (modo, pacienteSeleccionado = {}) => {
        setModalMode(modo);
        setpacienteSeleccionado(pacienteSeleccionado);
        setModalOpen(true);
    };


    //cierre del modal
    const closeModal = () => {
        setModalOpen(false);
    };



    //para la eliminacion del paciente
    const handleDelete = async (id) => {

        setpacienteAEliminar(id);
        setTipoAlertaModal('confirmacion');
        setMensajeAlertaModal('¿Estás seguro de que deseas eliminar el paciente seleccionado?');
        setMostrarAlertaModal(true);
    };

    const confirmarEliminacion = async () => {
        try {
            const response = await clienteAxios.delete(`api/paciente/${pacienteAEliminar}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Configurar el token en los headers
                }
            });

            toast.success('Paciente eliminado correctamente.');
            fetchPacientes();
        } catch (error) {
            setTipoAlertaModal('informativo');
            setMensajeAlertaModal('Hubo un problema al eliminar el paciente.');
            setMostrarAlertaModal(true);
        } finally {
            setpacienteAEliminar(null);
        }
    }



    const handleClose = () => {
        setMostrarAlertaModal(false);
        setAccionConfirmadaModal(null);
    };

    const handleConfirm = () => {
        setMostrarAlertaModal(false);
        confirmarEliminacion();
    };


    const handleSearch = (term) => {
        setSearchTerm(term);
        // console.log("Buscando:", term); 
        fetchPacientes(1, term);
    };

    const handleAdd = () => {
        openModal('crear')
    };




    return (
        <div>
            <section className="content">
                <div className="container-fluid">
                    <div className="card shadow-sm">
                        <SearchBar
                            title="Pacientes"
                            placeholder="Buscar paciente..."
                            buttonLabel="Añadir paciente"
                            onSearch={handleSearch}
                            onAdd={handleAdd}
                        />



                        <div className="card-body">
                            <div className="overflow-auto max-h-[70vh] relative">
                                <table className="table table-bordered w-full bg-white">
                                    <thead className="[&>tr>th]:sticky [&>tr>th]:top-0 [&>tr>th]:z-30 [&>tr>th]:bg-gradient-to-br [&>tr>th]:from-blue-900 [&>tr>th]:to-cyan-900 [&>tr>th]:text-white [&>tr>th:last-child]:right-0 [&>tr>th:last-child]:z-40">
                                        <tr className="font-bold rounded text-center">
                                            <th>ID</th>
                                            <th>Codigo del paciente</th>
                                            <th>Apellido(s)</th>
                                            <th>Nombre(s)</th>
                                            <th>Titulo</th>
                                            <th>Documento N°</th>
                                            <th>Nacionalidad</th>
                                            <th>Fecha de Nacimiento</th>
                                            <th>Edad</th>
                                            <th>Sexo</th>
                                            <th>Dirección</th>
                                            <th>Barrio</th>
                                            <th>Ciudad</th>
                                            <th>Districto</th>
                                            <th>Departamento</th>
                                            <th>Telefono</th>
                                            <th>Celular</th>
                                            <th>Whatsapp</th>
                                            <th>Correo</th>
                                            <th>Grupo sanguineo</th>
                                            <th>Factor RH</th>
                                            <th>Estado civil</th>
                                            <th>Diagnóstico</th>
                                            <th>Seguro médico</th>
                                            <th>Fecha de fallecimiento</th>
                                            <th>Causa de fallecimiento</th>
                                            <th>Lugar de fallecimiento</th>
                                            <th>Certificado de defuncion N°</th>
                                            <th>Usuario</th>
                                            <th>Utilidades</th>
                                        </tr>
                                    </thead>
                                    <tbody className="[&>tr>td:last-child]:sticky [&>tr>td:last-child]:right-0 [&>tr>td:last-child]:z-20 [&>tr>td:last-child]:whitespace-nowrap [&>tr>td:last-child]:bg-inherit">
                                        {pacientesRender.length === 0 ? (
                                            <tr>
                                                <td colSpan={30} className="text-center text-gray-600 py-6">
                                                    No existen pacientes.
                                                </td>
                                            </tr>
                                        ) : (
                                            pacientesRender.map((p) => (
                                                <tr key={p.id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
                                                    <td>{p.id}</td>
                                                    <td>{p.PatientCode}</td>
                                                    <td>{p.LastName}</td>
                                                    <td>{p.FirstName}</td>
                                                    <td>{p.Title}</td>
                                                    <td>{formatearMiles(p.DocumentNo)}</td>
                                                    <td>{p.Nationality}</td>
                                                    <td>{p.__birthdayDmy}</td>
                                                    <td>{p.__age}</td>
                                                    <td>{p.sexes ? p.sexes.name : 'Sin sexo seleccionado'}</td>
                                                    <td>
                                                        <span className="block max-w-[220px] truncate" title={p.Address || ''}>
                                                            {p.Address}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="block max-w-[160px] truncate" title={p.Neighborhood || ''}>
                                                            {p.Neighborhood}
                                                        </span>
                                                    </td>
                                                    <td>{p.City_Id ? p.ciudad?.nombre : 'Sin ciudad seleccionada'}</td>
                                                    <td>
                                                        <span className="block max-w-[160px] truncate" title={p.District || ''}>
                                                            {p.District}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="block max-w-[180px] truncate" title={p.departamento?.nombre || ''}>
                                                            {p.departamento?.nombre ?? 'Sin departamento seleccionado'}
                                                        </span>
                                                    </td>
                                                    <td>{p.PhoneNumber}</td>
                                                    <td>{p.CellPhoneNumber}</td>
                                                    <td>{p.SupportWhatsapp === "1" ? "Sí" : "No"}</td>
                                                    <td>
                                                        <span className="block max-w-[220px] truncate" title={p.Email || ''}>
                                                            {p.Email}
                                                        </span>
                                                    </td>
                                                    <td>{p.BloodType}</td>
                                                    <td>{p.RhFactor}</td>
                                                    <td>
                                                        <span className="block max-w-[160px] truncate" title={p.marital_status?.name || ''}>
                                                            {p.marital_status?.name ?? 'Sin estado civil seleccionado'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="block max-w-[240px] truncate" title={p.MedicalDiagnosis || ''}>
                                                            {p.MedicalDiagnosis}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="block max-w-[240px] truncate" title={p.MedicalInsurance || ''}>
                                                            {p.MedicalInsurance}
                                                        </span>
                                                    </td>
                                                    <td>{p.__deathDmy}</td>
                                                    <td>
                                                        <span className="block max-w-[180px] truncate" title={p.DeathCause || ''}>
                                                            {p.DeathCause}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="block max-w-[220px] truncate" title={p.DeathPlace || ''}>
                                                            {p.DeathPlace}
                                                        </span>
                                                    </td>
                                                    <td>{p.DeathCertificateNumber}</td>
                                                    <td>
                                                        <span className="block max-w-[180px] truncate" title={p.UrevCalc || ''}>
                                                            {p.UrevCalc}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => openModal('editar', p)}
                                                                className="flex items-center rounded hover:bg-gray-200 focus:outline-none p-1"
                                                                type="button"
                                                            >
                                                                <img src="/img/Icon/edit.png" alt="Edit Paciente" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(p.id)}
                                                                className="flex items-center rounded hover:bg-gray-200 focus:outline-none p-1"
                                                                type="button"
                                                            >
                                                                <img src="/img/Icon/trash_bin-remove.png" alt="Delete Paciente" />
                                                            </button>
                                                        </div>
                                                    </td>

                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="">
                                <span className="text-lg font-semibold text-gray-700">Total de registros:</span>
                                <span className="text-lg font-bold text-gray-700">{totalRegistros}</span> {/* Aquí el total dinámico */}
                            </div>

                            {/* Controles de paginación */}
                            <div className="flex flex-col items-center sm:flex-row sm:justify-between py-4 space-y-2 sm:space-y-0">
                                {/* Botones para la primera y anterior página */}
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handlePageChange(1)}
                                        disabled={paginaActual === 1}
                                        className={`px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base text-white font-semibold rounded-lg ${paginaActual === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-br from-blue-900 to-cyan-900 hover:from-blue-800 hover:to-cyan-800'}`}
                                    >
                                        Primera
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(paginaActual - 1)}
                                        disabled={paginaActual === 1}
                                        className={`px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base text-white font-semibold rounded-lg ${paginaActual === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-br from-blue-900 to-cyan-900 hover:from-blue-800 hover:to-cyan-800'}`}
                                    >
                                        Anterior
                                    </button>
                                </div>

                                {/* Información de la página actual */}
                                <span className="text-sm sm:text-lg font-medium text-center">
                                    Página {paginaActual} de {totalPaginas}
                                </span>

                                {/* Botones para la siguiente y última página */}
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handlePageChange(paginaActual + 1)}
                                        disabled={paginaActual === totalPaginas}
                                        className={`px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base text-white font-semibold rounded-lg ${paginaActual === totalPaginas ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-br from-blue-900 to-cyan-900 hover:from-blue-800 hover:to-cyan-800'}`}
                                    >
                                        Siguiente
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(totalPaginas)}
                                        disabled={paginaActual === totalPaginas}
                                        className={`px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base text-white font-semibold rounded-lg ${paginaActual === totalPaginas ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-br from-blue-900 to-cyan-900 hover:from-blue-800 hover:to-cyan-800'}`}
                                    >
                                        Última
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>


            {/* Mostrar alerta solo si es necesario */}
            {mostrarAlertaModal && (
                <AlertaModal
                    tipo={tipoAlertaModal}
                    mensaje={mensajeAlertaModal}
                    onClose={handleClose}
                    onConfirm={handleConfirm}
                />
            )}

            {/* Renderizar el modal */}
            {isModalOpen && (
                <ModalPatient
                    refrescarPacientes={fetchPacientes}
                    paciente={pacienteSeleccionado}
                    modo={modalMode}
                    onClose={closeModal}
                />
            )}

        </div>
    )
}
