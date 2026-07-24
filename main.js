/* ============================================================
   PORTFOLIO — SHAMAL SATHSARA  |  main.js
   "Cyber Forge" 2026 Edition — All interactive logic
   1.  Page load body reveal
   2.  Scroll progress bar
   3.  Navbar — scroll state + mobile menu + active link
   4.  Typing effect — hero subtitle
   5.  Scroll reveal — IntersectionObserver
   6.  Custom magnetic cursor
   7.  Counter animation — stats count up
   8.  3D tilt effect — project cards
   9.  Slide animation pause when off-screen
   10. Back-to-top button
   11. Orbit scene — Mouse-Parallax Tilt
   12. Canvas particle constellation (with visibility API)
   13. Contact form handler
   ============================================================ */

'use strict';

/* ── Reduced-motion check (used by animation modules) ── */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ────────────────────────────────────────────────────────────
   1. PAGE LOAD — body is faded in via CSS animation.
      Mark body as loaded for any JS-driven entrance effects.
────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('loaded');
});


/* ────────────────────────────────────────────────────────────
   2. UNIFIED SCROLL HANDLER
   Single passive scroll listener — everything runs here.
────────────────────────────────────────────────────────────── */
const progressBar = document.getElementById('scroll-progress');
const navbar      = document.getElementById('navbar');
const backToTop   = document.getElementById('back-to-top');

function onScroll() {
  const scrolled  = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

  /* Scroll progress bar */
  if (progressBar) {
    progressBar.style.width = (scrolled / maxScroll * 100) + '%';
  }

  /* Navbar state */
  navbar?.classList.toggle('scrolled', scrolled > 50);

  /* Back-to-top visibility */
  backToTop?.classList.toggle('visible', scrolled > 600);
}

window.addEventListener('scroll', onScroll, { passive: true });


/* ────────────────────────────────────────────────────────────
   3. NAVBAR — Mobile menu + active link tracking
────────────────────────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');

/* ── Hamburger toggle ── */
hamburger?.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  mobileNav?.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen.toString());
  mobileNav?.setAttribute('aria-hidden', (!isOpen).toString());
});

/* ── Close mobile menu on link click ── */
mobileNav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('open');
    mobileNav.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
  });
});

/* ── Keyboard: close mobile menu on Escape ── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mobileNav?.classList.contains('open')) {
    hamburger?.classList.remove('open');
    mobileNav.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
    mobileNav?.setAttribute('aria-hidden', 'true');
    hamburger?.focus();
  }
});

/* ── Active nav link via IntersectionObserver ── */
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('nav-active'));
        const active = document.querySelector(
          `.nav-links a[href="#${entry.target.id}"]`
        );
        if (active && !active.classList.contains('nav-hire')) {
          active.classList.add('nav-active');
        }
      }
    });
  },
  { threshold: 0.45 }
);

sections.forEach(s => sectionObserver.observe(s));


/* ────────────────────────────────────────────────────────────
   4. TYPING EFFECT
   Cycles through 3 role strings, types + erases each one.
────────────────────────────────────────────────────────────── */
const typedEl = document.getElementById('typed-text');

if (typedEl) {
  const roles = [
    'Full-Stack Developer',
    'MERN Stack Engineer',
    'ML / AI Explorer',
  ];

  let roleIdx   = 0;
  let charIdx   = 0;
  let isErasing = false;

  function typeLoop() {
    if (prefersReducedMotion) {
      typedEl.textContent = roles[0];
      return;
    }

    const current = roles[roleIdx];

    if (isErasing) {
      charIdx--;
      typedEl.textContent = current.slice(0, charIdx);
      if (charIdx === 0) {
        isErasing = false;
        roleIdx   = (roleIdx + 1) % roles.length;
        setTimeout(typeLoop, 400);
        return;
      }
      setTimeout(typeLoop, 36);
    } else {
      charIdx++;
      typedEl.textContent = current.slice(0, charIdx);
      if (charIdx === current.length) {
        isErasing = true;
        setTimeout(typeLoop, 2400);
        return;
      }
      setTimeout(typeLoop, 56);
    }
  }

  setTimeout(typeLoop, 1100);
}


