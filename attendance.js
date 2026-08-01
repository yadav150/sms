// attendance.js - Attendance Specific
import {
  loadAllStudentsForAttendance,
  loadAllTeachersForAttendance,
  getAttendance,
  markAttendance
} from './script.js';

const attType = document.getElementById('attType');
const attDate = document.getElementById('attDate');
const container = document.getElementById('attendanceListContainer');
const loadBtn = document.getElementById('loadAttendanceBtn');
const saveBtn = document.getElementById('saveAttendanceBtn');

// Set default date to today
attDate.value = new Date().toISOString().split('T')[0];

let currentList = [];

function renderList(list) {
  if (!list || list.length === 0) {
    container.innerHTML = '<p class="text-center">No records found for this type.</p>';
    return;
  }

  container.innerHTML = list
    .map(
      (item) => `
      <div style="display:flex; align-items:center; gap:1rem; padding:0.5rem 0; border-bottom:1px solid #e5e7eb;">
        <label style="display:flex; align-items:center; gap:0.5rem; cursor:pointer; width:100%;">
          <input type="checkbox" ${item.present ? 'checked' : ''} data-id="${item.id}" style="width:18px; height:18px;" />
          <span>${item.name}</span>
        </label>
      </div>
    `
    )
    .join('');

  document.querySelectorAll('#attendanceListContainer input[type="checkbox"]').forEach((cb) => {
    cb.onchange = () => {
      const found = currentList.find((i) => i.id === cb.dataset.id);
      if (found) found.present = cb.checked;
    };
  });
}

async function loadAttendance() {
  const type = attType.value;
  const date = attDate.value;

  if (!date) {
    alert('Please select a date.');
    return;
  }

  let people = [];

  if (type === 'students') {
    await new Promise((resolve) => {
      loadAllStudentsForAttendance((data) => {
        people = data;
        resolve();
      });
    });
  } else {
    await new Promise((resolve) => {
      loadAllTeachersForAttendance((data) => {
        people = data;
        resolve();
      });
    });
  }

  if (!people || people.length === 0) {
    container.innerHTML = `<p class="text-center">No ${type} added yet. Please add some first.</p>`;
    currentList = [];
    return;
  }

  getAttendance(type, date, (attData) => {
    currentList = people.map((p) => ({
      id: p.id,
      name: p.name || 'Unnamed',
      present: attData && attData[p.id] === true
    }));
    renderList(currentList);
  });
}

loadBtn.onclick = loadAttendance;

saveBtn.onclick = async () => {
  const type = attType.value;
  const date = attDate.value;

  if (!date) {
    alert('Select date.');
    return;
  }

  if (currentList.length === 0) {
    alert('No data to save.');
    return;
  }

  const map = {};
  currentList.forEach((item) => {
    map[item.id] = !!item.present;
  });

  await markAttendance(type, date, map);
  alert(`Attendance for ${date} saved successfully!`);
};

// Auto-load on page open
setTimeout(loadAttendance, 300);
