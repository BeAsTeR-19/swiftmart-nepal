let mode = 'login'; // 'login' or 'register'

function setMode(newMode) {
  mode = newMode;
  document.getElementById('tab-login').classList.toggle('active', mode === 'login');
  document.getElementById('tab-register').classList.toggle('active', mode === 'register');
  
  const title = document.getElementById('form-title');
  const subtitle = document.getElementById('form-subtitle');
  const nameGroup = document.getElementById('name-group');
  const confirmPasswordGroup = document.getElementById('confirm-password-group');
  const submitBtn = document.getElementById('submit-btn');

  if (mode === 'login') {
    title.textContent = 'Welcome back';
    subtitle.textContent = 'Sign in to your SwiftMart account';
    nameGroup.style.display = 'none';
    confirmPasswordGroup.style.display = 'none';
    document.getElementById('auth-name').removeAttribute('required');
    document.getElementById('auth-confirm-password').removeAttribute('required');
    submitBtn.innerHTML = '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="margin-right:8px; vertical-align:middle;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>Sign In';
  } else {
    title.textContent = 'Create Account';
    subtitle.textContent = 'Join SwiftMart today';
    nameGroup.style.display = 'block';
    confirmPasswordGroup.style.display = 'block';
    document.getElementById('auth-name').setAttribute('required', 'true');
    document.getElementById('auth-confirm-password').setAttribute('required', 'true');
    submitBtn.innerHTML = '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="margin-right:8px; vertical-align:middle;"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>Register';
  }
  
  showError('');
}

function showError(msg) {
  const errDiv = document.getElementById('auth-error');
  errDiv.textContent = msg;
  errDiv.style.display = msg ? 'block' : 'none';
}

async function handleAuth(e) {
  e.preventDefault();
  showError('');
  const email = document.getElementById('auth-email').value.trim();
  const password = document.getElementById('auth-password').value;
  
  if (mode === 'register') {
    const confirmPassword = document.getElementById('auth-confirm-password').value;
    if (password !== confirmPassword) {
      return showError('Passwords do not match.');
    }
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,64}$/;
    if (!passwordRegex.test(password)) {
      return showError('Password must be 8-64 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
    }
  }

  const submitBtn = document.getElementById('submit-btn');
  const originalHtml = submitBtn.innerHTML;
  submitBtn.innerHTML = 'Please wait...';
  submitBtn.disabled = true;

  try {
    if (mode === 'login') {
      await firebase.auth().signInWithEmailAndPassword(email, password);
    } else {
      const name = document.getElementById('auth-name').value.trim();
      const userCred = await firebase.auth().createUserWithEmailAndPassword(email, password);
      await userCred.user.updateProfile({ displayName: name });
    }
    // Set explicit login flag
    localStorage.setItem('sm_auth_method', 'firebase');
    window.location.href = '/';
  } catch (error) {
    showError(error.message);
  } finally {
    submitBtn.innerHTML = originalHtml;
    submitBtn.disabled = false;
  }
}

function signInWithApple() {
  const msg = document.getElementById('apple-coming-soon');
  msg.style.display = 'block';
  setTimeout(() => msg.style.display = 'none', 3000);
}

async function signInWithGoogle() {
  showError('');
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    await firebase.auth().signInWithPopup(provider);
    localStorage.setItem('sm_auth_method', 'firebase');
    window.location.href = '/';
  } catch (error) {
    if (error.code !== 'auth/popup-closed-by-user') {
      showError(error.message);
    }
  }
}

// Redirect if already logged in
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    window.location.href = '/';
  }
});
