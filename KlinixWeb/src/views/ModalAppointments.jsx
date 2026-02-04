import { useEffect, useRef, useState } from 'react'
import AsyncSelect from 'react-select/async'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import clienteAxios from '../config/axios'
import AlertaModal from '../components/AlertaModal'

export function toDatetimeLocalValue(date) {
	if (!date) return ''
	const d = date instanceof Date ? date : new Date(date)
	if (Number.isNaN(d.getTime())) return ''
	const offset = d.getTimezoneOffset() * 60000
	return new Date(d.getTime() - offset).toISOString().slice(0, 16)
}

export function fromDatetimeLocalValue(value) {
	if (!value) return null
	const d = new Date(value)
	return Number.isNaN(d.getTime()) ? null : d
}

export function toApiDateTime(value) {
	// Acepta Date o string "YYYY-MM-DDTHH:mm" de datetime-local.
	if (!value) return null
	if (value instanceof Date) {
		if (Number.isNaN(value.getTime())) return null
		return format(value, "yyyy-MM-dd'T'HH:mm:ss")
	}
	const s = String(value).trim()
	if (!s) return null
	// Normaliza a segundos
	if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(s)) return `${s}:00`
	return s
}

export function parseApiDateTime(value) {
	if (!value) return null
	if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value

	const s = String(value).trim()
	if (!s) return null

	// Soporta "YYYY-MM-DD HH:mm:ss" (Laravel) -> ISO básico
	const normalized = s.includes(' ') && !s.includes('T') ? s.replace(' ', 'T') : s
	const d = new Date(normalized)
	return Number.isNaN(d.getTime()) ? null : d
}

