// teachers.js - Teachers Specific
import { loadTeachers, saveTeacher, removeTeacher } from './script.js';

const tbody = document.getElementById('teacherTableBody');
const modal = document.getElementById('teacherModal');
const form = document.getElementById('teacherForm');

// Open modal
document.getElementById('openTeacherModal').onclick = () => {
  modal.classList.add('open');
};

// Close modal (X button)
document.getElementById('closeTeacherModal').onclick = () => {
  modal.classList.remove('open');
};

// Close modal (click outside)
modal.onclick = (e) => {
  if (e.target === modal) {
    modal.classList.remove('open');
  }
};

// Load and display teachers in real-time
loadTeachers((teachers) => {
  if (!teachers || teachers.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="text-center">No teachers added yet.</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = teachers
    .map(
      (t) => `
      <tr>
        <td>${t.name || ''}</td>
        <td>${t.subject || ''}</td>
        <td>${t.phone || ''}</td>
        <td>
          <button class="btn btn-danger" data-id="${t.id}">Delete</button>
        </td>
      </tr>
    `
    )
    .join('');

  document.querySelectorAll('[data-id]').forEach((btn) => {
    btn.onclick = () => {
      if (confirm('Delete this teacher?')) {
        removeTeacher(btn.dataset.id);
      }
    };
  });
});

// Handle form submission (Add Teacher)
form.onsubmit = async (e) => {
  e.preventDefault();

  const name = document.getElementById('tName').value.trim();
  const subject = document.getElementById('tSubject').value.trim();
  const phone = document.getElementById('tPhone').value.trim();

  if (!name || !subject) {
    alert('Name and Subject are required.');
    return;
  }

  await saveTeacher({ name, subject, phone });

  form.reset();
  modal.classList.remove('open');
};
