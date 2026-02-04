import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { toast } from 'react-toastify'
import { format, parse, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfDay, endOfDay, addDays, setHours, setMinutes, getDay } from 'date-fns'
import es from 'date-fns/locale/es'
import clienteAxios from '../config/axios'
import AppointmentModal, { parseApiDateTime, toApiDateTime } from './ModalAppointments'

const locales = { es }

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { locale: es }),
  getDay,
  locales,
})

const DnDCalendar = withDragAndDrop(Calendar)

function intToHexColor(value) {
  if (value === null || value === undefined || value === '') return null
  const n = Number(value)
  if (Number.isNaN(n)) return null
  // convierte int a RGB (misma idea usada en Resource.jsx)
  const unsigned = n >>> 0
  const rgb = unsigned & 0xffffff
  return `#${rgb.toString(16).padStart(6, '0').toUpperCase()}`
}

function buildEventTitle(appointment) {
  const caption = appointment?.Caption ? String(appointment.Caption).trim() : ''
  const patient = appointment?.patient
  const doctor = appointment?.doctor

  const patientName = patient ? `${patient.FirstName ?? ''} ${patient.LastName ?? ''}`.trim() : ''
  const doctorName = doctor ? `${doctor.FirstName ?? ''} ${doctor.LastName ?? ''}`.trim() : ''

  const parts = [caption, patientName && `Paciente: ${patientName}`, doctorName && `Doctor: ${doctorName}`].filter(Boolean)
  return parts.join(' · ') || 'Cita'
}

function normalizeRange(range) {
  // range puede ser: { start, end } o un array de fechas (month view)
  if (!range) return null
  if (Array.isArray(range) && range.length) {
    const start = range[0]
    const end = range[range.length - 1]
    return { start, end }
  }
  if (range.start && range.end) return range
  return null
}


function getRangeForView(view, date) {
  const base = date instanceof Date ? date : new Date(date)
  if (Number.isNaN(base.getTime())) return null

  // En month, el calendario muestra días de semanas anteriores/siguientes.
  // Por eso pedimos el rango de semanas completas.
  if (view === 'month') {
    const monthStart = startOfMonth(base)
    const monthEnd = endOfMonth(base)
    return {
      start: startOfWeek(monthStart, { locale: es }),
      end: endOfWeek(monthEnd, { locale: es }),
    }
  }
  if (view === 'day') return { start: startOfDay(base), end: endOfDay(base) }
  // Agenda (react-big-calendar) por defecto muestra ~30 días
  if (view === 'agenda') return { start: startOfDay(base), end: endOfDay(addDays(base, 30)) }
  // week: rango de semana
  return { start: startOfWeek(base, { locale: es }), end: endOfWeek(base, { locale: es }) }
}

