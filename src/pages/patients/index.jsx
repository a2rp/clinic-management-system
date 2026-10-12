import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiCalendar, FiMail, FiPhone, FiPlus, FiSearch, FiTrash2, FiUser, FiUserPlus } from "react-icons/fi";
import AppointmentDetails from "../../components/appointmentDetails";
import { formatCompactDate, formatDate, formatTime, getInitials } from "../../utils/formatters";
import styles from "./styles.module.css";

const filterOptions = ["All", "Active", "Follow-up", "Inactive"];

const PatientsPage = ({ patients, appointments, clinicians, onNewPatient, onEditPatient, onDeletePatient, onEditAppointment, onDeleteAppointment, onStatusChange }) => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedId, setSelectedId] = useState(patients[0]?.id || "");
  const [appointmentId, setAppointmentId] = useState("");
  const navigate = useNavigate();

  const visiblePatients = useMemo(() => patients
    .filter((patient) => filter === "All" || patient.status === filter)
    .filter((patient) => [patient.name, patient.phone, patient.email, patient.reason].some((value) => value?.toLowerCase().includes(query.trim().toLowerCase())))
    .sort((a, b) => a.name.localeCompare(b.name)), [patients, filter, query]);

  const selectedPatient = visiblePatients.find((patient) => patient.id === selectedId) || visiblePatients[0];
  const patientVisits = selectedPatient ? appointments.filter((appointment) => appointment.patientId === selectedPatient.id).sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time)) : [];
  const selectedAppointment = appointments.find((appointment) => appointment.id === appointmentId);
  const visitPatient = patients.find((patient) => patient.id === selectedAppointment?.patientId);
  const visitClinician = clinicians.find((clinician) => clinician.id === selectedAppointment?.clinicianId);
  const activeCount = patients.filter((patient) => patient.status === "Active").length;
  const followUpCount = patients.filter((patient) => patient.status === "Follow-up").length;

  const bookForPatient = () => {
    if (selectedPatient) navigate("/appointments?create=1&patient=" + encodeURIComponent(selectedPatient.id));
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeading}>
        <div><p className={styles.sectionLabel}>People in your care</p><h1>Patient directory</h1><p>Contact details, visit history, and care notes in one place.</p></div>
        <button className={styles.newButton} type="button" onClick={onNewPatient}><FiUserPlus aria-hidden="true" /> Add patient</button>
      </div>

      <div className={styles.summaryStrip}>
        <div><span>Total records</span><strong>{patients.length}</strong></div>
        <div><span>Active patients</span><strong>{activeCount}</strong></div>
        <div><span>Follow-up needed</span><strong>{followUpCount}</strong></div>
      </div>

      <div className={styles.directoryGrid}>
        <section className={styles.directoryPanel}>
          <div className={styles.directoryTop}>
            <div className={styles.filterTabs} role="group" aria-label="Filter patient records">
              {filterOptions.map((option) => <button className={filter === option ? styles.activeTab : ""} type="button" key={option} onClick={() => setFilter(option)}>{option}<span>{option === "All" ? patients.length : patients.filter((patient) => patient.status === option).length}</span></button>)}
            </div>
            <label className={styles.searchBox}><FiSearch aria-hidden="true" /><span className={styles.srOnly}>Search patient records</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, phone, or visit reason" /></label>
          </div>

          <div className={styles.patientList}>
            {visiblePatients.map((patient) => {
              const count = appointments.filter((appointment) => appointment.patientId === patient.id).length;
              return (
                <button className={[styles.patientRow, patient.id === selectedPatient?.id && styles.patientSelected].filter(Boolean).join(" ")} type="button" key={patient.id} onClick={() => setSelectedId(patient.id)}>
                  <span className={styles.avatar}>{getInitials(patient.name)}</span>
                  <span className={styles.patientSummary}>
                    <span className={styles.nameLine}><strong>{patient.name}</strong><span className={[styles.status, styles[patient.status.toLowerCase().replace("-", "")]].filter(Boolean).join(" ")}>{patient.status}</span></span>
                    <small>{patient.age} years · {patient.reason || "No visit reason added"}</small><small>{patient.phone}</small>
                  </span>
                  <span className={styles.visitCount}>{count} {count === 1 ? "visit" : "visits"}</span><FiArrowRight className={styles.rowArrow} aria-hidden="true" />
                </button>
              );
            })}
            {visiblePatients.length === 0 && <div className={styles.emptyState}><FiUser aria-hidden="true" /><strong>No patient records found</strong><p>Try another search or clear the selected status.</p><button type="button" onClick={() => { setQuery(""); setFilter("All"); }}>Clear search</button></div>}
          </div>
          <div className={styles.directoryFooter}><span>Showing {visiblePatients.length} of {patients.length} records</span><span>Demo records reset on refresh</span></div>
        </section>

        {selectedPatient ? (
          <aside className={styles.recordPanel}>
            <div className={styles.recordTop}>
              <div className={styles.recordIdentity}>
                <span className={styles.largeAvatar}>{getInitials(selectedPatient.name)}</span>
                <div><span className={[styles.status, styles[selectedPatient.status.toLowerCase().replace("-", "")]].filter(Boolean).join(" ")}>{selectedPatient.status}</span><h2>{selectedPatient.name}</h2><p>{selectedPatient.age} years · {selectedPatient.pronouns}</p></div>
              </div>
              <div className={styles.recordActions}><button type="button" onClick={() => onEditPatient(selectedPatient)}>Edit record</button><button type="button" className={styles.removeButton} aria-label={"Remove " + selectedPatient.name} onClick={() => onDeletePatient(selectedPatient)}><FiTrash2 aria-hidden="true" /></button></div>
            </div>

            <div className={styles.contactCards}>
              <a href={"tel:" + selectedPatient.phone.replace(/[^\d+]/g, "")}><FiPhone aria-hidden="true" /><span><small>Phone</small><strong>{selectedPatient.phone}</strong></span></a>
              <a href={selectedPatient.email ? "mailto:" + selectedPatient.email : undefined} aria-disabled={!selectedPatient.email} onClick={(event) => { if (!selectedPatient.email) event.preventDefault(); }}><FiMail aria-hidden="true" /><span><small>Email</small><strong>{selectedPatient.email || "Not provided"}</strong></span></a>
            </div>

            <section className={styles.careNotes}>
              <div className={styles.subheading}><div><p className={styles.sectionLabel}>Care notes</p><h3>Visit preparation</h3></div><span className={styles.noteIcon}><FiUser aria-hidden="true" /></span></div>
              <div className={styles.noteBlock}><small>Primary reason</small><strong>{selectedPatient.reason || "No visit reason added"}</strong></div>
              <div className={styles.noteBlock}><small>Allergies</small><strong>{selectedPatient.allergies || "None recorded"}</strong></div>
            </section>

            <section className={styles.visitHistory}>
              <div className={styles.subheading}><div><p className={styles.sectionLabel}>Recent activity</p><h3>Visit history</h3></div><button type="button" onClick={bookForPatient}><FiPlus aria-hidden="true" /> Schedule</button></div>
              {patientVisits.length > 0 ? <div className={styles.historyList}>{patientVisits.slice(0, 4).map((appointment) => {
                const clinician = clinicians.find((item) => item.id === appointment.clinicianId);
                return <button className={styles.historyItem} type="button" key={appointment.id} onClick={() => setAppointmentId(appointment.id)}><span className={styles.historyDate}>{formatCompactDate(appointment.date)}</span><span className={styles.historyText}><strong>{appointment.type}</strong><small>{clinician?.name || "Care team"} · {formatTime(appointment.time)}</small></span><span className={styles.historyArrow}><FiArrowRight aria-hidden="true" /></span></button>;
              })}</div> : <p className={styles.noHistory}>No visits have been scheduled for this patient yet.</p>}
            </section>

            <div className={styles.nextVisit}><FiCalendar aria-hidden="true" /><span><small>Next visit</small><strong>{selectedPatient.nextVisit ? formatDate(selectedPatient.nextVisit, { month: "long", day: "numeric" }) : "Not scheduled"}</strong></span><button type="button" onClick={bookForPatient} aria-label={"Schedule a visit for " + selectedPatient.name}><FiArrowRight aria-hidden="true" /></button></div>
          </aside>
        ) : (
          <aside className={styles.recordEmpty}><FiUser aria-hidden="true" /><h2>Select a patient record</h2><p>Choose a patient from the directory to review their details.</p><button type="button" onClick={onNewPatient}><FiPlus aria-hidden="true" /> Add a patient</button></aside>
        )}
      </div>

      {selectedAppointment && <AppointmentDetails appointment={selectedAppointment} patient={visitPatient} clinician={visitClinician} onClose={() => setAppointmentId("")} onStatusChange={onStatusChange} onEdit={onEditAppointment} onDelete={onDeleteAppointment} />}
    </div>
  );
};

export default PatientsPage;
