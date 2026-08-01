// index.js - Dashboard page specific logic
import { checkAuth, listenData } from './script.js';

// ----- Auth Guard (if not logged in, redirect to login) -----
checkAuth();

// ----- Dashboard Stats Load Function (Defined locally) -----
function loadDashboardStats() {
  const paths = ['students', 'teachers', 'fees', 'salaries'];
  paths.forEach(p => {
    listenData(p, (data) => {
      const count = data ? data.length : 0;
      const el = document.getElementById(`count-${p}`);
      if (el) el.textContent = count;
    });
  });
}

// ----- Load Dashboard Stats -----
loadDashboardStats();
