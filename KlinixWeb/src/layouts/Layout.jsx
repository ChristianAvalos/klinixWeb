import { Outlet } from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
import Header from "../components/Header"
import SideNav from "../components/SideNav"
import Footer from "../components/Footer"
import { PermisosProvider } from "../context/PermisosContext";
export default function Layout() {
    return (
        <PermisosProvider>
            <div className="wrapper">
                <Header />
                <aside className="main-sidebar font-bold text-white elevation-4 !z-[1]">
                    <SideNav />
                </aside>
                <main className="content-wrapper flex-1 h-screen overflow-y-scroll bg-gray-100 p-3 ml-64">
                    <Outlet />
                </main>
                <Footer />
                <ToastContainer />
            </div>
        </PermisosProvider>
    )
}
