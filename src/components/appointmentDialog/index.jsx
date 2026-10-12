import { useState } from "react";
import { FiCalendar, FiSave } from "react-icons/fi";
import Modal from "../modal";
import styles from "./styles.module.css";

const visitTypes = ["Consultation", "Follow-up", "Wellness", "First visit", "Medication review", "Cardiology", "Preventive care"];

const AppointmentDialog = ({ appointment, patients, clinicians, today, initialPatientId, onSave, onClose }) => {
  const [values, setValues] = useState(() => appointment ? { ...appointment } : {
    patientId: patients.some((patient) => patient.id === initialPatientId) ? initialPatientId : patients[0]?.id || "",
    clinicianId: clinicians.find((clinician) => clinician.onDuty)?.id || clinicians[0]?.id || "",
    date: today,
    time: "13:00",
    duration: 30,
    type: "Consultation",
    room: "Room 02",
    note: "",
  });
  const [errors, setErrors] = useState({});

  const updateValue = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const submitForm = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!values.patientId) nextErrors.patientId = "Choose a patient.";
    if (!values.clinicianId) nextErrors.clinicianId = "Choose a clinician.";
    if (!values.date) nextErrors.date = "Choose an appointment date.";
    if (!values.time) nextErrors.time = "Choose an appointment time.";
    if (!values.room.trim()) nextErrors.room = "Add a room for this visit.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onSave({ ...values, duration: Number(values.duration), room: values.room.trim(), note: values.note.trim() });
  };

  return (
    <Modal
      title={appointment ? "Update appointment" : "Book an appointment"}
      description="Keep the visit, care team, and room details together."
      size="wide"
      onClose={onClose}
    >
      <form className={styles.form} onSubmit={submitForm} noValidate>
        <div className={styles.field}>
          <label htmlFor="appointment-patient">Patient</label>
          <select id="appointment-patient" name="patientId" value={values.patientId} onChange={updateValue} data-dialog-focus aria-invalid={Boolean(errors.patientId)} aria-describedby={errors.patientId ? "appointment-patient-error" : undefined}>
            <option value="">Select a patient</option>
            {patients.filter((patient) => patient.status !== "Inactive").map((patient) => <option key={patient.id} value={patient.id}>{patient.name}</option>)}
          </select>
          {errors.patientId && <small className={styles.error} id="appointment-patient-error">{errors.patientId}</small>}
        </div>

        <div className={styles.twoColumns}>
          <div className={styles.field}>
            <label htmlFor="appointment-clinician">Clinician</label>
            <select id="appointment-clinician" name="clinicianId" value={values.clinicianId} onChange={updateValue} aria-invalid={Boolean(errors.clinicianId)}>
              <option value="">Select a clinician</option>
              {clinicians.map((clinician) => <option key={clinician.id} value={clinician.id}>{clinician.name} - {clinician.specialty}</option>)}
            </select>
            {errors.clinicianId && <small className={styles.error}>{errors.clinicianId}</small>}
          </div>
          <div className={styles.field}>
            <label htmlFor="appointment-type">Visit type</label>
            <select id="appointment-type" name="type" value={values.type} onChange={updateValue}>
              {visitTypes.map((type) => <option key={type}>{type}</option>)}
            </select>
          </div>
        </div>

        <div className={styles.twoColumns}>
          <div className={styles.field}>
            <label htmlFor="appointment-date">Date</label>
            <input id="appointment-date" type="date" name="date" value={values.date} onChange={updateValue} aria-invalid={Boolean(errors.date)} />
            {errors.date && <small className={styles.error}>{errors.date}</small>}
          </div>
          <div className={styles.field}>
            <label htmlFor="appointment-time">Start time</label>
            <input id="appointment-time" type="time" name="time" value={values.time} onChange={updateValue} aria-invalid={Boolean(errors.time)} />
            {errors.time && <small className={styles.error}>{errors.time}</small>}
          </div>
        </div>

        <div className={styles.twoColumns}>
          <div className={styles.field}>
            <label htmlFor="appointment-duration">Visit length</label>
            <select id="appointment-duration" name="duration" value={values.duration} onChange={updateValue}>
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>60 minutes</option>
            </select>
          </div>
          <div className={styles.field}>
            <label htmlFor="appointment-room">Room</label>
            <input id="appointment-room" name="room" value={values.room} onChange={updateValue} aria-invalid={Boolean(errors.room)} />
            {errors.room && <small className={styles.error}>{errors.room}</small>}
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="appointment-note">Visit note <span>Optional</span></label>
          <textarea id="appointment-note" name="note" value={values.note} onChange={updateValue} rows="3" placeholder="Anything the care team should prepare?" />
        </div>

        <div className={styles.formActions}>
          <button className={styles.cancelButton} type="button" onClick={onClose}>Cancel</button>
          <button className={styles.submitButton} type="submit">
            {appointment ? <FiSave aria-hidden="true" /> : <FiCalendar aria-hidden="true" />}
            {appointment ? "Save changes" : "Book visit"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AppointmentDialog;
