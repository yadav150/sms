// students.js - Students Specific
import { loadStudents, saveStudent, removeStudent } from './script.js';

const tbody = document.getElementById('studentTableBody');
const modal = document.getElementById('studentModal');
const form = document.getElementById('studentForm');

// Open modal
document.getElementById('openStudentModal').onclick = () => {
  modal.classList.add('open');
};

// Close modal (X button)
document.getElementById('closeStudentModal').onclick = () => {
  modal.classList.remove('open');
};

// Close modal (click outside)
modal.onclick = (e) => {
  if (e.target === modal) {
    modal.classList.remove('open');
  }
};

// Load and display students in real-time
loadStudents((students) => {
  if (!students || students.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="text-center">No students added yet.</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = students
    .map(
      (s) => `
      <tr>
        <td>${s.name || ''}</td>
        <td>${s.class || ''}</td>
        <td>${s.phone || ''}</td>
        <td>
          <button class="btn btn-danger" data-id="${s.id}">Delete</button>
        </td>
      </tr>
    `
    )
    .join('');

  document.querySelectorAll('[data-id]').forEach((btn) => {
    btn.onclick = () => {
      if (confirm('Delete this student?')) {
        removeStudent(btn.dataset.id);
      }
    };
  });
});

// Handle form submission (Add Student)
form.onsubmit = async (e) => {
  e.preventDefault();

  const name = document.getElementById('sName').value.trim();
  const cls = document.getElementById('sClass').value.trim();
  const phone = document.getElementById('sPhone').value.trim();

  if (!name || !cls) {
    alert('Name and Class are required.');
    return;
  }

  await saveStudent({ name, class: cls, phone });

  form.reset();
  modal.classList.remove('open');
};
