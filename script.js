// script.js - Universal Firebase + Helpers (Added Update Functions)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js";
import { getDatabase, ref, push, set, onValue, remove, update } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database-compat.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCZ5Dlvm-VqPFw1tro8mSzjgeYnfytAmY4",
  authDomain: "smserp-4a050.firebaseapp.com",
  databaseURL: "https://smserp-4a050-default-rtdb.firebaseio.com",
  projectId: "smserp-4a050",
  storageBucket: "smserp-4a050.firebasestorage.app",
  messagingSenderId: "929008046022",
  appId: "1:929008046022:web:93c529551223264e966cc7",
  measurementId: "G-X3DXVW453H"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

// ----- CRUD HELPERS -----
export function listenData(path, callback) {
  const dbRef = ref(db, path);
  return onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const formatted = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
      callback(formatted);
    } else {
      callback([]);
    }
  });
}

export function addData(path, data) {
  const dbRef = ref(db, path);
  const newRef = push(dbRef);
  return set(newRef, data);
}

export function deleteData(path) {
  const dbRef = ref(db, path);
  return remove(dbRef);
}

export function updateData(path, data) {
  const dbRef = ref(db, path);
  return update(dbRef, data);
}

// ----- STUDENTS -----
export function loadStudents(callback) { return listenData('students', callback); }
export function saveStudent(data) { return addData('students', data); }
export function removeStudent(id) { return deleteData(`students/${id}`); }
export function updateStudent(id, data) { return updateData(`students/${id}`, data); }

// ----- TEACHERS -----
export function loadTeachers(callback) { return listenData('teachers', callback); }
export function saveTeacher(data) { return addData('teachers', data); }
export function removeTeacher(id) { return deleteData(`teachers/${id}`); }
export function updateTeacher(id, data) { return updateData(`teachers/${id}`, data); }

// ----- FEES -----
export function loadFees(callback) { return listenData('fees', callback); }
export function saveFee(data) { return addData('fees', data); }
export function removeFee(id) { return deleteData(`fees/${id}`); }
export function updateFee(id, data) { return updateData(`fees/${id}`, data); }

// ----- SALARIES -----
export function loadSalaries(callback) { return listenData('salaries', callback); }
export function saveSalary(data) { return addData('salaries', data); }
export function removeSalary(id) { return deleteData(`salaries/${id}`); }
export function updateSalary(id, data) { return updateData(`salaries/${id}`, data); }

// ----- ATTENDANCE -----
export function markAttendance(type, date, attendanceMap) {
  const path = `attendance_${type}/${date}`;
  const dbRef = ref(db, path);
  return set(dbRef, attendanceMap);
}
export function getAttendance(type, date, callback) {
  const path = `attendance_${type}/${date}`;
  const dbRef = ref(db, path);
  return onValue(dbRef, (snap) => {
    const data = snap.val();
    callback(data || {});
  });
}
export function loadAllStudentsForAttendance(callback) { return listenData('students', callback); }
export function loadAllTeachersForAttendance(callback) { return listenData('teachers', callback); }

// Sidebar Highlight
document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('.sidebar nav a');
  const current = location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === current) link.classList.add('active');
  });
});
