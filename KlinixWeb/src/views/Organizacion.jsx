import clienteAxios from "../config/axios";
import { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import AlertaModal from "../components/AlertaModal";
import ModalOrganizacion from "./ModalOrganizacion";
import SearchBar from "../components/SearchBar";


export default function Organizacion() {
    //grilla de organizacion
    const [organizacion, setOrganizacion,] = useState([]);
    const [organizacionSeleccionado, setorganizacionSeleccionado] = useState(null);

    //Esta parte es de las alertas
    const [mostrarAlertaModal, setMostrarAlertaModal] = useState(false);
    const [tipoAlertaModal, setTipoAlertaModal] = useState('informativo');
    const [mensajeAlertaModal, setMensajeAlertaModal] = useState('');
    const [accionConfirmadaModal, setAccionConfirmadaModal] = useState(null);
    const [organizacionAEliminar, setOrganizacionAEliminar] = useState(null);


    //paginacion
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);

    //session total
    const [totalRegistros, setTotalRegistros] = useState(0);

    //buscador 
    const [searchTerm, setSearchTerm] = useState('');
    // Obtener el token de autenticación
    const token = localStorage.getItem('AUTH_TOKEN');

    //funcion para obtener las organizaciones
    const fetchOrganizacion = async (page = 1, search = '') => {
        try {

            // Realizar la solicitud a la API
            const { data } = await clienteAxios.get(`api/organizacion?page=${page}&search=${search}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Configurar el token en los headers
                }
            });

            // Actualizar el estado con los usuarios obtenidos
            setOrganizacion(data.data);
            setTotalPaginas(data.last_page);
            setTotalRegistros(data.total);
            setPaginaActual(data.current_page);

        } catch (error) {
            console.error('Error al obtener las organizaciones:', error);
            throw error; // Lanza el error para manejarlo donde sea llamado
        }
    };

    //llamo con la pagina para obtener la lista 
    useEffect(() => {

        fetchOrganizacion(paginaActual);
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

    const openModal = (modo, organizacionSeleccionado = {}) => {
        setModalMode(modo);
        setorganizacionSeleccionado(organizacionSeleccionado);
        setModalOpen(true);
    };


    //cierre del modal
    const closeModal = () => {
        setModalOpen(false);
    };



    //para la eliminacion de organizacion
    const handleDelete = async (id) => {

        setOrganizacionAEliminar(id);
        setTipoAlertaModal('confirmacion');
        setMensajeAlertaModal('¿Estás seguro de que deseas eliminar este usuario?');
        setMostrarAlertaModal(true);
    };

    const confirmarEliminacion = async () => {
        try {
            const response = await clienteAxios.delete(`api/organizacion/${organizacionAEliminar}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Configurar el token en los headers
                }
            });

            toast.success('Organización eliminado correctamente.');
            fetchOrganizacion();
        } catch (error) {
            setTipoAlertaModal('informativo');
            setMensajeAlertaModal('Hubo un problema al eliminar la organización.');
            setMostrarAlertaModal(true);
        } finally {
            setOrganizacionAEliminar(null);
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
        fetchOrganizacion(1, term);
    };

    const handleAdd = () => {
        openModal('crear')
    };




    return (
        <div>
            <section className="content">
                <div className="container-fluid">
                    <div className="card shadow-sm">




                        {/* <div className="content-header bg-blue-500 text-white rounded">
                            <div className="container-fluid">
                                <div className="row mb-2">
                                    <div className="col-sm-6 d-flex align-items-center">
                                        <h1 className="m-0">Organización</h1>

                                    </div>
                                    <div className="col-sm-6 d-flex justify-content-end align-items-center">
                                        <input
                                            type="text"
                                            className="form-control mr-2"
                                            placeholder="Buscar organización..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    fetchOrganizacion(1, searchTerm);
                                                }
                                            }}

                                        />
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => fetchOrganizacion(1, searchTerm)}
                                        >
                                            Buscar
                                        </button>
                                        <button
                                            className="btn btn-success ml-2"
                                            onClick={() => openModal('crear')}
                                        >
                                            Añadir organización
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div> */}

                        <SearchBar
                            title="Organización"
                            placeholder="Buscar organización..."
                            buttonLabel="Añadir organización"
                            onSearch={handleSearch}
                            onAdd={handleAdd}
                        />



                        <div className="card-body">
                            <div className="overflow-x-auto">
                                <table className="table table-bordered table-striped w-full">
                                    <thead>
                                        <tr className="font-bold bg-gradient-to-br from-blue-900 to-cyan-900 text-white rounded text-center">
                                            <th>ID</th>
                                            <th>Razón social</th>
                                            <th>RUC</th>
                                            <th>Dirección</th>
                                            <th>Ciudad</th>
                                            <th>Pais</th>
                                            <th>Telefono(s)</th>
                                            <th>Fax(s)</th>
                                            <th>Email</th>
                                            <th>Sigla</th>
                                            <th>Sitio web</th>
                                            <th>Utilidades</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {organizacion.length === 0 ? (
                                            <tr>
                                                <td colSpan={12} className="text-center text-gray-600 py-6">
                                                    No existen organizaciones.
                                                </td>
                                            </tr>
                                        ) : (
                                            organizacion.map((organizacion) => (
                                                <tr key={organizacion.id}>
                                                    <td>{organizacion.id}</td>
                                                    <td>{organizacion.RazonSocial}</td>
                                                    <td>{organizacion.RUC}</td>
                                                    <td>{organizacion.Direccion}</td>
                                                    <td>{organizacion.ciudad ? organizacion.ciudad.nombre : 'Sin ciudad seleccionada'}</td>
                                                    <td>{organizacion.pais ? organizacion.pais.Name : 'Sin pais seleccionado'}</td>
                                                    <td>{organizacion.Telefono}</td>
                                                    <td>{organizacion.Fax}</td>
                                                    <td>{organizacion.Email}</td>
                                                    <td>{organizacion.Sigla}</td>
                                                    <td>{organizacion.SitioWeb}</td>
                                                    <td>
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => openModal('editar', organizacion)}
                                                                className="flex items-center rounded hover:bg-gray-200 focus:outline-none p-1"
                                                                type="button"
                                                            >
                                                                <img src="/img/edit.png" alt="Edit Rol" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(organizacion.id)}
                                                                className="flex items-center rounded hover:bg-gray-200 focus:outline-none p-1"
                                                                type="button"
                                                            >
                                                                <img src="/img/Delete.png" alt="Delete Rol" />
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
            {/* Renderizar el modal */}
            {isModalOpen && (
                <ModalOrganizacion
                    organizacion={organizacionSeleccionado}
                    refrescarOrganizacion={fetchOrganizacion}
                    modo={modalMode}
                    onClose={closeModal}
                />
            )}

            {/* Mostrar alerta solo si es necesario */}
            {mostrarAlertaModal && (
                <AlertaModal
                    tipo={tipoAlertaModal}
                    mensaje={mensajeAlertaModal}
                    onClose={handleClose}
                    onConfirm={handleConfirm}
                />
            )}

        </div>
    )
}