export default function Appointments() {
  const [loading, setLoading] = useState(true)
  const [loadingEvents, setLoadingEvents] = useState(false)

  const appointmentsAbortRef = useRef(null)
  const lastRequestedKeyRef = useRef(null)
  const appointmentsCacheRef = useRef(new Map())
  const rangeDebounceRef = useRef(null)

  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [currentView, setCurrentView] = useState('week')

  const [doctors, setDoctors] = useState([])
  const [resources, setResources] = useState([])

  const [appointments, setAppointments] = useState([])
  const [range, setRange] = useState(null)

  const [filterDoctorId, setFilterDoctorId] = useState('')
  const [filterResourceId, setFilterResourceId] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('crear')
  const [modalInitial, setModalInitial] = useState(null)

  const loadCatalogs = useCallback(async (isMounted, abortController) => {
    setLoading(true)
    try {
      const currentToken = localStorage.getItem('AUTH_TOKEN');
      const [doctorsRes, resourcesRes] = await Promise.all([
        clienteAxios.get('api/doctores?all=true', {
          headers: { Authorization: `Bearer ${currentToken}` },
          signal: abortController.signal,
        }),
        clienteAxios.get('api/consultorios?all=true', {
          headers: { Authorization: `Bearer ${currentToken}` },
          signal: abortController.signal,
        }),
      ])
      if (isMounted.current) {
        setDoctors(Array.isArray(doctorsRes.data) ? doctorsRes.data : [])
        setResources(Array.isArray(resourcesRes.data) ? resourcesRes.data : [])
      }
    } catch (error) {
      if (abortController.signal.aborted) return;
      if (isMounted.current) {
        console.error('Error cargando catálogos', error)
        toast.error('Error cargando doctores/consultorios.')
      }
    } finally {
      if (isMounted.current) setLoading(false)
    }
  }, [])

  const loadAppointments = useCallback(
    async (currentRange) => {
      const norm = normalizeRange(currentRange)
      if (!norm?.start || !norm?.end) return

      const currentToken = localStorage.getItem('AUTH_TOKEN')
      if (!currentToken) return

      const startParam = toApiDateTime(new Date(norm.start))
      const endParam = toApiDateTime(new Date(norm.end))
      const rangeKey = `${startParam}__${endParam}`

      // Cancela la petición anterior si todavía está en vuelo (evita ráfagas)
      if (appointmentsAbortRef.current) {
        appointmentsAbortRef.current.abort()
      }

      // Cache: si ya cargamos este rango antes, pintamos inmediatamente sin pegarle al backend.
      if (appointmentsCacheRef.current.has(rangeKey)) {
        setAppointments(appointmentsCacheRef.current.get(rangeKey))
        setLoadingEvents(false)
        return
      }

      // Evita re-disparar el mismo rango mientras ya se está pidiendo.
      if (lastRequestedKeyRef.current === rangeKey) return
      lastRequestedKeyRef.current = rangeKey

      const abortController = new AbortController()
      appointmentsAbortRef.current = abortController

      setLoadingEvents(true)

      try {
        const { data } = await clienteAxios.get(
          `api/appointments?start=${encodeURIComponent(startParam)}&end=${encodeURIComponent(endParam)}`,
          {
            headers: { Authorization: `Bearer ${currentToken}` },
            signal: abortController.signal,
          }
        )

        const normalized = Array.isArray(data) ? data : []
        appointmentsCacheRef.current.set(rangeKey, normalized)
        setAppointments(normalized)
      } catch (error) {
        if (abortController.signal.aborted) return
        console.error('Error cargando citas', error)
        toast.error('Error cargando las citas.')
      } finally {
        if (!abortController.signal.aborted) setLoadingEvents(false)
      }
    },
    []
  )

  useEffect(() => {
    const isMounted = { current: true };
    const abortController = new AbortController();
    loadCatalogs(isMounted, abortController);
    return () => {
      isMounted.current = false;
      abortController.abort();
    };
  }, [loadCatalogs])

  useEffect(() => {
    if (!range) return

    // Debounce: si el usuario navega rápido (anterior/siguiente), solo pedimos el último rango.
    if (rangeDebounceRef.current) {
      clearTimeout(rangeDebounceRef.current)
    }
    rangeDebounceRef.current = setTimeout(() => {
      loadAppointments(range)
    }, 250)

    return () => {
      if (rangeDebounceRef.current) {
        clearTimeout(rangeDebounceRef.current)
        rangeDebounceRef.current = null
      }
    }
  }, [range, loadAppointments])

  useEffect(() => {
    return () => {
      if (appointmentsAbortRef.current) {
        appointmentsAbortRef.current.abort()
      }
    }
  }, [])

  useEffect(() => {
    const next = getRangeForView(currentView, currentDate)
    if (!next) return
    setRange(next)
  }, [currentDate, currentView])

  const handleRangeChange = useCallback(
    (nextRange, view) => {
      const norm = normalizeRange(nextRange)
      if (norm?.start && norm?.end) {
        setRange(norm)
        return
      }
      // Fallback defensivo
      const fallback = getRangeForView(view || currentView, currentDate)
      if (fallback) setRange(fallback)
    },
    [currentDate, currentView]
  )

  const events = useMemo(() => {
    const filtered = appointments.filter((a) => {
      if (filterDoctorId && String(a?.Id_Doctor) !== String(filterDoctorId)) return false
      if (filterResourceId && String(a?.Id_Resource) !== String(filterResourceId)) return false
      return true
    })

    return filtered
      .map((a) => {
        const start = parseApiDateTime(a?.Start)
        const end = parseApiDateTime(a?.Finish)
        if (!start || !end || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null

        return {
          id: a.id,
          title: buildEventTitle(a),
          start,
          end,
          allDay: false,
          __raw: a,
        }
      })
      .filter(Boolean)
  }, [appointments, filterDoctorId, filterResourceId])

  const openCreate = useCallback(
    (slotInfo) => {
      setModalMode('crear')
      setModalInitial({
        start: slotInfo?.start,
        end: slotInfo?.end,
        Start: slotInfo?.start,
        Finish: slotInfo?.end,
      })
      setModalOpen(true)
    },
    []
  )

  const openEdit = useCallback((event) => {
    setModalMode('editar')
    setModalInitial(event?.__raw ?? null)
    setModalOpen(true)
  }, [])

  const closeModal = () => setModalOpen(false)

  const handleSaved = useCallback(
    (saved) => {
      if (!saved?.id) return
      setAppointments((prev) => {
        const idx = prev.findIndex((p) => p.id === saved.id)
        if (idx === -1) return [saved, ...prev]
        const next = [...prev]
        next[idx] = saved
        return next
      })
    },
    []
  )

  const handleDeleted = useCallback((id) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const persistEventDates = useCallback(
    async ({ event, start, end }) => {
      const id = event?.id
      if (!id) return

      const currentToken = localStorage.getItem('AUTH_TOKEN')
      if (!currentToken) {
        toast.error('Sesión expirada. Inicia sesión nuevamente.')
        return
      }

      // snapshot para rollback
      const previous = appointments.find((a) => a.id === id)
      if (!previous) return

      // update optimista
      const optimisticStart = toApiDateTime(start)
      const optimisticFinish = toApiDateTime(end)

      setAppointments((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                Start: optimisticStart,
                Finish: optimisticFinish,
              }
            : a
        )
      )

      try {
        const payload = {
          EventType: previous.EventType ?? null,
          Start: optimisticStart,
          Finish: optimisticFinish,
          Caption: previous.Caption ?? null,
          Id_Patient: previous.Id_Patient,
          Id_Doctor: previous.Id_Doctor,
          Id_Resource: previous.Id_Resource ?? null,
          Location: previous.Location ?? null,
          MessageText: previous.MessageText ?? null,
          State: previous.State ?? null,
          LabelColor: previous.LabelColor ?? null,
        }

        const { data } = await clienteAxios.put(`api/appointments/${id}`, payload, {
          headers: { Authorization: `Bearer ${currentToken}` },
        })

        setAppointments((prev) => prev.map((a) => (a.id === id ? data : a)))
        toast.success('Cita actualizada.')
      } catch (error) {
        // rollback
        setAppointments((prev) => prev.map((a) => (a.id === id ? previous : a)))

        if (error?.response?.status === 422) {
          const msg = error.response.data?.message
          toast.error(msg || 'No se pudo mover la cita (conflicto o validación).')
        } else {
          console.error('Error moviendo la cita', error)
          toast.error('Error moviendo la cita.')
        }
      }
    },
    [appointments]
  )

  const messages = useMemo(
    () => ({
      next: 'Siguiente',
      previous: 'Anterior',
      today: 'Hoy',
      month: 'Mes',
      week: 'Semana',
      day: 'Día',
      agenda: 'Agenda',
      date: 'Fecha',
      time: 'Hora',
      event: 'Evento',
      noEventsInRange: 'No hay citas en este rango.',
      showMore: (total) => `+ Ver ${total} más`,
    }),
    []
  )

  const eventPropGetter = useCallback(
    (event) => {
      const raw = event?.__raw
      const relatedResource = raw?.resource ?? resources.find((r) => String(r.id) === String(raw?.Id_Resource))
      const hex = intToHexColor(relatedResource?.ResourceColor)
      if (!hex) return {}

      return {
        style: {
          backgroundColor: hex,
          borderColor: hex,
          color: '#fff',
        },
      }
    },
    [resources]
  )

  return (
    <div>
      <section className="content">
        <div className="container-fluid">
          <div className="card shadow-sm">
            <div className="card-header klinix-gradient">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <h3 className="card-title text-lg font-semibold">Agenda</h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openCreate({ start: new Date(), end: new Date(Date.now() + 30 * 60 * 1000) })}
                    className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/20"
                    disabled={loading}
                  >
                    Nueva cita
                  </button>
                </div>
              </div>
            </div>

            <div className="card-body">
              {loading ? (
                <div className="text-center text-gray-600 py-6">Cargando…</div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por doctor</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filterDoctorId}
                        onChange={(e) => setFilterDoctorId(e.target.value)}
                      >
                        <option value="">Todos</option>
                        {doctors.map((d) => (
                          <option key={d.id} value={d.id}>
                            {(d.LastName ?? '').trim()} {(d.FirstName ?? '').trim()}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por consultorio</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filterResourceId}
                        onChange={(e) => setFilterResourceId(e.target.value)}
                      >
                        <option value="">Todos</option>
                        {resources.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.ResourceNumber ? `#${r.ResourceNumber} - ` : ''}{r.ResourceName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-end gap-2">
                      <div className="text-sm text-gray-600">{`Mostrando ${events.length} cita(s)`}</div>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        onClick={() => {
                          setFilterDoctorId('')
                          setFilterResourceId('')
                        }}
                      >
                        Limpiar filtros
                      </button>
                    </div>
                  </div>

                  <div className="relative" style={{ height: '65vh' }}>
                  {loadingEvents && (
                    <div className="absolute right-2 top-2 z-10 rounded bg-white/90 px-3 py-1 text-sm text-gray-700 shadow">
                      Cargando citas…
                    </div>
                  )}
                  <DnDCalendar
                    localizer={localizer}
                    culture="es"
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    view={currentView}
                    date={currentDate}
                    selectable
                    onSelectSlot={openCreate}
                    onSelectEvent={openEdit}
                    onNavigate={(date) => setCurrentDate(date)}
                    onView={(view) => setCurrentView(view)}
                    onRangeChange={handleRangeChange}
                    messages={messages}
                    popup
                    eventPropGetter={eventPropGetter}
                    draggableAccessor={() => true}
                    resizable
                    onEventDrop={({ event, start, end }) => persistEventDates({ event, start, end })}
                    onEventResize={({ event, start, end }) => persistEventDates({ event, start, end })}
                    step={30}
                    timeslots={2}
                    min={setMinutes(setHours(new Date(), 7), 0)}
                    max={setMinutes(setHours(new Date(), 19), 0)}
                    scrollToTime={setMinutes(setHours(new Date(), 7), 0)}
                    style={{ height: '100%' }}
                  />
                </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <AppointmentModal
        isOpen={modalOpen}
        mode={modalMode}
        onClose={closeModal}
        onSaved={handleSaved}
        onDeleted={handleDeleted}
        doctors={doctors}
        resources={resources}
        initial={modalInitial}
        defaultDoctorId={filterDoctorId}
        defaultResourceId={filterResourceId}
      />
    </div>
  )
}
