let mode = 'login'; // 'login' or 'register'

function setMode(newMode) {
  mode = newMode;
  document.getElementById('tab-login').classList.toggle('active', mode === 'login');
  document.getElementById('tab-register').classList.toggle('active', mode === 'register');
  
  const title = document.getElementById('form-title');
  const subtitle = document.getElementById('form-subtitle');
  const nameGroup = document.getElementById('name-group');
  const submitBtn = document.getElementById('submit-btn');

  if (mode === 'login') {
    title.textContent = 'Welcome back';
    subtitle.textContent = 'Sign in to your SwiftMart account';
    nameGroup.style.display = 'none';
    document.getElementById('auth-name').removeAttribute('required');
    submitBtn.textContent = 'Sign In';
  } else {
    title.textContent = 'Create Account';
    subtitle.textContent = 'Join SwiftMart today';
    nameGroup.style.display = 'block';
    document.getElementById('auth-name').setAttribute('required', 'true');
    submitBtn.textContent = 'Register';
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
  const submitBtn = document.getElementById('submit-btn');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Please wait...';
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
    window.location.href = 'index.html';
  } catch (error) {
    showError(error.message);
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}

async function signInWithGoogle() {
  showError('');
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    await firebase.auth().signInWithPopup(provider);
    localStorage.setItem('sm_auth_method', 'firebase');
    window.location.href = 'index.html';
  } catch (error) {
    if (error.code !== 'auth/popup-closed-by-user') {
      showError(error.message);
    }
  }
}

// Redirect if already logged in
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    window.location.href = 'index.html';
  }
});
