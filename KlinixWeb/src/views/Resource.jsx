import clienteAxios from "../config/axios";
import { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import AlertaModal from "../components/AlertaModal";
import SearchBar from "../components/SearchBar";
import ModalResource from './ModalResource';


export default function Resource() {
    const extractHHMM = (value) => {
        if (!value) return '';
        const str = String(value);
        const match = str.match(/(\d{2}:\d{2})/);
        return match ? match[1] : str;
    };

    const intToHexColor = (value) => {
        if (value === null || value === undefined || value === '') return null;
        const n = Number(value);
        if (Number.isNaN(n)) return null;
        const unsigned = n >>> 0; 
        const rgb = unsigned & 0xFFFFFF; 
        return `#${rgb.toString(16).padStart(6, '0').toUpperCase()}`;
    };

    //grilla del consultorio
    const [resources, setResources,] = useState([]);
    const [resourceSeleccionado, setresourceSeleccionado] = useState(null);

    //Esta parte es de las alertas
    const [mostrarAlertaModal, setMostrarAlertaModal] = useState(false);
    const [tipoAlertaModal, setTipoAlertaModal] = useState('informativo');
    const [mensajeAlertaModal, setMensajeAlertaModal] = useState('');
    const [accionConfirmadaModal, setAccionConfirmadaModal] = useState(null);
    const [resourceAEliminar, setresourceAEliminar] = useState(null);


    //paginacion
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);

    //session total
    const [totalRegistros, setTotalRegistros] = useState(0);

    //buscador 
    const [searchTerm, setSearchTerm] = useState('');
    // Obtener el token de autenticación
    const token = localStorage.getItem('AUTH_TOKEN');

    //funcion para obtener los consultorios
    const fetchResource = async (page = 1, search = '') => {
        try {

            // Realizar la solicitud a la API
            const { data } = await clienteAxios.get(`api/consultorios?page=${page}&search=${search}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Configurar el token en los headers
                }
            });

            // Actualizar el estado con la lista de los consultorios
            setResources(data.data);
            setTotalPaginas(data.last_page);
            setTotalRegistros(data.total);
            setPaginaActual(data.current_page);

        } catch (error) {
            console.error('Error al obtener los consultorios:', error);
            throw error; // Lanza el error para manejarlo donde sea llamado
        }
    };

    //llamo con la pagina para obtener la lista 
    useEffect(() => {

        fetchResource(paginaActual);
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

    const openModal = (modo, resourceSeleccionado = {}) => {
        setModalMode(modo);
        setresourceSeleccionado(resourceSeleccionado);
        setModalOpen(true);
    };


    //cierre del modal
    const closeModal = () => {
        setModalOpen(false);
    };



    //para la eliminacion del consultorio
    const handleDelete = async (id) => {

        setresourceAEliminar(id);
        setTipoAlertaModal('confirmacion');
        setMensajeAlertaModal('¿Estás seguro de que deseas eliminar el consultorio seleccionado?');
        setMostrarAlertaModal(true);
    };

    const confirmarEliminacion = async () => {
        try {
            const response = await clienteAxios.delete(`api/consultorios/${resourceAEliminar}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Configurar el token en los headers
                }
            });

            toast.success('Consultorio eliminado correctamente.');
            fetchResource();
        } catch (error) {
            setTipoAlertaModal('informativo');
            setMensajeAlertaModal('Hubo un problema al eliminar el consultorio.');
            setMostrarAlertaModal(true);
        } finally {
            setresourceAEliminar(null);
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
        fetchResource(1, term);
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
                            title="Consultorios"
                            placeholder="Buscar consultorio..."
                            buttonLabel="Añadir consultorio"
                            onSearch={handleSearch}
                            onAdd={handleAdd}
                        />



                        <div className="card-body">
                            <div className="overflow-auto max-h-[70vh] relative">
                                <table className="table table-bordered w-full bg-white">
                                    <thead className="[&>tr>th]:sticky [&>tr>th]:top-0 [&>tr>th]:z-30 klinix-thead-gradient [&>tr>th:last-child]:right-0 [&>tr>th:last-child]:z-40">
                                        <tr className="font-bold rounded text-center">
                                            <th>ID</th>
                                            <th>Color</th>
                                            <th>Numero</th>
                                            <th>Nombre</th>
                                            <th>Visible</th>
                                            <th>Doctor</th>
                                            <th>Inicio</th>
                                            <th>Fin</th>
                                            <th>Usuario</th>
                                            <th>Utilidades</th>
                                        </tr>
                                    </thead>
                                    <tbody className="[&>tr>td:last-child]:sticky [&>tr>td:last-child]:right-0 [&>tr>td:last-child]:z-20 [&>tr>td:last-child]:whitespace-nowrap [&>tr>td:last-child]:bg-inherit">
                                        {resources.length === 0 ? (
                                            <tr>
                                                <td colSpan={11} className="text-center text-gray-600 py-6">
                                                    No existen consultorios.
                                                </td>
                                            </tr>
                                        ) : (
                                            resources.map((resource) => (
                                                <tr key={resource.id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
                                                    <td>{resource.id}</td>
                                                    <td>
                                                        {(() => {
                                                            const hex = intToHexColor(resource.ResourceColor);
                                                            return (
                                                                <div className="flex items-center justify-center">
                                                                    <span
                                                                        className="inline-block h-7 w-7 rounded-full border border-gray-300 shadow-sm"
                                                                        style={{ backgroundColor: hex ?? '#E5E7EB' }}
                                                                        title={hex ? `${hex} (${resource.ResourceColor})` : String(resource.ResourceColor ?? '')}
                                                                    />
                                                                </div>
                                                            );
                                                        })()}
                                                    </td>
                                                    <td>{resource.ResourceNumber}</td>
                                                    <td>{resource.ResourceName}</td>
                                                    <td>{resource.ResourceVisible === "1" ? "Sí" : "No"}</td>
                                                    <td>{`${resource.doctor?.FirstName ?? ''} ${resource.doctor?.LastName ?? ''}`.trim()}</td>
                                                    <td>{extractHHMM(resource.ResourceWorkStart)}</td>
                                                    <td>{extractHHMM(resource.ResourceWorkFinish)}</td>
                                                    <td>{resource.UrevCalc}</td>

                                                    <td>
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => openModal('editar', resource)}
                                                                className="flex items-center rounded hover:bg-gray-200 focus:outline-none p-1"
                                                                type="button"
                                                            >
                                                                <img src="/img/Icon/edit.png" alt="Edit Consultorio" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(resource.id)}
                                                                className="flex items-center rounded hover:bg-gray-200 focus:outline-none p-1"
                                                                type="button"
                                                            >
                                                                <img src="/img/Icon/trash_bin-remove.png" alt="Delete Consultorio" />
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
                                        className={`px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base font-semibold rounded-lg ${paginaActual === 1 ? 'bg-gray-400 text-white cursor-not-allowed' : 'klinix-gradient'}`}
                                    >
                                        Primera
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(paginaActual - 1)}
                                        disabled={paginaActual === 1}
                                        className={`px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base font-semibold rounded-lg ${paginaActual === 1 ? 'bg-gray-400 text-white cursor-not-allowed' : 'klinix-gradient'}`}
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
                                        className={`px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base font-semibold rounded-lg ${paginaActual === totalPaginas ? 'bg-gray-400 text-white cursor-not-allowed' : 'klinix-gradient'}`}
                                    >
                                        Siguiente
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(totalPaginas)}
                                        disabled={paginaActual === totalPaginas}
                                        className={`px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base font-semibold rounded-lg ${paginaActual === totalPaginas ? 'bg-gray-400 text-white cursor-not-allowed' : 'klinix-gradient'}`}
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
                <ModalResource
                    refrescarResources={fetchResource}
                    resource={resourceSeleccionado}
                    modo={modalMode}
                    onClose={closeModal}
                />
            )}

        </div>
    )
}
