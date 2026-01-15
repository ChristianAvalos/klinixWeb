import { Outlet } from "react-router-dom"

export default function AuthLayout() {
    return (
        <main className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-900 to-cyan-900">
            <Outlet />
        </main>
    )
}