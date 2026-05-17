/* ============================================================
   PORTFOLIO — SHAMAL SATHSARA  |  main.js
   All interactive logic:
     1. Navbar — scroll state + mobile menu
     2. Typing effect — hero subtitle
     3. Scroll reveal — IntersectionObserver
     4. Skill bar animation — triggered on scroll
     5. Active nav link highlight
   ============================================================ */

/* ────────────────────────────────────────────────────────────
   1. NAVBAR
   Adds .scrolled class when page scrolls past 50px,
   darkening the background. Hamburger toggles mobile menu.
────────────────────────────────────────────────────────────── */

const navbar     = document.getElementById('navbar');
const hamburger  = document.getElementById('hamburger');
const mobileNav  = document.getElementById('mobile-nav');

// Darken navbar background once user scrolls down
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Toggle hamburger open/close state
hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen.toString());
  mobileNav.setAttribute('aria-hidden', (!isOpen).toString());
});

// Close mobile menu when any link inside it is clicked
mobileNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
  });
});


/* ────────────────────────────────────────────────────────────
   2. TYPING EFFECT
   Cycles through an array of role strings,
   types each character then deletes before moving on.
────────────────────────────────────────────────────────────── */

const typedEl = document.getElementById('typed-text');

// Role strings to cycle through — edit freely
const roles = [
  'Full-Stack Developer',
  'MERN Stack Engineer',
  'WhatsApp Bot Builder',
  'Node.js Enthusiast',
  'Content Creator',
];

let roleIdx    = 0;       // Current role index
let charIdx    = 0;       // Characters typed so far
let isErasing  = false;   // Are we currently deleting?

/**
 * Core typing loop.
 * Types one character, pauses at the end of each word,
 * then erases before cycling to the next role.
 */
function typeLoop() {
  const current = roles[roleIdx];

  if (isErasing) {
    // Remove one character
    charIdx--;
    typedEl.textContent = current.slice(0, charIdx);

    if (charIdx === 0) {
      // Move to next role once fully erased
      isErasing = false;
      roleIdx   = (roleIdx + 1) % roles.length;
      setTimeout(typeLoop, 380);
      return;
    }
    setTimeout(typeLoop, 38);   // Erase speed (fast)

  } else {
    // Add one character
    charIdx++;
    typedEl.textContent = current.slice(0, charIdx);

    if (charIdx === current.length) {
      // Hold the completed word then start erasing
      isErasing = true;
      setTimeout(typeLoop, 2200);
      return;
    }
    setTimeout(typeLoop, 60);   // Type speed (natural)
  }
}

// Start typing after a short delay (lets hero fade in first)
setTimeout(typeLoop, 900);


/* ────────────────────────────────────────────────────────────
   3. SCROLL REVEAL
   Watches all .reveal elements and adds the .visible class
   once they enter the viewport, triggering the CSS transition.
────────────────────────────────────────────────────────────── */

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // Run only once
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: '0px 0px -36px 0px'
  }
);

// Observe every element marked for reveal
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ────────────────────────────────────────────────────────────
   4. SKILL BAR ANIMATION
   Each .sk-fill has a data-pct attribute (e.g. data-pct="85").
   Once the bar scrolls into view, its width is set to that %,
   triggering the CSS width transition.
────────────────────────────────────────────────────────────── */

const barObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        bar.style.width = bar.dataset.pct + '%';  // Animate to target width
        barObserver.unobserve(bar);
      }
    });
  },
  { threshold: 0.4 }
);

document.querySelectorAll('.sk-fill').forEach(bar => barObserver.observe(bar));




/* ────────────────────────────────────────────────────────────
   5. ACTIVE NAV LINK HIGHLIGHT
   Uses IntersectionObserver to detect which section is
   in view and highlights the corresponding nav link.
────────────────────────────────────────────────────────────── */


const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Clear all active highlights
        navAnchors.forEach(a => {
          a.style.color = '';
          a.style.removeProperty('color');
        });
        // Highlight current section's nav link
        const active = document.querySelector(
          `.nav-links a[href="#${entry.target.id}"]`
        );
        if (active && !active.classList.contains('nav-hire')) {
          active.style.color = 'var(--gold)';
        }
      }
    });
  },
  { threshold: 0.45 }
);

sections.forEach(s => sectionObserver.observe(s));
