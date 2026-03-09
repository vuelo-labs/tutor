// ===== NAV SCROLL EFFECT =====
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ===== SCROLL ANIMATIONS =====
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.fade-in, .skill-card').forEach(el => observer.observe(el));

// Stagger skill cards
document.querySelectorAll('.skill-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 60}ms`;
});

// ===== AUDIENCE TABS =====
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    tabBtns.forEach(b => b.classList.toggle('active', b === btn));
    tabPanels.forEach(p => p.classList.toggle('active', p.id === `tab-${target}`));
  });
});

// ===== ANIMATE SKILL BARS ON VISIBLE =====
const barObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.level-bar-fill').forEach(bar => {
          bar.style.width = bar.dataset.width;
        });
        barObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

document.querySelectorAll('.level-bars').forEach(el => {
  el.querySelectorAll('.level-bar-fill').forEach(bar => {
    bar.style.width = '0';
  });
  barObserver.observe(el);
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
