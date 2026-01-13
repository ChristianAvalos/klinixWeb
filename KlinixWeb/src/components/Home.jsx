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
      {/* Content Header (Page header) */}
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Dashboard</h1>
            </div>{/* /.col */}
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item"><a href="/">Principal</a></li>
                <li className="breadcrumb-item active">Panel de control</li>
              </ol>
            </div>{/* /.col */}
          </div>{/* /.row */}
        </div>{/* /.container-fluid */}
      </div>
      {/* /.content-header */}
      {/* Main content */}
      <section className="content">
        <div className="container-fluid">
          {/* Small boxes (Stat box) */}
          <div className="row">
            <div className="col-lg-3 col-6">
              {/* small box */}
              <div className="small-box bg-info">
                <div className="inner">
                  <h3>150</h3>
                  <p>Visitas</p>
                </div>
                <div className="icon">
                  <i className="ion ion-person-add" />
                </div>
                <Link to="/visit" className="small-box-footer">Más información <i className="fas fa-arrow-circle-right" /></Link>
              </div>
            </div>
            {/* ./col */}
            <div className="col-lg-3 col-6">
              {/* small box */}
              <div className="small-box bg-success">
                <div className="inner">
                <h3>{cantidadPacientes}</h3>
                  <p>Pacientes</p>
                </div>
                <div className="icon">
                  <i className="ion ion-person-add" />
                </div>
                <Link to="/patients" className="small-box-footer">Más información <i className="fas fa-arrow-circle-right" /></Link>
              </div>
            </div>
            {/* ./col */}
            <div className="col-lg-3 col-6">
              {/* small box */}
              <div className="small-box bg-lime-400">
                <div className="inner">
                  <h3>{cantidadDoctores}</h3>
                  <p>Doctores</p>
                </div>
                <div className="icon">
                  <i className="ion ion-person-add" />
                </div>
                <Link to="/doctor" className="small-box-footer">Más información <i className="fas fa-arrow-circle-right" /></Link>
              </div>
            </div>

            {/* ./col */}
            <div className="col-lg-3 col-6">
              {/* small box */}
              <div className="small-box bg-warning">
                <div className="inner">
                  <h3>{cantidadUsuarios}</h3>
                  <p>Usuarios registrados</p>
                </div>
                <div className="icon">
                  <i className="ion ion-person-add"
                    onClick={() => openModal('crear', {}, 'usuarios')}
                  />

                </div>
                <Link to="/usuarios" className="small-box-footer">Más información <i className="fas fa-arrow-circle-right" /></Link>
              </div>
            </div>
            {/* ./col */}
            <div className="col-lg-3 col-6">
              {/* small box */}
              <div className="small-box bg-danger">
                <div className="inner">
                  <h3>{cantidadRoles}</h3>
                  <p>Roles</p>
                </div>
                <div className="icon">
                  <i className="ion ion-android-lock"
                    onClick={() => openModal('crear', {}, 'roles')}
                  >

                  </i>
                </div>
                <Link to="/usuarios/roles" className="small-box-footer">Más información <i className="fas fa-arrow-circle-right" /></Link>
              </div>
            </div>
            {/* ./col */}
          </div>
          {/* /.row */}
          {/* Main row */}
          <div className="row">

          </div>
          {/* /.row (main row) */}
        </div>{/* /.container-fluid */}
      </section>
      {/* /.content */}

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
