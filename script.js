/* ==========================================================================
   MD. Moshiur Rahman — Premium Portfolio
   script.js
   Apple + Linear + Framer Quality Vanilla JavaScript Engine
   ========================================================================== */

function initAll() {
  initTheme();
  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  initRoleRotator();
  initRevealAnimations();
  initCounters();
  initSkillWheel();
  initParticles();
  initContactForm();
  
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}

/* ----------------------------------------------------------------------
   1. Theme Engine: Dark Mode by Default with LocalStorage & Smooth Switch
   ---------------------------------------------------------------------- */
function initTheme() {
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  const savedTheme = localStorage.getItem('mr-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'dark'); /* Default to luxury dark */

  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('mr-theme', theme);
    
    /* Update toggle ARIA label */
    toggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  };

  applyTheme(initialTheme);

  toggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  });
}

/* ----------------------------------------------------------------------
   2. Navbar Engine: Sticky Blur, Scroll State & Active Section Tracking
   ---------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('[data-nav]');
  const sections = document.querySelectorAll('main .section, main .hero');
  if (!navbar) return;

  let ticking = false;

  const updateNavbar = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    navbar.classList.toggle('scrolled', scrollY > 20);

    /* Determine active section */
    let currentSection = '';
    const navHeight = navbar.offsetHeight + 40;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - navHeight;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    /* Fallback to first section if at very top */
    if (scrollY < 100 && sections.length > 0) {
      currentSection = sections[0].getAttribute('id');
    }

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      const isActive = href === `#${currentSection}`;
      link.classList.toggle('active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }, { passive: true });

  updateNavbar();
}

/* ----------------------------------------------------------------------
   3. Mobile Menu Engine: Zero-Jitter Body Lock, ESC & Outside Click
   ---------------------------------------------------------------------- */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  if (!hamburger || !navLinks) return;

  /* Create backdrop overlay */
  let backdrop = document.querySelector('.nav-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);
  }

  const openMenu = () => {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    navLinks.classList.add('open');
    backdrop.classList.add('open');
    
    /* Lock body scroll without layout shift */
    document.body.classList.add('no-scroll');
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
  };

  const closeMenu = () => {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('open');
    backdrop.classList.remove('open');
    
    /* Restore body scroll */
    document.body.classList.remove('no-scroll');
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
  };

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = hamburger.classList.contains('open');
    if (isOpen) closeMenu();
    else openMenu();
  });

  /* Close on link click */
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  /* Close on backdrop click */
  backdrop.addEventListener('click', closeMenu);

  /* Close on ESC key */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburger.classList.contains('open')) {
      closeMenu();
    }
  });

  /* Close on resize to desktop */
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && hamburger.classList.contains('open')) {
      closeMenu();
    }
  }, { passive: true });
}

/* ----------------------------------------------------------------------
   4. Smooth Scroll Engine: Precise Offset Calculation
   ---------------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      e.preventDefault();
      const navbar = document.getElementById('navbar');
      const offset = (navbar ? navbar.offsetHeight : 76) + 12;
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
}

/* ----------------------------------------------------------------------
   5. Role Rotator Engine: Natural Typing & Deleting Effect
   ---------------------------------------------------------------------- */
function initRoleRotator() {
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
  let isDeleting = false;
  let timerId = null;

  const type = () => {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      charIndex--;
      el.textContent = currentRole.substring(0, charIndex);
    } else {
      charIndex++;
      el.textContent = currentRole.substring(0, charIndex);
    }

    let typeSpeed = isDeleting ? 28 : 55;

    if (!isDeleting && charIndex === currentRole.length) {
      typeSpeed = 2000; /* Pause at end of sentence */
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typeSpeed = 400; /* Pause before typing next */
    }

    timerId = setTimeout(type, typeSpeed);
  };

  type();
}

/* ----------------------------------------------------------------------
   6. Scroll Reveal Engine: Hardware-Accelerated IntersectionObserver
   ---------------------------------------------------------------------- */
