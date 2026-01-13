import { Link } from "react-router-dom"
import React, { useEffect, useState } from 'react';
import useAuthPermisos from "../hooks/useAuthPermisos";

export default function SideNav() {


  const { permissions, hasPermission } = useAuthPermisos();

  // Estado para el término de búsqueda y los ítems del menú
  const [searchTerm, setSearchTerm] = useState('');
  const [menuItems, setMenuItems] = useState([]);

  // Función para manejar el cambio del input de búsqueda
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // useEffect para extraer automáticamente los ítems del menú
  useEffect(() => {
    // Crear un observador para detectar cambios en el DOM
    const observer = new MutationObserver(() => {
      // Obtener los ítems dinámicamente del DOM usando querySelectorAll
      const links = document.querySelectorAll(".nav-item .nav-link");
      const items = Array.from(links).map(link => {
        const route = link.getAttribute('href'); // Obtener el atributo to directamente del Link
        const textElement = link.querySelector('p'); // Buscar el elemento <p> dentro del Link
        const text = textElement ? textElement.textContent.trim().toLowerCase() : '';

        return {
          text: text,
          route: route, // Guardar la ruta junto con el texto
          originalElement: link
        };
      });
      // Actualizar el estado solo si hay un cambio real
      setMenuItems(prevItems => {
        const newItems = items.filter(item => !prevItems.some(prev => prev.text === item.text));
        return [...prevItems, ...newItems];
      });
    });

    // Observar cambios en el contenedor principal de la barra lateral
    const sidebar = document.querySelector('.main-sidebar');
    if (sidebar) {
      observer.observe(sidebar, { childList: true, subtree: true });
    }

    // Desconectar el observador cuando se desmonte el componente
    return () => observer.disconnect();
  }, []); // Solo ejecuta al montar


  // Filtrar los items del menú según el término de búsqueda
  const filteredMenuItems = menuItems.filter(item =>
    item.text.includes(searchTerm.trim().toLowerCase())
  );



  //esto es para ver la cantidad de permisos que tiene
  //   permissions.forEach(permission => {
  //     console.log(`El usuario tiene permiso: ${permission}`);
  // });


  return (
    <div>
      {/* Main Sidebar Container */}
      <aside className="main-sidebar sidebar-dark-primary elevation-4">

        <div className="sidebar">
          {/* Sidebar user panel (optional) */}
          <div className="user-panel mt-3 pb-3 mb-3 flex items-center">
            <div className="image">
              <img src="/img/Logo Institucional.png" className="img-circle elevation-2" alt="User Image" />
            </div>
            <div className="info">
              {hasPermission('Principal') ? (
                <a href="/" className="d-block text-white">CDSystem</a>
              ) : (
                <p className="d-block text-white">CDSystem</p>
              )}
            </div>
          </div>

          {/* SidebarSearch Form */}
          <div className="form-inline">
            <div className="input-group" data-widget="sidebar-search">
              <input
                className="form-control form-control-sidebar"
                type="search"
                placeholder="Buscar"
                aria-label="Search"
                value={searchTerm}
                onChange={handleSearch}
              />
              <div className="input-group-append">
                <button className="btn btn-sidebar">
                  <i className="fas fa-search fa-fw" />
                </button>
              </div>
            </div>
          </div>


          {/* Mostrar los items filtrados solo si hay término de búsqueda */}
          {searchTerm && (
            <ul className="nav nav-pills nav-sidebar flex-column">
              {filteredMenuItems.length > 0 ? (
                filteredMenuItems.map((item, index) => (
                  <li key={index} className="nav-item">
                    <Link to={item.route} className="nav-link">
                      <i className="nav-icon fas fa-circle"></i>
                      <p>{item.text}</p>
                    </Link>
                  </li>
                ))
              ) : (
                <p className="text-white ml-3">No results found</p>
              )}
            </ul>
          )}

          {/* Sidebar Menu */}


          <nav className="mt-2">
            <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">

              {(hasPermission('Visitas') || hasPermission('Doctores') || hasPermission('Pacientes')) && (

                <ul className="nav nav-pills ">
                  <li className="nav-item">
                    <p className="nav-header">Operaciones</p>

                    {hasPermission('Visitas') && (
                      <ul className="nav nav-pills ">
                        <li className="nav-item">
                          <Link to="/scanvisit" className="nav-link flex items-center">
                            <i className="far fa-address-card"></i>
                            <p className="ml-2">Escanear visitas</p>
                          </Link>
                        </li>
                      </ul>
                    )}

                    {hasPermission('Visitas') && (
                      <ul className="nav nav-pills ">
                        <li className="nav-item">
                          <Link to="/visit" className="nav-link flex items-center">
                          <i className="fas fa-users"></i>
                            <p className="ml-2">Fichero de visitas</p>
                          </Link>
                        </li>
                      </ul>
                    )}

                    {hasPermission('Doctores') && (
                      <ul className="nav nav-pills ">
                        <li className="nav-item">
                          <Link to="/doctor" className="nav-link flex items-center">
                            <i className="fas fa-user-md"></i>
                            <p className="ml-2">Fichero de doctores</p>
                          </Link>
                        </li>
                      </ul>
                    )}

                    {hasPermission('Pacientes') && (
                      <ul className="nav nav-pills ">
                        <li className="nav-item">
                          <Link to="/patients" className="nav-link flex items-center">
                            <i className="fas fa-user-injured"></i>
                            <p className="ml-2">Fichero de pacientes</p>
                          </Link>
                        </li>
                      </ul>
                    )}


                  </li>
                </ul>

              )}

              {(hasPermission('Herraminetas_usuarios') || hasPermission('Organizacion')) && (

                <li className="nav-item">
                  <p className="nav-header">Herramientas</p>

                  {hasPermission('Organizacion') && (
                    <ul className="nav nav-pills ">
                      <li className="nav-item">
                        <Link to="/organizacion" className="nav-link flex items-center">
                          <i className="fas fa-sitemap"></i>
                          <p className="ml-2">Organización</p>
                        </Link>
                      </li>
                    </ul>
                  )}


                  {hasPermission('Herraminetas_usuarios') && (

                    <ul className="nav nav-pills ">
                      <li className="nav-item">
                        <Link to="/usuarios" className="nav-link flex items-center">
                          <i className="fas fa-user"></i>
                          <p className="ml-2">Usuarios</p>
                        </Link>
                      </li>


                      <li className="nav-item">
                        <Link to="/usuarios/roles" className="nav-link flex items-center">
                          <i className="fas fa-user-tag"></i>
                          <p className="ml-2">Roles usuario </p>
                        </Link>
                      </li>
                    </ul>

                  )}
                </li>

              )}


              {hasPermission('Reporte_Usuarios') && (

                <ul className="nav nav-pills ">
                  <li className="nav-item">
                    <p className="nav-header">Reportes</p>

                    {hasPermission('Reporte_Usuarios') && (
                      <ul className="nav nav-pills ">
                        <li className="nav-item">
                          <Link to="/usuarios/reporte" className="nav-link flex items-center">
                            <i className="fas fa-file-invoice"></i>
                            <p className="ml-2">Reporte de usuarios</p>
                          </Link>
                        </li>
                      </ul>
                    )}
                  </li>
                </ul>

              )}

              {hasPermission('altas y bajas') && (

                <li className="nav-item">
                  <p className="nav-header">Operaciones</p>

                  <Link to="#" className="nav-link">
                    <i className="fas nav-icon" />
                    <p>Altas y Bajas</p>
                    <i className="right fas fa-angle-left" />
                  </Link>

                  {hasPermission('Ventas') && (
                    <ul className="nav nav-treeview">
                      <li className="nav-item">
                        <Link to="/ventas" className="nav-link">
                          <i className="fas fa-circle nav-icon" />
                          <p>Ventas</p>
                        </Link>
                      </li>
                    </ul>
                  )}

                  {hasPermission('Bajas') && (
                    <ul className="nav nav-treeview">
                      <li className="nav-item">
                        <Link to="/bajas" className="nav-link">
                          <i className="fas fa-circle nav-icon" />
                          <p>Bajas</p>
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
              )}
            </ul>
          </nav>
          {/* /.sidebar-menu */}
        </div>
        {/* /.sidebar */}
      </aside>

    </div>
  )
}
