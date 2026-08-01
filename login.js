// login.js - Login page specific logic
import { auth, checkAuth } from './script.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth-compat.js";

// ----- Auth Guard (if already logged in, redirect to dashboard) -----
checkAuth();

// ----- Form Elements -----
const form = document.getElementById('loginForm');
const errorMsg = document.getElementById('loginError');

// ----- Login Form Submit -----
form.onsubmit = async (e) => {
  e.preventDefault();
  errorMsg.classList.remove('show');

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = 'index.html';
  } catch (error) {
    errorMsg.classList.add('show');
    console.error('Login error:', error.message);
  }
};
