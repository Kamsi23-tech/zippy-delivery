const API = {
  register: '/api/auth/register',
  login: '/api/auth/login',
  forgot: '/api/auth/forgot-password',
  verify: '/api/auth/verify-email'
};

const params = new URLSearchParams(window.location.search);
const requestedView = params.get('view');
const validViews = ['login', 'register', 'forgot', 'verify'];
const currentView = validViews.includes(requestedView) ? requestedView : 'login';
const views = document.querySelectorAll('[data-auth-view]');
views.forEach(view => { view.hidden = view.dataset.authView !== currentView; });
const viewTitles = { login: 'Sign in', register: 'Create account', forgot: 'Forgot password', verify: 'Verify email' };
document.title = `${viewTitles[currentView]} | Zippy`;

function setError(form, message) {
  form.querySelector('.form-error').textContent = message;
}

function validPassword(password) {
  return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
}

async function authenticate(action, payload) {
  // Connect each endpoint above to your authentication backend.
  // This simulation keeps the frontend usable until the API is available.
  await new Promise(resolve => setTimeout(resolve, 400));
  return { ok: true, message: 'Request successful.' };
}

function showSuccess(title, message) {
  views.forEach(view => { view.hidden = true; });
  const success = document.querySelector('.auth-success');
  document.getElementById('auth-success-title').textContent = title;
  document.getElementById('auth-success-message').textContent = message;
  success.hidden = false;
}

document.querySelectorAll('.password-toggle').forEach(button => {
  button.addEventListener('click', () => {
    const input = button.parentElement.querySelector('input');
    const reveal = input.type === 'password';
    input.type = reveal ? 'text' : 'password';
    button.textContent = reveal ? 'Hide' : 'Show';
    button.setAttribute('aria-label', reveal ? 'Hide password' : 'Show password');
  });
});

document.querySelectorAll('.auth-form').forEach(form => {
  form.addEventListener('submit', async event => {
    event.preventDefault();
    setError(form, '');
    if (!form.checkValidity()) {
      setError(form, 'Please complete every required field correctly.');
      form.reportValidity();
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    const action = form.dataset.authAction;
    if (action === 'register') data.full_name = `${data.surname.trim()} ${data.other_names.trim()}`;
    if (action === 'register' && !validPassword(data.password)) {
      setError(form, 'Password must contain at least 8 characters, including a letter and a number.');
      return;
    }
    if (action === 'verify' && !/^\d{6}$/.test(data.code)) {
      setError(form, 'Enter the complete 6-digit verification code.');
      return;
    }

    const submit = form.querySelector('[type="submit"]');
    submit.disabled = true;
    submit.textContent = 'Please wait…';
    const response = await authenticate(action, data);
    submit.disabled = false;
    submit.textContent = action === 'login' ? 'Sign in →' : action === 'register' ? 'Create account →' : action === 'forgot' ? 'Send reset link →' : 'Verify email →';
    if (!response.ok) {
      setError(form, response.message || 'We could not complete your request. Please try again.');
      return;
    }
    if (action === 'register') {
      window.location.href = `auth.html?view=verify&email=${encodeURIComponent(data.email)}`;
      return;
    }
    if (action === 'forgot') {
      showSuccess('Check your inbox', `A password reset link has been sent to ${data.email}.`);
      return;
    }
    if (action === 'verify') {
      showSuccess('Email verified', 'Your Zippy account is ready. You can now sign in and start delivering.');
      return;
    }
    window.location.href = 'place-order.html';
  });
});

const verificationEmail = document.getElementById('verification-email');
if (verificationEmail) verificationEmail.textContent = params.get('email') || 'your email address';
document.querySelector('[data-resend]')?.addEventListener('click', event => {
  event.currentTarget.textContent = 'Verification code resent';
  event.currentTarget.disabled = true;
});
