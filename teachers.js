// teachers.js - Handles Add + Edit for Teachers
import { loadTeachers, saveTeacher, removeTeacher, updateTeacher } from './script.js';

const tbody = document.getElementById('teacherTableBody');
const modal = document.getElementById('teacherModal');
const form = document.getElementById('teacherForm');
const modalTitle = document.getElementById('teacherModalTitle');
const submitBtn = document.getElementById('teacherSubmitBtn');

let editingId = null;

// Open Modal for Add
document.getElementById('openTeacherModal').onclick = () => {
  editingId = null;
  modalTitle.textContent = 'Add Teacher';
  submitBtn.textContent = 'Save Teacher';
  form.reset();
  modal.classList.add('open');
};

// Close Modal (X button)
document.getElementById('closeTeacherModal').onclick = () => {
  modal.classList.remove('open');
};

// Close Modal (click outside)
modal.onclick = (e) => {
  if (e.target === modal) {
    modal.classList.remove('open');
  }
};

// Load and display teachers
loadTeachers((teachers) => {
  if (!teachers || teachers.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="text-center">No teachers added yet.</td></tr>`;
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
          <button class="btn btn-primary" data-edit-id="${t.id}" style="margin-right:0.5rem;">Edit</button>
          <button class="btn btn-danger" data-delete-id="${t.id}">Delete</button>
        </td>
      </tr>
    `
    )
    .join('');

  // Delete Logic
  document.querySelectorAll('[data-delete-id]').forEach((btn) => {
    btn.onclick = () => {
      if (confirm('Delete this teacher?')) {
        removeTeacher(btn.dataset.deleteId);
      }
    };
  });

  // Edit Logic
  document.querySelectorAll('[data-edit-id]').forEach((btn) => {
    btn.onclick = () => {
      const id = btn.dataset.editId;
      const teacher = teachers.find((t) => t.id === id);
      if (!teacher) return;

      editingId = id;
      modalTitle.textContent = 'Edit Teacher';
      submitBtn.textContent = 'Update Teacher';
      document.getElementById('tName').value = teacher.name || '';
      document.getElementById('tSubject').value = teacher.subject || '';
      document.getElementById('tPhone').value = teacher.phone || '';

      modal.classList.add('open');
    };
  });
});

// Handle Form Submission (Add OR Update)
form.onsubmit = async (e) => {
  e.preventDefault();

  const name = document.getElementById('tName').value.trim();
  const subject = document.getElementById('tSubject').value.trim();
  const phone = document.getElementById('tPhone').value.trim();

  if (!name || !subject) {
    alert('Name and Subject are required.');
    return;
  }

  const data = { name, subject, phone };

  if (editingId) {
    await updateTeacher(editingId, data);
    editingId = null;
  } else {
    await saveTeacher(data);
  }

  form.reset();
  modal.classList.remove('open');
};
