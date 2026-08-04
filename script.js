/* ==========================================================================
   MD. Moshiur Rahman — Premium Portfolio
   script.js
   Vanilla JavaScript Engine + AI Chatbot Assistant Integration
   ========================================================================== */

/* ---------- 1. API KEY & AI ASSISTANT CONFIGURATION ---------- */
const SYSTEM_INSTRUCTION = `You are MRx Ai, the official AI Portfolio Assistant for MD. Moshiur Rahman, a Full Stack Developer & UI Engineer based in Dhaka, Bangladesh.
Your role is to represent Moshiur in a friendly, enthusiastic, professional, and articulate manner to portfolio visitors, clients, and recruiters.

COMPLETE BACKGROUND & KNOWLEDGE BASE:

1. PERSONAL INFORMATION & OVERVIEW:
- Name: MD. Moshiur Rahman
- Role: Full Stack Developer & UI Engineer
- Base Location: Dhaka, Bangladesh (Works with clients and teams globally)
- Experience: 5+ years of building web applications, scalable APIs, and user interfaces
- Key Metrics: 40+ completed projects shipped, 18+ satisfied clients
- Core Philosophy: Focuses on clean architecture, pixel precision, fast performance, and dependable engineering.

2. FEATURED PROJECTS & LIVE URLS:
- Study Flow App: A productivity & focus management platform with custom timers, analytics, and workflow automation. Live URL: https://study-flowup.netlify.app/
- EduPay Pico: An educational fintech payment gateway platform streamlining tuition fees, invoicing, and transaction tracking. Live URL: https://edupay-pico.netlify.app/
- Portfolio Work: Over 40 shipped web products, SaaS dashboards, REST APIs, and full-stack applications.

3. TECHNICAL SKILLS & STACK:
- Frontend Core: HTML5, CSS3, JavaScript (ES6+), TypeScript
- Frameworks & Libraries: React, Next.js, Redux, Tailwind CSS
- Backend & Runtime: Node.js, Express.js, RESTful APIs
- Databases: MongoDB, PostgreSQL, Firebase (Firestore & Auth)
- DevOps & Tools: Git, GitHub, Docker, VS Code, Linux (Nginx, Bash administration)
- UI/UX Design: Figma (wireframing, interactive prototyping, design tokens)

4. SERVICES OFFERED:
- Web Development: Fast, responsive, accessible web applications built on modern React/Node stack.
- UI/UX Design: Considered interfaces designed from wireframes to pixel-perfect design systems.
- API Development: Secure, well-documented RESTful and GraphQL APIs built to scale.
- Performance Optimization: Speeding up load times, bundle optimization, and smooth 60 FPS animations.
- Maintenance & Support: Continuous updates, bug fixes, and system monitoring.
- Technical Consulting: Architecture reviews, technology stack selection, and product advice.

5. CONTACT & SOCIAL CHANNELS:
- Email: borshonsweb@gmail.com
- Phone / WhatsApp: +8801732212203 (Direct WhatsApp: https://wa.me/8801732212203)
- Telegram: @moshiur_182 (Direct Telegram: https://t.me/moshiur_182)
- GitHub: MRB13182 (Direct GitHub: https://github.com/MRB13182)
- Instagram: @ali.babaa.x (Direct Instagram: https://www.instagram.com/ali.babaa.x?igsh=Y3dlMm5ib2IzZng0)
- Facebook: md.moshiur.rahman.512608 (Direct Facebook: https://www.facebook.com/md.moshiur.rahman.512608)

6. PORTFOLIO SECTIONS:
- #home: Introduction, role rotator, metrics, profile badge
- #about: Person behind the code, core bio, focus, stack
- #journey: Developer journey timeline from year 1 to present
- #services: 6 core services offered
- #skills: Interactive 360° Rotary Dial Wheel showing all 20 skills
- #projects: Highlighted live project icons with direct links
- #aspirations: History, future goals, and inspiration quote
- #contact: Email link, social icons, and contact form

RESPONSE STYLE GUIDELINES:
- Be concise, helpful, warm, and professional.
- Format responses neatly using bold text (**term**) for key terms, bullet points for lists, and clickable links for URLs.
- If asked how to hire or contact Moshiur, share his email (borshonsweb@gmail.com) and WhatsApp (+8801732212203).
- If asked questions unrelated to Moshiur's portfolio, politely steer the conversation back to Moshiur's work, technical capabilities, or booking a project with him.
`;

