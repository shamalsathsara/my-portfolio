/* ============================================================
   PORTFOLIO — SHAMAL SATHSARA  |  main.js
   All interactive logic:
     1. Navbar — scroll state + mobile menu
     2. Typing effect — hero subtitle
     3. Scroll reveal — IntersectionObserver
     4. Skill bar animation — triggered on scroll
     5. Matter.js physics hero — falling cards
     6. Active nav link highlight
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
   5. MATTER.JS PHYSICS HERO
   Cards and skill pills spawn above the viewport and fall
   into the hero section. The user can grab + throw them.
────────────────────────────────────────────────────────────── */

// ── Destructure the modules we need ──────────────────────
const {
  Engine, Render, Runner,
  Bodies, Composite,
  Mouse, MouseConstraint,
  Events
} = Matter;

// ── Create engine ─────────────────────────────────────────
const engine = Engine.create();
engine.gravity.y = 1.3;   // Slightly heavier gravity for a punchy feel

// ── Set up transparent canvas ────────────────────────────
// The canvas captures mouse events for physics drag, but is
// visually invisible so only the HTML elements are seen.
const heroEl = document.getElementById('hero');

const render = Render.create({
  element: heroEl,
  engine,
  options: {
    width:      heroEl.offsetWidth,
    height:     heroEl.offsetHeight,
    wireframes: false,
    background: 'transparent'   // Let the HTML show through
  }
});

// Mark canvas with id (for CSS targeting) and make it invisible
render.canvas.id = 'hero-canvas';
render.canvas.style.opacity = '0';

// ── Boundary walls ────────────────────────────────────────
// Static bodies that keep physics elements inside the hero.
let floor, leftWall, rightWall;
const wallOpts = { isStatic: true, render: { visible: false } };

/**
 * Builds/rebuilds boundary rectangles around the hero section.
 * Called on init and every time the window is resized.
 */
function buildWalls() {
  const w = heroEl.offsetWidth;
  const h = heroEl.offsetHeight;
  const t = 60;  // Wall thickness

  // Remove old walls first (if rebuilding after a resize)
  if (floor) Composite.remove(engine.world, [floor, leftWall, rightWall]);

  floor     = Bodies.rectangle(w / 2, h + t / 2, w * 2, t, wallOpts);
  leftWall  = Bodies.rectangle(-t / 2, h / 2, t, h * 2, wallOpts);
  rightWall = Bodies.rectangle(w + t / 2, h / 2, t, h * 2, wallOpts);

  Composite.add(engine.world, [floor, leftWall, rightWall]);
}
buildWalls();

// ── Create physics bodies for each DOM card ───────────────
const physEls   = document.querySelectorAll('.phys-el');
const domBodies = [];   // Array of { dom, body, w, h } pairs

setTimeout(() => {
  // Wait 650ms so the browser has measured all element sizes
  physEls.forEach((el, i) => {
    const rect = el.getBoundingClientRect();
    const w    = rect.width;
    const h    = rect.height;

    // Spread start positions horizontally across the hero width
    const startX = (heroEl.offsetWidth * 0.2) + (Math.random() * heroEl.offsetWidth * 0.6);
    const startY = -80 - (i * 85);  // Each card spawns higher than the previous

    // Create a physics rectangle matching the DOM element's size
    const body = Bodies.rectangle(startX, startY, w, h, {
      restitution: 0.6,     // How bouncy the card is
      friction:    0.12,
      frictionAir: 0.012,   // Gentle air drag
      chamfer: { radius: 8 }, // Rounded corners to match CSS border-radius
      render: { visible: false }
    });

    domBodies.push({ dom: el, body, w, h });
    Composite.add(engine.world, body);
  });

  // ── Mouse drag constraint ──────────────────────────────
  // Lets the user click and throw the physics cards around.
  const mouse = Mouse.create(render.canvas);
  const mc    = MouseConstraint.create(engine, {
    mouse,
    constraint: { stiffness: 0.2, render: { visible: false } }
  });
  Composite.add(engine.world, mc);
  render.mouse = mouse;

  // ── Start engine and renderer ──────────────────────────
  Runner.run(Runner.create(), engine);
  Render.run(render);

  // ── DOM sync loop ──────────────────────────────────────
  /**
   * Every physics tick: translate each DOM element to match
   * its physics body's position and rotation.
   *
   * Matter.js positions by center-of-mass; CSS by top-left corner.
   * Subtract half width/height to align them correctly.
   */
  Events.on(engine, 'afterUpdate', () => {
    domBodies.forEach(({ dom, body, w, h }) => {
      const x = body.position.x - w / 2;
      const y = body.position.y - h / 2;
      dom.style.transform = `translate(${x}px, ${y}px) rotate(${body.angle}rad)`;
    });
  });

}, 650);  // 650ms gives the page time to fully paint before we measure elements

// ── Window resize handler ─────────────────────────────────
// Rebuilds boundary walls when the viewport changes size.
window.addEventListener('resize', () => {
  const w = heroEl.offsetWidth;
  const h = heroEl.offsetHeight;
  render.canvas.width  = w;
  render.canvas.height = h;
  buildWalls();
});


/* ────────────────────────────────────────────────────────────
   6. ACTIVE NAV LINK HIGHLIGHT
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
