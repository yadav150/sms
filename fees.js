// fees.js - Fees Specific
import { loadFees, saveFee, removeFee, loadStudents } from './script.js';

const tbody = document.getElementById('feeTableBody');
const modal = document.getElementById('feeModal');
const form = document.getElementById('feeForm');
const studentSelect = document.getElementById('feeStudent');

// Open modal
document.getElementById('openFeeModal').onclick = () => {
  loadStudents((students) => {
    if (!students || students.length === 0) {
      studentSelect.innerHTML = '<option value="">No students found. Add a student first.</option>';
    } else {
      studentSelect.innerHTML = students
        .map((s) => `<option value="${s.id}">${s.name}</option>`)
        .join('');
    }
  });
  modal.classList.add('open');
};

// Close modal (X button)
document.getElementById('closeFeeModal').onclick = () => {
  modal.classList.remove('open');
};

// Close modal (click outside)
modal.onclick = (e) => {
  if (e.target === modal) {
    modal.classList.remove('open');
  }
};

// Load and display fees in real-time
loadFees((fees) => {
  if (!fees || fees.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center">No fee records.</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = fees
    .map(
      (f) => `
      <tr>
        <td>${f.studentName || f.studentId || ''}</td>
        <td>${f.amount || ''}</td>
        <td>${f.month || ''}</td>
        <td>${f.status || 'Pending'}</td>
        <td>
          <button class="btn btn-danger" data-id="${f.id}">Delete</button>
        </td>
      </tr>
    `
    )
    .join('');

  document.querySelectorAll('[data-id]').forEach((btn) => {
    btn.onclick = () => {
      if (confirm('Delete this fee record?')) {
        removeFee(btn.dataset.id);
      }
    };
  });
});

// Handle form submission (Add Fee)
form.onsubmit = async (e) => {
  e.preventDefault();

  const studentId = studentSelect.value;
  const amount = document.getElementById('feeAmount').value;
  const month = document.getElementById('feeMonth').value.trim();
  const status = document.getElementById('feeStatus').value;

  if (!studentId) {
    alert('Please select a student.');
    return;
  }

  if (!amount || !month) {
    alert('Amount and Month are required.');
    return;
  }

  let studentName = '';
  await new Promise((resolve) => {
    loadStudents((students) => {
      const found = students.find((s) => s.id === studentId);
      studentName = found ? found.name : studentId;
      resolve();
    });
  });

  await saveFee({ studentId, studentName, amount, month, status });

  form.reset();
  modal.classList.remove('open');
};
