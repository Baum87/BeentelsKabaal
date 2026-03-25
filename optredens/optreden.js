document.addEventListener('DOMContentLoaded', () => {

  const cells = Array.from(document.querySelectorAll('.photo-cell'));
  const lightbox = document.getElementById('lightbox');
  const lbContent = document.getElementById('lbContent');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  const lbCounter = document.getElementById('lbCounter');
  let current = 0;

  function openLightbox(index) {
    current = index;
    updateLightbox();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function updateLightbox() {
    const svg = cells[current].querySelector('svg');
    lbContent.innerHTML = svg ? svg.outerHTML : cells[current].innerHTML;
    lbCounter.textContent = `${current + 1} / ${cells.length}`;
  }

  cells.forEach((cell, i) => {
    cell.addEventListener('click', () => openLightbox(i));
  });

  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  lbPrev.addEventListener('click', () => {
    current = (current - 1 + cells.length) % cells.length;
    updateLightbox();
  });

  lbNext.addEventListener('click', () => {
    current = (current + 1) % cells.length;
    updateLightbox();
  });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') { current = (current - 1 + cells.length) % cells.length; updateLightbox(); }
    if (e.key === 'ArrowRight') { current = (current + 1) % cells.length; updateLightbox(); }
  });

  // Swipe-ondersteuning in lightbox op mobiel
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      current = diff > 0
        ? (current + 1) % cells.length
        : (current - 1 + cells.length) % cells.length;
      updateLightbox();
    }
  }, { passive: true });

  // Fade-in
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity='1'; e.target.style.transform='translateY(0)'; } });
  }, { threshold: 0.08 });

  cells.forEach((cell, i) => {
    cell.style.opacity = '0';
    cell.style.transform = 'translateY(20px)';
    cell.style.transition = `opacity 0.5s ease ${i * 0.06}s, transform 0.5s ease ${i * 0.06}s`;
    observer.observe(cell);
  });

});