export default function AppointmentModal({
 isOpen,
 mode,
 onClose,
 onSaved,
 onDeleted,
 doctors,
 resources,
 initial,
 defaultDoctorId,
 defaultResourceId,
}) {
	 const [isSubmitting, setIsSubmitting] = useState(false)
	 const [errores, setErrores] = useState({})

	 // Estados para la alerta de confirmación
	 const [mostrarAlertaModal, setMostrarAlertaModal] = useState(false)
	 const [tipoAlertaModal, setTipoAlertaModal] = useState('informativo')
	 const [mensajeAlertaModal, setMensajeAlertaModal] = useState('')
	 const [accionConfirmadaModal, setAccionConfirmadaModal] = useState(null)

	const [caption, setCaption] = useState('')
	const [doctorId, setDoctorId] = useState('')
	const [patientId, setPatientId] = useState('')
	const [resourceId, setResourceId] = useState('')
	const [startValue, setStartValue] = useState('')
	const [endValue, setEndValue] = useState('')

	// Paciente autocomplete
	const [patientOption, setPatientOption] = useState(null)

	const captionRef = useRef(null)

	const token = localStorage.getItem('AUTH_TOKEN')

	 useEffect(() => {
	   if (!isOpen) return
	   setErrores({})

	   setPatientOption(null)

	   setCaption(initial?.Caption ?? '')
	   setDoctorId(initial?.Id_Doctor ? String(initial.Id_Doctor) : (defaultDoctorId ? String(defaultDoctorId) : ''))
	   setPatientId(initial?.Id_Patient ? String(initial.Id_Patient) : '')
	   setResourceId(initial?.Id_Resource ? String(initial.Id_Resource) : (defaultResourceId ? String(defaultResourceId) : ''))

	   setStartValue(toDatetimeLocalValue(initial?.Start ? parseApiDateTime(initial.Start) : initial?.start))
	   setEndValue(toDatetimeLocalValue(initial?.Finish ? parseApiDateTime(initial.Finish) : initial?.end))
	 }, [isOpen, initial, defaultDoctorId, defaultResourceId])

	 useEffect(() => {
		 if (!isOpen) return
		 // precargar paciente actual cuando se edita
		 const p = initial?.patient
		 if (p?.id) {
			 setPatientOption({
				 value: p.id,
				 label: `${(p.LastName ?? '').trim()} ${(p.FirstName ?? '').trim()}${p.DocumentNo ? ' - ' + p.DocumentNo : ''}`,
				 data: p
			 })
			 setPatientId(String(p.id))
		 } else {
			 setPatientOption(null)
			 setPatientId('')
		 }
	 }, [isOpen, initial])



	useEffect(() => {
		if (isOpen && captionRef.current) captionRef.current.focus()
	}, [isOpen])

	 const handleSubmit = async (e) => {
		 e.preventDefault();
		 if (isSubmitting) return;

		 setIsSubmitting(true);
		 setErrores({});

		 // Validación manual
		 const nuevosErrores = {};
		 if (!patientId) {
			 nuevosErrores.Id_Patient = ['Selecciona un paciente.'];
		 }
		 if (!doctorId) {
			 nuevosErrores.Id_Doctor = ['Selecciona un doctor.'];
		 }
		 if (!resourceId) {
			 nuevosErrores.Id_Resource = ['Selecciona un consultorio.'];
		 }
		 const startDt = fromDatetimeLocalValue(startValue);
		 const endDt = fromDatetimeLocalValue(endValue);
		 if (!startDt) {
			 nuevosErrores.Start = ['Selecciona la fecha y hora de inicio.'];
		 }
		 if (!endDt) {
			 nuevosErrores.Finish = ['Selecciona la fecha y hora de fin.'];
		 }
		 if (startDt && endDt && endDt <= startDt) {
			 nuevosErrores.Finish = ['La hora fin debe ser mayor que la hora inicio.'];
		 }

		 if (Object.keys(nuevosErrores).length > 0) {
			 setErrores(nuevosErrores);
			 setIsSubmitting(false);
			 toast.error('Revisa los campos del formulario.');
			 return;
		 }

		 try {
			 const payload = {
				 Caption: caption,
				 Id_Patient: patientId ? Number(patientId) : null,
				 Id_Doctor: doctorId ? Number(doctorId) : null,
				 Id_Resource: resourceId ? String(resourceId) : null,
				 // Enviar sin zona horaria (evita desfase UTC)
				 Start: toApiDateTime(startValue),
				 Finish: toApiDateTime(endValue),
			 };

			 if (mode === 'crear') {
				 const { data } = await clienteAxios.post('api/appointments', payload, {
					 headers: { Authorization: `Bearer ${token}` },
				 });
				 toast.success('Cita creada correctamente.');
				 onSaved?.(data);
			 } else {
				 const { data } = await clienteAxios.put(`api/appointments/${initial?.id}`, payload, {
					 headers: { Authorization: `Bearer ${token}` },
				 });
				 toast.success('Cita actualizada correctamente.');
				 onSaved?.(data);
			 }
			 onClose();
		 } catch (error) {
			 if (error?.response?.status === 422) {
				 setErrores(error.response.data?.errors ?? {});
				 toast.error('Revisa los campos del formulario.');
			 } else {
				 console.error('Error al guardar la cita', error);
				 toast.error('Error al guardar la cita.');
			 }
		 } finally {
			 setIsSubmitting(false);
		 }
	 };

	 const handleDelete = () => {
		 setAccionConfirmadaModal('delete');
		 setTipoAlertaModal('confirmacion');
		 setMensajeAlertaModal('¿Estás seguro de que deseas eliminar esta cita?');
		 setMostrarAlertaModal(true);
	 };

	 const confirmarEliminacion = async () => {
		 if (!initial?.id) return;
		 setIsSubmitting(true);
		 try {
			 await clienteAxios.delete(`api/appointments/${initial.id}`, {
				 headers: { Authorization: `Bearer ${token}` },
			 });
			 toast.success('Cita eliminada correctamente.');
			 onDeleted?.(initial.id);
			 onClose();
		 } catch (error) {
			 console.error('Error al eliminar la cita', error);
			 toast.error('Error al eliminar la cita.');
		 } finally {
			 setIsSubmitting(false);
			 setMostrarAlertaModal(false);
			 setAccionConfirmadaModal(null);
		 }
	 };

	 const handleCloseAlerta = () => {
		 setMostrarAlertaModal(false);
		 setAccionConfirmadaModal(null);
	 };

	 const handleConfirmAlerta = () => {
		 setMostrarAlertaModal(false);
		 if (accionConfirmadaModal === 'delete') {
			 confirmarEliminacion();
		 }
	 };


	 if (!isOpen) return null

	 return (
		 <>
			 <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
				 <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
				 <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
					 <div className="flex items-start justify-between gap-4 px-6 pt-6 md:px-8 md:pt-8">
						 <div>
							 <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
								 {mode === 'crear' ? 'Crear cita' : 'Editar cita'}
							 </h2>
							 <p className="mt-1 text-sm text-slate-500">Agenda un paciente con su doctor y consultorio.</p>
						 </div>
						 <button
							 type="button"
							 onClick={onClose}
							 disabled={isSubmitting}
							 className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-60"
							 aria-label="Cerrar"
						 >
							 <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
								 <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
							 </svg>
						 </button>
					 </div>

					 <form onSubmit={handleSubmit} className="px-6 pb-6 md:px-8 md:pb-8" aria-busy={isSubmitting}>
						 <fieldset disabled={isSubmitting} className="mt-6 space-y-4">
							 {/* ...existing code... */}
							 <div>
								 <label className="block text-sm font-medium text-gray-700 mb-1">Motivo / Título</label>
								 <input
									 ref={captionRef}
									 type="text"
									 className={`w-full h-11 px-3 border ${errores.Caption ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
									 value={caption}
									 onChange={(e) => setCaption(e.target.value)}
								 />
								 {errores.Caption && <p className="text-red-500 text-sm">{errores.Caption[0]}</p>}
							 </div>

							 <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
								 {/* ...existing code... */}
								 <div>
									 <label className="block text-sm font-medium text-gray-700 mb-1">Paciente</label>
									<div className="relative">
										<AsyncSelect
											cacheOptions
											defaultOptions={false}
											value={patientOption}
											loadOptions={async (inputValue) => {
												if (!inputValue || inputValue.trim().length < 2) return [];
												try {
													const tipoPaciente = 2;
													const { data } = await clienteAxios.get(
														`api/pacientes?search=${encodeURIComponent(inputValue)}&id_type_people=${tipoPaciente}`,
														{ headers: { Authorization: `Bearer ${token}` } }
													);
													const items = Array.isArray(data?.data) ? data.data : [];
													return items.map((p) => ({
														value: p.id,
														label: `${(p.LastName ?? '').trim()} ${(p.FirstName ?? '').trim()}${p.DocumentNo ? ' - ' + p.DocumentNo : ''}`,
														data: p
													}));
												} catch (error) {
													return [];
												}
											}}
											onChange={option => {
												setPatientOption(option);
												setPatientId(option ? String(option.value) : '');
											}}
											placeholder="Buscar paciente por nombre o documento..."
											isClearable
											classNamePrefix="react-select"
											menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
											menuPosition="fixed"
											styles={{
												control: (base, state) => ({
													...base,
													minHeight: '2.75rem',
													backgroundColor: 'white',
													borderRadius: '0.375rem',
													borderColor: errores.Id_Patient ? '#ef4444' : '#d1d5db',
													boxShadow: state.isFocused ? '0 0 0 2px #3b82f6' : base.boxShadow,
													fontSize: '1rem',
													paddingLeft: '0.75rem',
													paddingRight: '0.75rem',
												}),
												menu: (base) => ({
													...base,
													zIndex: 99999,
													fontSize: '1rem',
													maxHeight: '300px',
													overflowY: 'auto',
												}),
												menuPortal: (base) => ({
													...base,
													zIndex: 99999,
												}),
												option: (base, state) => ({
													...base,
													backgroundColor: state.isSelected ? '#e0f2fe' : state.isFocused ? '#f1f5f9' : 'white',
													color: '#0f172a',
													fontSize: '1rem',
													padding: '0.5rem 1rem',
												}),
												singleValue: (base) => ({
													...base,
													fontSize: '1rem',
												}),
												input: (base) => ({
													...base,
													fontSize: '1rem',
												}),
												placeholder: (base) => ({
													...base,
													fontSize: '1rem',
													color: '#64748b',
												}),
												dropdownIndicator: (base) => ({
													...base,
													color: '#64748b',
												}),
												clearIndicator: (base) => ({
													...base,
													color: '#64748b',
												}),
											}}
											noOptionsMessage={() => 'No hay resultados'}
										/>
									</div>
									 {errores.Id_Patient && <p className="text-red-500 text-sm">{errores.Id_Patient[0]}</p>}
								 </div>

								 <div>
									 <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
									 <select
									   className={`w-full h-11 px-3 border ${errores.Id_Doctor ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
									   value={doctorId}
									   onChange={(e) => setDoctorId(e.target.value)}
									 >
									   <option value="">Seleccione</option>
									   {doctors.map((d) => (
									     <option key={d.id} value={d.id}>
									       {(d.LastName ?? '').trim()} {(d.FirstName ?? '').trim()}
									     </option>
									   ))}
									 </select>
									 {errores.Id_Doctor && <p className="text-red-500 text-sm">{errores.Id_Doctor[0]}</p>}
								 </div>

								 <div>
									 <label className="block text-sm font-medium text-gray-700 mb-1">Consultorio</label>
									 <select
										 className={`w-full h-11 px-3 border ${errores.Id_Resource ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
										 value={resourceId}
										 onChange={(e) => setResourceId(e.target.value)}
									 >
										 <option value="">Seleccione un consultorio</option>
										 {resources.map((r) => (
											 <option key={r.id} value={r.id}>
												 {r.ResourceNumber ? `#${r.ResourceNumber} - ` : ''}{r.ResourceName}
											 </option>
										 ))}
									 </select>
									 {errores.Id_Resource && <p className="text-red-500 text-sm">{errores.Id_Resource[0]}</p>}
								 </div>
							 </div>

							 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								 <div>
									 <label className="block text-sm font-medium text-gray-700 mb-1">Inicio</label>
									 <input
										 type="datetime-local"
										 className={`w-full h-11 px-3 border ${errores.Start ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
										 value={startValue}
										 onChange={(e) => setStartValue(e.target.value)}
										 required
									 />
									 {errores.Start && <p className="text-red-500 text-sm">{errores.Start[0]}</p>}
								 </div>
								 <div>
									 <label className="block text-sm font-medium text-gray-700 mb-1">Fin</label>
									 <input
										 type="datetime-local"
										 className={`w-full h-11 px-3 border ${errores.Finish ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
										 value={endValue}
										 onChange={(e) => setEndValue(e.target.value)}
										 required
									 />
									 {errores.Finish && <p className="text-red-500 text-sm">{errores.Finish[0]}</p>}
								 </div>
							 </div>

							 <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between pt-2">
								 <div className="flex gap-2">
									 {mode === 'editar' && (
										 <button
											 type="button"
											 onClick={handleDelete}
											 className="inline-flex items-center justify-center rounded-md klinix-danger px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
											 disabled={isSubmitting}
										 >
											 Eliminar
										 </button>
									 )}
								 </div>

								 <div className="flex gap-2 justify-end">
									 <button
										 type="button"
										 onClick={onClose}
										 className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
										 disabled={isSubmitting}
									 >
										 Cancelar
									 </button>
									 <button
										 type="submit"
										 className="inline-flex items-center justify-center rounded-md klinix-gradient px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
										 disabled={isSubmitting}
									 >
										 {isSubmitting ? 'Guardando…' : 'Guardar'}
									 </button>
								 </div>
							 </div>
						 </fieldset>
					 </form>
				 </div>
			 </div>
			 {/* Modal de confirmación de eliminación */}
			 {mostrarAlertaModal && (
				 <AlertaModal
					 tipo={tipoAlertaModal}
					 mensaje={mensajeAlertaModal}
					 onClose={handleCloseAlerta}
					 onConfirm={handleConfirmAlerta}
				 />
			 )}
		 </>
	 )
}

