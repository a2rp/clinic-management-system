import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiCalendar, FiCheck, FiClock, FiPlus, FiUsers } from "react-icons/fi";
import AppointmentDetails from "../../components/appointmentDetails";
import { formatDate, formatTime, getInitials, statusLabel } from "../../utils/formatters";
import styles from "./styles.module.css";

const nextAction = {
  confirmed: { label: "Mark arrived", status: "arrived" },
  arrived: { label: "Start visit", status: "in-room" },
  "checked-in": { label: "Start visit", status: "in-room" },
  "in-room": { label: "Complete", status: "completed" },
};

const OverviewPage = ({ appointments, patients, clinicians, today, onStatusChange, onEditAppointment, onDeleteAppointment, showToast }) => {
  const [selectedId, setSelectedId] = useState("");
  const navigate = useNavigate();
  const todayVisits = appointments.filter((appointment) => appointment.date === today).sort((a, b) => a.time.localeCompare(b.time));
  const checkedIn = todayVisits.filter((appointment) => ["arrived", "checked-in", "in-room"].includes(appointment.status));
  const completed = todayVisits.filter((appointment) => appointment.status === "completed");
  const onDuty = clinicians.filter((clinician) => clinician.onDuty);
  const selectedAppointment = appointments.find((appointment) => appointment.id === selectedId);
  const selectedPatient = patients.find((patient) => patient.id === selectedAppointment?.patientId);
  const selectedClinician = clinicians.find((clinician) => clinician.id === selectedAppointment?.clinicianId);
  const progress = todayVisits.length ? Math.round((completed.length / todayVisits.length) * 100) : 0;

  const handleStatus = (id, status) => {
    const appointment = appointments.find((item) => item.id === id);
    onStatusChange(id, status);
    showToast("success", (appointment?.type || "Visit") + " moved to " + statusLabel(status).toLowerCase() + ".");
  };

  return (
    <div className={styles.page}>
      <div className={styles.dateLine}>
        <span className={styles.dateIcon}><FiCalendar aria-hidden="true" /></span>
        <span>{formatDate(today)}</span>
        <span className={styles.openTag}><i aria-hidden="true" /> Clinic open</span>
      </div>

      <div className={styles.titleRow}>
        <div>
          <p className={styles.sectionLabel}>Clinic desk</p>
          <h1>Care, moving smoothly.</h1>
          <p className={styles.subtitle}>A clear view of today's visits, people, and next steps.</p>
        </div>
        <button className={styles.bookButton} type="button" onClick={() => navigate("/appointments?create=1")}>
          <FiPlus aria-hidden="true" /> Book a visit
        </button>
      </div>

      <section className={styles.metrics} aria-label="Clinic overview">
        <article className={styles.metric}>
          <span className={styles.metricIcon}><FiCalendar aria-hidden="true" /></span>
          <div><p>Today's visits</p><strong>{todayVisits.length}</strong><small>Across the clinic</small></div>
        </article>
        <article className={styles.metric}>
          <span className={[styles.metricIcon, styles.waitingIcon].join(" ")}><FiClock aria-hidden="true" /></span>
          <div><p>In the waiting room</p><strong>{checkedIn.length}</strong><small>Checked in or ready</small></div>
        </article>
        <article className={styles.metric}>
          <span className={[styles.metricIcon, styles.teamIcon].join(" ")}><FiUsers aria-hidden="true" /></span>
          <div><p>Care team on duty</p><strong>{onDuty.length}<small className={styles.metricTotal}> / {clinicians.length}</small></strong><small>Available clinicians</small></div>
        </article>
      </section>

      <section className={styles.dayDesk}>
        <div className={styles.dayHeader}>
          <div>
            <p className={styles.sectionLabel}>The day ahead</p>
            <h2>Visit planner</h2>
          </div>
          <div className={styles.dayProgress}>
            <div><span>{completed.length} of {todayVisits.length} visits complete</span><strong>{progress}%</strong></div>
            <span className={styles.progressTrack}><i style={{ width: progress + "%" }} /></span>
          </div>
        </div>

        <div className={styles.plannerGrid}>
          <div className={styles.timeline}>
            {todayVisits.map((appointment) => {
              const patient = patients.find((item) => item.id === appointment.patientId);
              const clinician = clinicians.find((item) => item.id === appointment.clinicianId);
              const next = nextAction[appointment.status];
              return (
                <div className={styles.timelineRow} key={appointment.id}>
                  <div className={styles.timeRail}>
                    <strong>{formatTime(appointment.time)}</strong>
                    <span aria-hidden="true" />
                  </div>
                  <div className={[styles.visitCard, styles[appointment.status]].filter(Boolean).join(" ")}>
                    <button className={styles.visitSummary} type="button" onClick={() => setSelectedId(appointment.id)} aria-label={"Open visit for " + (patient?.name || "patient")}>
                      <span className={styles.avatar}>{getInitials(patient?.name)}</span>
                      <span className={styles.visitText}>
                        <strong>{patient?.name || "Patient record unavailable"}</strong>
                        <small>{appointment.type} <span>·</span> {clinician?.name || "Unassigned"}</small>
                      </span>
                    </button>
                    <span className={[styles.statusBadge, styles[appointment.status]].filter(Boolean).join(" ")}>{statusLabel(appointment.status)}</span>
                    {next && <button className={styles.nextButton} type="button" onClick={() => handleStatus(appointment.id, next.status)}>{next.label}</button>}
                    {!next && <span className={styles.doneIcon} title="Visit complete"><FiCheck aria-hidden="true" /></span>}
                  </div>
                </div>
              );
            })}
            {todayVisits.length === 0 && (
              <div className={styles.emptySchedule}>
                <FiCalendar aria-hidden="true" />
                <strong>No visits booked for today</strong>
                <p>Use the booking form to add the first appointment.</p>
                <button type="button" onClick={() => navigate("/appointments?create=1")}>Book a visit</button>
              </div>
            )}
          </div>

          <aside className={styles.waitingRoom}>
            <div className={styles.queueHeader}>
              <div>
                <p className={styles.sectionLabel}>Patient flow</p>
                <h3>Waiting room</h3>
              </div>
              <span className={styles.queueCount}>{checkedIn.length}</span>
            </div>
            {checkedIn.length > 0 ? (
              <div className={styles.queueList}>
                {checkedIn.map((appointment) => {
                  const patient = patients.find((item) => item.id === appointment.patientId);
                  const clinician = clinicians.find((item) => item.id === appointment.clinicianId);
                  return (
                    <button className={styles.queueItem} type="button" key={appointment.id} onClick={() => setSelectedId(appointment.id)}>
                      <span className={styles.avatar}>{getInitials(patient?.name)}</span>
                      <span className={styles.queueInfo}>
                        <strong>{patient?.name || "Patient"}</strong>
                        <small>{formatTime(appointment.time)} · {clinician?.name || "Care team"}</small>
                      </span>
                      <FiArrowRight aria-hidden="true" />
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className={styles.queueEmpty}><FiCheck aria-hidden="true" /><p>Everyone is up to date.</p></div>
            )}
            <div className={styles.handoff}>
              <span className={styles.handoffIcon}><FiClock aria-hidden="true" /></span>
              <div><strong>Next handoff</strong><p>{todayVisits.find((appointment) => appointment.status !== "completed") ? formatTime(todayVisits.find((appointment) => appointment.status !== "completed").time) + " · " + (patients.find((patient) => patient.id === todayVisits.find((appointment) => appointment.status !== "completed").patientId)?.name || "Next patient") : "No more visits scheduled"}</p></div>
            </div>
            <button className={styles.viewBook} type="button" onClick={() => navigate("/appointments")}>Open appointment book <FiArrowRight aria-hidden="true" /></button>
          </aside>
        </div>
      </section>

      <div className={styles.bottomNote}>
        <span><FiCheck aria-hidden="true" /></span>
        <p><strong>Ready for the next patient.</strong> Visit details and care team assignments stay together in this clinic workspace.</p>
        <button type="button" onClick={() => navigate("/patients")}>Patient records <FiArrowRight aria-hidden="true" /></button>
      </div>

      {selectedAppointment && (
        <AppointmentDetails
          appointment={selectedAppointment}
          patient={selectedPatient}
          clinician={selectedClinician}
          onClose={() => setSelectedId("")}
          onStatusChange={handleStatus}
          onEdit={onEditAppointment}
          onDelete={onDeleteAppointment}
        />
      )}
    </div>
  );
};

export default OverviewPage;
