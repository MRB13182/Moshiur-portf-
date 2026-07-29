/* ==========================================================================
   MD. Moshiur Rahman — Premium Portfolio
   script.js
   Vanilla JavaScript Engine (Theme System, 360° Rotary Wheel & Glass System)
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
   1. Theme Engine: LIGHT MODE BY DEFAULT with LocalStorage Persistence
   ---------------------------------------------------------------------- */
function initTheme() {
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');

  /* Default theme is 'light' when website loads for the first time */
  const savedTheme = localStorage.getItem('mr-theme');
  const initialTheme = savedTheme ? savedTheme : 'light';

  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      root.classList.remove('theme-light');
      root.classList.add('theme-dark');
      document.body.classList.remove('theme-light');
      document.body.classList.add('theme-dark');
    } else {
      root.classList.remove('theme-dark');
      root.classList.add('theme-light');
      document.body.classList.remove('theme-dark');
      document.body.classList.add('theme-light');
    }
    localStorage.setItem('mr-theme', theme);
    if (toggle) {
      toggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }
  };

  applyTheme(initialTheme);

  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  }
}

/* ----------------------------------------------------------------------
   2. Navbar Engine: Sticky Blur & Active Section Tracking
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

    let currentSection = '';
    const navHeight = navbar.offsetHeight + 40;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - navHeight;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

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
   3. Mobile Menu Engine: Zero-Jitter Body Lock
   ---------------------------------------------------------------------- */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  if (!hamburger || !navLinks) return;

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
    document.body.classList.add('no-scroll');
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
  };

  const closeMenu = () => {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('open');
    backdrop.classList.remove('open');
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

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  backdrop.addEventListener('click', closeMenu);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburger.classList.contains('open')) {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && hamburger.classList.contains('open')) {
      closeMenu();
    }
  }, { passive: true });
}

/* ----------------------------------------------------------------------
   4. Smooth Scroll Engine
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
   5. Role Rotator Engine: Natural Typewriter
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
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typeSpeed = 400;
    }

    setTimeout(type, typeSpeed);
  };

  type();
}

/* ----------------------------------------------------------------------
   6. Scroll Reveal Engine: IntersectionObserver
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
   7. Hero Stat Counters Engine
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
   8. Premium 360° Circular Rotary Skill Wheel Engine
   ---------------------------------------------------------------------- */
