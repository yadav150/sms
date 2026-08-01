// fees.js - Handles Add + Edit for Fees
import { loadFees, saveFee, removeFee, updateFee, loadStudents } from './script.js';

const tbody = document.getElementById('feeTableBody');
const modal = document.getElementById('feeModal');
const form = document.getElementById('feeForm');
const modalTitle = document.getElementById('feeModalTitle');
const submitBtn = document.getElementById('feeSubmitBtn');
const studentSelect = document.getElementById('feeStudent');

let editingId = null;

// Populate student dropdown
function populateStudentDropdown(selectedId = null) {
  loadStudents((students) => {
    if (!students || students.length === 0) {
      studentSelect.innerHTML = '<option value="">No students found. Add a student first.</option>';
    } else {
      studentSelect.innerHTML = students
        .map((s) => `<option value="${s.id}" ${s.id === selectedId ? 'selected' : ''}>${s.name}</option>`)
        .join('');
    }
  });
}

// Open Modal for Add
document.getElementById('openFeeModal').onclick = () => {
  editingId = null;
  modalTitle.textContent = 'Add Fee';
  submitBtn.textContent = 'Save Fee';
  form.reset();
  populateStudentDropdown();
  modal.classList.add('open');
};

// Close Modal (X button)
document.getElementById('closeFeeModal').onclick = () => {
  modal.classList.remove('open');
};

// Close Modal (click outside)
modal.onclick = (e) => {
  if (e.target === modal) {
    modal.classList.remove('open');
  }
};

// Load and display fees
loadFees((fees) => {
  if (!fees || fees.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center">No fee records.</td></tr>`;
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
          <button class="btn btn-primary" data-edit-id="${f.id}" style="margin-right:0.5rem;">Edit</button>
          <button class="btn btn-danger" data-delete-id="${f.id}">Delete</button>
        </td>
      </tr>
    `
    )
    .join('');

  // Delete Logic
  document.querySelectorAll('[data-delete-id]').forEach((btn) => {
    btn.onclick = () => {
      if (confirm('Delete this fee record?')) {
        removeFee(btn.dataset.deleteId);
      }
    };
  });

  // Edit Logic
  document.querySelectorAll('[data-edit-id]').forEach((btn) => {
    btn.onclick = () => {
      const id = btn.dataset.editId;
      const fee = fees.find((f) => f.id === id);
      if (!fee) return;

      editingId = id;
      modalTitle.textContent = 'Edit Fee';
      submitBtn.textContent = 'Update Fee';
      
      // Populate dropdown with selected student
      populateStudentDropdown(fee.studentId);
      document.getElementById('feeAmount').value = fee.amount || '';
      document.getElementById('feeMonth').value = fee.month || '';
      document.getElementById('feeStatus').value = fee.status || 'Pending';

      modal.classList.add('open');
    };
  });
});

// Handle Form Submission (Add OR Update)
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

  // Get student name
  let studentName = '';
  await new Promise((resolve) => {
    loadStudents((students) => {
      const found = students.find((s) => s.id === studentId);
      studentName = found ? found.name : studentId;
      resolve();
    });
  });

  const data = { studentId, studentName, amount, month, status };

  if (editingId) {
    await updateFee(editingId, data);
    editingId = null;
  } else {
    await saveFee(data);
  }

  form.reset();
  modal.classList.remove('open');
};
