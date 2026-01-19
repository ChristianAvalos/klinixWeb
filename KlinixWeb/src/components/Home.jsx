import { Link } from "react-router-dom"
import { useEffect, useState } from 'react';
import { obtenerUsuarios, obtenerRoles, obtenerDoctores,obtenerPacientes } from '../helpers/HelpersUsuarios';
import ModalUsuarios from '../views/ModalUsuarios';
import ModalRol from '../views/ModalRol';

export default function Home() {

  //modal de usuarios 
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('crear');

  //para los tipos de vistas 
  const [isModalVista, setModalVista] = useState('');

  //Cantidad de usuarios registrados
  const [cantidadUsuarios, setCantidadUsuarios] = useState(0);

  //Cantidad de doctores registrados
  const [cantidadDoctores, setCantidadDoctores] = useState(0);

  //Cantidad de pacientes registrados
  const [cantidadPacientes, setCantidadPacientes] = useState(0);

  //Cantidad de roles registrados
  const [cantidadRoles, setCantidadRoles] = useState(0);

  //para abrir el modal
  const openModal = (modo, usuarioSeleccionado = {}, vista) => {
    if (vista === 'usuarios') {
      setModalVista('usuarios');
      setModalMode(modo);
      setModalOpen(true);
    } else if (vista === 'roles') {
      setModalVista('roles');
      setModalMode(modo);
      setModalOpen(true);
    }
  };

  //para cerrar el modal
  const closeModal = () => {
    setModalOpen(false);
  };

  //obtener la cantidad de usuarios registrados
  const cantidadRegistrados = async () => {
    try {
      const usuarios = await obtenerUsuarios();
      setCantidadUsuarios(usuarios.usuarios.total);
    } catch (error) {
      console.error('Error al cargar los usuarios:', error);
    }
  };

  useEffect(() => {

    cantidadRegistrados();
  }, []);

  //obtener la cantidad de roles registrados
  const cantidadRolesRegistrados = async () => {
    try {
      const roles = await obtenerRoles();
      setCantidadRoles(roles.total);
    } catch (error) {
      console.error('Error al cargar los roles:', error);
    }
  };

  useEffect(() => {

    cantidadRolesRegistrados();
  }, []);

  //obtener la cantidad de doctores registrados
  const cantidadDoctoresRegistrados = async () => {
    try {
      const doctores = await obtenerDoctores();
      setCantidadDoctores(doctores.total);
    } catch (error) {
      console.error('Error al cargar los doctores:', error);
    }
  };

  useEffect(() => {

    cantidadDoctoresRegistrados();
  }, []);

    //obtener la cantidad de pacientes registrados
    const cantidadPacientesRegistrados = async () => {
      try {
        const pacientes = await obtenerPacientes();
        setCantidadPacientes(pacientes.total);
      } catch (error) {
        console.error('Error al cargar los pacientes:', error);
      }
    };
  
    useEffect(() => {
  
      cantidadPacientesRegistrados();
    }, []);




  return (
    <>
      {/* Encabezado */}
      <div className="py-4 px-6 bg-white border-b">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <nav className="text-sm text-gray-500 flex items-center space-x-2">
            <Link to="/" className="hover:underline">Principal</Link>
            <span>/</span>
            <span className="text-gray-700">Panel de control</span>
          </nav>
        </div>
      </div>

      {/* Contenido principal */}
      <section className="p-6 bg-gray-50 min-h-[calc(100vh-120px)]">
        <div className="max-w-7xl mx-auto">
          {/* Cajas resumen */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-sky-500 rounded-lg shadow-md p-5 flex flex-col justify-between min-h-[140px] transition-transform hover:-translate-y-0.5 hover:shadow-lg">
              <div>
                <h3 className="text-white text-3xl font-bold">150</h3>
                <p className="text-white/90 text-lg">Visitas</p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="h-10 w-10 rounded-full bg-white/15 flex items-center justify-center" aria-hidden>
                  <i className="ion ion-person-add text-white text-2xl" />
                </div>
                <Link to="/visit" className="text-white text-sm underline underline-offset-2 hover:text-sky-100">Más información</Link>
              </div>
            </div>

            <div className="bg-green-500 rounded-lg shadow-md p-5 flex flex-col justify-between min-h-[140px] transition-transform hover:-translate-y-0.5 hover:shadow-lg">
              <div>
                <h3 className="text-white text-3xl font-bold">{cantidadPacientes}</h3>
                <p className="text-white/90 text-lg">Pacientes</p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="h-10 w-10 rounded-full bg-white/15 flex items-center justify-center" aria-hidden>
                  <i className="ion ion-person-add text-white text-2xl" />
                </div>
                <Link to="/patients" className="text-white text-sm underline underline-offset-2 hover:text-green-100">Más información</Link>
              </div>
            </div>

            <div className="bg-lime-500 rounded-lg shadow-md p-5 flex flex-col justify-between min-h-[140px] transition-transform hover:-translate-y-0.5 hover:shadow-lg">
              <div>
                <h3 className="text-white text-3xl font-bold">{cantidadDoctores}</h3>
                <p className="text-white/90 text-lg">Doctores</p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="h-10 w-10 rounded-full bg-white/15 flex items-center justify-center" aria-hidden>
                  <i className="ion ion-person-add text-white text-2xl" />
                </div>
                <Link to="/doctor" className="text-white text-sm underline underline-offset-2 hover:text-lime-100">Más información</Link>
              </div>
            </div>

             <div className="bg-purple-400 rounded-lg shadow-md p-5 flex flex-col justify-between min-h-[140px] transition-transform hover:-translate-y-0.5 hover:shadow-lg">
              <div>
                <h3 className="text-white text-3xl font-bold">12</h3>
                <p className="text-white/90 text-lg">Consultorios</p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <button
                  type="button"
                  onClick={() => openModal('crear', {}, 'consultorios')}
                  className="h-10 w-10 rounded-full bg-white/15 hover:bg-white/25 transition flex items-center justify-center"
                  aria-label="Crear consultorio"
                >
                  <i className="ion ion-android-lock text-white text-2xl" />
                </button>
                <Link to="/consultorios" className="text-white text-sm underline underline-offset-2 hover:text-red-100">Más información</Link>
              </div>
            </div>

            <div className="bg-yellow-400 rounded-lg shadow-md p-5 flex flex-col justify-between min-h-[140px] transition-transform hover:-translate-y-0.5 hover:shadow-lg">
              <div>
                <h3 className="text-white text-3xl font-bold">{cantidadUsuarios}</h3>
                <p className="text-white/90 text-lg">Usuarios registrados</p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <button
                  type="button"
                  onClick={() => openModal('crear', {}, 'usuarios')}
                  className="h-10 w-10 rounded-full bg-white/15 hover:bg-white/25 transition flex items-center justify-center"
                  aria-label="Crear usuario"
                >
                  <i className="ion ion-person-add text-white text-2xl" />
                </button>
                <Link to="/usuarios" className="text-white text-sm underline underline-offset-2 hover:text-yellow-50">Más información</Link>
              </div>
            </div>

            <div className="bg-red-500 rounded-lg shadow-md p-5 flex flex-col justify-between min-h-[140px] transition-transform hover:-translate-y-0.5 hover:shadow-lg">
              <div>
                <h3 className="text-white text-3xl font-bold">{cantidadRoles}</h3>
                <p className="text-white/90 text-lg">Roles</p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <button
                  type="button"
                  onClick={() => openModal('crear', {}, 'roles')}
                  className="h-10 w-10 rounded-full bg-white/15 hover:bg-white/25 transition flex items-center justify-center"
                  aria-label="Crear rol"
                >
                  <i className="ion ion-android-lock text-white text-2xl" />
                </button>
                <Link to="/usuarios/roles" className="text-white text-sm underline underline-offset-2 hover:text-red-100">Más información</Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Renderizado de modal de usuarios  */}
      {isModalOpen && (isModalVista === 'usuarios') && (
        <ModalUsuarios
          refrescarUsuarios={cantidadRegistrados}
          modo={modalMode}
          onClose={closeModal}
        />
      )}

      {/* Renderizado de modal de roles  */}
      {isModalOpen && (isModalVista === 'roles') && (
        <ModalRol
          refrescarRoles={cantidadRolesRegistrados}
          modo={modalMode}
          onClose={closeModal}
        />
      )}


    </>

  )
}
