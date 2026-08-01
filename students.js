// students.js - Handles Add + Edit (Consistent Form)
import { loadStudents, saveStudent, removeStudent, updateStudent } from './script.js';

const tbody = document.getElementById('studentTableBody');
const modal = document.getElementById('studentModal');
const form = document.getElementById('studentForm');
const modalTitle = document.getElementById('studentModalTitle');
const submitBtn = document.getElementById('studentSubmitBtn');

let editingId = null; // Tracks if we are editing

// Open Modal for Add
document.getElementById('openStudentModal').onclick = () => {
  editingId = null;
  modalTitle.textContent = 'Add Student';
  submitBtn.textContent = 'Save Student';
  form.reset();
  modal.classList.add('open');
};

// Close Modal (X button)
document.getElementById('closeStudentModal').onclick = () => {
  modal.classList.remove('open');
};

// Close Modal (click outside)
modal.onclick = (e) => {
  if (e.target === modal) {
    modal.classList.remove('open');
  }
};

// Load and display students
loadStudents((students) => {
  if (!students || students.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="text-center">No students added yet.</td></tr>`;
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
          <button class="btn btn-primary" data-edit-id="${s.id}" style="margin-right:0.5rem;">Edit</button>
          <button class="btn btn-danger" data-delete-id="${s.id}">Delete</button>
        </td>
      </tr>
    `
    )
    .join('');

  // --- DELETE LOGIC ---
  document.querySelectorAll('[data-delete-id]').forEach((btn) => {
    btn.onclick = () => {
      if (confirm('Delete this student?')) {
        removeStudent(btn.dataset.deleteId);
      }
    };
  });

  // --- EDIT LOGIC ---
  document.querySelectorAll('[data-edit-id]').forEach((btn) => {
    btn.onclick = () => {
      const id = btn.dataset.editId;
      // Find the student data
      const student = students.find((s) => s.id === id);
      if (!student) return;

      // Populate the form
      editingId = id;
      modalTitle.textContent = 'Edit Student';
      submitBtn.textContent = 'Update Student';
      document.getElementById('sName').value = student.name || '';
      document.getElementById('sClass').value = student.class || '';
      document.getElementById('sPhone').value = student.phone || '';
      
      modal.classList.add('open');
    };
  });
});

// Handle Form Submission (Add OR Update)
form.onsubmit = async (e) => {
  e.preventDefault();

  const name = document.getElementById('sName').value.trim();
  const cls = document.getElementById('sClass').value.trim();
  const phone = document.getElementById('sPhone').value.trim();

  if (!name || !cls) {
    alert('Name and Class are required.');
    return;
  }

  const data = { name, class: cls, phone };

  if (editingId) {
    // UPDATE MODE
    await updateStudent(editingId, data);
    editingId = null;
  } else {
    // ADD MODE
    await saveStudent(data);
  }

  form.reset();
  modal.classList.remove('open');
};
