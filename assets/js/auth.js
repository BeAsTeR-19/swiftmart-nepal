let mode = 'login'; // 'login' or 'register'

function setMode(newMode) {
  mode = newMode;
  document.getElementById('tab-login').classList.toggle('active', mode === 'login');
  document.getElementById('tab-register').classList.toggle('active', mode === 'register');
  
  const title = document.getElementById('form-title');
  const subtitle = document.getElementById('form-subtitle');
  const nameGroup = document.getElementById('name-group');
  const confirmPasswordGroup = document.getElementById('confirm-password-group');
  const termsGroup = document.getElementById('terms-group');
  const loginExtras = document.getElementById('login-extras');
  const submitBtn = document.getElementById('submit-btn');

  if (mode === 'login') {
    title.textContent = 'Welcome back';
    subtitle.textContent = 'Sign in to your SwiftMart account';
    nameGroup.style.display = 'none';
    confirmPasswordGroup.style.display = 'none';
    if(termsGroup) termsGroup.style.display = 'none';
    if(loginExtras) loginExtras.style.display = 'flex';
    document.getElementById('auth-name').removeAttribute('required');
    document.getElementById('auth-confirm-password').removeAttribute('required');
    document.getElementById('password-reqs').style.display = 'none';
    submitBtn.innerHTML = '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="margin-right:8px; vertical-align:middle;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>Sign In';
  } else {
    title.textContent = 'Create Account';
    subtitle.textContent = 'Join SwiftMart today';
    nameGroup.style.display = 'block';
    confirmPasswordGroup.style.display = 'block';
    if(termsGroup) termsGroup.style.display = 'block';
    if(loginExtras) loginExtras.style.display = 'none';
    document.getElementById('auth-name').setAttribute('required', 'true');
    document.getElementById('auth-confirm-password').setAttribute('required', 'true');
    submitBtn.innerHTML = '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="margin-right:8px; vertical-align:middle;"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>Register';
    
    // trigger input event to show reqs if there's already text
    document.getElementById('auth-password').dispatchEvent(new Event('input'));
  }
  
  showError('');
}

function showError(msg) {
  const errDiv = document.getElementById('auth-error');
  errDiv.textContent = msg;
  errDiv.style.display = msg ? 'block' : 'none';
}

// Password Validation Real-time UI
document.addEventListener('DOMContentLoaded', () => {
  const pw = document.getElementById('auth-password');
  if(pw) {
    pw.addEventListener('input', () => {
      if (mode !== 'register') return;
      
      const v = pw.value;
      const reqs = document.getElementById('password-reqs');
      if (v.length > 0) reqs.style.display = 'block';
      else reqs.style.display = 'none';

      const check = (id, valid) => {
        const el = document.getElementById(id);
        if(!el) return;
        el.style.color = valid ? 'var(--success, #27ae60)' : 'var(--text-3)';
        el.innerHTML = (valid ? '✓ ' : '✗ ') + el.innerHTML.substring(2);
      };

      check('req-length', v.length >= 8 && v.length <= 64);
      check('req-upper', /[A-Z]/.test(v));
      check('req-lower', /[a-z]/.test(v));
      check('req-num', /[0-9]/.test(v));
      check('req-spec', /[^A-Za-z0-9]/.test(v));
    });
  }
});

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
    
    const terms = document.getElementById('auth-terms');
    if (terms && !terms.checked) {
      return showError('You must agree to the Terms and Conditions.');
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,64}$/;
    if (!passwordRegex.test(password)) {
      return showError('Password must meet all the requirements listed.');
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
