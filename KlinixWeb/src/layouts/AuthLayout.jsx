import { Outlet } from "react-router-dom"

export default function AuthLayout() {
    return (
        <main className="min-h-screen flex flex-col justify-center items-center klinix-gradient">
            <Outlet />
        </main>
    )
}