import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FiArrowLeft, FiArrowRight, FiCalendar, FiClock, FiFilter, FiPlus, FiSearch, FiUsers } from "react-icons/fi";
import AppointmentDetails from "../../components/appointmentDetails";
import { appointmentStatuses } from "../../data/seedData";
import { formatDate, formatTime, getInitials } from "../../utils/formatters";
import styles from "./styles.module.css";

const shiftDate = (dateKey, amount) => {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day, 12);
  date.setDate(date.getDate() + amount);
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
};

const AppointmentsPage = ({ appointments, patients, clinicians, today, onOpenAppointment, onEditAppointment, onDeleteAppointment, onStatusChange }) => {
  const [selectedDate, setSelectedDate] = useState(today);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [clinicianFilter, setClinicianFilter] = useState("all");
  const [selectedId, setSelectedId] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!searchParams.has("create")) return;
    onOpenAppointment();
    setSearchParams({}, { replace: true });
  }, [searchParams, setSearchParams, onOpenAppointment]);

  const visibleAppointments = useMemo(() => appointments
    .filter((appointment) => appointment.date === selectedDate)
    .filter((appointment) => statusFilter === "all" || appointment.status === statusFilter)
    .filter((appointment) => clinicianFilter === "all" || appointment.clinicianId === clinicianFilter)
    .filter((appointment) => {
      const patient = patients.find((item) => item.id === appointment.patientId);
      const clinician = clinicians.find((item) => item.id === appointment.clinicianId);
      const query = search.trim().toLowerCase();
      return !query || [patient?.name, clinician?.name, appointment.type, appointment.room].some((value) => value?.toLowerCase().includes(query));
    })
    .sort((a, b) => a.time.localeCompare(b.time)), [appointments, patients, clinicians, selectedDate, statusFilter, clinicianFilter, search]);

  const selectedAppointment = appointments.find((appointment) => appointment.id === selectedId);
  const selectedPatient = patients.find((patient) => patient.id === selectedAppointment?.patientId);
  const selectedClinician = clinicians.find((clinician) => clinician.id === selectedAppointment?.clinicianId);
  const dayTotal = appointments.filter((appointment) => appointment.date === selectedDate).length;
  const bookedClinicians = new Set(appointments.filter((appointment) => appointment.date === selectedDate).map((appointment) => appointment.clinicianId)).size;

  const updateAppointmentStatus = (id, status) => onStatusChange(id, status);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeading}>
        <div>
          <p className={styles.sectionLabel}>Clinic schedule</p>
          <h1>Appointment book</h1>
          <p>Keep each visit, provider, and room easy to find.</p>
        </div>
        <button className={styles.newButton} type="button" onClick={onOpenAppointment}><FiPlus aria-hidden="true" /> Book a visit</button>
      </div>

      <section className={styles.dateToolbar} aria-label="Appointment date and filters">
        <div className={styles.dateControls}>
          <button type="button" aria-label="Previous day" onClick={() => setSelectedDate((current) => shiftDate(current, -1))}><FiArrowLeft aria-hidden="true" /></button>
          <button className={styles.todayButton} type="button" onClick={() => setSelectedDate(today)}>Today</button>
          <button type="button" aria-label="Next day" onClick={() => setSelectedDate((current) => shiftDate(current, 1))}><FiArrowRight aria-hidden="true" /></button>
          <strong>{formatDate(selectedDate, { weekday: "long", month: "long", day: "numeric" })}</strong>
        </div>
        <div className={styles.filters}>
          <label className={styles.searchBox}>
            <FiSearch aria-hidden="true" />
            <span className={styles.srOnly}>Search appointments</span>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a patient or visit" />
          </label>
          <label className={styles.filterSelect}>
            <FiFilter aria-hidden="true" />
            <span className={styles.srOnly}>Filter by visit status</span>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="all">All statuses</option>
              {appointmentStatuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
            </select>
          </label>
        </div>
      </section>

      <div className={styles.contentGrid}>
        <section className={styles.bookPanel}>
          <div className={styles.panelHeading}>
            <div>
              <p className={styles.sectionLabel}>Visit list</p>
              <h2>{visibleAppointments.length} appointments</h2>
            </div>
            <span className={styles.dayChip}><FiCalendar aria-hidden="true" /> {dayTotal} booked today</span>
          </div>

          <div className={styles.tableHeader} aria-hidden="true">
            <span>Time & patient</span>
            <span>Care team</span>
            <span>Status</span>
            <span>Room</span>
          </div>

          <div className={styles.appointmentRows}>
            {visibleAppointments.map((appointment) => {
              const patient = patients.find((item) => item.id === appointment.patientId);
              const clinician = clinicians.find((item) => item.id === appointment.clinicianId);
              return (
                <article className={styles.appointmentRow} key={appointment.id}>
                  <div className={styles.patientCell}>
                    <span className={styles.time}>{formatTime(appointment.time)}</span>
                    <span className={styles.avatar}>{getInitials(patient?.name)}</span>
                    <div className={styles.patientInfo}>
                      <button type="button" onClick={() => setSelectedId(appointment.id)}>{patient?.name || "Patient record unavailable"}</button>
                      <small>{appointment.type} · {appointment.duration} min</small>
                    </div>
                  </div>
                  <div className={styles.clinicianCell}>
                    <span>{clinician?.name || "Unassigned"}</span>
                    <small>{clinician?.specialty || "Care team"}</small>
                  </div>
                  <label className={styles.statusControl}>
                    <span className={styles.srOnly}>Update visit status for {patient?.name || "patient"}</span>
                    <select className={[styles.statusSelect, styles[appointment.status]].filter(Boolean).join(" ")} value={appointment.status} onChange={(event) => updateAppointmentStatus(appointment.id, event.target.value)}>
                      {appointmentStatuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
                    </select>
                  </label>
                  <div className={styles.roomCell}>
                    <span>{appointment.room}</span>
                    <button type="button" onClick={() => setSelectedId(appointment.id)} aria-label={"Open appointment details for " + (patient?.name || "patient")}>Details <FiArrowRight aria-hidden="true" /></button>
                  </div>
                </article>
              );
            })}

            {visibleAppointments.length === 0 && (
              <div className={styles.emptyState}>
                <span><FiCalendar aria-hidden="true" /></span>
                <h3>{dayTotal ? "No visits match these filters" : "No appointments for this day"}</h3>
                <p>{dayTotal ? "Clear your search or choose a different status or clinician." : "Book a visit to add it to the clinic schedule."}</p>
                {dayTotal ? (
                  <button type="button" onClick={() => { setSearch(""); setStatusFilter("all"); setClinicianFilter("all"); }}>Clear filters</button>
                ) : (
                  <button type="button" onClick={onOpenAppointment}>Book a visit</button>
                )}
              </div>
            )}
          </div>
        </section>

        <aside className={styles.teamPanel}>
          <div className={styles.panelHeading}>
            <div>
              <p className={styles.sectionLabel}>Care coverage</p>
              <h2>Team on the floor</h2>
            </div>
            <FiUsers className={styles.panelIcon} aria-hidden="true" />
          </div>
          <p className={styles.teamSummary}>{bookedClinicians} clinicians have visits on {selectedDate === today ? "today" : formatDate(selectedDate, { month: "short", day: "numeric" })}.</p>
          <div className={styles.teamFilter}>
            <label htmlFor="clinician-filter">Show clinician</label>
            <select id="clinician-filter" value={clinicianFilter} onChange={(event) => setClinicianFilter(event.target.value)}>
              <option value="all">All care team</option>
              {clinicians.map((clinician) => <option key={clinician.id} value={clinician.id}>{clinician.name}</option>)}
            </select>
          </div>
          <div className={styles.clinicianList}>
            {clinicians.map((clinician) => {
              const count = appointments.filter((appointment) => appointment.date === selectedDate && appointment.clinicianId === clinician.id).length;
              return (
                <button className={[styles.clinicianItem, clinicianFilter === clinician.id && styles.clinicianSelected].filter(Boolean).join(" ")} type="button" key={clinician.id} onClick={() => setClinicianFilter((current) => current === clinician.id ? "all" : clinician.id)}>
                  <span className={[styles.clinicianAvatar, styles[clinician.color]].filter(Boolean).join(" ")}>{getInitials(clinician.name)}</span>
                  <span className={styles.clinicianInfo}>
                    <strong>{clinician.name}</strong>
                    <small>{clinician.room} · {clinician.shift}</small>
                  </span>
                  <span className={styles.visitCount}>{count}</span>
                </button>
              );
            })}
          </div>
          <div className={styles.coverageNote}>
            <FiClock aria-hidden="true" />
            <p>Status changes update the clinic day immediately.</p>
          </div>
        </aside>
      </div>

      {selectedAppointment && (
        <AppointmentDetails
          appointment={selectedAppointment}
          patient={selectedPatient}
          clinician={selectedClinician}
          onClose={() => setSelectedId("")}
          onStatusChange={onStatusChange}
          onEdit={onEditAppointment}
          onDelete={onDeleteAppointment}
        />
      )}
    </div>
  );
};

export default AppointmentsPage;
