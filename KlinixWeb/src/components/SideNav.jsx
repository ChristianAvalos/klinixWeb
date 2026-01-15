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
      // Excluye toggles de treeview para no contaminar la búsqueda
      const links = document.querySelectorAll(".nav-item .nav-link:not(.menu-toggle)");
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
      <div className="sidebar bg-gradient-to-br from-blue-900 to-cyan-900 w-64 min-h-screen fixed !z-[1] shadow-xl border-r border-cyan-800/40 overflow-y-auto">
        {/* Sidebar user panel (optional) */}
        <div className="user-panel mt-3 pb-3 mb-3 flex justify-center">
          <div className="info">
            {hasPermission('Principal') ? (

              <Link to="/" className="flex justify-center">
                <img
                  src="/img/Logo Institucional.png"
                  alt="CDSystem"
                  className="rounded-full bg-white w-50 h-30"
                />
              </Link>
            ) : (
              <img
                src="/img/Logo Institucional.png"
                alt="CDSystem"
                className="rounded-full bg-white w-50 h-30"
              />
            )}
          </div>
        </div>


          {/* SidebarSearch Form */}
          <div className="form-inline px-3">
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
                <button className="btn btn-sidebar" type="button">
                  <span className="font-bold text-white">
                    <i className="fas fa-search fa-fw" />
                  </span>
                </button>
              </div>
            </div>
          </div>


          {/* Mostrar los items filtrados solo si hay término de búsqueda */}
          {searchTerm && (
            <ul className="nav nav-pills nav-sidebar flex-column px-2">
              {filteredMenuItems.length > 0 ? (
                filteredMenuItems.map((item, index) => (
                  <li key={index} className="nav-item">
                    <Link to={item.route} className="nav-link text-white font-bold flex items-center gap-2 rounded-md hover:bg-cyan-800/30 transition-colors">
                      <i className="nav-icon fas fa-circle text-xs"></i>
                      <p className="m-0">{item.text}</p>
                    </Link>
                  </li>
                ))
              ) : (
                <p className="text-white ml-3">No results found</p>
              )}
            </ul>
          )}

          {/* Sidebar Menu */}


          <nav className="mt-2 px-1">
            <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">

              {(hasPermission('Visitas') || hasPermission('Doctores') || hasPermission('Pacientes')) && (

                <li className="nav-item has-treeview">
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="nav-link text-white font-bold underline underline-offset-4 decoration-cyan-300/60 tracking-wide menu-toggle flex items-center justify-between rounded-md hover:bg-cyan-800/30 transition-colors"
                  >
                    <p className="m-0">
                      Operaciones
                      <i className="right fas fa-angle-left ml-2" />
                    </p>
                  </a>

                  <ul className="nav nav-treeview px-2">
                    {hasPermission('Visitas') && (
                      <li className="nav-item">
                        <Link to="/scanvisit" className="nav-link flex items-center gap-2 text-white font-bold rounded-md hover:bg-cyan-800/30 transition-colors">
                          <i className="far fa-address-card mr-1"></i>
                          <p className="ml-2 m-0">Escanear visitas</p>
                        </Link>
                      </li>
                    )}

                    {hasPermission('Visitas') && (
                      <li className="nav-item">
                        <Link to="/visit" className="nav-link flex items-center gap-2 text-white font-bold rounded-md hover:bg-cyan-800/30 transition-colors">
                          <i className="fas fa-users mr-1"></i>
                          <p className="ml-2 m-0">Fichero de visitas</p>
                        </Link>
                      </li>
                    )}

                    {hasPermission('Doctores') && (
                      <li className="nav-item">
                        <Link to="/doctor" className="nav-link flex items-center gap-2 text-white font-bold rounded-md hover:bg-cyan-800/30 transition-colors">
                          <i className="fas fa-user-md mr-1"></i>
                          <p className="ml-2 m-0">Fichero de doctores</p>
                        </Link>
                      </li>
                    )}

                    {hasPermission('Pacientes') && (
                      <li className="nav-item">
                        <Link to="/patients" className="nav-link flex items-center gap-2 text-white font-bold rounded-md hover:bg-cyan-800/30 transition-colors">
                          <i className="fas fa-user-injured mr-1"></i>
                          <p className="ml-2 m-0">Fichero de pacientes</p>
                        </Link>
                      </li>
                    )}
                  </ul>
                </li>

              )}

              {(hasPermission('Herraminetas_usuarios') || hasPermission('Organizacion')) && (

                <li className="nav-item has-treeview">
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="nav-link text-white font-bold underline underline-offset-4 decoration-cyan-300/60 tracking-wide menu-toggle flex items-center justify-between rounded-md hover:bg-cyan-800/30 transition-colors"
                  >
                    <p className="m-0">
                      Herramientas
                      <i className="right fas fa-angle-left ml-2" />
                    </p>
                  </a>

                  <ul className="nav nav-treeview px-2">
                    {hasPermission('Organizacion') && (
                      <li className="nav-item">
                        <Link to="/organizacion" className="nav-link flex items-center gap-2 text-white font-bold rounded-md hover:bg-cyan-800/30 transition-colors">
                          <i className="fas fa-sitemap mr-1"></i>
                          <p className="ml-2 m-0">Organización</p>
                        </Link>
                      </li>
                    )}

                    {hasPermission('Herraminetas_usuarios') && (
                      <>
                        <li className="nav-item">
                          <Link to="/usuarios" className="nav-link flex items-center gap-2 text-white font-bold rounded-md hover:bg-cyan-800/30 transition-colors">
                            <i className="fas fa-user mr-1"></i>
                            <p className="ml-2 m-0">Usuarios</p>
                          </Link>
                        </li>

                        <li className="nav-item">
                          <Link to="/usuarios/roles" className="nav-link flex items-center gap-2 text-white font-bold rounded-md hover:bg-cyan-800/30 transition-colors">
                            <i className="fas fa-user-tag mr-1"></i>
                            <p className="ml-2 m-0">Roles usuario </p>
                          </Link>
                        </li>
                      </>
                    )}
                  </ul>
                </li>

              )}


              {hasPermission('Reporte_Usuarios') && (
                <li className="nav-item has-treeview">
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="nav-link text-white font-bold underline underline-offset-4 decoration-cyan-300/60 tracking-wide menu-toggle flex items-center justify-between rounded-md hover:bg-cyan-800/30 transition-colors"
                  >
                    <p className="m-0">
                      Reportes
                      <i className="right fas fa-angle-left ml-2" />
                    </p>
                  </a>

                  <ul className="nav nav-treeview px-2">
                    {hasPermission('Reporte_Usuarios') && (
                      <li className="nav-item">
                        <Link to="/usuarios/reporte" className="nav-link flex items-center gap-2 text-white font-bold rounded-md hover:bg-cyan-800/30 transition-colors">
                          <i className="fas fa-file-invoice mr-1"></i>
                          <p className="ml-2 m-0">Reporte de usuarios</p>
                        </Link>
                      </li>
                    )}
                  </ul>
                </li>
              )}

              {hasPermission('altas y bajas') && (

                <li className="nav-item has-treeview">
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="nav-link text-white font-bold underline underline-offset-4 decoration-cyan-300/60 tracking-wide menu-toggle flex items-center justify-between rounded-md hover:bg-cyan-800/30 transition-colors"
                  >
                    <p className="m-0">
                      Operaciones
                      <i className="right fas fa-angle-left ml-2" />
                    </p>
                  </a>

                  <ul className="nav nav-treeview px-2">
                    <li className="nav-item">
                      <a href="#" onClick={(e) => e.preventDefault()} className="nav-link text-white font-bold flex items-center justify-between rounded-md hover:bg-cyan-800/30 transition-colors menu-toggle">
                        <span className="flex items-center gap-2">
                          <i className="fas nav-icon" />
                          <p className="m-0">Altas y Bajas</p>
                        </span>
                        <i className="right fas fa-angle-left" />
                      </a>

                      <ul className="nav nav-treeview px-2">
                        {hasPermission('Ventas') && (
                          <li className="nav-item">
                            <Link to="/ventas" className="nav-link text-white font-bold flex items-center gap-2 rounded-md hover:bg-cyan-800/30 transition-colors">
                              <i className="fas fa-circle nav-icon text-xs" />
                              <p className="m-0">Ventas</p>
                            </Link>
                          </li>
                        )}

                        {hasPermission('Bajas') && (
                          <li className="nav-item">
                            <Link to="/bajas" className="nav-link text-white font-bold flex items-center gap-2 rounded-md hover:bg-cyan-800/30 transition-colors">
                              <i className="fas fa-circle nav-icon text-xs" />
                              <p className="m-0">Bajas</p>
                            </Link>
                          </li>
                        )}
                      </ul>
                    </li>
                  </ul>
                </li>
              )}
            </ul>
          </nav>
          {/* /.sidebar-menu */}
        </div>
        {/* /.sidebar */}

    </div>
  )
}
