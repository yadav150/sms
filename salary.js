// salary.js - Handles Add + Edit for Salary
import { loadSalaries, saveSalary, removeSalary, updateSalary, loadTeachers } from './script.js';

const tbody = document.getElementById('salaryTableBody');
const modal = document.getElementById('salaryModal');
const form = document.getElementById('salaryForm');
const modalTitle = document.getElementById('salaryModalTitle');
const submitBtn = document.getElementById('salarySubmitBtn');
const teacherSelect = document.getElementById('salaryTeacher');

let editingId = null;

// Populate teacher dropdown
function populateTeacherDropdown(selectedId = null) {
  loadTeachers((teachers) => {
    if (!teachers || teachers.length === 0) {
      teacherSelect.innerHTML = '<option value="">No teachers found. Add a teacher first.</option>';
    } else {
      teacherSelect.innerHTML = teachers
        .map((t) => `<option value="${t.id}" ${t.id === selectedId ? 'selected' : ''}>${t.name}</option>`)
        .join('');
    }
  });
}

// Open Modal for Add
document.getElementById('openSalaryModal').onclick = () => {
  editingId = null;
  modalTitle.textContent = 'Add Salary';
  submitBtn.textContent = 'Save Salary';
  form.reset();
  populateTeacherDropdown();
  modal.classList.add('open');
};

// Close Modal (X button)
document.getElementById('closeSalaryModal').onclick = () => {
  modal.classList.remove('open');
};

// Close Modal (click outside)
modal.onclick = (e) => {
  if (e.target === modal) {
    modal.classList.remove('open');
  }
};

// Load and display salaries
loadSalaries((salaries) => {
  if (!salaries || salaries.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center">No salary records.</td></tr>`;
    return;
  }

  tbody.innerHTML = salaries
    .map(
      (s) => `
      <tr>
        <td>${s.teacherName || s.teacherId || ''}</td>
        <td>${s.amount || ''}</td>
        <td>${s.month || ''}</td>
        <td>${s.status || 'Pending'}</td>
        <td>
          <button class="btn btn-primary" data-edit-id="${s.id}" style="margin-right:0.5rem;">Edit</button>
          <button class="btn btn-danger" data-delete-id="${s.id}">Delete</button>
        </td>
      </tr>
    `
    )
    .join('');

  // Delete Logic
  document.querySelectorAll('[data-delete-id]').forEach((btn) => {
    btn.onclick = () => {
      if (confirm('Delete this salary record?')) {
        removeSalary(btn.dataset.deleteId);
      }
    };
  });

  // Edit Logic
  document.querySelectorAll('[data-edit-id]').forEach((btn) => {
    btn.onclick = () => {
      const id = btn.dataset.editId;
      const salary = salaries.find((s) => s.id === id);
      if (!salary) return;

      editingId = id;
      modalTitle.textContent = 'Edit Salary';
      submitBtn.textContent = 'Update Salary';

      populateTeacherDropdown(salary.teacherId);
      document.getElementById('salaryAmount').value = salary.amount || '';
      document.getElementById('salaryMonth').value = salary.month || '';
      document.getElementById('salaryStatus').value = salary.status || 'Pending';

      modal.classList.add('open');
    };
  });
});

// Handle Form Submission (Add OR Update)
form.onsubmit = async (e) => {
  e.preventDefault();

  const teacherId = teacherSelect.value;
  const amount = document.getElementById('salaryAmount').value;
  const month = document.getElementById('salaryMonth').value.trim();
  const status = document.getElementById('salaryStatus').value;

  if (!teacherId) {
    alert('Please select a teacher.');
    return;
  }

  if (!amount || !month) {
    alert('Amount and Month are required.');
    return;
  }

  // Get teacher name
  let teacherName = '';
  await new Promise((resolve) => {
    loadTeachers((teachers) => {
      const found = teachers.find((t) => t.id === teacherId);
      teacherName = found ? found.name : teacherId;
      resolve();
    });
  });

  const data = { teacherId, teacherName, amount, month, status };

  if (editingId) {
    await updateSalary(editingId, data);
    editingId = null;
  } else {
    await saveSalary(data);
  }

  form.reset();
  modal.classList.remove('open');
};
