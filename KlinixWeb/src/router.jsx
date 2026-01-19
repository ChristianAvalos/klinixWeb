import { createBrowserRouter,Navigate } from "react-router-dom";
import Layout from "./layouts/Layout";
import AuthLayout from "./layouts/AuthLayout";
import Inicio from "./views/Inicio";
import Login from "./views/Login";
import Registro from "./views/Registro";
import Usuarios from "./views/Usuarios";
import Error from "./views/Error";
import ProtectedRoute from "./hooks/ProtectedRoute";
import InicioUsuarios from "./views/InicioUsuarios";
import RolesUsuarios from "./views/RolesUsuarios";
import UserReportRolesPermission from "./report/UserReportRolesPermission";
import Organizacion from "./views/Organizacion";
import ErrorEstadoUsuario from "./views/ErrorEstadoUsuario";
import Visit from "./views/Visit";
import Doctor from "./views/Doctor";
import Patients from "./views/Patients";
import ScanVisit from "./views/ScanVisit";
import Consultorios from "./views/Consultorios";


const router = createBrowserRouter ([
    {
        path: '/',
        element:  <Layout/>,
        children: [
            {
                index:true,
                element: (
                    <ProtectedRoute permission="Principal">
                        <Inicio/>
                    </ProtectedRoute>
            
                    )
                    },
            {
                path:'/usuarios',
                
                element: (
                <ProtectedRoute permission="Herraminetas_usuarios">
                    <Usuarios/>
                </ProtectedRoute>
                )
            },
            {
                path:'/usuarios/roles',
                
                element: (
                <ProtectedRoute permission="Herraminetas_usuarios">
                    <RolesUsuarios/>
                </ProtectedRoute>
                )
            },
            {
                path:'/error',
                element: <Error/>
            },

            {
                path:'/iniciousuarios',
                element: <InicioUsuarios/>
            },
            {
                path:'/usuarios/reporte',
                
                element: (
                <ProtectedRoute permission="Reporte_Usuarios">
                    <UserReportRolesPermission/>
                </ProtectedRoute>
                )
            },
            {
                path:'/organizacion',
                
                element: (
                <ProtectedRoute permission="Organizacion">
                    <Organizacion/>
                </ProtectedRoute>
                )
            },
            {
                path:'/scanvisit',
                
                element: (
                <ProtectedRoute permission="Visitas">
                    <ScanVisit/>
                </ProtectedRoute>
                )
            },
            {
                path:'/visit',
                
                element: (
                <ProtectedRoute permission="Visitas">
                    <Visit/>
                </ProtectedRoute>
                )
            },
            {
                path:'/doctor',
                
                element: (
                <ProtectedRoute permission="Doctores">
                    <Doctor/>
                </ProtectedRoute>
                )
            },
            {
                path:'/patients',
                
                element: (
                <ProtectedRoute permission="Pacientes">
                    <Patients/>
                </ProtectedRoute>
                )
            },
            {
                path:'/consultorios',
                
                element: (
                <ProtectedRoute permission="Consultorios">
                    <Consultorios/>
                </ProtectedRoute>
                )
            },

        ]
    },
    {
        path: '/auth',
        element: <AuthLayout />,
        children: [
            {
                path: '', // Ruta vacía para '/auth'
                element: <Navigate to="/auth/login" replace /> // Redirigir a '/auth/login'
            },
            {
                path:'/auth/login',
                element: <Login />
            },
            {
                path: '/auth/registro',
                element: <Registro/>
            }
        ]
    },
    {
        path:'/errorEstadoUsuario',
        element: (
                <ErrorEstadoUsuario/>
    
            )
        
        
    }
])

export default router