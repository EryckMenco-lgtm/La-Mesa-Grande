/* ============================================================
   La Mesa Grande — script.js
   ============================================================ */

/* ---- Navbar scroll ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ---- Hamburger menu ---- */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ---- Hero background parallax subtle ---- */
const heroBg = document.querySelector('.hero-bg');
window.addEventListener('scroll', () => {
  if (window.scrollY < window.innerHeight) {
    heroBg.style.transform = `scale(1.05) translateY(${window.scrollY * 0.18}px)`;
  }
}, { passive: true });
window.addEventListener('load', () => heroBg.classList.add('loaded'));

/* ---- Hero particles ---- */
(function spawnParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = 18;
  const symbols = ['✦', '·', '✧', '∘'];
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.textContent = symbols[i % symbols.length];
    const size = Math.random() * 10 + 6;
    Object.assign(p.style, {
      position:   'absolute',
      left:       Math.random() * 100 + '%',
      top:        Math.random() * 100 + '%',
      fontSize:   size + 'px',
      color:      'rgba(255,255,255,' + (Math.random() * 0.2 + 0.05) + ')',
      animation:  `particleDrift ${Math.random() * 12 + 8}s ease-in-out ${Math.random() * 5}s infinite alternate`,
      pointerEvents: 'none',
      userSelect: 'none',
    });
    container.appendChild(p);
  }

  if (!document.getElementById('particleStyle')) {
    const style = document.createElement('style');
    style.id = 'particleStyle';
    style.textContent = `
      @keyframes particleDrift {
        from { transform: translate(0, 0) rotate(0deg); opacity: .4; }
        to   { transform: translate(${Math.random() * 30 - 15}px, ${Math.random() * 40 - 20}px) rotate(20deg); opacity: .1; }
      }
    `;
    document.head.appendChild(style);
  }
})();

/* ---- Menu filters ---- */
const filterBtns = document.querySelectorAll('.filter-btn');
const menuCards  = document.querySelectorAll('.menu-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    menuCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.style.transition = 'opacity .35s ease, transform .35s ease';
      if (match) {
        card.style.opacity = '0';
        card.style.transform = 'scale(.95)';
        card.classList.remove('hidden');
        requestAnimationFrame(() => {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        });
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(.95)';
        setTimeout(() => card.classList.add('hidden'), 350);
      }
    });
  });
});

/* ---- Animated counter numbers ---- */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const step = 16;
  const steps = duration / step;
  const increment = target / steps;
  let current = 0;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      el.textContent = target.toLocaleString('es-CO');
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current).toLocaleString('es-CO');
    }
  }, step);
}

const statNums = document.querySelectorAll('.stat-num');
let statsAnimated = false;

/* ---- Scroll reveal + counters trigger ---- */
const revealEls = document.querySelectorAll(
  '.menu-card, .about-grid, .gallery-item, .testi-card, .reservas-grid, .ubicacion-grid, .stat-item'
);
revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !statsAnimated) {
      statsAnimated = true;
      statNums.forEach(animateCounter);
    }
  });
}, { threshold: 0.5 });

const statsRow = document.querySelector('.stats-row');
if (statsRow) statsObserver.observe(statsRow);

/* ---- Lightbox ---- */
const galleryItems  = document.querySelectorAll('.gallery-item');
const lightbox      = document.getElementById('lightbox');
const lbImg         = document.getElementById('lbImg');
const lbClose       = document.getElementById('lbClose');
const lbPrev        = document.getElementById('lbPrev');
const lbNext        = document.getElementById('lbNext');

const lbSrcs = Array.from(galleryItems).map(item => item.dataset.src);
let lbIndex  = 0;

function openLightbox(index) {
  lbIndex = index;
  lbImg.src = lbSrcs[lbIndex];
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lbImg.src = '';
  document.body.style.overflow = '';
}

function stepLightbox(dir) {
  lbIndex = (lbIndex + dir + lbSrcs.length) % lbSrcs.length;
  lbImg.style.opacity = '0';
  setTimeout(() => {
    lbImg.src = lbSrcs[lbIndex];
    lbImg.style.opacity = '1';
  }, 180);
}

lbImg.style.transition = 'opacity .18s ease';

galleryItems.forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
});
lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click',  () => stepLightbox(-1));
lbNext.addEventListener('click',  () => stepLightbox(1));
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   stepLightbox(-1);
  if (e.key === 'ArrowRight')  stepLightbox(1);
});