function initRevealAnimations() {
  const revealItems = document.querySelectorAll('.reveal');
  if (!revealItems.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.12
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        /* Add staggered delay based on relative index in view */
        const delay = (idx % 4) * 80;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealItems.forEach((item) => observer.observe(item));
}

/* ----------------------------------------------------------------------
   8. Hero Stat Counters Engine: Smooth Cubic Easing
   ---------------------------------------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 1400;
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const easeOut = 1 - Math.pow(1 - progress, 4);
      el.textContent = Math.round(easeOut * target);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach((counter) => observer.observe(counter));
}

/* ----------------------------------------------------------------------
   9. Premium Interactive Rotary Skill Wheel Engine (Half-Visible Glass Dial)
   ---------------------------------------------------------------------- */
function initSkillWheel() {
  const dial = document.getElementById('rotary-dial');
  const podsContainer = document.getElementById('dial-pods-container');
  const ticksContainer = document.getElementById('dial-ticks');
  const infoBox = document.getElementById('skill-info-box');
  if (!dial || !podsContainer) return;

  const skillsData = [
    { title: "HTML & CSS", category: "Frontend Development", scoreText: "★★★★★", icon: '<i class="fa-brands fa-html5" aria-hidden="true"></i>' },
    { title: "JavaScript", category: "Core Language", scoreText: "★★★★★", icon: '<i class="fa-brands fa-js" aria-hidden="true"></i>' },
    { title: "React", category: "Frontend Library", scoreText: "★★★★★", icon: '<i class="fa-brands fa-react" aria-hidden="true"></i>' },
    { title: "TypeScript", category: "Typed JavaScript", scoreText: "★★★★☆", icon: '<i class="fa-solid fa-code" aria-hidden="true"></i>' },
    { title: "Node.js", category: "Backend Runtime", scoreText: "★★★★☆", icon: '<i class="fa-brands fa-node-js" aria-hidden="true"></i>' },
    { title: "Express.js", category: "Backend Framework", scoreText: "★★★★☆", icon: '<i class="fa-solid fa-server" aria-hidden="true"></i>' },
    { title: "MongoDB", category: "NoSQL Database", scoreText: "★★★★☆", icon: '<i class="fa-solid fa-database" aria-hidden="true"></i>' },
    { title: "PostgreSQL", category: "Relational Database", scoreText: "★★★★☆", icon: '<i class="fa-solid fa-database" aria-hidden="true"></i>' },
    { title: "REST API", category: "Backend Architecture", scoreText: "★★★★★", icon: '<i class="fa-solid fa-network-wired" aria-hidden="true"></i>' },
    { title: "Next.js", category: "React Framework", scoreText: "★★★★☆", icon: '<i class="fa-solid fa-cubes" aria-hidden="true"></i>' },
    { title: "Figma", category: "UI/UX Design", scoreText: "★★★★☆", icon: '<i class="fa-brands fa-figma" aria-hidden="true"></i>' },
    { title: "Tailwind CSS", category: "CSS Framework", scoreText: "★★★★★", icon: '<i class="fa-brands fa-css3-alt" aria-hidden="true"></i>' },
    { title: "Docker", category: "Containerization", scoreText: "★★★☆☆", icon: '<i class="fa-brands fa-docker" aria-hidden="true"></i>' },
    { title: "Git & GitHub", category: "Version Control", scoreText: "★★★★★", icon: '<i class="fa-brands fa-github" aria-hidden="true"></i>' },
    { title: "Firebase", category: "Cloud Backend", scoreText: "★★★★☆", icon: '<i class="fa-solid fa-cloud" aria-hidden="true"></i>' },
    { title: "Supabase", category: "Open Source Backend", scoreText: "★★★★☆", icon: '<i class="fa-solid fa-bolt" aria-hidden="true"></i>' },
    { title: "UI/UX Design", category: "Interface Design", scoreText: "★★★★☆", icon: '<i class="fa-solid fa-wand-magic-sparkles" aria-hidden="true"></i>' },
    { title: "Web Animation", category: "Interactive Motion", scoreText: "★★★★☆", icon: '<i class="fa-solid fa-film" aria-hidden="true"></i>' },
    { title: "Performance Optimization", category: "Speed & Core Vitals", scoreText: "★★★★☆", icon: '<i class="fa-solid fa-gauge-high" aria-hidden="true"></i>' },
    { title: "Responsive Design", category: "Multi-Device UI", scoreText: "★★★★★", icon: '<i class="fa-solid fa-mobile-screen-button" aria-hidden="true"></i>' },
    { title: "API Integration", category: "Third-Party Services", scoreText: "★★★★★", icon: '<i class="fa-solid fa-plug" aria-hidden="true"></i>' },
    { title: "Database Design", category: "Schema Architecture", scoreText: "★★★★☆", icon: '<i class="fa-solid fa-sitemap" aria-hidden="true"></i>' }
  ];

  /* Generate 44 ticks around the wheel */
  if (ticksContainer && !ticksContainer.children.length) {
    for (let i = 0; i < 44; i++) {
      const tick = document.createElement('div');
      tick.className = `dial-tick${i % 2 === 0 ? ' major' : ''}`;
      tick.style.transform = `rotate(${i * (360 / 44)}deg)`;
      ticksContainer.appendChild(tick);
    }
  }

  /* Create Skill Pods */
  podsContainer.innerHTML = '';
  const podElements = skillsData.map((skill) => {
    const pod = document.createElement('div');
    pod.className = 'skill-pod';
    pod.setAttribute('role', 'button');
    pod.setAttribute('tabindex', '0');
    pod.setAttribute('aria-label', `${skill.title} - ${skill.category}`);
    pod.innerHTML = `<span class="skill-pod-icon">${skill.icon}</span>`;
    podsContainer.appendChild(pod);
    return pod;
  });

  let currentRotation = 0;
  let targetRotation = 0;
  let isDragging = false;
  let startAngle = 0;
  let startRotation = 0;
  let startX = 0;
  let lastRotation = 0;
  let velocity = 0;
  let lastTime = 0;
  let activeIndex = -1;

  const stepAngle = 360 / skillsData.length;

  /* Helper: Get dynamic pod radius based on screen size */
  const getRadius = () => {
    const rStr = getComputedStyle(document.documentElement).getPropertyValue('--pod-radius');
    return parseFloat(rStr) || 300;
  };

  /* Update active skill info box with smooth glass transition */
  const updateInfoBox = (index) => {
    if (index === activeIndex || !infoBox || !skillsData[index]) return;
    activeIndex = index;
    const skill = skillsData[index];

    const iconEl = document.getElementById('info-box-icon');
    const titleEl = document.getElementById('info-box-title');
    const categoryEl = document.getElementById('info-box-category');
    const starsEl = document.getElementById('info-box-stars');

    if (iconEl) iconEl.innerHTML = skill.icon;
    if (titleEl) {
      titleEl.style.opacity = '0';
      setTimeout(() => {
        titleEl.textContent = skill.title;
        titleEl.style.opacity = '1';
      }, 100);
    }
    if (categoryEl) {
      categoryEl.style.opacity = '0';
      setTimeout(() => {
        categoryEl.textContent = skill.category;
        categoryEl.style.opacity = '1';
      }, 100);
    }
    if (starsEl) {
      starsEl.style.transform = 'scale(0.8)';
      starsEl.style.opacity = '0.5';
      setTimeout(() => {
        starsEl.textContent = skill.scoreText;
        starsEl.setAttribute('aria-label', `${skill.scoreText.split('★').length - 1} out of 5 stars`);
        starsEl.style.transform = 'scale(1)';
        starsEl.style.opacity = '1';
      }, 100);
    }

    infoBox.style.transform = 'scale(0.97)';
    infoBox.style.borderColor = '#60A5FA';
    setTimeout(() => {
      infoBox.style.transform = 'scale(1)';
      infoBox.style.borderColor = '';
    }, 150);
  };

  /* Position pods around circle and determine active item at 12 o'clock */
  const renderWheel = () => {
    const radius = getRadius();
    let closestIndex = 0;
    let minDistance = 360;

    if (ticksContainer) {
      ticksContainer.style.transform = `rotate(${currentRotation}deg)`;
    }

    podElements.forEach((pod, i) => {
      const baseAngle = i * stepAngle;
      const totalAngle = baseAngle + currentRotation;
      const rad = totalAngle * (Math.PI / 180);

      const x = Math.sin(rad) * radius;
      const y = -Math.cos(rad) * radius;

      /* Calculate normalized distance from top 12 o'clock position (0 degrees) */
      let normalized = (totalAngle % 360 + 360) % 360;
      if (normalized > 180) normalized -= 360;
      const dist = Math.abs(normalized);

      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = i;
      }

      /* Dynamic scale & opacity based on proximity to active pointer */
      const distPct = Math.max(0, 1 - dist / 35);
      const scale = 0.85 + distPct * 0.65;
      const opacity = 0.45 + distPct * 0.55;

      pod.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
      pod.style.opacity = opacity;
      
      if (dist < 10) {
        pod.classList.add('active');
      } else {
        pod.classList.remove('active');
      }
    });

    updateInfoBox(closestIndex);
  };

  /* Pointer event handlers for Rotary Dial drag/swipe */
  const onPointerDown = (e) => {
    isDragging = true;
    dial.style.cursor = 'grabbing';
    velocity = 0;
    startX = e.clientX;

    const rect = dial.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    startRotation = targetRotation;
    lastRotation = targetRotation;
    lastTime = performance.now();

    if (e.pointerId && dial.setPointerCapture) {
      try { dial.setPointerCapture(e.pointerId); } catch (err) {}
    }
  };

  const onPointerMove = (e) => {
    if (!isDragging) return;
    
    const rect = dial.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distFromCenter = Math.hypot(e.clientX - centerX, e.clientY - centerY);

    let deltaAngle = 0;
    if (distFromCenter > 45) {
      const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
      deltaAngle = currentAngle - startAngle;
      if (deltaAngle > 180) deltaAngle -= 360;
      if (deltaAngle < -180) deltaAngle += 360;
    } else {
      deltaAngle = (e.clientX - startX) * 0.65;
    }

    const newTarget = startRotation + deltaAngle;
    const now = performance.now();
    const dt = now - lastTime;
    if (dt > 0) {
      velocity = (newTarget - lastRotation) / dt;
    }

    lastRotation = newTarget;
    targetRotation = newTarget;
    lastTime = now;
  };

  const onPointerUp = (e) => {
    if (!isDragging) return;
    isDragging = false;
    dial.style.cursor = 'grab';

    if (e.pointerId && dial.releasePointerCapture) {
      try { dial.releasePointerCapture(e.pointerId); } catch (err) {}
    }
  };

  dial.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerUp);

  /* Pod Click Handler: Direct spin to selected skill */
  podElements.forEach((pod, i) => {
    const spinToSkill = () => {
      if (isDragging) return;
      const desiredBase = -i * stepAngle;
      const diff = (desiredBase - targetRotation) % 360;
      let shortestDiff = ((diff + 540) % 360) - 180;
      targetRotation += shortestDiff;
    };

    pod.addEventListener('click', spinToSkill);
    pod.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        spinToSkill();
      }
    });
  });

  /* Animation & Physics Loop */
  const animateWheel = () => {
    if (!isDragging) {
      if (Math.abs(velocity) > 0.01) {
        targetRotation += velocity * 16;
        velocity *= 0.94;
      } else {
        velocity = 0;
        const snapped = Math.round(targetRotation / stepAngle) * stepAngle;
        targetRotation += (snapped - targetRotation) * 0.12;
      }
    }

    currentRotation += (targetRotation - currentRotation) * 0.22;
    renderWheel();
    requestAnimationFrame(animateWheel);
  };

  window.addEventListener('resize', renderWheel, { passive: true });
  renderWheel();
  requestAnimationFrame(animateWheel);
}

