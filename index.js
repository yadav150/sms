// index.js - Dashboard Specific
import { listenData } from './script.js';

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

loadDashboardStats();
