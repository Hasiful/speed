// Keep the showcase frontend-only: newsletter forms retain their appearance but
// never post visitor data to the original site's external marketing service.
document.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.target;
  const confirmation = form.closest('.sib-form')?.querySelector('#success-message');
  if (confirmation) confirmation.style.display = 'block';
});

// Apply the Speed rebrand synchronously before the deferred showcase scripts initialize.
document.write('<script src="/speed-brand.js"><\/script>');
