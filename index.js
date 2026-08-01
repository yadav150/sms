// index.js - Dashboard page specific logic
import { checkAuth, loadDashboardStats } from './script.js';

// ----- Auth Guard (if not logged in, redirect to login) -----
checkAuth();

// ----- Load Dashboard Stats -----
loadDashboardStats();