function initSkillWheel() {
  const dial = document.getElementById('rotary-dial');
  const podsContainer = document.getElementById('dial-pods-container');
  const ticksContainer = document.getElementById('dial-ticks');
  const infoCard = document.getElementById('skill-info-card');
  if (!dial || !podsContainer || !infoCard) return;

  const skillsData = [
    { title: "HTML5", category: "Frontend Core", scoreText: "★★★★★", pct: 100, icon: '<i class="fa-brands fa-html5" aria-hidden="true"></i>', desc: "Semantic markup architecture, accessibility (WCAG AA), SEO optimization, and modern web APIs for responsive web applications." },
    { title: "CSS3", category: "Styling & Layout", scoreText: "★★★★★", pct: 98, icon: '<i class="fa-brands fa-css3-alt" aria-hidden="true"></i>', desc: "Advanced Flexbox, CSS Grid, custom properties, fluid responsive typography, and hardware-accelerated 60 FPS animations." },
    { title: "JavaScript", category: "Core Language", scoreText: "★★★★★", pct: 98, icon: '<i class="fa-brands fa-js" aria-hidden="true"></i>', desc: "Deep mastery of ES6+, asynchronous event loop, closures, DOM manipulation, functional programming, and performance tuning." },
    { title: "TypeScript", category: "Typed JavaScript", scoreText: "★★★★★", pct: 95, icon: '<i class="fa-solid fa-code" aria-hidden="true"></i>', desc: "Enterprise type safety, custom interfaces, generics, decorators, and strict compile-time verification for scalable applications." },
    { title: "React", category: "Frontend Library", scoreText: "★★★★★", pct: 96, icon: '<i class="fa-brands fa-react" aria-hidden="true"></i>', desc: "Component-driven architecture, custom hooks, concurrent rendering, state management, and optimized virtual DOM reconciliation." },
    { title: "Next.js", category: "React Framework", scoreText: "★★★★★", pct: 92, icon: '<i class="fa-solid fa-cubes" aria-hidden="true"></i>', desc: "Server-side rendering (SSR), static site generation (SSG), App Router, API routes, and edge-optimized web delivery." },
    { title: "Node.js", category: "Backend Runtime", scoreText: "★★★★★", pct: 94, icon: '<i class="fa-brands fa-node-js" aria-hidden="true"></i>', desc: "Event-driven server architecture, asynchronous I/O, microservices, file system processing, and high-concurrency data streams." },
    { title: "Express.js", category: "Backend Framework", scoreText: "★★★★★", pct: 94, icon: '<i class="fa-solid fa-server" aria-hidden="true"></i>', desc: "RESTful API design, custom middleware pipelines, authentication routing, security headers, and structured error handling." },
    { title: "MongoDB", category: "NoSQL Database", scoreText: "★★★★☆", pct: 90, icon: '<i class="fa-solid fa-database" aria-hidden="true"></i>', desc: "Document-oriented schema design, indexing strategies, aggregation pipelines, Mongoose ODM, and scalable cloud clusters." },
    { title: "PostgreSQL", category: "Relational Database", scoreText: "★★★★☆", pct: 90, icon: '<i class="fa-solid fa-database" aria-hidden="true"></i>', desc: "Relational schema architecture, complex SQL queries, JOIN optimization, indexing, ACID transactions, and data integrity." },
    { title: "REST API", category: "System Integration", scoreText: "★★★★★", pct: 96, icon: '<i class="fa-solid fa-network-wired" aria-hidden="true"></i>', desc: "Scalable HTTP endpoint architecture, OpenAPI documentation, rate limiting, token authentication, and data pagination." },
    { title: "Git", category: "Version Control", scoreText: "★★★★★", pct: 95, icon: '<i class="fa-brands fa-git-alt" aria-hidden="true"></i>', desc: "Advanced branching workflows, interactive rebase, conflict resolution, commit history governance, and collaborative engineering." },
    { title: "GitHub", category: "DevOps & CI/CD", scoreText: "★★★★★", pct: 94, icon: '<i class="fa-brands fa-github" aria-hidden="true"></i>', desc: "Automated GitHub Actions workflows, code review pipelines, pull request governance, package registries, and repo security." },
    { title: "Docker", category: "Containerization", scoreText: "★★★★☆", pct: 86, icon: '<i class="fa-brands fa-docker" aria-hidden="true"></i>', desc: "Containerized application deployment, multi-stage Dockerfiles, Docker Compose environment orchestration, and volume mapping." },
    { title: "Tailwind CSS", category: "Utility CSS", scoreText: "★★★★★", pct: 98, icon: '<i class="fa-solid fa-wind" aria-hidden="true"></i>', desc: "Utility-first design systems, custom theme configuration, responsive design tokens, dark mode systems, and rapid UI prototyping." },
    { title: "Figma", category: "UI/UX Design", scoreText: "★★★★☆", pct: 88, icon: '<i class="fa-brands fa-figma" aria-hidden="true"></i>', desc: "Interactive prototyping, auto-layout design systems, vector iconography, design token mapping, and developer handoff." },
    { title: "Firebase", category: "Cloud Backend", scoreText: "★★★★☆", pct: 90, icon: '<i class="fa-solid fa-fire" aria-hidden="true"></i>', desc: "Real-time Firestore databases, Firebase Authentication, Cloud Functions, hosting deployment, and secure security rules." },
    { title: "Redux", category: "State Management", scoreText: "★★★★☆", pct: 88, icon: '<i class="fa-solid fa-layer-group" aria-hidden="true"></i>', desc: "Predictable global state containers, Redux Toolkit (RTK), asynchronous thunks, immutable state trees, and DevTools debugging." },
    { title: "VS Code", category: "Development IDE", scoreText: "★★★★★", pct: 96, icon: '<i class="fa-solid fa-laptop-code" aria-hidden="true"></i>', desc: "Optimized development environments, custom snippets, debugging pipelines, keyboard workflow mastery, and linting automation." },
    { title: "Linux", category: "OS & Server Admin", scoreText: "★★★★☆", pct: 85, icon: '<i class="fa-brands fa-linux" aria-hidden="true"></i>', desc: "Server command-line operations, bash scripting, SSH authentication, process management, Nginx proxy setup, and permission security." }
  ];

  /* Ticks generation */
  if (ticksContainer && !ticksContainer.children.length) {
    for (let i = 0; i < 60; i++) {
      const tick = document.createElement('div');
      tick.className = `dial-tick${i % 5 === 0 ? ' major' : ''}`;
      tick.style.transform = `rotate(${i * (360 / 60)}deg)`;
      ticksContainer.appendChild(tick);
    }
  }

  /* Pods Injection */
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
  let startY = 0;
  let lastRotation = 0;
  let velocity = 0;
  let lastTime = 0;
  let activeIndex = -1;
  let currentPctDisplay = 0;
  let pctAnimId = null;

  const stepAngle = 360 / skillsData.length;
  const ACTIVE_ANGLE = 0;

  const getRadius = () => {
    const rStr = getComputedStyle(document.documentElement).getPropertyValue('--pod-radius');
    return parseFloat(rStr) || 325;
  };

  const animatePercentage = (targetPct) => {
    if (pctAnimId) cancelAnimationFrame(pctAnimId);
    const pctEl = document.getElementById('card-skill-pct');
    const barEl = document.getElementById('card-skill-progress');
    if (!pctEl || !barEl) return;

    barEl.style.width = `${targetPct}%`;
    const startPct = currentPctDisplay || 0;
    const duration = 500;
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      currentPctDisplay = Math.round(startPct + (targetPct - startPct) * easeOut);
      pctEl.textContent = `${currentPctDisplay}%`;

      if (progress < 1) {
        pctAnimId = requestAnimationFrame(step);
      }
    };
    pctAnimId = requestAnimationFrame(step);
  };

  const updateInfoCard = (index) => {
    if (index === activeIndex || !infoCard || !skillsData[index]) return;
    activeIndex = index;
    const skill = skillsData[index];

    const iconEl = document.getElementById('card-skill-icon');
    const titleEl = document.getElementById('card-skill-title');
    const categoryEl = document.getElementById('card-skill-category');
    const descEl = document.getElementById('card-skill-desc');
    const starsEl = document.getElementById('card-skill-stars');

    infoCard.classList.add('updating');

    setTimeout(() => {
      if (iconEl) iconEl.innerHTML = skill.icon;
      if (titleEl) titleEl.textContent = skill.title;
      if (categoryEl) categoryEl.textContent = skill.category;
      if (descEl) descEl.textContent = skill.desc;
      if (starsEl) {
        starsEl.textContent = skill.scoreText;
        starsEl.setAttribute('aria-label', `${skill.scoreText.split('★').length - 1} out of 5 stars`);
      }
      animatePercentage(skill.pct);
      infoCard.classList.remove('updating');
    }, 150);
  };

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

      let normalized = ((totalAngle - ACTIVE_ANGLE) % 360 + 360) % 360;
      if (normalized > 180) normalized = 360 - normalized;
      const dist = Math.abs(normalized);

      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = i;
      }

      const distPct = Math.max(0, 1 - dist / 60);
      const scale = 0.82 + distPct * 0.36;
      const opacity = 0.48 + distPct * 0.52;

      pod.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      pod.style.opacity = opacity;
      
      if (dist < 9) {
        pod.classList.add('active');
      } else {
        pod.classList.remove('active');
      }
    });

    updateInfoCard(closestIndex);
  };

  const onPointerDown = (e) => {
    isDragging = true;
    dial.style.cursor = 'grabbing';
    velocity = 0;
    startX = e.clientX;
    startY = e.clientY;

    const rect = dial.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
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
    if (distFromCenter > 30) {
      const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
      deltaAngle = currentAngle - startAngle;
      if (deltaAngle > 180) deltaAngle -= 360;
      if (deltaAngle < -180) deltaAngle += 360;
      startAngle = currentAngle;
    } else {
      deltaAngle = (e.clientX - startX) * 0.5 - (e.clientY - startY) * 0.5;
      startX = e.clientX;
      startY = e.clientY;
    }

    const newTarget = lastRotation + deltaAngle;
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

  dial.addEventListener('wheel', (e) => {
    e.preventDefault();
    velocity += (e.deltaY || e.deltaX) * 0.035;
  }, { passive: false });

  podElements.forEach((pod, i) => {
    const spinToSkill = () => {
      if (isDragging) return;
      const baseAngle = i * stepAngle;
      const currentMod = ((targetRotation % 360) + 360) % 360;
      const desiredMod = ((ACTIVE_ANGLE - baseAngle) % 360 + 360) % 360;
      let diff = desiredMod - currentMod;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      targetRotation += diff;
    };

    pod.addEventListener('click', spinToSkill);
    pod.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        spinToSkill();
      }
    });
  });

  const animateWheel = () => {
    if (!isDragging) {
      if (Math.abs(velocity) > 0.01) {
        targetRotation += velocity * 16;
        velocity *= 0.93;
      } else {
        velocity = 0;
        const offset = targetRotation - ACTIVE_ANGLE;
        const snappedOffset = Math.round(offset / stepAngle) * stepAngle;
        const snappedTarget = ACTIVE_ANGLE + snappedOffset;
        targetRotation += (snappedTarget - targetRotation) * 0.12;
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
   9. Ambient Background Particles Engine: Dynamic Light/Dark Responsive
   ---------------------------------------------------------------------- */
function initParticles() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let particles = [];
  const mouse = { x: null, y: null };
  
  const getParticleCount = () => window.innerWidth < 768 ? 32 : 64;
  const LINK_DIST_SQ = 130 * 130;

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
    const dotColor = isLight ? 'rgba(37, 99, 235, 0.45)' : 'rgba(96, 165, 250, 0.75)';
    const lineColorRGB = isLight ? '37, 99, 235' : '96, 165, 250';

    const len = particles.length;
    for (let i = 0; i < len; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      if (mouse.x !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < 14400) {
          const dist = Math.sqrt(distSq);
          p.x += (dx / dist) * 0.5;
          p.y += (dy / dist) * 0.5;
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = dotColor;
      ctx.fill();

      for (let j = i + 1; j < len; j++) {
        const b = particles[j];
        const dx = p.x - b.x;
        const dy = p.y - b.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < LINK_DIST_SQ) {
          const dist = Math.sqrt(distSq);
          const alpha = (1 - dist / 130) * (isLight ? 0.22 : 0.3);
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
   10. Contact Form Engine
   ---------------------------------------------------------------------- */
function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  const noteEl = document.createElement('p');
  noteEl.className = 'form-note';
  noteEl.style.cssText = 'font-size: 0.78rem; color: var(--text-accent); min-height: 1.4em; margin-top: 4px;';
  form.appendChild(noteEl);

  form.addEventListener('submit', () => {
    const nameInput = form.querySelector('input[name="name"]');
    const name = nameInput ? nameInput.value.trim() : '';
    const firstName = name ? name.split(' ')[0] : 'friend';

    noteEl.textContent = `✨ Thank you, ${firstName}! Sending your message now...`;
  });
}
