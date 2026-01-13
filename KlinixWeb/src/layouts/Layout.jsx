import { Outlet } from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
import Header from "../components/Header"
import SideNav from "../components/SideNav"
import Footer from "../components/Footer"
export default function Layout() {
    return (
        <div className="wrapper">
            <Header />
            <SideNav />
            <div className="content-wrapper">
                <Outlet />
            </div>
            <Footer />

            <ToastContainer/>
        </div>

    )
}