/* ────────────────────────────────────────────────────────────
   5. SCROLL REVEAL
   Watches .reveal elements and adds .visible when in view.
────────────────────────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -36px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ────────────────────────────────────────────────────────────
   6. CUSTOM MAGNETIC CURSOR
   Smooth-lagging outer ring + snappy inner dot.
   Falls back to default on touch devices.
────────────────────────────────────────────────────────────── */
(function () {
  if (prefersReducedMotion) return;
  if (window.matchMedia('(hover: none)').matches) return;

  const outer = document.getElementById('cursor-outer');
  const dot   = document.getElementById('cursor-dot');
  if (!outer || !dot) return;

  let mouseX = -200, mouseY = -200;
  let outerX = -200, outerY = -200;
  let hasMoved = false;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';

    /* Only hide system cursor after first move */
    if (!hasMoved) {
      hasMoved = true;
      document.body.style.cursor = 'none';
    }
  });

  function animateCursor() {
    outerX += (mouseX - outerX) * 0.11;
    outerY += (mouseY - outerY) * 0.11;
    outer.style.left = outerX + 'px';
    outer.style.top  = outerY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  const hoverTargets = [
    'a', 'button', 'input', 'textarea',
    '.chip', '.fact', '.c-card', '.soc-btn',
    '.proj-card', '.cr-card', '.gh-link-sm', '.nav-hire', '.sk-tag',
  ].join(', ');

  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => outer.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => outer.classList.remove('cursor-hover'));
  });

  document.addEventListener('mousedown', () => outer.classList.add('cursor-click'));
  document.addEventListener('mouseup',   () => outer.classList.remove('cursor-click'));
})();


/* ────────────────────────────────────────────────────────────
   7. COUNTER ANIMATION
   Stats numbers count up from 0 when scrolled into view.
────────────────────────────────────────────────────────────── */
(function () {
  const counters = document.querySelectorAll('.hs-num[data-count]');
  if (!counters.length) return;

  function animateCount(el, target, duration = 1500) {
    if (prefersReducedMotion) { el.textContent = target; return; }
    const start = performance.now();
    function step(now) {
      const t       = Math.min((now - start) / duration, 1);
      const eased   = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(eased * target);
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.count, 10);
          animateCount(entry.target, target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.7 }
  );

  counters.forEach(c => counterObserver.observe(c));
})();


