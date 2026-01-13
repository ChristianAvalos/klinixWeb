import clienteAxios from "../config/axios";
import { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import AlertaModal from "../components/AlertaModal";
import SearchBar from "../components/SearchBar";
import ModalDoctor from './ModalDoctor';


export default function Doctores() {
    //grilla del doctor
    const [doctor, setDoctores,] = useState([]);
    const [doctorSeleccionado, setdoctorSeleccionado] = useState(null);

    //Esta parte es de las alertas
    const [mostrarAlertaModal, setMostrarAlertaModal] = useState(false);
    const [tipoAlertaModal, setTipoAlertaModal] = useState('informativo');
    const [mensajeAlertaModal, setMensajeAlertaModal] = useState('');
    const [accionConfirmadaModal, setAccionConfirmadaModal] = useState(null);
    const [doctorAEliminar, setdoctorAEliminar] = useState(null);


    //paginacion
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);

    //session total
    const [totalRegistros, setTotalRegistros] = useState(0);

    //buscador 
    const [searchTerm, setSearchTerm] = useState('');
    // Obtener el token de autenticación
    const token = localStorage.getItem('AUTH_TOKEN');

    //funcion para obtener los doctores
    const fetchDoctor = async (page = 1, search = '') => {
        try {

            // Realizar la solicitud a la API
            const { data } = await clienteAxios.get(`api/doctores?page=${page}&search=${search}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Configurar el token en los headers
                }
            });

            // Actualizar el estado con la lista de los doctores
            setDoctores(data.data);
            setTotalPaginas(data.last_page);
            setTotalRegistros(data.total);
            setPaginaActual(data.current_page);

        } catch (error) {
            console.error('Error al obtener los doctores:', error);
            throw error; // Lanza el error para manejarlo donde sea llamado
        }
    };

    //llamo con la pagina para obtener la lista 
    useEffect(() => {

        fetchDoctor(paginaActual);
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

    const openModal = (modo, doctorSeleccionado = {}) => {
        setModalMode(modo);
        setdoctorSeleccionado(doctorSeleccionado);
        setModalOpen(true);
    };


    //cierre del modal
    const closeModal = () => {
        setModalOpen(false);
    };



    //para la eliminacion del doctor
    const handleDelete = async (id) => {

        setdoctorAEliminar(id);
        setTipoAlertaModal('confirmacion');
        setMensajeAlertaModal('¿Estás seguro de que deseas eliminar el doctor seleccionado?');
        setMostrarAlertaModal(true);
    };

    const confirmarEliminacion = async () => {
        try {
            const response = await clienteAxios.delete(`api/doctores/${doctorAEliminar}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Configurar el token en los headers
                }
            });

            toast.success('Doctor eliminado correctamente.');
            fetchDoctor();
        } catch (error) {
            setTipoAlertaModal('informativo');
            setMensajeAlertaModal('Hubo un problema al eliminar el doctor.');
            setMostrarAlertaModal(true);
        } finally {
            setdoctorAEliminar(null);
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
        fetchDoctor(1, term);
    };

    const handleAdd = () => {
        openModal('crear')
    };




    return (
        <div>
            <section className="content">
                <div className="container-fluid">
                    <div className="card">
                        <SearchBar
                            title="Doctores"
                            placeholder="Buscar doctor..."
                            buttonLabel="Añadir doctor"
                            onSearch={handleSearch}
                            onAdd={handleAdd}
                        />



                        <div className="card-body">
                            <div className="overflow-x-auto">
                                <table className="table table-bordered table-striped w-full">
                                    <thead>
                                        <tr className="bg-gray-600 text-white text-center">
                                            <th>ID</th>
                                            <th>Apellido(s)</th>
                                            <th>Nombre(s)</th>
                                            <th>Dirección</th>
                                            <th>Ciudad</th>
                                            <th>Telefono</th>
                                            <th>Celular</th>
                                            <th>Whatsapp</th>
                                            <th>Correo</th>
                                            <th>Usuario</th>
                                            <th>Utilidades</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {doctor.map((doctor) => (
                                            <tr key={doctor.id}>
                                                <td>{doctor.id}</td>
                                                <td>{doctor.Lastname}</td>
                                                <td>{doctor.Firstname}</td>
                                                <td>{doctor.Address}</td>
                                                <td>{doctor.City_Id ? doctor.ciudad.nombre : 'Sin ciudad seleccionada'}</td>
                                                <td>{doctor.PhoneNumber}</td>
                                                <td>{doctor.CellPhoneNumber}</td>
                                                <td>{doctor.SupportWhatsapp  === "1" ? "Sí" : "No"}</td>
                                                <td>{doctor.Email}</td>
                                                <td>{doctor.UrevCalc}</td>
                                                <td>
                                                    <div className="flex space-x-2">
                                                        <button onClick={() => openModal('editar', doctor)} className="flex items-center focus:outline-none">
                                                            <img src="/img/edit.png" alt="Edit Doctor" />
                                                        </button>
                                                        <button onClick={() => handleDelete(doctor.id)} className="flex items-center focus:outline-none">
                                                            <img src="/img/Delete.png" alt="Delete Doctor" />
                                                        </button>
                                                    </div>
                                                </td>

                                            </tr>
                                        ))}
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
                                        className={`px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base text-white font-semibold rounded-lg ${paginaActual === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                                    >
                                        Primera
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(paginaActual - 1)}
                                        disabled={paginaActual === 1}
                                        className={`px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base text-white font-semibold rounded-lg ${paginaActual === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
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
                                        className={`px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base text-white font-semibold rounded-lg ${paginaActual === totalPaginas ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                                    >
                                        Siguiente
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(totalPaginas)}
                                        disabled={paginaActual === totalPaginas}
                                        className={`px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base text-white font-semibold rounded-lg ${paginaActual === totalPaginas ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                                    >
                                        Última
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
            {/* Renderizar el modal */}
            {/* {isModalOpen && (
                <ModalOrganizacion
                    organizacion={organizacionSeleccionado}
                    refrescarOrganizacion={fetchOrganizacion}
                    modo={modalMode}
                    onClose={closeModal}
                />
            )} */}

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
                <ModalDoctor
                    refrescarDoctores={fetchDoctor}
                    doctor={doctorSeleccionado}
                    modo={modalMode}
                    onClose={closeModal}
                />
            )}

        </div>
    )
}