/* ----------------------------------------------------------------------
   10. Ambient Background Particles Engine: High FPS & RequestAnimationFrame
   ---------------------------------------------------------------------- */
function initParticles() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let particles = [];
  const mouse = { x: null, y: null };
  
  /* Responsive particle density for optimum FPS */
  const getParticleCount = () => window.innerWidth < 768 ? 32 : 64;
  const LINK_DIST_SQ = 130 * 130; /* Use distance squared to avoid Math.sqrt in loop */

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createParticles() {
    const count = getParticleCount();
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.5 + 0.8
    }));
  }

  let animId = null;
  let isRunning = true;

  function step() {
    if (!isRunning) return;
    ctx.clearRect(0, 0, width, height);

    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const dotColor = isLight ? 'rgba(37, 99, 235, 0.5)' : 'rgba(96, 165, 250, 0.75)';
    const lineColorRGB = isLight ? '37, 99, 235' : '96, 165, 250';

    const len = particles.length;
    for (let i = 0; i < len; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      /* Gentle mouse interaction */
      if (mouse.x !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < 14400) { /* 120 * 120 */
          const dist = Math.sqrt(distSq);
          p.x += (dx / dist) * 0.5;
          p.y += (dy / dist) * 0.5;
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = dotColor;
      ctx.fill();

      /* Draw linking lines */
      for (let j = i + 1; j < len; j++) {
        const b = particles[j];
        const dx = p.x - b.x;
        const dy = p.y - b.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < LINK_DIST_SQ) {
          const dist = Math.sqrt(distSq);
          const alpha = (1 - dist / 130) * (isLight ? 0.2 : 0.3);
          ctx.strokeStyle = `rgba(${lineColorRGB}, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(step);
  }

  /* Debounced resize handler */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      createParticles();
    }, 150);
  }, { passive: true });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  }, { passive: true });

  /* Pause animation when tab is hidden to save battery & CPU */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isRunning = false;
      if (animId) cancelAnimationFrame(animId);
    } else {
      if (!isRunning) {
        isRunning = true;
        step();
      }
    }
  });

  resize();
  createParticles();
  step();
}

/* ----------------------------------------------------------------------
   11. Contact Form Engine: Responsive & User Feedback
   ---------------------------------------------------------------------- */
function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  const noteEl = document.createElement('p');
  noteEl.className = 'form-note';
  noteEl.style.cssText = 'font-size: 0.78rem; color: var(--text-accent); min-height: 1.4em; margin-top: 4px;';
  form.appendChild(noteEl);

  form.addEventListener('submit', (e) => {
    /* Allow formsubmit.co POST to proceed or show clean confirmation */
    const nameInput = form.querySelector('input[name="name"]');
    const name = nameInput ? nameInput.value.trim() : '';
    const firstName = name ? name.split(' ')[0] : 'friend';

    noteEl.textContent = `✨ Thank you, ${firstName}! Sending your message now...`;
  });
}
