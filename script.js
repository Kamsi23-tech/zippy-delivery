// Navigation behavior
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
if (menuToggle) menuToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  menuToggle.classList.toggle('open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});
document.querySelectorAll('.nav-menu a').forEach(link => link.addEventListener('click', () => {
  navMenu?.classList.remove('open');
  menuToggle?.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

window.addEventListener('resize', () => {
  if (window.innerWidth > 1180) {
    navMenu?.classList.remove('open');
    menuToggle?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }
});

// Real-time tracking data. Replace getTrackedDelivery() with an API call when the backend is ready.
const trackingPageForm = document.getElementById('tracking-page-form');
if (trackingPageForm) {
  const trackingProfiles = {
    'ZIP123456': { stage: 'in-transit', eta: '10:48 AM', distance: '8 minutes away', status: 'In transit', rider: 'Adebayo Okafor', initials: 'AO', rating: '★ 4.9 · 320 deliveries', phone: '+2348000000000', package: 'Small parcel', recipient: 'Ada Okafor' },
    'ZIP234567': { stage: 'picked-up', eta: '11:16 AM', distance: '14 minutes away', status: 'Package picked up', rider: 'Chioma Eze', initials: 'CE', rating: '★ 4.8 · 245 deliveries', phone: '+2348000000001', package: 'Document envelope', recipient: 'Emeka Nnamdi' },
    'ZIP345678': { stage: 'arriving', eta: '10:52 AM', distance: '3 minutes away', status: 'Arriving soon', rider: 'Tunde Bello', initials: 'TB', rating: '★ 5.0 · 410 deliveries', phone: '+2348000000002', package: 'Medium parcel', recipient: 'Mariam Yusuf' },
    'ZIP456789': { stage: 'delivered', eta: 'Delivered', distance: 'Delivered at 10:44 AM', status: 'Successfully delivered', rider: 'Tunde Bello', initials: 'TB', rating: '★ 5.0 · 410 deliveries', phone: '+2348000000002', package: 'Document envelope', recipient: 'Ifeoma Obi' }
  };
  const stages = ['received', 'assigned', 'picked-up', 'in-transit', 'arriving', 'delivered'];

  async function getTrackedDelivery(trackingId) {
    // Example API integration: return fetch(`/api/tracking/${trackingId}`).then(response => response.json());
    return trackingProfiles[trackingId] || null;
  }

  async function showTrackedDelivery(trackingId) {
    const profile = await getTrackedDelivery(trackingId);
    if (!profile) return false;
    const activeIndex = stages.indexOf(profile.stage);
    document.querySelectorAll('#delivery-timeline .progress-item').forEach((item, index) => {
      item.classList.toggle('complete', index < activeIndex);
      item.classList.toggle('current', index === activeIndex);
      const marker = item.querySelector(':scope > span');
      marker.textContent = index < activeIndex ? '✓' : String(index + 1);
    });
    document.getElementById('delivery-status').textContent = profile.status;
    document.getElementById('eta-time').textContent = profile.eta;
    document.getElementById('eta-distance').textContent = profile.distance;
    document.getElementById('rider-name').textContent = profile.rider;
    document.getElementById('rider-avatar').textContent = profile.initials;
    document.getElementById('rider-rating').textContent = profile.rating;
    document.getElementById('rider-call').href = `tel:${profile.phone}`;
    document.getElementById('delivery-tracking-id').textContent = trackingId;
    document.getElementById('delivery-package').textContent = profile.package;
    document.getElementById('delivery-recipient').textContent = profile.recipient;
    return true;
  }

  trackingPageForm.addEventListener('submit', async event => {
    event.preventDefault();
    const input = document.getElementById('tracking-page-input');
    const message = document.getElementById('tracking-page-message');
    const value = input.value.trim().toUpperCase();
    if (!/^ZIP\d{5,8}$/.test(value)) {
      message.textContent = 'Enter a valid tracking number, such as ZIP123456.';
      message.className = 'tracking-page-message error';
      return;
    }
    input.value = value;
    if (await showTrackedDelivery(value)) {
      message.textContent = `Live tracking opened for ${value}.`;
      message.className = 'tracking-page-message success';
      document.getElementById('tracking-dashboard').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      message.textContent = 'No delivery was found for this tracking ID.';
      message.className = 'tracking-page-message error';
    }
  });
}

const trackingForm = document.getElementById('tracking-form');
if (trackingForm) trackingForm.addEventListener('submit', event => {
  event.preventDefault();
  const input = document.getElementById('tracking-input');
  const message = document.getElementById('tracking-message');
  const value = input.value.trim().toUpperCase();
  if (!/^ZIP\d{5,8}$/.test(value)) {
    message.textContent = 'Enter a valid tracking number, such as ZIP123456.';
    message.className = 'form-message error';
    return;
  }
  message.textContent = `Tracking found. Showing the latest updates for ${value}.`;
  message.className = 'form-message success';
});

// Newsletter validation
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) newsletterForm.addEventListener('submit', event => {
  event.preventDefault();
  const email = document.getElementById('newsletter-email');
  const message = document.getElementById('newsletter-message');
  if (!email.checkValidity()) {
    message.textContent = 'Please enter a valid email address.';
    message.className = 'error';
    return;
  }
  message.textContent = 'Thank you! You are subscribed.';
  message.className = 'success';
  email.value = '';
});

// Interactive FAQ accordion
document.querySelectorAll('.faq-item button').forEach(button => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    const isOpen = item.classList.toggle('open');
    button.setAttribute('aria-expanded', String(isOpen));
    button.querySelector('span').textContent = isOpen ? '−' : '+';
  });
});

