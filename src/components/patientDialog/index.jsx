import { useState } from "react";
import { FiSave, FiUserPlus } from "react-icons/fi";
import Modal from "../modal";
import styles from "./styles.module.css";

const blankPatient = { name: "", age: "", pronouns: "she/her", phone: "", email: "", reason: "", allergies: "", status: "Active", lastVisit: "", nextVisit: "" };

const PatientDialog = ({ patient, onSave, onClose }) => {
  const [values, setValues] = useState(() => patient ? { ...patient } : blankPatient);
  const [errors, setErrors] = useState({});

  const updateValue = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const submitForm = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!values.name.trim()) nextErrors.name = "Enter the patient's full name.";
    if (!values.age || Number(values.age) < 1 || Number(values.age) > 120) nextErrors.age = "Enter an age from 1 to 120.";
    if (!values.phone.trim()) nextErrors.phone = "Add a contact phone number.";
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) nextErrors.email = "Enter a valid email address.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onSave({ ...values, name: values.name.trim(), age: Number(values.age), phone: values.phone.trim(), email: values.email.trim(), reason: values.reason.trim(), allergies: values.allergies.trim() || "None recorded" });
  };

  return (
    <Modal title={patient ? "Update patient record" : "Add a patient"} description="Keep contact and visit information ready for the care team." onClose={onClose}>
      <form className={styles.form} onSubmit={submitForm} noValidate>
        <div className={styles.twoColumns}>
          <div className={styles.field}>
            <label htmlFor="patient-name">Full name</label>
            <input id="patient-name" name="name" value={values.name} onChange={updateValue} placeholder="Patient name" data-dialog-focus aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "patient-name-error" : undefined} />
            {errors.name && <small className={styles.error} id="patient-name-error">{errors.name}</small>}
          </div>
          <div className={styles.field}>
            <label htmlFor="patient-age">Age</label>
            <input id="patient-age" type="number" min="1" max="120" name="age" value={values.age} onChange={updateValue} placeholder="Age" aria-invalid={Boolean(errors.age)} />
            {errors.age && <small className={styles.error}>{errors.age}</small>}
          </div>
        </div>

        <div className={styles.twoColumns}>
          <div className={styles.field}>
            <label htmlFor="patient-pronouns">Pronouns</label>
            <select id="patient-pronouns" name="pronouns" value={values.pronouns} onChange={updateValue}>
              <option>she/her</option>
              <option>he/him</option>
              <option>they/them</option>
              <option>prefer not to say</option>
            </select>
          </div>
          <div className={styles.field}>
            <label htmlFor="patient-status">Record status</label>
            <select id="patient-status" name="status" value={values.status} onChange={updateValue}>
              <option>Active</option>
              <option>Follow-up</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        <div className={styles.twoColumns}>
          <div className={styles.field}>
            <label htmlFor="patient-phone">Phone</label>
            <input id="patient-phone" type="tel" name="phone" value={values.phone} onChange={updateValue} placeholder="(212) 555-0100" aria-invalid={Boolean(errors.phone)} />
            {errors.phone && <small className={styles.error}>{errors.phone}</small>}
          </div>
          <div className={styles.field}>
            <label htmlFor="patient-email">Email <span>Optional</span></label>
            <input id="patient-email" type="email" name="email" value={values.email} onChange={updateValue} placeholder="patient@example.com" aria-invalid={Boolean(errors.email)} />
            {errors.email && <small className={styles.error}>{errors.email}</small>}
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="patient-reason">Primary visit reason</label>
          <input id="patient-reason" name="reason" value={values.reason} onChange={updateValue} placeholder="For example, annual wellness" />
        </div>

        <div className={styles.field}>
          <label htmlFor="patient-allergies">Allergies or care notes <span>Optional</span></label>
          <textarea id="patient-allergies" name="allergies" value={values.allergies === "None recorded" ? "" : values.allergies} onChange={updateValue} rows="3" placeholder="Add relevant information for the care team" />
        </div>

        <div className={styles.formActions}>
          <button className={styles.cancelButton} type="button" onClick={onClose}>Cancel</button>
          <button className={styles.submitButton} type="submit">
            {patient ? <FiSave aria-hidden="true" /> : <FiUserPlus aria-hidden="true" />}
            {patient ? "Save patient" : "Add patient"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PatientDialog;
