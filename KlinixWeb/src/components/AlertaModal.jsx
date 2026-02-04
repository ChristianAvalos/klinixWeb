import React from 'react';

export default function Alerta({ tipo = 'informativo', mensaje, onClose, onConfirm }) {
    const titulo = tipo === 'confirmacion' ? 'Confirmación' : 'Aviso';

    return (
        <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
                <div className="flex items-start justify-between gap-4 px-6 pt-6">
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight text-slate-900">{titulo}</h2>
                        <p className="mt-1 text-sm text-slate-500">{mensaje}</p>
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

                <div className="px-6 pb-6">
                    {tipo === 'confirmacion' ? (
                        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                className="inline-flex items-center justify-center rounded-lg border border-red-200 klinix-danger px-4 py-2 font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-red-200"
                                onClick={onClose}
                            >
                                No
                            </button>
                            <button
                                type="button"
                                className="inline-flex items-center justify-center rounded-lg klinix-gradient px-4 py-2 font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                onClick={onConfirm}
                            >
                                Sí
                            </button>
                        </div>
                    ) : (
                        <div className="mt-8 flex justify-end">
                            <button
                                type="button"
                                className="inline-flex items-center justify-center rounded-lg border border-red-200 klinix-danger px-4 py-2 font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-red-200"
                                onClick={onClose}
                            >
                                Cerrar
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
