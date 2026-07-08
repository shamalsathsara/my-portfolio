/* ============================================================
   PORTFOLIO — SHAMAL SATHSARA  |  main.js
   "Cyber Forge" — All interactive logic
   1.  Scroll progress bar
   2.  Navbar — scroll state + mobile menu
   3.  Typing effect — hero subtitle
   4.  Scroll reveal — IntersectionObserver
   5.  Skill bar animation
   6.  Active nav link highlight
   7.  Canvas particle constellation
   8.  Custom magnetic cursor
   9.  Counter animation — stats count up
   10. 3D tilt effect — project cards
   11. Back-to-top button
   ============================================================ */

/* ────────────────────────────────────────────────────────────
   1. SCROLL PROGRESS BAR
────────────────────────────────────────────────────────────── */
const progressBar = document.getElementById('scroll-progress');

window.addEventListener('scroll', () => {
  const scrolled  = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  if (progressBar) progressBar.style.width = (scrolled / maxScroll * 100) + '%';
}, { passive: true });


/* ────────────────────────────────────────────────────────────
   2. NAVBAR — scroll state + mobile menu
────────────────────────────────────────────────────────────── */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');

// Darken navbar on scroll
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// Toggle hamburger
hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen.toString());
  mobileNav.setAttribute('aria-hidden', (!isOpen).toString());
});

// Close mobile menu on link click
mobileNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
  });
});


/* ────────────────────────────────────────────────────────────
   3. TYPING EFFECT
   Cycles through role strings, types + erases each one.
────────────────────────────────────────────────────────────── */
const typedEl = document.getElementById('typed-text');

const roles = [
  'Full-Stack Developer',
  'MERN Stack Engineer',
  'WhatsApp Bot Builder',
  'Node.js Enthusiast',
  'Content Creator',
  'ML / AI Explorer',
];

let roleIdx   = 0;
let charIdx   = 0;
let isErasing = false;

function typeLoop() {
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


/* ────────────────────────────────────────────────────────────
   4. SCROLL REVEAL
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
   5. SKILL BAR ANIMATION
   Each .sk-fill has data-pct; width is set when scrolled in.
────────────────────────────────────────────────────────────── */
const barObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        bar.style.width = bar.dataset.pct + '%';
        barObserver.unobserve(bar);
      }
    });
  },
  { threshold: 0.4 }
);

document.querySelectorAll('.sk-fill').forEach(bar => barObserver.observe(bar));


/* ────────────────────────────────────────────────────────────
   6. ACTIVE NAV LINK HIGHLIGHT
   Highlights the nav link for whichever section is in view.
────────────────────────────────────────────────────────────── */
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.style.removeProperty('color'));
        const active = document.querySelector(
          `.nav-links a[href="#${entry.target.id}"]`
        );
        if (active && !active.classList.contains('nav-hire')) {
          active.style.color = 'var(--violet-light)';
        }
      }
    });
  },
  { threshold: 0.45 }
);

sections.forEach(s => sectionObserver.observe(s));


