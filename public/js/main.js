document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const status = document.getElementById('formStatus');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      name: form.name.value,
      email: form.email.value,
      message: form.message.value
    };

    try {
      const res = await fetch('/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (json.success) {
        status.textContent = 'Message sent — thank you!';
        form.reset();
      } else {
        status.textContent = 'There was a problem sending your message.';
      }
    } catch (err) {
      status.textContent = 'Network error — please try again later.';
    }
  });
});

// Appointment form handler (if present)
document.addEventListener('DOMContentLoaded', () => {
  const appt = document.getElementById('appointmentForm');
  if (!appt) return;
  const status = document.getElementById('appointmentStatus');
  appt.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      name: appt.name.value,
      email: appt.email.value,
      preferredDate: appt.preferredDate.value,
      service: appt.service.value,
      message: appt.message.value
    };

    try {
      const res = await fetch('/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (json.success) {
        status.textContent = 'Appointment request sent — we will contact you.';
        appt.reset();
      } else {
        status.textContent = 'There was a problem submitting your request.';
      }
    } catch (err) {
      status.textContent = 'Network error — please try again later.';
    }
  });
});
