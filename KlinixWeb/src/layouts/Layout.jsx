import { useEffect } from 'react';
import { Outlet } from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
import Header from "../components/Header"
import SideNav from "../components/SideNav"
import Footer from "../components/Footer"
import { PermisosProvider } from "../context/PermisosContext";
import { ThemeProvider } from "../context/ThemeContext";
export default function Layout() {
    useEffect(() => {
        const body = document.body;
        body.classList.remove('wrapper');
        body.classList.add('hold-transition', 'layout-fixed');

        return () => {
            body.classList.remove('hold-transition', 'layout-fixed');
        };
    }, []);

    return (
        <PermisosProvider>
            <ThemeProvider>
                <div className="wrapper">
                    <Header />
                    <aside className="main-sidebar fixed inset-y-0 left-0 flex font-bold klinix-sidenav klinix-gradient elevation-4 !z-[1040]">
                        <SideNav />
                    </aside>
                    <main className="content-wrapper bg-white p-3">
                        <Outlet />
                    </main>
                    <Footer />
                    <ToastContainer />
                </div>
            </ThemeProvider>
        </PermisosProvider>
    )
}
