// Custom JS for POS enhancements
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('input[x-model="search"]');
  if (searchInput) {
    requestAnimationFrame(() => searchInput.focus({ preventScroll: true }));
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) {
    document.querySelectorAll('[x-transition]').forEach(el => {
      el.removeAttribute('x-transition');
    });
  }

  document.body.addEventListener('click', (event) => {
    const card = event.target.closest('[data-product-card]');
    if (!card) return;
    card.classList.add('ring', 'ring-brand/40');
    setTimeout(() => card.classList.remove('ring', 'ring-brand/40'), 220);
  });
});
