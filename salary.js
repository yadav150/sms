// salary.js - Salary Specific
import { loadSalaries, saveSalary, removeSalary, loadTeachers } from './script.js';

const tbody = document.getElementById('salaryTableBody');
const modal = document.getElementById('salaryModal');
const form = document.getElementById('salaryForm');
const teacherSelect = document.getElementById('salaryTeacher');

// Open modal
document.getElementById('openSalaryModal').onclick = () => {
  loadTeachers((teachers) => {
    if (!teachers || teachers.length === 0) {
      teacherSelect.innerHTML = '<option value="">No teachers found. Add a teacher first.</option>';
    } else {
      teacherSelect.innerHTML = teachers
        .map((t) => `<option value="${t.id}">${t.name}</option>`)
        .join('');
    }
  });
  modal.classList.add('open');
};

// Close modal (X button)
document.getElementById('closeSalaryModal').onclick = () => {
  modal.classList.remove('open');
};

// Close modal (click outside)
modal.onclick = (e) => {
  if (e.target === modal) {
    modal.classList.remove('open');
  }
};

// Load and display salaries in real-time
loadSalaries((salaries) => {
  if (!salaries || salaries.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center">No salary records.</td>
      </tr>
    `;
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
          <button class="btn btn-danger" data-id="${s.id}">Delete</button>
        </td>
      </tr>
    `
    )
    .join('');

  document.querySelectorAll('[data-id]').forEach((btn) => {
    btn.onclick = () => {
      if (confirm('Delete this salary record?')) {
        removeSalary(btn.dataset.id);
      }
    };
  });
});

// Handle form submission (Add Salary)
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

  let teacherName = '';
  await new Promise((resolve) => {
    loadTeachers((teachers) => {
      const found = teachers.find((t) => t.id === teacherId);
      teacherName = found ? found.name : teacherId;
      resolve();
    });
  });

  await saveSalary({ teacherId, teacherName, amount, month, status });

  form.reset();
  modal.classList.remove('open');
};
