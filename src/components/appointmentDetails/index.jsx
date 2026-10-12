import { FiArrowUpRight, FiCalendar, FiClock, FiEdit3, FiMapPin, FiTrash2, FiUser } from "react-icons/fi";
import Modal from "../modal";
import { formatDate, formatTime, statusLabel } from "../../utils/formatters";
import styles from "./styles.module.css";

const nextAction = {
  confirmed: { status: "arrived", label: "Mark arrived" },
  arrived: { status: "in-room", label: "Move to room" },
  "checked-in": { status: "in-room", label: "Move to room" },
  "in-room": { status: "completed", label: "Complete visit" },
};

const AppointmentDetails = ({ appointment, patient, clinician, onEdit, onStatusChange, onDelete, onClose }) => {
  if (!appointment) return null;
  const action = nextAction[appointment.status];

  return (
    <Modal title={patient?.name || "Appointment details"} description="Review the visit plan and update its progress." onClose={onClose}>
      <div className={styles.details}>
        <div className={styles.statusRow}>
          <span className={[styles.status, styles[appointment.status]].filter(Boolean).join(" ")}>{statusLabel(appointment.status)}</span>
          <span className={styles.id}>Visit {appointment.id.toUpperCase()}</span>
        </div>

        <div className={styles.visitSummary}>
          <div className={styles.summaryIcon}><FiCalendar aria-hidden="true" /></div>
          <div>
            <strong>{appointment.type}</strong>
            <p>{formatDate(appointment.date)} · {formatTime(appointment.time)} · {appointment.duration} min</p>
          </div>
        </div>

        <div className={styles.informationGrid}>
          <div><span><FiUser aria-hidden="true" /> Clinician</span><strong>{clinician?.name || "Unassigned"}</strong><small>{clinician?.specialty || "No specialty assigned"}</small></div>
          <div><span><FiMapPin aria-hidden="true" /> Visit room</span><strong>{appointment.room}</strong><small>{clinician?.room ? "Clinician's primary room" : "Clinic room"}</small></div>
          <div><span><FiClock aria-hidden="true" /> Length</span><strong>{appointment.duration} minutes</strong><small>{formatTime(appointment.time)} start</small></div>
          <div><span><FiArrowUpRight aria-hidden="true" /> Patient status</span><strong>{patient?.status || "Record unavailable"}</strong><small>{patient?.phone || "No phone number"}</small></div>
        </div>

        <div className={styles.note}>
          <span>Visit preparation</span>
          <p>{appointment.note || "No preparation notes have been added."}</p>
        </div>

        <div className={styles.actions}>
          {action && <button className={styles.primaryAction} type="button" onClick={() => onStatusChange(appointment.id, action.status)}>{action.label}</button>}
          <button className={styles.secondaryAction} type="button" onClick={() => { onClose(); onEdit(appointment); }}><FiEdit3 aria-hidden="true" /> Edit visit</button>
          <button className={styles.deleteAction} type="button" onClick={() => { onClose(); onDelete(appointment); }}><FiTrash2 aria-hidden="true" /> Remove</button>
        </div>
      </div>
    </Modal>
  );
};

export default AppointmentDetails;
