import { React, useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import ModalUsuarios from '../views/ModalUsuarios';
import { useAuth } from "../hooks/useAuth";
import ChangePasswordModal from '../views/ModalPassword';
import { useTheme } from '../context/ThemeContext';

export default function Header() {
    const { themes, themeName, setTheme, resetTheme } = useTheme();
  const { logout, user } = useAuth({ middleware: 'auth' })
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    logout();
    setDropdownOpen(false);  // Cerrar el menú después de hacer logout
  };

  // Manejo del dropdown y cierre al hacer clic fuera (usa captura para mayor fiabilidad)
  const toggleDropdown = () => setDropdownOpen((v) => !v);

  useEffect(() => {
    const handleOutside = (event) => {
      if (!dropdownOpen) return;
      const target = event.target;
      const btn = dropdownRef.current;
      const menu = menuRef.current;
      if (btn && btn.contains(target)) return;
      if (menu && menu.contains(target)) return;
      setDropdownOpen(false);
    };

    document.addEventListener('mousedown', handleOutside, true);
    document.addEventListener('touchstart', handleOutside, true);

    return () => {
      document.removeEventListener('mousedown', handleOutside, true);
      document.removeEventListener('touchstart', handleOutside, true);
    };
  }, [dropdownOpen]);



  //apertura de modal de password
  const [isModalOpenPassword, setIsModalOpenPassword] = useState(false);

  // Apertura del modal en modo "perfil"
  const [modalMode, setModalMode] = useState('perfil');
  const [isModalOpen, setModalOpen] = useState(false);
  const openProfileModal = (modo) => {
    setModalMode(modo);
    setModalOpen(true);
  };

  // Cierre del modal
  const closeModal = () => {
    setModalOpen(false);
  };


  return (
    <div>
      {/* Navbar */}
      <nav className="main-header navbar navbar-expand klinix-gradient !z-[1]">
        {/* Left navbar links */}
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link text-klinix-on" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars" /></a>
          </li>
        </ul>
        {/* Right navbar links */}
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <a className="nav-link text-klinix-on" data-widget="fullscreen" href="#" role="button">
              <i className="fas fa-expand-arrows-alt" />
            </a>
          </li>
          <li className="nav-item">
            {/* Usuario logueado y menú desplegable */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="nav-link text-klinix-on font-semibold focus:outline-none flex items-center space-x-2"
              >
                {user?.name} {/* Muestra el nombre del usuario */}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              {/* Menú desplegable usando Portal */}
              {dropdownOpen && ReactDOM.createPortal(
                <ul ref={menuRef} className="fixed right-4 top-16 w-56 bg-white rounded-lg shadow-lg z-[9999] transition-all duration-200 ease-in-out border border-gray-200">
                  <li className="px-4 pt-3 pb-2">
                    <div className="text-xs font-semibold text-gray-500">Tema</div>
                    <select
                      className="mt-2 w-full rounded-md border border-gray-300 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={themeName}
                      onChange={(e) => setTheme(e.target.value)}
                    >
                      {Object.entries(themes).map(([key, t]) => (
                        <option key={key} value={key}>{t.label}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={resetTheme}
                      className="mt-2 w-full rounded-md bg-gray-100 px-2 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
                    >
                      Restaurar por defecto
                    </button>
                  </li>
                  <li><hr className="my-1 border-gray-200" /></li>
                  <li>
                    <button
                      onClick={() => { setDropdownOpen(false); openProfileModal('perfil'); }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors duration-150 ease-in-out"
                    > 
                    <div className='flex items-center'>
                      <img src="/img/Icon/user-man.png" alt="User" className="w-5 h-5 mr-2"  />
                      Mi perfil
                    </div>
                    </button>
                  </li>
                  <li>
                    <button
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors duration-150 ease-in-out"
                      onClick={() => { setDropdownOpen(false); setIsModalOpenPassword(true); }}
                    >
                      <div className='flex items-center'>
                        <img src="/img/Icon/key-user-filled.png" alt="Change Password" className="w-5 h-5 mr-2" />
                        Cambiar contraseña
                      </div>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => { setDropdownOpen(false); handleLogout(); }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors duration-150 ease-in-out"
                    >
                      <div className='flex items-center'>
                        <img src="/img/Icon/exit.png" alt="Logout" className="w-5 h-5 mr-2" />
                        Cerrar sesión
                      </div>
                    </button>
                  </li>
                </ul>,
                document.body
              )}
            </div>
          </li>


        </ul>
      </nav>
      {/* Renderizar el modal usuario */}
      {isModalOpen && (
        <ModalUsuarios
          usuario={user}
          modo={modalMode}
          onClose={closeModal}
          ocultarRolesYOrganizaciones={true}
        />
      )}

      {/* Renderizar el modal de cambio de contraseña */}
      {isModalOpenPassword && (
        <ChangePasswordModal
          isOpen={isModalOpenPassword}
          onClose={() => setIsModalOpenPassword(false)}
        />
      )}
    </div>
  )
}