/* ────────────────────────────────────────────────────────────
   7. CANVAS PARTICLE CONSTELLATION
   Calm ambient violet/amber dots with connection lines.
────────────────────────────────────────────────────────────── */
(function () {
  const canvas = document.createElement('canvas');
  canvas.id = 'ambient-canvas';
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

  function init() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    particles = [];
    const count = Math.floor((W * H) / 14000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.5 + 0.4,
        dx: (Math.random() - 0.5) * 0.22,
        dy: (Math.random() - 0.5) * 0.22,
        alpha: Math.random() * 0.42 + 0.12,
        // Alternate between violet and amber hues
        hue: Math.random() > 0.6 ? 265 : 38,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw particles
    particles.forEach(p => {
      p.x = (p.x + p.dx + W) % W;
      p.y = (p.y + p.dy + H) % H;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 82%, 72%, ${p.alpha})`;
      ctx.fill();
    });

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 115) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `hsla(265, 82%, 72%, ${(1 - dist / 115) * 0.11})`;
          ctx.lineWidth   = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    clearTimeout(window._resizeTimer);
    window._resizeTimer = setTimeout(init, 200);
  }, { passive: true });

  init();
  draw();
})();


/* ────────────────────────────────────────────────────────────
   8. CUSTOM MAGNETIC CURSOR
   Smooth-lagging outer ring + snappy inner dot.
   Falls back to default on touch devices.
────────────────────────────────────────────────────────────── */
(function () {
  // Only on true pointer (non-touch) devices
  if (window.matchMedia('(hover: none)').matches) return;

  const outer = document.getElementById('cursor-outer');
  const dot   = document.getElementById('cursor-dot');
  if (!outer || !dot) return;

  let mouseX = -200, mouseY = -200;
  let outerX = -200, outerY = -200;

  // Snappy dot — follows cursor exactly
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Smooth outer ring via lerp
  function animateCursor() {
    outerX += (mouseX - outerX) * 0.11;
    outerY += (mouseY - outerY) * 0.11;
    outer.style.left = outerX + 'px';
    outer.style.top  = outerY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover state — expand ring on interactive elements
  const hoverTargets = [
    'a', 'button', 'input', 'textarea',
    '.chip', '.fact', '.c-card', '.soc-btn',
    '.proj-card', '.cr-card', '.gh-link', '.nav-hire',
  ].join(', ');

  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => outer.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => outer.classList.remove('cursor-hover'));
  });

  // Click state — shrink ring on click
  document.addEventListener('mousedown', () => outer.classList.add('cursor-click'));
  document.addEventListener('mouseup',   () => outer.classList.remove('cursor-click'));
})();


/* ────────────────────────────────────────────────────────────
   9. COUNTER ANIMATION
   Stats numbers count up from 0 when scrolled into view.
────────────────────────────────────────────────────────────── */
(function () {
  const counters = document.querySelectorAll('.hs-num[data-count]');
  if (!counters.length) return;

  /**
   * Animates an element's text from 0 to target over duration ms.
   * Uses an ease-out cubic easing function.
   */
  function animateCount(el, target, duration = 1500) {
    const start = performance.now();
    function step(now) {
      const t       = Math.min((now - start) / duration, 1);
      const eased   = 1 - Math.pow(1 - t, 3); // ease-out cubic
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
   10. 3D TILT EFFECT
   Project cards rotate in 3D perspective on mousemove.
   Disabled on touch devices.
────────────────────────────────────────────────────────────── */
(function () {
  if (window.matchMedia('(hover: none)').matches) return;

  document.querySelectorAll('[data-tilt]').forEach(card => {
    let raf;

    card.addEventListener('mouseenter', () => {
      // Remove CSS transition while mouse is moving for smoothness
      card.style.transition = 'box-shadow 0.3s ease';
    });

    card.addEventListener('mousemove', e => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect  = card.getBoundingClientRect();
        const cx    = rect.left + rect.width  / 2;
        const cy    = rect.top  + rect.height / 2;
        const normX = (e.clientX - cx) / (rect.width  / 2); // -1 → 1
        const normY = (e.clientY - cy) / (rect.height / 2); // -1 → 1

        const tiltX =  normY * 9;   // degrees around X axis
        const tiltY = -normX * 9;   // degrees around Y axis

        card.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(10px)`;
        card.style.boxShadow = `
          ${-normX * 14}px ${-normY * 14}px 48px rgba(0,0,0,0.45),
          0 0 48px rgba(124,58,237,0.22)
        `;
      });
    });

    card.addEventListener('mouseleave', () => {
      cancelAnimationFrame(raf);
      card.style.transition = 'transform 0.55s ease, box-shadow 0.55s ease';
      card.style.transform  = '';
      card.style.boxShadow  = '';
      // Re-enable CSS transitions after reset
      setTimeout(() => { card.style.transition = ''; }, 560);
    });
  });
})();


/* ────────────────────────────────────────────────────────────
   11. BACK-TO-TOP BUTTON
   Shows after scrolling 600px, scrolls to top on click.
────────────────────────────────────────────────────────────── */
(function () {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ────────────────────────────────────────────────────────────
   12. ORBIT SCENE — Mouse-Parallax Tilt
   The tech orbit tilts gently toward the cursor for depth.
────────────────────────────────────────────────────────────── */
(function () {
  if (window.matchMedia('(hover: none)').matches) return;

  const scene = document.getElementById('orbit-scene');
  if (!scene) return;

  const MAX_TILT = 14; // degrees

  document.addEventListener('mousemove', e => {
    const rect   = scene.getBoundingClientRect();
    // Scene centre in viewport space
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    // Normalise: -1 → +1 relative to screen centre
    const nx = (e.clientX - cx) / (window.innerWidth  / 2);
    const ny = (e.clientY - cy) / (window.innerHeight / 2);

    const tiltX = -ny * MAX_TILT;
    const tiltY =  nx * MAX_TILT;

    scene.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  });

  // Reset on mouse leave
  document.addEventListener('mouseleave', () => {
    scene.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
  });
})();
