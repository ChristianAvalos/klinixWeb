import clienteAxios from "../config/axios";
import { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import AlertaModal from "../components/AlertaModal";
import SearchBar from "../components/SearchBar";
import ModalPatient from './ModalPatient';
import {formatearMiles}from "../helpers/HelpersNumeros";


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
            const tipoPaciente = 1;
            const { data } = await clienteAxios.get(
                `api/personas?page=${page}&search=${encodeURIComponent(search)}&id_type_people=${tipoPaciente}`,
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
            const response = await clienteAxios.delete(`api/persona/${pacienteAEliminar}`, {
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
                            <div className="overflow-x-auto">
                                <table className="table table-bordered table-striped w-full">
                                    <thead>
                                        <tr className="font-bold bg-gradient-to-br from-blue-900 to-cyan-900 text-white rounded text-center">
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
                                    <tbody>
                                        {paciente.length === 0 ? (
                                            <tr>
                                                <td colSpan={30} className="text-center text-gray-600 py-6">
                                                    No existen pacientes.
                                                </td>
                                            </tr>
                                        ) : (
                                            paciente.map((paciente) => (
                                                <tr key={paciente.id}>
                                                    <td>{paciente.id}</td>
                                                    <td>{paciente.PatientCode}</td>
                                                    <td>{paciente.LastName}</td>
                                                    <td>{paciente.FirstName}</td>
                                                    <td>{paciente.Title}</td>
                                                    <td>{formatearMiles(paciente.DocumentNo)}</td>
                                                    <td>{paciente.Nationality}</td>
                                                    <td>{paciente.Birthday ? new Date(paciente.Birthday).toISOString().split('T')[0] : ''}</td>
                                                    <td>
                                                        {paciente.Birthday
                                                            ? (() => {
                                                                const birthDate = new Date(paciente.Birthday);
                                                                if (isNaN(birthDate)) return ""; // Manejo de fechas inválidas

                                                                const today = new Date();
                                                                let age = today.getFullYear() - birthDate.getFullYear();
                                                                const monthDiff = today.getMonth() - birthDate.getMonth();
                                                                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                                                                    age--;
                                                                }
                                                                return age;
                                                            })()
                                                            : "" /*retorno vacio si no hay fecha de nacimiento*/}
                                                    </td>
                                                    <td>{paciente.sexes ? paciente.sexes.name : 'Sin sexo seleccionado'}</td>
                                                    <td>{paciente.Address}</td>
                                                    <td>{paciente.Neighborhood}</td>
                                                    <td>{paciente.City_Id ? paciente.ciudad.nombre : 'Sin ciudad seleccionada'}</td>
                                                    <td>{paciente.District}</td>
                                                    <td>{paciente.Department}</td>
                                                    <td>{paciente.PhoneNumber}</td>
                                                    <td>{paciente.CellPhoneNumber}</td>
                                                    <td>{paciente.SupportWhatsapp === "1" ? "Sí" : "No"}</td>
                                                    <td>{paciente.Email}</td>
                                                    <td>{paciente.BloodType}</td>
                                                    <td>{paciente.RHFactor}</td>
                                                    <td>{paciente.MaritalStatus}</td>
                                                    <td>{paciente.MedicalDiagnosis}</td>
                                                    <td>{paciente.MedicalInsurance}</td>
                                                    <td>{paciente.DeathDate ? new Date(paciente.DeathDate).toISOString().split('T')[0] : ''}</td>
                                                    <td>{paciente.DeathCause}</td>
                                                    <td>{paciente.DeathPlace}</td>
                                                    <td>{paciente.DeathCertificateNumber}</td>
                                                    <td>{paciente.UrevCalc}</td>
                                                    <td>
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => openModal('editar', paciente)}
                                                                className="flex items-center rounded hover:bg-gray-200 focus:outline-none p-1"
                                                                type="button"
                                                            >
                                                                <img src="/img/Icon/edit.png" alt="Edit Paciente" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(paciente.id)}
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
