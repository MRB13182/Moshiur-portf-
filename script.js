/* ==========================================================================
   MD. Moshiur Rahman — Portfolio
   script.js
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  initRoleRotator();
  initRevealAnimations();
  initSkillBars();
  initCounters();
  initParticles();
  initContactForm();
  document.getElementById('year').textContent = new Date().getFullYear();
});

/* ---------------------------------------------------------------------- */
/* Theme: dark by default, saved in localStorage                          */
/* ---------------------------------------------------------------------- */
function initTheme(){
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const saved = localStorage.getItem('mr-theme');

  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('mr-theme', theme);
  };

  applyTheme(saved === 'light' ? 'light' : 'dark');

  toggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
}

/* ---------------------------------------------------------------------- */
/* Navbar: background on scroll + active link tracking                    */
/* ---------------------------------------------------------------------- */
function initNavbar(){
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('[data-nav]');
  const sections = document.querySelectorAll('main .section, .hero');

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);

    let current = sections[0] ? sections[0].id : '';
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 140 && rect.bottom >= 140) current = section.id;
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------------------------------------------------------------------- */
/* Mobile menu                                                            */
/* ---------------------------------------------------------------------- */
function initMobileMenu(){
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

/* ---------------------------------------------------------------------- */
/* Smooth scroll for in-page anchors                                      */
/* ---------------------------------------------------------------------- */
function initSmoothScroll(){
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = 84;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ---------------------------------------------------------------------- */
/* Hero role rotator (typing effect)                                      */
/* ---------------------------------------------------------------------- */
function initRoleRotator(){
  const el = document.getElementById('role-rotator');
  if (!el) return;

  const roles = [
    'Building scalable web experiences',
    'Crafting premium user interfaces',
    'Turning ideas into working products',
    'Writing clean, dependable code'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const tick = () => {
    const current = roles[roleIndex];

    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 1600);
        return;
      }
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(tick, deleting ? 30 : 55);
  };

  tick();
}

/* ---------------------------------------------------------------------- */
/* Scroll reveal animations                                               */
/* ---------------------------------------------------------------------- */
function initRevealAnimations(){
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 40 % 200);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  items.forEach(item => observer.observe(item));
}

/* ---------------------------------------------------------------------- */
/* Skill progress bar animation                                           */
/* ---------------------------------------------------------------------- */
function initSkillBars(){
  const rows = document.querySelectorAll('.skill-row');
  if (!rows.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const row = entry.target;
      const value = parseInt(row.dataset.skill, 10) || 0;
      const fill = row.querySelector('.skill-fill');
      const pct = row.querySelector('.skill-pct');

      requestAnimationFrame(() => { fill.style.width = value + '%'; });

      let current = 0;
      const step = () => {
        current += Math.max(1, Math.round(value / 40));
        if (current >= value) current = value;
        pct.textContent = current + '%';
        if (current < value) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);

      observer.unobserve(row);
    });
  }, { threshold: 0.4 });

  rows.forEach(row => observer.observe(row));
}

/* ---------------------------------------------------------------------- */
/* Hero stat counters                                                     */
/* ---------------------------------------------------------------------- */
function initCounters(){
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const animate = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 1200;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  counters.forEach(c => observer.observe(c));
}

/* ---------------------------------------------------------------------- */
/* Ambient background particles (blue neon glow)                          */
/* ---------------------------------------------------------------------- */
function initParticles(){
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height, particles, mouse = { x: null, y: null };
  const PARTICLE_COUNT = window.innerWidth < 700 ? 36 : 70;
  const LINK_DIST = 130;

  function resize(){
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createParticles(){
    particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.6
    }));
  }

  function step(){
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      if (mouse.x !== null) {
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          p.x += dx / dist * 0.6;
          p.y += dy / dist * 0.6;
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(96,165,250,0.75)';
      ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DIST) {
          ctx.strokeStyle = `rgba(37,99,235,${(1 - dist / LINK_DIST) * 0.35})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(step);
  }

  window.addEventListener('resize', () => { resize(); createParticles(); });
  window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

  resize();
  createParticles();
  step();
}

/* ---------------------------------------------------------------------- */
/* Contact form (client-side only, no backend)                            */
/* ---------------------------------------------------------------------- */
function initContactForm(){
  const form = document.getElementById('contact-form');
  const note = document.getElementById('form-note');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('cf-name').value.trim();

    note.textContent = `Thanks${name ? ', ' + name.split(' ')[0] : ''} — your message is ready to send. Connect a backend or mail service to deliver it.`;
    form.reset();
  });
}
/* ===========================
   Premium Sticky Stack
=========================== */

const cards = document.querySelectorAll(".skill-card");

function updateCards() {

    const isMobile = window.innerWidth <= 768;

    const trigger = isMobile ? 90 : 130;
    const moveGap = isMobile ? 4 : 8;
    const scaleGap = isMobile ? 0.015 : 0.02;

    cards.forEach((card, index) => {

        const rect = card.getBoundingClientRect();

        if (rect.top <= trigger) {

            const scale = Math.max(
                0.88,
                1 - ((cards.length - index - 1) * scaleGap)
            );

            card.style.transform =
                `translateY(${index * moveGap}px) scale(${scale})`;

            card.style.zIndex = index + 100;
            card.style.opacity = "1";

        } else {

            card.style.transform =
                "translateY(0) scale(1)";

            card.style.zIndex = index;
        }

    });

}

window.addEventListener("scroll", updateCards, { passive: true });
window.addEventListener("resize", updateCards);
window.addEventListener("load", updateCards);