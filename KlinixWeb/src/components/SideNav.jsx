import { Link, useLocation } from "react-router-dom"
import React, { useEffect, useState } from 'react';
import { usePermisos } from "../context/PermisosContext";
import { useTheme } from '../context/ThemeContext';

const buildExpandedSections = (pathname) => ({
  operaciones: pathname === '/scanvisit' || pathname === '/visit' || pathname === '/doctor' || pathname === '/patients' || pathname === '/consultorios' || pathname === '/agenda',
  herramientas: pathname === '/organizacion' || pathname === '/usuarios' || pathname === '/usuarios/roles',
  reportes: pathname === '/usuarios/reporte',
});

const sectionTitleClasses = "mt-5 flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-extrabold uppercase tracking-[0.14em] transition hover:bg-white/10";
const itemLinkClasses = "flex items-center gap-3 rounded-xl px-3 py-2 text-[1.02rem] font-semibold transition hover:bg-white/10";

export default function SideNav() {
  const { permissions, hasPermission, loading } = usePermisos();
  const { theme } = useTheme();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState(() => buildExpandedSections(location.pathname));
  const isLightTheme = theme.on === '15 23 42';
  const dividerColor = isLightTheme ? `rgba(${theme.on}, 0.14)` : 'rgba(255, 255, 255, 0.1)';

  const loadingStyle = {
    backgroundColor: `rgb(${theme.from})`,
    backgroundImage: `linear-gradient(180deg, rgb(${theme.from}) 0%, rgb(${theme.to}) 100%)`,
    backgroundRepeat: 'no-repeat',
    color: `rgb(${theme.on})`,
  };

  const sidenavStyle = {
    backgroundColor: `rgb(${theme.from})`,
    backgroundImage: `linear-gradient(180deg, rgb(${theme.from}) 0%, rgb(${theme.to}) 100%)`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%',
    opacity: 1,
    color: `rgb(${theme.on})`,
    borderRightColor: dividerColor,
  };

  useEffect(() => {
    setExpandedSections((prev) => ({
      ...prev,
      ...buildExpandedSections(location.pathname),
    }));
  }, [location.pathname]);


  const toggleSection = (sectionName) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  const handleSectionToggle = (event, sectionName) => {
    event.preventDefault();
    event.stopPropagation();
    toggleSection(sectionName);
  };

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center" style={loadingStyle}>
        <span className="text-lg font-bold">Cargando menú...</span>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-full w-full">
      <div className="sidebar flex h-full min-h-full flex-1 flex-col overflow-y-auto border-r shadow-2xl" style={sidenavStyle}>
        <div className="flex flex-col items-center gap-4 px-5 pb-4 pt-6">
          <div className="flex justify-center">
            {hasPermission('Principal') ? (
              <Link to="/" className="flex justify-center">
                <img
                  src="/img/Logo Institucional.png"
                  alt="CDSystem"
                  className="mb-4 h-24 w-24 rounded-full bg-slate-50 object-contain p-2 shadow-sm"
                />
              </Link>
            ) : (
              <img
                src="/img/Logo Institucional.png"
                alt="CDSystem"
                className="h-40 w-40 rounded-full bg-white object-contain p-3 shadow-xl ring-1 ring-white/15"
              />
            )}
          </div>
          <div className="h-px w-full" style={{ backgroundColor: dividerColor }} />
        </div>
        <nav className="flex-1 px-3 pb-6">
          <ul className="space-y-1" role="menu">

              {(hasPermission('Visitas') || hasPermission('Doctores') || hasPermission('Pacientes') || hasPermission('Consultorios'))  && (

                <li>
                    <button
                    type="button"
                    onClick={(event) => handleSectionToggle(event, 'operaciones')}
                    className={sectionTitleClasses}
                  >
                    <span>Operaciones</span>
                    <i className={`fas fa-angle-left text-sm transition-transform ${expandedSections.operaciones ? '-rotate-90' : ''}`} />
                  </button>

                  <ul className={`space-y-1 overflow-hidden pl-2 transition-all ${expandedSections.operaciones ? 'mt-2 max-h-[420px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    {hasPermission('Visitas') && (
                      <li>
                        <Link to="/scanvisit" className={itemLinkClasses}>
                          <img src="/img/Icon/access-card.png" alt="Escanear visitas" className="h-5 w-5 shrink-0" />
                          <span>Escanear visitas</span>
                        </Link>
                      </li>
                    )}

                    {hasPermission('Visitas') && (
                      <li>
                        <Link to="/visit" className={itemLinkClasses}>
                          <img src="/img/Icon/user-group-men.png" alt="Fichero de visitas" className="h-5 w-5 shrink-0" />
                          <span>Fichero de visitas</span>
                        </Link>
                      </li>
                    )}

                    {hasPermission('Doctores') && (
                      <li>
                        <Link to="/doctor" className={itemLinkClasses}>
                          <img src="/img/Icon/people_doctor.png" alt="Fichero de doctores" className="h-5 w-5 shrink-0" />
                          <span>Fichero de doctores</span>
                        </Link>
                      </li>
                    )}

                    {hasPermission('Pacientes') && (
                      <li>
                        <Link to="/patients" className={itemLinkClasses}>
                          <i className="fas fa-user-injured h-5 w-5 shrink-0 text-center" />
                          <span>Fichero de pacientes</span>
                        </Link>
                      </li>
                    )}

                    {hasPermission('Consultorios') && (
                      <li>
                        <Link to="/consultorios" className={itemLinkClasses}>
                          <img src="/img/Icon/pharmacy.png" alt="Fichero de consultorios" className="h-5 w-5 shrink-0" />
                          <span>Fichero de consultorios</span>
                        </Link>
                      </li>
                    )}

                    {hasPermission('Agenda') && (
                      <li>
                        <Link to="/agenda" className={itemLinkClasses}>
                          <img src="/img/Icon/calendar2.png" alt="Agendamientos" className="h-5 w-5 shrink-0" />
                          <span>Agendamientos</span>
                        </Link>
                      </li>
                    )}


                  </ul>

                </li>

                

              )}

              {(hasPermission('Herraminetas_usuarios') || hasPermission('Organizacion')) && (

                <li>
                    <button
                    type="button"
                    onClick={(event) => handleSectionToggle(event, 'herramientas')}
                    className={sectionTitleClasses}
                  >
                    <span>Herramientas</span>
                    <i className={`fas fa-angle-left text-sm transition-transform ${expandedSections.herramientas ? '-rotate-90' : ''}`} />
                  </button>

                  <ul className={`space-y-1 overflow-hidden pl-2 transition-all ${expandedSections.herramientas ? 'mt-2 max-h-[260px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    {hasPermission('Organizacion') && (
                      <li>
                        <Link to="/organizacion" className={itemLinkClasses}>
                          <img src="/img/Icon/organogram.png" alt="Organización" className="h-5 w-5 shrink-0" />
                          <span>Organización</span>
                        </Link>
                      </li>
                    )}

                    {hasPermission('Herraminetas_usuarios') && (
                      <>
                        <li>
                          <Link to="/usuarios" className={itemLinkClasses}>
                             <img src="/img/Icon/user-group.png" alt="Usuarios" className="h-5 w-5 shrink-0" />
                            <span>Usuarios</span>
                          </Link>
                        </li>

                        <li>
                          <Link to="/usuarios/roles" className={itemLinkClasses}>
                            <img src="/img/Icon/manage-user.png" alt="Roles usuario" className="h-5 w-5 shrink-0" />
                            <span>Roles usuario</span>
                          </Link>
                        </li>
                      </>
                    )}
                  </ul>
                </li>

              )}


              {hasPermission('Reporte_Usuarios') && (
                <li>
                    <button
                    type="button"
                    onClick={(event) => handleSectionToggle(event, 'reportes')}
                    className={sectionTitleClasses}
                  >
                    <span>Reportes</span>
                    <i className={`fas fa-angle-left text-sm transition-transform ${expandedSections.reportes ? '-rotate-90' : ''}`} />
                  </button>

                  <ul className={`space-y-1 overflow-hidden pl-2 transition-all ${expandedSections.reportes ? 'mt-2 max-h-28 opacity-100' : 'max-h-0 opacity-0'}`}>
                    {hasPermission('Reporte_Usuarios') && (
                      <li>
                        <Link to="/usuarios/reporte" className={itemLinkClasses}>
                          <img src="/img/Icon/report-print.png" alt="Reporte de usuarios" className="h-5 w-5 shrink-0" />
                          <span>Reporte de usuarios</span>
                        </Link>
                      </li>
                    )}
                  </ul>
                </li>
              )}
            </ul>
        </nav>
      </div>
    </div>
  )
}
