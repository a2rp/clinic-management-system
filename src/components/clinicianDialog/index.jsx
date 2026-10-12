import { useState } from "react";
import { FiSave, FiUserPlus } from "react-icons/fi";
import Modal from "../modal";
import styles from "./styles.module.css";

const ClinicianDialog = ({ clinician, onSave, onClose }) => {
  const [values, setValues] = useState(() => {
    if (!clinician) return { name: "", specialty: "", room: "Room 03", shiftStart: "09:00", shiftEnd: "17:00", email: "", onDuty: true, color: "mint" };
    const [shiftStart, shiftEnd] = clinician.shift.split(" - ");
    return { ...clinician, shiftStart, shiftEnd };
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
    if (!values.name.trim()) nextErrors.name = "Enter the clinician's name.";
    if (!values.specialty.trim()) nextErrors.specialty = "Add a specialty.";
    if (!values.room.trim()) nextErrors.room = "Assign a room.";
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) nextErrors.email = "Enter a valid email address.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onSave({ ...values, name: values.name.trim(), specialty: values.specialty.trim(), room: values.room.trim(), shift: values.shiftStart + " - " + values.shiftEnd, email: values.email.trim() });
  };

  return (
    <Modal title={clinician ? "Update care team profile" : "Add a clinician"} description="Set a clinician's specialty, room, and regular shift." onClose={onClose}>
      <form className={styles.form} onSubmit={submitForm} noValidate>
        <div className={styles.field}>
          <label htmlFor="clinician-name">Full name</label>
          <input id="clinician-name" name="name" value={values.name} onChange={updateValue} placeholder="Dr. First Last" data-dialog-focus aria-invalid={Boolean(errors.name)} />
          {errors.name && <small className={styles.error}>{errors.name}</small>}
        </div>

        <div className={styles.twoColumns}>
          <div className={styles.field}>
            <label htmlFor="clinician-specialty">Specialty</label>
            <input id="clinician-specialty" name="specialty" value={values.specialty} onChange={updateValue} placeholder="Family medicine" aria-invalid={Boolean(errors.specialty)} />
            {errors.specialty && <small className={styles.error}>{errors.specialty}</small>}
          </div>
          <div className={styles.field}>
            <label htmlFor="clinician-room">Primary room</label>
            <input id="clinician-room" name="room" value={values.room} onChange={updateValue} placeholder="Room 03" aria-invalid={Boolean(errors.room)} />
            {errors.room && <small className={styles.error}>{errors.room}</small>}
          </div>
        </div>

        <div className={styles.twoColumns}>
          <div className={styles.field}>
            <label htmlFor="clinician-shift-start">Shift starts</label>
            <input id="clinician-shift-start" type="time" name="shiftStart" value={values.shiftStart} onChange={updateValue} />
          </div>
          <div className={styles.field}>
            <label htmlFor="clinician-shift-end">Shift ends</label>
            <input id="clinician-shift-end" type="time" name="shiftEnd" value={values.shiftEnd} onChange={updateValue} />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="clinician-email">Work email <span>Optional</span></label>
          <input id="clinician-email" type="email" name="email" value={values.email} onChange={updateValue} placeholder="name@lumaclinic.demo" aria-invalid={Boolean(errors.email)} />
          {errors.email && <small className={styles.error}>{errors.email}</small>}
        </div>

        <div className={styles.formActions}>
          <button className={styles.cancelButton} type="button" onClick={onClose}>Cancel</button>
          <button className={styles.submitButton} type="submit">
            {clinician ? <FiSave aria-hidden="true" /> : <FiUserPlus aria-hidden="true" />}
            {clinician ? "Save profile" : "Add clinician"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ClinicianDialog;