// Modal demonstrations for order, sign in, and registration
const modal = document.getElementById('form-modal');
const modalTitle = document.getElementById('modal-title');
const modalEyebrow = document.getElementById('modal-eyebrow');
const modalFields = document.getElementById('modal-fields');
const modalForm = document.getElementById('modal-form');
const modalSuccess = document.getElementById('modal-success');

function closeModal() {
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

function passwordField(label = 'Password') {
  return `<label>${label}<div class="password-field"><input type="password" minlength="6" required><button type="button" class="password-toggle" aria-label="Show password">Show</button></div></label>`;
}

document.querySelectorAll('[data-modal]').forEach(button => button.addEventListener('click', () => {
  const type = button.dataset.modal;
  modalForm.reset();
  modalSuccess.textContent = '';
  modalForm.style.display = 'grid';
  if (type === 'order') {
    modalEyebrow.textContent = 'Book a delivery'; modalTitle.textContent = 'Create your delivery';
    modalFields.innerHTML = '<label>Pickup location<input required placeholder="Enter pickup address"></label><label>Delivery location<input required placeholder="Enter delivery address"></label><label>Package details<input required placeholder="What are you sending?"></label>';
  } else if (type === 'signin') {
    modalEyebrow.textContent = 'Welcome back'; modalTitle.textContent = 'Sign in to your account';
    modalFields.innerHTML = '<label>Email address<input type="email" required placeholder="name@email.com"></label>' + passwordField();
  } else {
    modalEyebrow.textContent = 'Join Zippy'; modalTitle.textContent = 'Get started with Zippy';
    modalFields.innerHTML = '<label>Full name<input required placeholder="Your full name"></label><label>Email address<input type="email" required placeholder="name@email.com"></label>' + passwordField();
  }
  attachPasswordToggles();
  modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); document.body.classList.add('modal-open');
}));

function attachPasswordToggles() {
  document.querySelectorAll('.password-toggle').forEach(toggle => toggle.addEventListener('click', () => {
    const input = toggle.parentElement.querySelector('input');
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    toggle.textContent = show ? 'Hide' : 'Show';
    toggle.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
  }));
}

document.querySelector('.modal-close')?.addEventListener('click', closeModal);
modal?.addEventListener('click', event => { if (event.target === modal) closeModal(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && modal?.classList.contains('open')) closeModal(); });
modalForm?.addEventListener('submit', event => {
  event.preventDefault();
  modalForm.style.display = 'none';
  modalSuccess.textContent = 'Success! Your request has been received.';
});
