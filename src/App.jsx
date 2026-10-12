import { useCallback, useState } from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import AppointmentDetails from "./components/appointmentDetails";
import AppointmentDialog from "./components/appointmentDialog";
import ClinicianDialog from "./components/clinicianDialog";
import ConfirmDialog from "./components/confirmDialog";
import Footer from "./components/footer";
import Header from "./components/header";
import PatientDialog from "./components/patientDialog";
import Toast from "./components/toast";
import AppointmentsPage from "./pages/appointments";
import CareTeamPage from "./pages/careTeam";
import OverviewPage from "./pages/overview";
import PatientsPage from "./pages/patients";
import { initialAppointments, initialClinicians, initialPatients, todayKey } from "./data/seedData";
import { makeId, statusLabel } from "./utils/formatters";
import styles from "./App.module.css";

const NotFound = () => (
  <section className={styles.notFound}>
    <span>404</span>
    <h1>This clinic page is unavailable.</h1>
    <p>Choose a workspace page to continue.</p>
    <Link to="/overview"><FiArrowLeft aria-hidden="true" /> Back to overview</Link>
  </section>
);

const App = () => {
  const [patients, setPatients] = useState(initialPatients);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [clinicians, setClinicians] = useState(initialClinicians);
  const [dialog, setDialog] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((type, message) => setToast({ type, message, id: Date.now() }), []);
  const closeToast = useCallback(() => setToast(null), []);
  const closeDialog = useCallback(() => setDialog(null), []);
  const openAppointment = useCallback((patientId = "") => setDialog({ type: "appointment", patientId }), []);
  const openAppointmentDetails = useCallback((appointment) => setDialog({ type: "appointmentDetails", appointment }), []);

  const editAppointment = useCallback((appointment) => setDialog({ type: "appointment", appointment }), []);
  const editPatient = useCallback((patient) => setDialog({ type: "patient", patient }), []);
  const editClinician = useCallback((clinician) => setDialog({ type: "clinician", clinician }), []);

  const saveAppointment = (values) => {
    const isEditing = Boolean(values.id);
    const appointment = { ...values, id: values.id || makeId("visit") };
    setAppointments((current) => isEditing ? current.map((item) => item.id === appointment.id ? appointment : item) : [...current, appointment]);
    setPatients((current) => current.map((patient) => patient.id === appointment.patientId && (!patient.nextVisit || appointment.date < patient.nextVisit) ? { ...patient, nextVisit: appointment.date, status: patient.status === "Inactive" ? "Active" : patient.status } : patient));
    setDialog(null);
    showToast("success", isEditing ? "Appointment details have been updated." : "Visit booked and added to the clinic schedule.");
  };

  const savePatient = (values) => {
    const isEditing = Boolean(values.id);
    const patient = { ...values, id: values.id || makeId("patient") };
    setPatients((current) => isEditing ? current.map((item) => item.id === patient.id ? patient : item) : [patient, ...current]);
    setDialog(null);
    showToast("success", isEditing ? "Patient record has been updated." : "Patient added to the directory.");
  };

  const saveClinician = (values) => {
    const isEditing = Boolean(values.id);
    const { shiftStart, shiftEnd, ...profile } = values;
    const clinician = { ...profile, shift: shiftStart + " - " + shiftEnd, id: values.id || makeId("clinician") };
    setClinicians((current) => isEditing ? current.map((item) => item.id === clinician.id ? clinician : item) : [...current, clinician]);
    setDialog(null);
    showToast("success", isEditing ? "Care team profile has been updated." : "Clinician added to the care team.");
  };

  const updateAppointmentStatus = (id, status) => {
    const appointment = appointments.find((item) => item.id === id);
    if (!appointment || appointment.status === status) return;
    setAppointments((current) => current.map((item) => item.id === id ? { ...item, status } : item));
    if (status === "completed") setPatients((current) => current.map((patient) => patient.id === appointment.patientId ? { ...patient, lastVisit: appointment.date } : patient));
    showToast("success", (appointment.type || "Visit") + " marked " + statusLabel(status).toLowerCase() + ".");
  };

  const toggleClinicianDuty = (clinician) => {
    const nextOnDuty = !clinician.onDuty;
    setClinicians((current) => current.map((item) => item.id === clinician.id ? { ...item, onDuty: nextOnDuty } : item));
    showToast("success", clinician.name + (nextOnDuty ? " is now marked on duty." : " is now marked off duty."));
  };

  const requestDelete = (type, record) => setConfirm({ type, record });

  const confirmDelete = () => {
    if (!confirm) return;
    const { type, record } = confirm;
    if (type === "patient") {
      const relatedCount = appointments.filter((appointment) => appointment.patientId === record.id).length;
      setPatients((current) => current.filter((patient) => patient.id !== record.id));
      setAppointments((current) => current.filter((appointment) => appointment.patientId !== record.id));
      showToast("success", relatedCount ? "Patient and " + relatedCount + " linked visit" + (relatedCount === 1 ? " were" : "s were") + " removed." : "Patient removed from the directory.");
    } else if (type === "clinician") {
      const relatedCount = appointments.filter((appointment) => appointment.clinicianId === record.id).length;
      setClinicians((current) => current.filter((clinician) => clinician.id !== record.id));
      setAppointments((current) => current.map((appointment) => appointment.clinicianId === record.id ? { ...appointment, clinicianId: "" } : appointment));
      showToast("success", relatedCount ? "Clinician removed. " + relatedCount + " visit" + (relatedCount === 1 ? " is" : "s are") + " now unassigned." : "Clinician removed from the care team.");
    } else {
      setAppointments((current) => current.filter((appointment) => appointment.id !== record.id));
      showToast("success", "Appointment removed from the schedule.");
    }
    setConfirm(null);
  };

  const currentAppointment = dialog?.appointment;
  const currentPatient = patients.find((patient) => patient.id === currentAppointment?.patientId);
  const currentClinician = clinicians.find((clinician) => clinician.id === currentAppointment?.clinicianId);
  const confirmationDetails = confirm && {
    patient: {
      title: "Remove this patient record?",
      description: "This removes " + confirm.record.name + " and " + appointments.filter((appointment) => appointment.patientId === confirm.record.id).length + " linked appointment record(s). This action cannot be undone.",
    },
    clinician: {
      title: "Remove this clinician?",
      description: confirm.record.name + " will be removed from the care team. Linked appointments remain but become unassigned.",
    },
    appointment: {
      title: "Remove this appointment?",
      description: "The visit for " + (patients.find((patient) => patient.id === confirm.record.patientId)?.name || "this patient") + " will be removed from the schedule.",
    },
  }[confirm.type];

  return (
    <div className={styles.appShell}>
      <Header />
      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<Navigate to="/overview" replace />} />
          <Route path="/overview" element={<OverviewPage appointments={appointments} patients={patients} clinicians={clinicians} today={todayKey} onStatusChange={updateAppointmentStatus} onEditAppointment={editAppointment} onDeleteAppointment={(appointment) => requestDelete("appointment", appointment)} showToast={showToast} />} />
          <Route path="/appointments" element={<AppointmentsPage appointments={appointments} patients={patients} clinicians={clinicians} today={todayKey} onOpenAppointment={openAppointment} onEditAppointment={editAppointment} onDeleteAppointment={(appointment) => requestDelete("appointment", appointment)} onStatusChange={updateAppointmentStatus} />} />
          <Route path="/patients" element={<PatientsPage patients={patients} appointments={appointments} clinicians={clinicians} onNewPatient={() => setDialog({ type: "patient" })} onEditPatient={editPatient} onDeletePatient={(patient) => requestDelete("patient", patient)} onEditAppointment={editAppointment} onDeleteAppointment={(appointment) => requestDelete("appointment", appointment)} onStatusChange={updateAppointmentStatus} />} />
          <Route path="/care-team" element={<CareTeamPage clinicians={clinicians} patients={patients} appointments={appointments} today={todayKey} onNewClinician={() => setDialog({ type: "clinician" })} onEditClinician={editClinician} onDeleteClinician={(clinician) => requestDelete("clinician", clinician)} onToggleDuty={toggleClinicianDuty} onOpenAppointment={openAppointmentDetails} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Toast toast={toast} onDismiss={closeToast} />

      {dialog?.type === "appointment" && <AppointmentDialog appointment={dialog.appointment} initialPatientId={dialog.patientId} patients={patients} clinicians={clinicians} today={todayKey} onSave={saveAppointment} onClose={closeDialog} />}
      {dialog?.type === "patient" && <PatientDialog patient={dialog.patient} onSave={savePatient} onClose={closeDialog} />}
      {dialog?.type === "clinician" && <ClinicianDialog clinician={dialog.clinician} onSave={saveClinician} onClose={closeDialog} />}
      {dialog?.type === "appointmentDetails" && <AppointmentDetails appointment={currentAppointment} patient={currentPatient} clinician={currentClinician} onClose={closeDialog} onStatusChange={updateAppointmentStatus} onEdit={editAppointment} onDelete={(appointment) => requestDelete("appointment", appointment)} />}
      {confirm && <ConfirmDialog title={confirmationDetails.title} description={confirmationDetails.description} confirmLabel="Remove record" onConfirm={confirmDelete} onClose={() => setConfirm(null)} />}
    </div>
  );
};

export default App;
