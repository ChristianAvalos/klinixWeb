import { useEffect, useState } from 'react';
import clienteAxios from "../config/axios";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";

const ChangePasswordModal = ({ isOpen, onClose }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [errores, setErrores] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { logout} = useAuth({ middleware: 'auth' })
    // Obtener el token de autenticación
    const token = localStorage.getItem('AUTH_TOKEN');


    const handleChangePassword =  async (e) => {
        e.preventDefault();
        if (isSubmitting) return; // Evita doble click / doble submit
                // Validar que las contraseñas coincidan
                if (newPassword !== repeatPassword) {
                    setErrores({}); 
                    toast.warning('Las contraseñas no coinciden');
                    return;
                }
        setIsSubmitting(true);

        try {       
            const data = {
                currentPassword: currentPassword,
                newPassword: newPassword,
                newPassword_confirmation: repeatPassword,
            };


            const response = await clienteAxios.post('/api/cambiarpassword',data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                    
            });
            console.log(response)
            if (response.data.success) {
                // Contraseña cambiada exitosamente
                toast.success('Contraseña actualizada con éxito');
                setCurrentPassword('');
                setNewPassword('');
                setRepeatPassword('');
                onClose();
                logout();

            } 
        } catch (error) {
            if (error.response && error.response.status === 422) {
                // Si la respuesta es un error de validación, capturamos los errores
                setErrores(error.response.data.errors);

            } else {
                console.error('Ocurrió un error al cambiar la contraseña', error);
                toast.error('Ocurrió un error al cambiar la contraseña');
            }
        } finally {
            setIsSubmitting(false);
        }

        
    };

    return (
        isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

                <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
                    <div className="flex items-start justify-between gap-4 px-6 pt-6 md:px-8 md:pt-8">
                        <div>
                            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Cambiar Contraseña</h2>
                            <p className="mt-1 text-sm text-slate-500">Completa la información y guarda los cambios.</p>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                            aria-label="Cerrar"
                        >
                            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleChangePassword} className="px-6 pb-6 md:px-8 md:pb-8" aria-busy={isSubmitting}>
                        <fieldset disabled={isSubmitting} className="contents">
                        <div className="mt-6">
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1" htmlFor="currentPassword">Contraseña Actual</label>
                            <input
                                type="password"
                                id="currentPassword"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className={`border ${errores.currentPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full p-2 focus:outline-none focus:ring focus:ring-blue-400`}
                                
                            />
                            {errores.currentPassword && <p className="text-red-500 text-sm">{errores.currentPassword[0]}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1" htmlFor="newPassword">Nueva Contraseña</label>
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className={`border ${errores.newPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full p-2 focus:outline-none focus:ring focus:ring-blue-400`}
                                
                            />
                            {errores.newPassword && <p className="text-red-500 text-sm">{errores.newPassword[0]}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1" htmlFor="repeatPassword">Repetir Nueva Contraseña</label>
                            <input
                                type="password"
                                id="repeatPassword"
                                value={repeatPassword}
                                onChange={(e) => setRepeatPassword(e.target.value)}
                                className={`border ${errores.repeatPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full p-2 focus:outline-none focus:ring focus:ring-blue-400`}
                                
                            />
                            {errores.repeatPassword && <p className="text-red-500 text-sm">{errores.repeatPassword[0]}</p>}
                        </div>
                        </div>
                        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                className={`inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-500 px-4 py-2 font-medium text-white focus:outline-none focus:ring-2 focus:ring-red-200 ${isSubmitting ? 'opacity-60 cursor-not-allowed' : 'hover:bg-red-600'}`}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className={`inline-flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-900 px-4 py-2 font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 ${isSubmitting ? 'opacity-60 cursor-not-allowed' : 'hover:from-blue-800 hover:to-cyan-800'}`}
                            >
                                {isSubmitting ? 'Cambiando...' : 'Cambiar'}
                            </button>
                        </div>
                        </fieldset>
                    </form>
                </div>
            </div>
        )
    );
};

export default ChangePasswordModal;