/* ---- Testimonials slider ---- */
const sliderTrack = document.getElementById('sliderTrack');
const dotsWrap    = document.getElementById('sliderDots');
const cards       = sliderTrack ? sliderTrack.querySelectorAll('.testi-card') : [];
let slideIndex    = 0;
let autoSlide;

function getVisible() {
  const w = window.innerWidth;
  if (w > 900)  return 3;
  if (w > 600)  return 2;
  return 1;
}

function buildDots() {
  if (!dotsWrap) return;
  dotsWrap.innerHTML = '';
  const total = Math.ceil(cards.length / getVisible());
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === slideIndex ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  }
}

function goTo(index) {
  const visible = getVisible();
  const max = Math.max(0, Math.ceil(cards.length / visible) - 1);
  slideIndex = Math.min(Math.max(index, 0), max);
  const cardWidth = cards[0] ? cards[0].offsetWidth + 24 : 0;
  sliderTrack.style.transform = `translateX(-${slideIndex * visible * cardWidth}px)`;
  document.querySelectorAll('.dot').forEach((d, i) => {
    d.classList.toggle('active', i === slideIndex);
  });
}

function startAutoSlide() {
  stopAutoSlide();
  autoSlide = setInterval(() => {
    const total = Math.ceil(cards.length / getVisible());
    goTo((slideIndex + 1) % total);
  }, 4500);
}

function stopAutoSlide() { clearInterval(autoSlide); }

if (sliderTrack) {
  buildDots();
  startAutoSlide();
  sliderTrack.addEventListener('mouseenter', stopAutoSlide);
  sliderTrack.addEventListener('mouseleave', startAutoSlide);
  window.addEventListener('resize', () => { buildDots(); goTo(0); });

  /* Touch/swipe support */
  let touchStartX = 0;
  sliderTrack.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  sliderTrack.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(slideIndex + (diff > 0 ? 1 : -1));
  });
}

/* ---- Reservation form validation ---- */
const reservaForm = document.getElementById('reservaForm');
const formSuccess = document.getElementById('formSuccess');

if (reservaForm) {
  /* Set minimum date to today */
  const fechaInput = document.getElementById('fecha');
  if (fechaInput) {
    const today = new Date().toISOString().split('T')[0];
    fechaInput.min = today;
  }

  function validateField(input) {
    const errEl = input.parentElement.querySelector('.field-error');
    let msg = '';
    if (input.required && !input.value.trim()) {
      msg = 'Este campo es obligatorio.';
    } else if (input.type === 'tel' && input.value && !/^\+?[\d\s\-]{7,15}$/.test(input.value)) {
      msg = 'Ingresa un número válido.';
    } else if (input.type === 'date' && input.value && input.value < input.min) {
      msg = 'Elige una fecha desde hoy.';
    }
    input.classList.toggle('error', !!msg);
    if (errEl) errEl.textContent = msg;
    return !msg;
  }

  reservaForm.querySelectorAll('input, select').forEach(el => {
    el.addEventListener('blur', () => validateField(el));
    el.addEventListener('input', () => { if (el.classList.contains('error')) validateField(el); });
  });

  reservaForm.addEventListener('submit', e => {
    e.preventDefault();
    const fields  = reservaForm.querySelectorAll('input, select');
    const allOk   = Array.from(fields).map(validateField).every(Boolean);
    if (!allOk) return;

    const nombre   = document.getElementById('nombre').value;
    const fecha    = document.getElementById('fecha').value;
    const hora     = document.getElementById('hora').value;
    const personas = document.getElementById('personas').value;
    const wa       = document.getElementById('whatsapp').value;

    const msg = encodeURIComponent(
      `Hola! Quiero reservar una mesa.\n\n` +
      `*Nombre:* ${nombre}\n` +
      `*Fecha:* ${fecha}\n` +
      `*Hora:* ${hora}\n` +
      `*Personas:* ${personas}\n` +
      `*Mi WhatsApp:* ${wa}`
    );

    window.open(`https://wa.me/573001234567?text=${msg}`, '_blank');
    formSuccess.style.display = 'block';
    reservaForm.reset();
    setTimeout(() => { formSuccess.style.display = 'none'; }, 6000);
  });
}

/* ---- Smooth scroll for anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 12;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ---- Active nav link on scroll ---- */
const sections = document.querySelectorAll('section[id], div[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.classList.toggle('active-link', a.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => activeObserver.observe(s));
