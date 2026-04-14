import { Outlet } from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"

export default function AuthLayout() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900 px-4 py-10 text-slate-900">
            <Outlet />
            <ToastContainer />
        </main>
    )
}