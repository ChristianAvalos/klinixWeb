import clienteAxios from "../config/axios";
import { useEffect, useRef, useState } from 'react';
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
    const [isLoading, setIsLoading] = useState(false);

    //session total
    const [totalRegistros, setTotalRegistros] = useState(0);

    //buscador 
    const [searchTerm, setSearchTerm] = useState('');
    // Obtener el token de autenticación
    const token = localStorage.getItem('AUTH_TOKEN');
    const activeRequestRef = useRef(null);
    const lastRequestIdRef = useRef(0);

    //funcion para obtener los consultorios
    const fetchResource = async (page = 1, search = '') => {
        activeRequestRef.current?.abort();
        const controller = new AbortController();
        activeRequestRef.current = controller;
        const requestId = ++lastRequestIdRef.current;
        setIsLoading(true);

        try {
            const { data } = await clienteAxios.get(`api/consultorios?page=${page}&search=${search}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Configurar el token en los headers
                },
                signal: controller.signal,
            });

            if (requestId !== lastRequestIdRef.current) {
                return;
            }

            // Actualizar el estado con la lista de los consultorios
            setResources(data.data);
            setTotalPaginas(data.last_page);
            setTotalRegistros(data.total);
            setPaginaActual(data.current_page);

        } catch (error) {
            if (error?.code === 'ERR_CANCELED' || error?.name === 'CanceledError') {
                return;
            }

            if (error?.response?.status === 429) {
                toast.warning('Se alcanzó el límite temporal de consultas. Espera un momento e inténtalo de nuevo.');
                return;
            }

            console.error('Error al obtener los consultorios:', error);
        } finally {
            if (requestId === lastRequestIdRef.current) {
                setIsLoading(false);
            }
        }
    };

    //llamo con la pagina para obtener la lista 
    useEffect(() => {

        fetchResource(paginaActual, searchTerm);
    }, [paginaActual, searchTerm]);

    useEffect(() => {
        return () => {
            activeRequestRef.current?.abort();
        };
    }, []);




    // Función para manejar el cambio de página
    const handlePageChange = (newPage) => {
        if (isLoading) {
            return;
        }

        if (newPage > 0 && newPage <= totalPaginas && newPage !== paginaActual) {
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
            fetchResource(paginaActual, searchTerm);
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
        setPaginaActual(1);
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
                                    <thead className="klinix-thead-gradient">
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
                                    <tbody>
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
                            {isLoading && (
                                <div className="py-2 text-sm font-medium text-slate-600">
                                    Cargando consultorios...
                                </div>
                            )}

                            {/* Controles de paginación */}
                            <div className="flex flex-col items-center sm:flex-row sm:justify-between py-4 space-y-2 sm:space-y-0">
                                {/* Botones para la primera y anterior página */}
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handlePageChange(1)}
                                        disabled={isLoading || paginaActual === 1}
                                        className={`px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base font-semibold rounded-lg ${(isLoading || paginaActual === 1) ? 'bg-gray-400 text-white cursor-not-allowed' : 'klinix-gradient'}`}
                                    >
                                        Primera
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(paginaActual - 1)}
                                        disabled={isLoading || paginaActual === 1}
                                        className={`px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base font-semibold rounded-lg ${(isLoading || paginaActual === 1) ? 'bg-gray-400 text-white cursor-not-allowed' : 'klinix-gradient'}`}
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
                                        disabled={isLoading || paginaActual === totalPaginas}
                                        className={`px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base font-semibold rounded-lg ${(isLoading || paginaActual === totalPaginas) ? 'bg-gray-400 text-white cursor-not-allowed' : 'klinix-gradient'}`}
                                    >
                                        Siguiente
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(totalPaginas)}
                                        disabled={isLoading || paginaActual === totalPaginas}
                                        className={`px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base font-semibold rounded-lg ${(isLoading || paginaActual === totalPaginas) ? 'bg-gray-400 text-white cursor-not-allowed' : 'klinix-gradient'}`}
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
