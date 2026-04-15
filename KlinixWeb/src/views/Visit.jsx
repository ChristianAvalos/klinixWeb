import clienteAxios from "../config/axios";
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from "react-toastify";
import AlertaModal from "../components/AlertaModal";
import SearchBar from "../components/SearchBar";
import ModalVisit from './ModalVisit';
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


export default function Visits() {
    //grilla de visitas
    const [visits, setVisits] = useState([]);
    const [visitSelected, setVisitSelected] = useState(null);

    // alertas
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [alertType, setAlertType] = useState('informativo');
    const [alertMessage, setAlertMessage] = useState('');
    const [confirmActionModal, setConfirmActionModal] = useState(null);
    const [visitToDelete, setVisitToDelete] = useState(null);

    // paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    // buscador
    const [searchTerm, setSearchTerm] = useState('');
    const token = localStorage.getItem('AUTH_TOKEN');
    const activeRequestRef = useRef(null);
    const lastRequestIdRef = useRef(0);

    // obtener visitas
    const fetchVisits = async (page = 1, search = '') => {
        activeRequestRef.current?.abort();
        const controller = new AbortController();
        activeRequestRef.current = controller;
        const requestId = ++lastRequestIdRef.current;
        setIsLoading(true);

        try {
            const { data } = await clienteAxios.get(
                `api/visitas?page=${page}&search=${encodeURIComponent(search)}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    signal: controller.signal,
                }
            );

            if (requestId !== lastRequestIdRef.current) {
                return;
            }

            setVisits(data.data);
            setTotalPages(data.last_page);
            setTotalRecords(data.total);
            setCurrentPage(data.current_page);
        } catch (error) {
            if (error?.code === 'ERR_CANCELED' || error?.name === 'CanceledError') {
                return;
            }

            if (error?.response?.status === 429) {
                toast.warning('Se alcanzó el límite temporal de consultas. Espera un momento e inténtalo de nuevo.');
                return;
            }

            console.error('Error al obtener las visitas:', error);
        } finally {
            if (requestId === lastRequestIdRef.current) {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchVisits(currentPage, searchTerm);
    }, [currentPage, searchTerm]);

    useEffect(() => {
        return () => {
            activeRequestRef.current?.abort();
        };
    }, []);

    // paginación
    const handlePageChange = (newPage) => {
        if (isLoading) {
            return;
        }

        if (newPage > 0 && newPage <= totalPages && newPage !== currentPage) {
            setCurrentPage(newPage);
        }
    };

    // modal
    const [isModalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('crear');

    // render visitas
    const visitsRender = useMemo(() => {
        if (!Array.isArray(visits)) return [];
        return visits.map((v) => {
            const birthdayIso = normalizarFechaISO(v?.Birthday);
            return {
                ...v,
                __birthdayDmy: isoADmy(birthdayIso),
                __age: calcularEdad(birthdayIso),
            };
        });
    }, [visits]);

    const openModal = (modo, visit = {}) => {
        setModalMode(modo);
        setVisitSelected(visit);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    // eliminar visita
    const handleDelete = async (id) => {
        setVisitToDelete(id);
        setAlertType('confirmacion');
        setAlertMessage('¿Estás seguro de que deseas eliminar la visita seleccionada?');
        setShowAlertModal(true);
    };

    const confirmarEliminacion = async () => {
        try {
            await clienteAxios.delete(`api/visita/${visitToDelete}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Visita eliminada correctamente.');
            fetchVisits(currentPage, searchTerm);
        } catch (error) {
            setAlertType('informativo');
            setAlertMessage('Hubo un problema al eliminar la visita.');
            setShowAlertModal(true);
        } finally {
            setVisitToDelete(null);
        }
    };

    const handleClose = () => {
        setShowAlertModal(false);
        setConfirmActionModal(null);
    };

    const handleConfirm = () => {
        setShowAlertModal(false);
        confirmarEliminacion();
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        setCurrentPage(1);
    };

    const handleAdd = () => {
        openModal('crear');
    };

    return (
        <div>
            <section className="content">
                <div className="container-fluid">
                    <div className="card shadow-sm">
                        <SearchBar
                            title="Visitas"
                            placeholder="Buscar visita..."
                            // buttonLabel="Añadir visita"
                            onSearch={handleSearch}
                            // onAdd={handleAdd}
                        />
                        <div className="card-body">
                            <div className="overflow-auto max-h-[70vh] relative">
                                <table className="table table-bordered w-full bg-white">
                                    <thead className="klinix-thead-gradient">
                                        <tr className="font-bold rounded text-center">
                                            <th>ID</th>
                                            <th>Tipo</th>
                                            <th>Documento N°</th>
                                            <th>Apellido(s)</th>
                                            <th>Nombre(s)</th>
                                            <th>Nacionalidad</th>
                                            <th>Fecha de Nacimiento</th>
                                            <th>Persona Nº</th>
                                            <th>Edad</th>
                                            <th>Sexo</th>
                                            <th>Vencimiento</th>
                                            <th>Usuario</th>
                                            <th>Utilidades</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {visitsRender.length === 0 ? (
                                            <tr>
                                                <td colSpan={13} className="text-center text-gray-600 py-6">
                                                    No existen visitas.
                                                </td>
                                            </tr>
                                        ) : (
                                            visitsRender.map((v) => (
                                                <tr key={v.id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
                                                    <td>{v.id}</td>
                                                    <td>{v.Type_}</td>
                                                    <td>{formatearMiles(v.DocumentNo)}</td>
                                                    <td>{v.Familyname}</td>
                                                    <td>{v.Givenname}</td>
                                                    <td>{v.Nationality}</td>
                                                    <td>{(v.__birthdayDmy)}</td>
                                                    <td>{v.PersonalNo}</td>
                                                    <td>{v.__age}</td>
                                                    <td>{v.Sex}</td>
                                                    <td>{normalizarFechaISO(v.Dateofexpiry)}</td>
                                                    <td>
                                                        <span className="block max-w-[180px] truncate" title={v.UrevCalc || ''}>
                                                            {v.UrevCalc}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="flex space-x-2">
                                                            {/* <button
                                                                onClick={() => openModal('editar', v)}
                                                                className="flex items-center rounded hover:bg-gray-200 focus:outline-none p-1"
                                                                type="button"
                                                            >
                                                                <img src="/img/Icon/edit.png" alt="Edit Visita" />
                                                            </button> */}
                                                            <button
                                                                onClick={() => handleDelete(v.id)}
                                                                className="flex items-center rounded hover:bg-gray-200 focus:outline-none p-1"
                                                                type="button"
                                                            >
                                                                <img src="/img/Icon/trash_bin-remove.png" alt="Delete Visita" />
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
                                <span className="text-lg font-bold text-gray-700">{totalRecords}</span>
                            </div>
                            {isLoading && (
                                <div className="py-2 text-sm font-medium text-slate-600">
                                    Cargando visitas...
                                </div>
                            )}
                            <div className="flex flex-col items-center sm:flex-row sm:justify-between py-4 space-y-2 sm:space-y-0">
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handlePageChange(1)}
                                        disabled={isLoading || currentPage === 1}
                                        className={`px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base font-semibold rounded-lg ${(isLoading || currentPage === 1) ? 'bg-gray-400 text-white cursor-not-allowed' : 'klinix-gradient'}`}
                                    >
                                        Primera
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={isLoading || currentPage === 1}
                                        className={`px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base font-semibold rounded-lg ${(isLoading || currentPage === 1) ? 'bg-gray-400 text-white cursor-not-allowed' : 'klinix-gradient'}`}
                                    >
                                        Anterior
                                    </button>
                                </div>
                                <span className="text-sm sm:text-lg font-medium text-center">
                                    Página {currentPage} de {totalPages}
                                </span>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={isLoading || currentPage === totalPages}
                                        className={`px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base font-semibold rounded-lg ${(isLoading || currentPage === totalPages) ? 'bg-gray-400 text-white cursor-not-allowed' : 'klinix-gradient'}`}
                                    >
                                        Siguiente
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(totalPages)}
                                        disabled={isLoading || currentPage === totalPages}
                                        className={`px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base font-semibold rounded-lg ${(isLoading || currentPage === totalPages) ? 'bg-gray-400 text-white cursor-not-allowed' : 'klinix-gradient'}`}
                                    >
                                        Última
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {showAlertModal && (
                <AlertaModal
                    tipo={alertType}
                    mensaje={alertMessage}
                    onClose={handleClose}
                    onConfirm={handleConfirm}
                />
            )}
            {isModalOpen && (
                <ModalVisit
                    refrescarVisitas={fetchVisits}
                    visita={visitSelected}
                    modo={modalMode}
                    onClose={closeModal}
                />
            )}
        </div>
    );
}
