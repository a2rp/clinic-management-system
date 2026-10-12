const dateOffset = (offset) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
};

export const todayKey = dateOffset(0);

export const initialPatients = [
  { id: "pt-1042", name: "Evelyn Carter", age: 48, pronouns: "she/her", phone: "(212) 555-0138", email: "evelyn.carter@example.com", reason: "Blood pressure review", allergies: "Shellfish", status: "Active", lastVisit: dateOffset(-35), nextVisit: todayKey },
  { id: "pt-1038", name: "Omar Patel", age: 37, pronouns: "he/him", phone: "(212) 555-0164", email: "omar.patel@example.com", reason: "Annual wellness", allergies: "None recorded", status: "Active", lastVisit: dateOffset(-170), nextVisit: todayKey },
  { id: "pt-1031", name: "Grace Kim", age: 29, pronouns: "she/her", phone: "(212) 555-0195", email: "grace.kim@example.com", reason: "Follow-up consultation", allergies: "Penicillin", status: "Follow-up", lastVisit: dateOffset(-12), nextVisit: todayKey },
  { id: "pt-1027", name: "Leo Martinez", age: 65, pronouns: "he/him", phone: "(212) 555-0126", email: "leo.martinez@example.com", reason: "Medication review", allergies: "None recorded", status: "Active", lastVisit: dateOffset(-22), nextVisit: todayKey },
  { id: "pt-1019", name: "Aisha Brooks", age: 41, pronouns: "she/her", phone: "(212) 555-0183", email: "aisha.brooks@example.com", reason: "New patient visit", allergies: "Latex", status: "Active", lastVisit: dateOffset(-4), nextVisit: todayKey },
  { id: "pt-1014", name: "Daniel Reed", age: 54, pronouns: "he/him", phone: "(212) 555-0177", email: "daniel.reed@example.com", reason: "Cardiology follow-up", allergies: "None recorded", status: "Follow-up", lastVisit: dateOffset(-60), nextVisit: dateOffset(2) },
  { id: "pt-1009", name: "Nora Williams", age: 33, pronouns: "she/her", phone: "(212) 555-0141", email: "nora.williams@example.com", reason: "Preventive care", allergies: "Adhesive tape", status: "Active", lastVisit: dateOffset(-140), nextVisit: dateOffset(5) },
  { id: "pt-1002", name: "Theo Bennett", age: 22, pronouns: "they/them", phone: "(212) 555-0109", email: "theo.bennett@example.com", reason: "Seasonal allergies", allergies: "None recorded", status: "Inactive", lastVisit: dateOffset(-210), nextVisit: "" },
];

export const initialClinicians = [
  { id: "dr-01", name: "Dr. Mira Kapoor", specialty: "Family medicine", room: "Room 02", shift: "08:00 - 16:00", email: "mira.kapoor@lumaclinic.demo", onDuty: true, color: "mint" },
  { id: "dr-02", name: "Dr. Adrian Cole", specialty: "Internal medicine", room: "Room 04", shift: "09:00 - 17:00", email: "adrian.cole@lumaclinic.demo", onDuty: true, color: "blue" },
  { id: "dr-03", name: "Dr. Priya Shah", specialty: "Cardiology", room: "Room 06", shift: "08:30 - 16:30", email: "priya.shah@lumaclinic.demo", onDuty: true, color: "peach" },
  { id: "dr-04", name: "Dr. Gabriel Ross", specialty: "Pediatrics", room: "Room 01", shift: "10:00 - 18:00", email: "gabriel.ross@lumaclinic.demo", onDuty: false, color: "lavender" },
];

export const initialAppointments = [
  { id: "ap-2401", patientId: "pt-1042", clinicianId: "dr-01", date: todayKey, time: "08:30", duration: 30, type: "Review", room: "Room 02", status: "completed", note: "Bring home blood pressure readings." },
  { id: "ap-2402", patientId: "pt-1038", clinicianId: "dr-02", date: todayKey, time: "09:15", duration: 45, type: "Wellness", room: "Room 04", status: "checked-in", note: "Annual review and medication check." },
  { id: "ap-2403", patientId: "pt-1031", clinicianId: "dr-01", date: todayKey, time: "10:00", duration: 30, type: "Follow-up", room: "Room 02", status: "confirmed", note: "Review follow-up plan." },
  { id: "ap-2404", patientId: "pt-1027", clinicianId: "dr-03", date: todayKey, time: "10:45", duration: 30, type: "Medication review", room: "Room 06", status: "arrived", note: "Confirm current prescriptions." },
  { id: "ap-2405", patientId: "pt-1019", clinicianId: "dr-02", date: todayKey, time: "11:30", duration: 60, type: "First visit", room: "Room 04", status: "confirmed", note: "Complete first-visit intake." },
  { id: "ap-2406", patientId: "pt-1009", clinicianId: "dr-02", date: todayKey, time: "13:15", duration: 30, type: "Preventive care", room: "Room 04", status: "confirmed", note: "Preventive care check." },
  { id: "ap-2407", patientId: "pt-1042", clinicianId: "dr-03", date: dateOffset(1), time: "09:30", duration: 30, type: "Cardiology", room: "Room 06", status: "confirmed", note: "ECG review." },
  { id: "ap-2408", patientId: "pt-1014", clinicianId: "dr-03", date: dateOffset(2), time: "14:00", duration: 45, type: "Follow-up", room: "Room 06", status: "confirmed", note: "Discuss latest results." },
];

export const appointmentStatuses = [
  { value: "confirmed", label: "Confirmed" },
  { value: "arrived", label: "Arrived" },
  { value: "checked-in", label: "Checked in" },
  { value: "in-room", label: "In room" },
  { value: "completed", label: "Completed" },
];
