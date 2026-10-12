import { useMemo, useState } from "react";
import { FiArrowRight, FiCalendar, FiClock, FiEdit2, FiMail, FiPlus, FiSearch, FiUserCheck, FiUserMinus, FiUsers } from "react-icons/fi";
import { formatTime, getInitials } from "../../utils/formatters";
import styles from "./styles.module.css";

const CareTeamPage = ({ clinicians, patients, appointments, today, onNewClinician, onEditClinician, onDeleteClinician, onToggleDuty, onOpenAppointment }) => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All clinicians");
  const filteredTeam = useMemo(() => clinicians
    .filter((clinician) => filter === "All clinicians" || (filter === "On duty" ? clinician.onDuty : !clinician.onDuty))
    .filter((clinician) => [clinician.name, clinician.specialty, clinician.room].some((value) => value.toLowerCase().includes(query.trim().toLowerCase()))), [clinicians, filter, query]);
  const todayAppointments = appointments.filter((appointment) => appointment.date === today).sort((first, second) => first.time.localeCompare(second.time));
  const onDutyCount = clinicians.filter((clinician) => clinician.onDuty).length;

  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <div><h1>Care team</h1><p>See who's on shift and keep today's clinic schedule moving.</p></div>
        <button className={styles.primaryButton} type="button" onClick={onNewClinician}><FiPlus aria-hidden="true" /> Add clinician</button>
      </div>

      <div className={styles.stats}>
        <div><span className={styles.statIcon}><FiUsers aria-hidden="true" /></span><span><small>Care team</small><strong>{clinicians.length}</strong></span></div>
        <div><span className={styles.statIcon}><FiUserCheck aria-hidden="true" /></span><span><small>On duty now</small><strong>{onDutyCount}</strong></span></div>
        <div><span className={styles.statIcon}><FiCalendar aria-hidden="true" /></span><span><small>Today's visits</small><strong>{todayAppointments.length}</strong></span></div>
      </div>

      <div className={styles.columns}>
        <section className={styles.teamPanel}>
          <div className={styles.panelHeading}>
            <div><h2>Clinician roster</h2><p>Profiles, specialties, and shift coverage</p></div>
            <span className={styles.count}>{filteredTeam.length} shown</span>
          </div>
          <div className={styles.rosterControls}>
            <label className={styles.search}><FiSearch aria-hidden="true" /><span className={styles.srOnly}>Search clinicians</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name or specialty" /></label>
            <select aria-label="Filter clinicians" value={filter} onChange={(event) => setFilter(event.target.value)}><option>All clinicians</option><option>On duty</option><option>Off duty</option></select>
          </div>
          <div className={styles.roster}>
            {filteredTeam.map((clinician) => {
              const clinicianVisits = todayAppointments.filter((appointment) => appointment.clinicianId === clinician.id);
              return (
                <article className={styles.clinicianCard} key={clinician.id}>
                  <span className={[styles.avatar, styles[clinician.color] || ""].filter(Boolean).join(" ")}>{getInitials(clinician.name)}</span>
                  <div className={styles.identity}><div className={styles.nameLine}><h3>{clinician.name}</h3><span className={[styles.duty, clinician.onDuty ? styles.available : styles.unavailable].join(" ")}><i />{clinician.onDuty ? "On duty" : "Off duty"}</span></div><p>{clinician.specialty}</p><div className={styles.details}><span><FiClock aria-hidden="true" />{clinician.shift}</span><span><FiCalendar aria-hidden="true" />{clinician.room}</span></div>{clinician.email && <a className={styles.email} href={`mailto:${clinician.email}`}><FiMail aria-hidden="true" />{clinician.email}</a>}</div>
                  <div className={styles.cardActions}>
                    <button type="button" className={styles.editButton} onClick={() => onEditClinician(clinician)} aria-label={`Edit ${clinician.name}`}><FiEdit2 aria-hidden="true" /></button>
                    <button type="button" className={styles.removeButton} onClick={() => onDeleteClinician(clinician)} aria-label={`Remove ${clinician.name}`}><FiUserMinus aria-hidden="true" /></button>
                  </div>
                  <div className={styles.cardFooter}><span>{clinicianVisits.length} visits scheduled today</span><button type="button" onClick={() => onToggleDuty(clinician)}>{clinician.onDuty ? "Mark off duty" : "Mark on duty"}</button></div>
                </article>
              );
            })}
            {filteredTeam.length === 0 && <div className={styles.empty}><FiUsers aria-hidden="true" /><strong>No clinicians match</strong><p>Try a different name or filter.</p><button type="button" onClick={() => { setQuery(""); setFilter("All clinicians"); }}>Clear filters</button></div>}
          </div>
        </section>

        <aside className={styles.schedulePanel}>
          <div className={styles.scheduleHeading}><div><span className={styles.dateBadge}><FiCalendar aria-hidden="true" /> Today</span><h2>Clinic schedule</h2><p>Appointments across the team</p></div><span className={styles.count}>{todayAppointments.length}</span></div>
          {todayAppointments.length ? <div className={styles.scheduleList}>{todayAppointments.map((appointment) => {
            const patient = patients.find((person) => person.id === appointment.patientId);
            const clinician = clinicians.find((person) => person.id === appointment.clinicianId);
            return <button className={styles.scheduleItem} key={appointment.id} type="button" onClick={() => onOpenAppointment(appointment)}><span className={styles.time}>{formatTime(appointment.time)}</span><span className={styles.event}><strong>{patient?.name || "Patient record"}</strong><small>{appointment.type} with {clinician?.name || "care team"}</small><small>{appointment.room}</small></span><FiArrowRight aria-hidden="true" /></button>;
          })}</div> : <div className={styles.emptySchedule}><FiCalendar aria-hidden="true" /><strong>No visits on the schedule</strong><p>Appointments booked for today will appear here.</p></div>}
          <div className={styles.scheduleFoot}><FiUserCheck aria-hidden="true" /><span><strong>{onDutyCount} clinicians</strong><small>available for today's care</small></span></div>
        </aside>
      </div>
    </div>
  );
};

export default CareTeamPage;
