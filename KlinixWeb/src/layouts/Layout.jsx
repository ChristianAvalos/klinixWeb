import { Outlet } from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
import Header from "../components/Header"
import SideNav from "../components/SideNav"
import Footer from "../components/Footer"
import { PermisosProvider } from "../context/PermisosContext";
import { ThemeProvider } from "../context/ThemeContext";
export default function Layout() {
    return (
        <PermisosProvider>
            <ThemeProvider>
                <div className="wrapper">
                    <Header />
                    <aside className="main-sidebar font-bold klinix-sidenav elevation-4 !z-[1]">
                        <SideNav />
                    </aside>
                    <main className="content-wrapper flex-1 h-screen overflow-y-scroll bg-white p-3 ml-64">
                        <Outlet />
                    </main>
                    <Footer />
                    <ToastContainer />
                </div>
            </ThemeProvider>
        </PermisosProvider>
    )
}
