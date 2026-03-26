document.addEventListener('DOMContentLoaded', () => {

  // ─── Navbar scroll effect ───────────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  // ─── Hamburger menu ──────────────────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navMobile = document.getElementById('navMobile');

  if (hamburger && navMobile) {
    hamburger.addEventListener('click', () => {
      navMobile.classList.toggle('open');
    });
    navMobile.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navMobile.classList.remove('open'));
    });
  }

  // ─── Smooth scroll ───────────────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ─── Quote slideshow ─────────────────────────────────────────────────────
  const slides = document.querySelectorAll('.quote-slide');
  const dots   = document.querySelectorAll('.dot');
  let current  = 0;
  let timer;

  function showSlide(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function startAuto() {
    timer = setInterval(() => showSlide(current + 1), 5000);
  }

  function resetAuto() {
    clearInterval(timer);
    startAuto();
  }

  if (slides.length > 0) {
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        showSlide(parseInt(dot.dataset.index));
        resetAuto();
      });
    });

    // Swipe-ondersteuning op mobiel
    const slider = document.getElementById('quoteSlider');
    if (slider) {
      let touchStartX = 0;
      slider.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].clientX;
      }, { passive: true });
      slider.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
          showSlide(diff > 0 ? current + 1 : current - 1);
          resetAuto();
        }
      }, { passive: true });
    }

    startAuto();
  }

  // ─── Scroll fade-in animaties ────────────────────────────────────────────
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  function applyFadeIn(elements) {
    elements.forEach((el, i) => {
      el.classList.add('fade-in');
      el.style.transitionDelay = `${(i % 4) * 0.08}s`;
      observer.observe(el);
    });
  }

  applyFadeIn(document.querySelectorAll(
    '.text-block, .image-block, .agenda-item, .optreden-card, .stat, .contact-details, .form-block'
  ));

  // ─── Contact formulier ───────────────────────────────────────────────────
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = '✓ Bericht ontvangen!';
      btn.style.background = 'var(--bordeaux)';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 3500);
    });
  }

  // ─── Agenda laden uit JSON ────────────────────────────────────────────
  async function laadAgenda() {
    const container = document.getElementById('agendaList');
    if (!container) return;
    try {
      const res = await fetch('/content/agenda.json');
      const data = await res.json();
      const items = (data.items || []).sort((a, b) => a.datum.localeCompare(b.datum));
      if (items.length === 0) {
        container.innerHTML = '<p class="loading-tekst">Geen aankomende evenementen.</p>';
        return;
      }
      container.innerHTML = items.map(renderAgendaItem).join('');
      applyFadeIn(container.querySelectorAll('.agenda-item'));
    } catch (e) {
      container.innerHTML = '<p class="loading-tekst">Agenda kon niet worden geladen.</p>';
    }
  }

  function renderAgendaItem(item) {
    const d = new Date(item.datum);
    const dag = String(d.getDate()).padStart(2, '0');
    const maanden = ['JAN','FEB','MRT','APR','MEI','JUN','JUL','AUG','SEP','OKT','NOV','DEC'];
    const maand = maanden[d.getMonth()];
    const isHoofd = item.hoofd ? 'highlight' : '';
    const btnKlasse = item.hoofd ? '' : 'btn-outline-dark';
    const labelHtml = item.label ? `<span class="tag tag-red">${item.label}</span>` : '';
    const tijdHtml = item.tijdstip ? `<span class="agenda-time">🕑 ${item.tijdstip}</span>` : '';
    const beschrijvingHtml = item.beschrijving ? `<p>${item.beschrijving}</p>` : '';
    return `
    <div class="agenda-item ${isHoofd}">
      <div class="agenda-date-block">
        <span class="a-day">${dag}</span>
        <span class="a-month">${maand}</span>
      </div>
      <div class="agenda-body">
        <div class="agenda-meta">
          ${labelHtml}
          <span class="agenda-location">📍 ${item.locatie}</span>
        </div>
        <h3>${item.titel}</h3>
        ${beschrijvingHtml}
        ${tijdHtml}
      </div>
    </div>`;
  }

  // ─── Evenementen laden uit JSON ───────────────────────────────────────
  async function laadEvenementen() {
    const container = document.getElementById('optredensGrid');
    if (!container) return;
    try {
      const res = await fetch('/content/evenementen.json');
      const data = await res.json();
      const items = (data.items || []).sort((a, b) => b.datum.localeCompare(a.datum));
      if (items.length === 0) {
        container.innerHTML = '<p class="loading-tekst">Nog geen evenementen.</p>';
        return;
      }
      container.innerHTML = items.map(renderEvenementCard).join('');
      applyFadeIn(container.querySelectorAll('.optreden-card'));
    } catch (e) {
      container.innerHTML = '<p class="loading-tekst">Evenementen konden niet worden geladen.</p>';
    }
  }

  function renderEvenementCard(item) {
    const d = new Date(item.datum);
    const dagNaam = d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
    const aantalFotos = item.fotos ? item.fotos.length : 0;
    const fotoTekst = aantalFotos > 0
      ? `<span class="optreden-count">${aantalFotos} foto's →</span>`
      : `<span class="optreden-count muted">Foto's volgen binnenkort</span>`;
    const img = item.omslagfoto || '/images/optreden-placeholder.svg';
    return `
    <a href="optredens/evenement.html?id=${item.id}" class="optreden-card">
      <div class="optreden-img-wrap">
        <img src="${img}" alt="${item.titel}" />
        <div class="optreden-overlay">
          <span class="overlay-icon">🖼</span>
          <span class="overlay-text">Bekijk foto's</span>
        </div>
      </div>
      <div class="optreden-info">
        <span class="optreden-date">${dagNaam}</span>
        <h3>${item.titel}</h3>
        <p>${item.locatie}</p>
        ${fotoTekst}
      </div>
    </a>`;
  }

  // ─── Over ons afbeeldingen laden ─────────────────────────────────────
  async function laadOverOns() {
    try {
      const res = await fetch('/content/over-ons.json');
      const data = await res.json();
      if (data.afbeelding_groot) {
        const el = document.getElementById('overOnsGroot');
        if (el) el.innerHTML = `<img src="${data.afbeelding_groot}" alt="Fanfare in actie" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;" />`;
      }
      if (data.afbeelding_klein) {
        const el = document.getElementById('overOnsKlein');
        if (el) el.innerHTML = `<img src="${data.afbeelding_klein}" alt="Beentels Kabaal" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;" />`;
      }
    } catch (e) { /* placeholders blijven zichtbaar */ }
  }

  laadAgenda();
  laadEvenementen();
  laadOverOns();

});
