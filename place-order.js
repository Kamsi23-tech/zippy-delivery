const form = document.getElementById('order-form');
const steps = [...document.querySelectorAll('.form-step')];
const indicators = [...document.querySelectorAll('.progress-step')];
const lines = [...document.querySelectorAll('.progress-line')];
const nextButton = document.getElementById('next-step');
const previousButton = document.getElementById('previous-step');
let currentStep = 1;

function updateSummary() {
  const pickup = document.getElementById('pickup').value.trim();
  const destination = document.getElementById('destination').value.trim();
  const recipient = document.getElementById('recipient').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const instructions = document.getElementById('instructions').value.trim();
  const selectedPackage = document.querySelector('input[name="package"]:checked');
  const deliveryFee = Number(selectedPackage.dataset.fee);

  document.getElementById('summary-pickup').textContent = pickup || 'Not entered';
  document.getElementById('summary-destination').textContent = destination || 'Not entered';
  document.getElementById('delivery-fee').textContent = `₦${deliveryFee.toLocaleString()}`;
  document.getElementById('estimated-total').textContent = `₦${(deliveryFee + 200).toLocaleString()}`;
  document.getElementById('review-pickup').textContent = pickup || '—';
  document.getElementById('review-destination').textContent = destination || '—';
  document.getElementById('review-recipient').textContent = recipient || '—';
  document.getElementById('review-phone').textContent = phone || '—';
  document.getElementById('review-package').textContent = selectedPackage.value;
  document.getElementById('review-instructions').textContent = instructions || 'No special instructions';
}

function showStep(step) {
  currentStep = step;
  steps.forEach(item => item.classList.toggle('active', Number(item.dataset.step) === step));
  indicators.forEach((item, index) => {
    item.classList.toggle('active', index + 1 === step);
    item.classList.toggle('complete', index + 1 < step);
  });
  lines.forEach((line, index) => line.classList.toggle('complete', index + 1 < step));
  previousButton.hidden = step === 1;
  nextButton.innerHTML = step === 3 ? 'Confirm order <span>✓</span>' : 'Continue <span>→</span>';
  updateSummary();
  document.querySelector('.order-layout').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function stepIsValid(step) {
  const fields = steps[step - 1].querySelectorAll('input[required], textarea[required]');
  let valid = true;
  fields.forEach(field => {
    if (!field.checkValidity()) {
      field.reportValidity();
      valid = false;
    }
  });
  return valid;
}

nextButton.addEventListener('click', () => {
  if (currentStep < 3) {
    if (!stepIsValid(currentStep)) return;
    showStep(currentStep + 1);
    return;
  }
  const number = `ZIP${Math.floor(100000 + Math.random() * 900000)}`;
  document.getElementById('order-number').textContent = number;
  const success = document.getElementById('order-success');
  success.classList.add('open');
  success.setAttribute('aria-hidden', 'false');
});

previousButton.addEventListener('click', () => showStep(currentStep - 1));
form.addEventListener('input', updateSummary);
form.addEventListener('change', updateSummary);
document.getElementById('track-order').addEventListener('click', () => {
  window.location.href = 'track-order.html';
});
updateSummary();