/* ────────────────────────────────────────────────────────────
   8. 3D TILT EFFECT — Project cards
   Disabled on touch devices and reduced-motion preference.
────────────────────────────────────────────────────────────── */
(function () {
  if (prefersReducedMotion) return;
  if (window.matchMedia('(hover: none)').matches) return;

  document.querySelectorAll('[data-tilt]').forEach(card => {
    let raf;

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'box-shadow 0.3s ease';
    });

    card.addEventListener('mousemove', e => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect  = card.getBoundingClientRect();
        const cx    = rect.left + rect.width  / 2;
        const cy    = rect.top  + rect.height / 2;
        const normX = (e.clientX - cx) / (rect.width  / 2);
        const normY = (e.clientY - cy) / (rect.height / 2);

        const tiltX =  normY * 8;
        const tiltY = -normX * 8;

        card.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(10px)`;
        card.style.boxShadow = `
          ${-normX * 12}px ${-normY * 12}px 44px rgba(0,0,0,0.45),
          0 0 48px rgba(124,58,237,0.20)
        `;
      });
    });

    card.addEventListener('mouseleave', () => {
      cancelAnimationFrame(raf);
      card.style.transition = 'transform 0.55s ease, box-shadow 0.55s ease';
      card.style.transform  = '';
      card.style.boxShadow  = '';
      setTimeout(() => { card.style.transition = ''; }, 560);
    });
  });
})();


/* ────────────────────────────────────────────────────────────
   9. PROJECT CARD SLIDE ANIMATION — pause when off-screen
   Saves GPU cycles for off-viewport cards.
────────────────────────────────────────────────────────────── */
(function () {
  if (prefersReducedMotion) return;

  const cards = document.querySelectorAll('.proj-card');
  if (!cards.length) return;

  const slideObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        entry.target.classList.toggle('paused', !entry.isIntersecting);
      });
    },
    { threshold: 0.05 }
  );

  cards.forEach(card => slideObserver.observe(card));
})();


/* ────────────────────────────────────────────────────────────
   10. BACK-TO-TOP BUTTON
────────────────────────────────────────────────────────────── */
backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
});


/* ────────────────────────────────────────────────────────────
   11. ORBIT SCENE — Mouse-Parallax Tilt
────────────────────────────────────────────────────────────── */
(function () {
  if (prefersReducedMotion) return;
  if (window.matchMedia('(hover: none)').matches) return;

  const scene = document.getElementById('orbit-scene');
  if (!scene) return;

  const MAX_TILT = 12;

  document.addEventListener('mousemove', e => {
    const rect = scene.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const nx = (e.clientX - cx) / (window.innerWidth  / 2);
    const ny = (e.clientY - cy) / (window.innerHeight / 2);

    scene.style.transform = `perspective(900px) rotateX(${-ny * MAX_TILT}deg) rotateY(${nx * MAX_TILT}deg)`;
  });

  document.addEventListener('mouseleave', () => {
    scene.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
  });
})();


/* ────────────────────────────────────────────────────────────
   12. CANVAS PARTICLE CONSTELLATION
   Pauses when tab is hidden (Page Visibility API).
────────────────────────────────────────────────────────────── */
(function () {
  if (prefersReducedMotion) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'ambient-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  Object.assign(canvas.style, {
    position: 'fixed', top: '0', left: '0',
    width: '100%', height: '100%',
    zIndex: '0', pointerEvents: 'none',
  });

  const bgMesh = document.querySelector('.bg-mesh');
  if (bgMesh) bgMesh.appendChild(canvas);
  else document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  let animFrameId = null;
  let paused = false;

  function init() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    particles = [];
    const count = Math.min(Math.floor((W * H) / 16000), 80); /* cap at 80 */
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.4 + 0.4,
        dx: (Math.random() - 0.5) * 0.20,
        dy: (Math.random() - 0.5) * 0.20,
        alpha: Math.random() * 0.38 + 0.10,
        hue: Math.random() > 0.6 ? 265 : 38,
      });
    }
  }

  function draw() {
    if (paused) { animFrameId = null; return; }

    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      p.x = (p.x + p.dx + W) % W;
      p.y = (p.y + p.dy + H) % H;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 82%, 72%, ${p.alpha})`;
      ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `hsla(265, 82%, 72%, ${(1 - dist / 110) * 0.10})`;
          ctx.lineWidth   = 0.5;
          ctx.stroke();
        }
      }
    }

    animFrameId = requestAnimationFrame(draw);
  }

  /* Pause when tab is hidden */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      paused = true;
    } else {
      paused = false;
      if (!animFrameId) draw();
    }
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(init, 200);
  }, { passive: true });

  init();
  draw();
})();


/* ────────────────────────────────────────────────────────────
   13. CONTACT FORM HANDLER
   Client-side validation + mailto fallback.
────────────────────────────────────────────────────────────── */
(function () {
  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form || !status) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name    = form.querySelector('#cf-name')?.value.trim();
    const email   = form.querySelector('#cf-email')?.value.trim();
    const subject = form.querySelector('#cf-subject')?.value.trim();
    const message = form.querySelector('#cf-msg')?.value.trim();

    /* Basic validation */
    if (!name || !email || !message) {
      status.textContent = '⚠ Please fill in your name, email, and message.';
      status.className   = 'form-status error';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      status.textContent = '⚠ Please enter a valid email address.';
      status.className   = 'form-status error';
      return;
    }

    /* Build mailto link as fallback (works without a backend) */
    const mailSubject = subject
      ? encodeURIComponent(subject)
      : encodeURIComponent(`Portfolio enquiry from ${name}`);
    const mailBody = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    );
    const mailTo = `mailto:shamalsathsara4@gmail.com?subject=${mailSubject}&body=${mailBody}`;

    /* Open mail client */
    window.location.href = mailTo;

    /* Show success feedback */
    status.textContent = '✅ Opening your email client... If nothing opens, email shamalsathsara4@gmail.com directly.';
    status.className   = 'form-status success';

    /* Reset form */
    setTimeout(() => {
      form.reset();
      status.textContent = '';
      status.className   = 'form-status';
    }, 6000);
  });
})();