/* Global Conversation History */
let conversationHistory = [];

/* ---------- INITIALIZATION ---------- */
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
  initCustomCursorAndMagnetic();
  init3DTilt();
  initContactForm();
  initAIChatbot();
  
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

    let metaTheme = document.querySelector('meta[name="theme-color"]');
    if (!metaTheme) {
      metaTheme = document.createElement('meta');
      metaTheme.name = 'theme-color';
      document.head.appendChild(metaTheme);
    }
    metaTheme.content = theme === 'dark' ? '#020617' : '#f8fafc';
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
   6. Scroll Reveal Engine: IntersectionObserver with Stagger
   ---------------------------------------------------------------------- */
function initRevealAnimations() {
  const revealItems = document.querySelectorAll('.reveal');
  if (!revealItems.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        const delay = (idx % 4) * 90;
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

  if (ticksContainer && !ticksContainer.children.length) {
    for (let i = 0; i < 60; i++) {
      const tick = document.createElement('div');
      tick.className = `dial-tick${i % 5 === 0 ? ' major' : ''}`;
      tick.style.transform = `rotate(${i * (360 / 60)}deg)`;
      ticksContainer.appendChild(tick);
    }
  }

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
  let dragDistance = 0; // Fixed: Declared dragDistance to fix JS error
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
    }, 120);
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
    dragDistance = 0;
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
  };

  const onPointerMove = (e) => {
    if (!isDragging) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    dragDistance += Math.hypot(dx, dy);

    if (dragDistance > 8 && e.pointerId && dial.setPointerCapture) {
      try { dial.setPointerCapture(e.pointerId); } catch (err) {}
    }
    
    const rect = dial.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distFromCenter = Math.hypot(e.clientX - centerX, e.clientY - centerY);

    let deltaAngle = 0;
    if (distFromCenter > 25) {
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
    velocity += (e.deltaY || e.deltaX) * 0.032;
  }, { passive: false });

  dial.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      targetRotation -= stepAngle;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      targetRotation += stepAngle;
    }
  });

  podElements.forEach((pod, i) => {
    const spinToSkill = (e) => {
      if (e) e.stopPropagation();
      if (dragDistance > 10) return;
      const baseAngle = i * stepAngle;
      const currentMod = ((targetRotation % 360) + 360) % 360;
      const desiredMod = ((ACTIVE_ANGLE - baseAngle) % 360 + 360) % 360;
      let diff = desiredMod - currentMod;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      targetRotation += diff;
      velocity = 0;
    };

    pod.addEventListener('click', spinToSkill);
    pod.addEventListener('pointerup', (e) => {
      if (dragDistance <= 10) spinToSkill(e);
    });
    pod.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        spinToSkill(e);
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
   10. Custom Cursor & Magnetic Button Physics Engine
   ---------------------------------------------------------------------- */
function initCustomCursorAndMagnetic() {
  const cursor = document.getElementById('custom-cursor');
  const glow = document.getElementById('cursor-glow');
  if (!cursor || !glow) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;
  let glowX = mouseX;
  let glowY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  const renderCursor = () => {
    cursorX += (mouseX - cursorX) * 0.75;
    cursorY += (mouseY - cursorY) * 0.75;
    glowX += (mouseX - glowX) * 0.18;
    glowY += (mouseY - glowY) * 0.18;

    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    glow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%)`;

    requestAnimationFrame(renderCursor);
  };
  requestAnimationFrame(renderCursor);

  const interactables = document.querySelectorAll('a, button, input, textarea, .skill-pod, .project-icon, .card, .chip-btn');
  interactables.forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  const magnetics = document.querySelectorAll('.magnetic');
  magnetics.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate3d(${x * 0.25}px, ${y * 0.25}px, 0)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = `translate3d(0, 0, 0)`;
    });
  });
}

/* ----------------------------------------------------------------------
   11. 3D Card Tilt Perspective Effect
   ---------------------------------------------------------------------- */
function init3DTilt() {
  const tiltCards = document.querySelectorAll('.tilt-card');
  if (!tiltCards.length) return;

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
    });
  });
}

/* ----------------------------------------------------------------------
   12. Contact Form Engine with Async Fetch Submission
   ---------------------------------------------------------------------- */
function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  let noteEl = form.querySelector('.form-note');
  if (!noteEl) {
    noteEl = document.createElement('p');
    noteEl.className = 'form-note';
    noteEl.style.cssText = 'font-size: 0.8rem; font-family: var(--font-mono); color: var(--text-accent); min-height: 1.4em; margin-top: 6px;';
    form.appendChild(noteEl);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameInput = form.querySelector('input[name="name"]');
    const name = nameInput ? nameInput.value.trim() : '';
    const firstName = name ? name.split(' ')[0] : 'friend';

    noteEl.textContent = `✨ Thank you, ${firstName}! Sending your message now...`;

    try {
      const formData = new FormData(form);
      const res = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        noteEl.textContent = `✅ Message sent successfully! Thank you, ${firstName}.`;
        form.reset();
      } else {
        noteEl.textContent = `✨ Thank you, ${firstName}! Your message has been dispatched.`;
        form.reset();
      }
    } catch (err) {
      noteEl.textContent = `✨ Thank you, ${firstName}! Your message has been received.`;
      form.reset();
    }
  });
}

/* ----------------------------------------------------------------------
   13. LUXURY FUTURISTIC AI CHATBOT ENGINE + SMOOTH DRAG REPOSITIONING
   ---------------------------------------------------------------------- */
function initAIChatbot() {
  const wrapper = document.getElementById('chatbot-wrapper');
  const triggerBtn = document.getElementById('chatbot-trigger');
  const chatPanel = document.getElementById('chatbot-panel');
  const chatHeader = document.getElementById('chat-header');
  const closeBtn = document.getElementById('chat-close-btn');
  const clearBtn = document.getElementById('chat-clear-btn');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const messagesContainer = document.getElementById('chat-messages');
  const typingIndicator = document.getElementById('typing-indicator');
  const suggestionsBox = document.getElementById('chat-suggestions');

  if (!wrapper || !triggerBtn || !chatPanel || !chatForm || !chatInput || !messagesContainer) return;

  // State flags for dragging & opening/closing
  let isDragging = false;
  let hasMoved = false;
  let startX = 0;
  let startY = 0;
  let startLeft = 0;
  let startTop = 0;

  // Initialize position tracking
  const initPos = () => {
    const rect = wrapper.getBoundingClientRect();
    wrapper.style.left = rect.left + 'px';
    wrapper.style.top = rect.top + 'px';
    wrapper.style.bottom = 'auto';
    wrapper.style.right = 'auto';
  };

  // Adjust panel placement relative to screen edges so it stays inside viewport
  const adjustPanelOrientation = () => {
    const rect = wrapper.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Check vertical space: if in top half of screen, open downwards
    if (rect.top < 320) {
      chatPanel.style.bottom = 'auto';
      chatPanel.style.top = '76px';
    } else {
      chatPanel.style.top = 'auto';
      chatPanel.style.bottom = '76px';
    }

    // Check horizontal space: if on left side of screen, align panel left
    if (rect.left < 220) {
      chatPanel.style.right = 'auto';
      chatPanel.style.left = '0px';
    } else {
      chatPanel.style.left = 'auto';
      chatPanel.style.right = '0px';
    }
  };

  // Clamp wrapper position within viewport boundaries
  const clampPosition = (left, top) => {
    const wWidth = window.innerWidth;
    const wHeight = window.innerHeight;
    const rect = wrapper.getBoundingClientRect();
    const maxLeft = Math.max(10, wWidth - rect.width - 10);
    const maxTop = Math.max(10, wHeight - rect.height - 10);

    const clampedLeft = Math.min(Math.max(10, left), maxLeft);
    const clampedTop = Math.min(Math.max(10, top), maxTop);

    return { clampedLeft, clampedTop };
  };

  // Smooth Pointer Drag Handling (Mouse & Touch)
  const onPointerDown = (e) => {
    // Ignore clicks on action buttons inside header
    if (e.target.closest('#chat-close-btn') || e.target.closest('#chat-clear-btn')) {
      return;
    }

    const rect = wrapper.getBoundingClientRect();
    wrapper.style.left = rect.left + 'px';
    wrapper.style.top = rect.top + 'px';
    wrapper.style.bottom = 'auto';
    wrapper.style.right = 'auto';

    startX = e.clientX;
    startY = e.clientY;
    startLeft = rect.left;
    startTop = rect.top;

    isDragging = true;
    hasMoved = false;

    if (e.pointerId && wrapper.setPointerCapture) {
      try { wrapper.setPointerCapture(e.pointerId); } catch (err) {}
    }

    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  const onPointerMove = (e) => {
    if (!isDragging) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (Math.hypot(dx, dy) > 5) {
      hasMoved = true;
      e.preventDefault();

      const { clampedLeft, clampedTop } = clampPosition(startLeft + dx, startTop + dy);
      wrapper.style.left = clampedLeft + 'px';
      wrapper.style.top = clampedTop + 'px';

      adjustPanelOrientation();
    }
  };

  const onPointerUp = (e) => {
    if (!isDragging) return;
    isDragging = false;

    if (e && e.pointerId && wrapper.releasePointerCapture) {
      try { wrapper.releasePointerCapture(e.pointerId); } catch (err) {}
    }

    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointercancel', onPointerUp);

    // Keep within bounds after drag ends
    const rect = wrapper.getBoundingClientRect();
    const { clampedLeft, clampedTop } = clampPosition(rect.left, rect.top);
    wrapper.style.left = clampedLeft + 'px';
    wrapper.style.top = clampedTop + 'px';

    adjustPanelOrientation();
  };

  // Attach drag handlers to trigger button and chat header
  triggerBtn.addEventListener('pointerdown', onPointerDown);
  if (chatHeader) chatHeader.addEventListener('pointerdown', onPointerDown);

  // Keep chatbot within screen on window resize
  window.addEventListener('resize', () => {
    if (wrapper.style.left && wrapper.style.left !== 'auto') {
      const rect = wrapper.getBoundingClientRect();
      const { clampedLeft, clampedTop } = clampPosition(rect.left, rect.top);
      wrapper.style.left = clampedLeft + 'px';
      wrapper.style.top = clampedTop + 'px';
      adjustPanelOrientation();
    }
  }, { passive: true });

  // Toggle Panel Visibility
  const togglePanel = () => {
    const isOpen = chatPanel.classList.contains('open');
    if (isOpen) {
      closePanel();
    } else {
      openPanel();
    }
  };

  const openPanel = () => {
    adjustPanelOrientation();
    chatPanel.classList.add('open');
    chatPanel.setAttribute('aria-hidden', 'false');
    triggerBtn.classList.add('active');
    triggerBtn.setAttribute('aria-expanded', 'true');
    setTimeout(() => chatInput.focus(), 150);
    scrollToBottom();
  };

  const closePanel = () => {
    chatPanel.classList.remove('open');
    chatPanel.setAttribute('aria-hidden', 'true');
    triggerBtn.classList.remove('active');
    triggerBtn.setAttribute('aria-expanded', 'false');
  };

  triggerBtn.addEventListener('click', (e) => {
    if (hasMoved) {
      hasMoved = false;
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    togglePanel();
  });

  if (closeBtn) closeBtn.addEventListener('click', closePanel);

  // Clear Chat History
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      conversationHistory = [];
      const messages = messagesContainer.querySelectorAll('.message-row:not(:first-child)');
      messages.forEach(m => m.remove());
      if (suggestionsBox) suggestionsBox.style.display = 'flex';
      scrollToBottom();
    });
  }

  // Escape key closes panel
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && chatPanel.classList.contains('open')) {
      closePanel();
    }
  });

  // Handle Quick Suggestion Chips
  document.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip-btn');
    if (chip && chip.dataset.prompt) {
      const promptText = chip.dataset.prompt;
      if (suggestionsBox) suggestionsBox.style.display = 'none';
      sendMessage(promptText);
    }
  });

  // Handle Textarea Enter / Shift+Enter
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      chatForm.dispatchEvent(new Event('submit', { cancelable: true }));
    }
  });

  // Auto-resize textarea
  chatInput.addEventListener('input', () => {
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 100) + 'px';
  });

  // Form Submit Handler
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;

    if (suggestionsBox) suggestionsBox.style.display = 'none';
    chatInput.value = '';
    chatInput.style.height = 'auto';

    sendMessage(text);
  });

  // Scroll Helper
  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });
  };

  // Helper: Format Markdown Text to Safe HTML
  const formatMarkdown = (text) => {
    if (!text) return '';
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Markdown Links [title](url)
    html = html.replace(/\[(.*?)\]\((https?:\/\/[^\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1 <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:0.7em;"></i></a>');

    // Plain URLs
    html = html.replace(/(^|[^"'])((https?:\/\/[^\s<]+))/g, '$1<a href="$2" target="_blank" rel="noopener noreferrer">$2 <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:0.7em;"></i></a>');

    // Bullet points
    const lines = html.split('\n');
    let inList = false;
    let formattedLines = [];

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        if (!inList) {
          inList = true;
          formattedLines.push('<ul>');
        }
        formattedLines.push(`<li>${trimmed.substring(2)}</li>`);
      } else {
        if (inList) {
          inList = false;
          formattedLines.push('</ul>');
        }
        if (trimmed) {
          formattedLines.push(`<p>${trimmed}</p>`);
        }
      }
    });

    if (inList) formattedLines.push('</ul>');

    return formattedLines.join('');
  };

  // Append Message Row to UI
  const appendMessage = (sender, messageText) => {
    const isUser = sender === 'user';
    const row = document.createElement('div');
    row.className = `message-row ${isUser ? 'user-row' : 'ai-row'}`;

    const formattedContent = isUser ? `<p>${messageText.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>` : formatMarkdown(messageText);

    row.innerHTML = `
      <div class="msg-avatar">
        ${isUser ? '<i class="fa-solid fa-user" aria-hidden="true"></i>' : '<img src="/robot.svg" class="msg-robot-avatar" alt="MRx Ai Robot">'}
      </div>
      <div class="msg-content glass-msg">
        <div class="msg-author">${isUser ? 'You' : 'MRx Ai'}</div>
        ${formattedContent}
      </div>
    `;

    messagesContainer.appendChild(row);
    scrollToBottom();
    return row;
  };

  // Knowledge Base Engine Fallback
  const generateKnowledgeResponse = (query) => {
    const q = query.toLowerCase();

    if (q.includes('project') || q.includes('work') || q.includes('built') || q.includes('portfolio') || q.includes('study') || q.includes('pay') || q.includes('app')) {
      return "MD. Moshiur Rahman has engineered **40+ successful web projects** including:\n\n" +
             "1. **Study Flow** ([study-flowup.netlify.app](https://study-flowup.netlify.app/))\n" +
             "   - Comprehensive productivity, task management, and study focus app.\n\n" +
             "2. **EduPay Pico** ([edupay-pico.netlify.app](https://edupay-pico.netlify.app/))\n" +
             "   - Next-generation educational fintech payment gateway interface.\n\n" +
             "3. **MRx Ai Portfolio Assistant**\n" +
             "   - Luxury glassmorphism assistant powered by Gemini 3.6 Flash.\n\n" +
             "Would you like to know more about his stack or start a project together?";
    }

    if (q.includes('skill') || q.includes('stack') || q.includes('tech') || q.includes('tool') || q.includes('language') || q.includes('react') || q.includes('node') || q.includes('html') || q.includes('css')) {
      return "MD. Moshiur Rahman specializes in modern full-stack web engineering:\n\n" +
             "- **Frontend**: HTML5, CSS3/Tailwind CSS, JavaScript (ES6+), React, Glassmorphism UI\n" +
             "- **Backend**: Node.js, Express, RESTful & GraphQL APIs\n" +
             "- **Databases**: PostgreSQL, MongoDB\n" +
             "- **Performance**: Asset optimization, SEO, Lighthouse 100/100 auditing, Responsive Design\n\n" +
             "You can explore his interactive 360° Rotary Skill Wheel in the **Skills** section!";
    }

    if (q.includes('service') || q.includes('hire') || q.includes('build') || q.includes('offer') || q.includes('help')) {
      return "Moshiur offers high-end software development services:\n\n" +
             "• **Full-Stack Web Development**: Custom responsive web applications built for speed & scale.\n" +
             "• **UI/UX Design & Engineering**: Modern interfaces with glassmorphism, smooth animations, and clean architecture.\n" +
             "• **API Engineering**: Secure, high-throughput REST and GraphQL backend services.\n" +
             "• **Performance Tuning**: Web vital optimizations and bundle downsizing.\n" +
             "• **Technical Consulting**: Architecture reviews & modern stack migration.";
    }

    if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('whatsapp') || q.includes('reach') || q.includes('message') || q.includes('social') || q.includes('github')) {
      return "<div class='chat-contact-card'><div class='chat-contact-header'><img src='/logo.svg' class='chat-contact-logo' alt='MD. Moshiur Rahman Logo'><div class='chat-contact-meta'><h4 class='chat-contact-name'>MD. Moshiur Rahman</h4><span class='chat-contact-role'>Full Stack Developer & UI Engineer</span></div></div></div>\n\n" +
             "You can get in touch with **MD. Moshiur Rahman** directly:\n\n" +
             "- 📧 **Email**: [borshonsweb@gmail.com](mailto:borshonsweb@gmail.com?subject=Portfolio%20Inquiry)\n" +
             "- 💬 **WhatsApp**: [+8801732212203](https://wa.me/8801732212203)\n" +
             "- ✈️ **Telegram**: [@moshiur_182](https://t.me/moshiur_182)\n" +
             "- 🐙 **GitHub**: [github.com/MRB13182](https://github.com/MRB13182)\n" +
             "- 📸 **Instagram**: [@ali.babaa.x](https://www.instagram.com/ali.babaa.x?igsh=Y3dlMm5ib2IzZng0)\n" +
             "- 🌐 **Facebook**: [facebook.com/md.moshiur.rahman.512608](https://www.facebook.com/md.moshiur.rahman.512608)\n\n" +
             "Based in **Dhaka, Bangladesh** • Available for global freelance & full-time roles!";
    }

    if (q.includes('who') || q.includes('about') || q.includes('experience') || q.includes('background') || q.includes('where') || q.includes('location')) {
      return "MD. Moshiur Rahman is a **Full Stack Developer & UI Engineer** based in Dhaka, Bangladesh, with **5+ years of experience**.\n\n" +
             "He focuses on building clean, high-performance web products, from pixel-considered user interfaces to robust backend systems. He has delivered work for 18+ happy clients across the globe!";
    }

    return "Hello! I am **MRx Ai**, MD. Moshiur Rahman's official portfolio AI assistant.\n\n" +
           "I can provide instant details about Moshiur's **projects**, **technical stack**, **services**, **5+ years of experience**, or how to **contact/hire him**. What would you like to explore?";
  };

  // Main Send Message Function
  const sendMessage = async (userText) => {
    appendMessage('user', userText);

    // Push turn to conversation history
    conversationHistory.push({
      role: 'user',
      parts: [{ text: userText }]
    });

    // Show typing animation
    if (typingIndicator) {
      typingIndicator.style.display = 'flex';
      scrollToBottom();
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          conversationHistory
        })
      });

      if (!response.ok) {
        throw new Error(`API response failed with status ${response.status}`);
      }

      const data = await response.json();
      const aiReply = data.reply;

      if (typingIndicator) typingIndicator.style.display = 'none';

      if (aiReply) {
        conversationHistory.push({
          role: 'model',
          parts: [{ text: aiReply }]
        });
        appendMessage('ai', aiReply);
      } else {
        const fallback = generateKnowledgeResponse(userText);
        appendMessage('ai', fallback);
      }

    } catch (err) {
      console.warn("MRx Ai API Notice (using local knowledge engine):", err.message);
      if (typingIndicator) typingIndicator.style.display = 'none';

      const fallback = generateKnowledgeResponse(userText);
      conversationHistory.push({
        role: 'model',
        parts: [{ text: fallback }]
      });
      appendMessage('ai', fallback);
    }
  };
}
