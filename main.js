/* ============================================================
   PORTFOLIO — SHAMAL SATHSARA
   main.js
   All interactive behavior: navbar, typing effect,
   scroll reveals, skill bar animations, physics hero.
   ============================================================ */

/* ────────────────────────────────────────────
   1. NAVBAR — scroll state + mobile toggle
──────────────────────────────────────────── */

// Grab DOM references for the navbar and hamburger
const navbar     = document.getElementById('navbar');
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

/**
 * Toggle the "scrolled" class on the navbar when user
 * scrolls past 50px — this darkens the background.
 */
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/**
 * Open / close the mobile slide-down menu when the
 * hamburger button is clicked.
 */
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

/**
 * Close the mobile menu when any link inside it is clicked,
 * so the menu collapses after navigation.
 */
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});


/* ────────────────────────────────────────────
   2. TYPING EFFECT — hero subtitle
   Cycles through an array of role strings,
   typing them out one character at a time.
──────────────────────────────────────────── */

// Element that shows the currently typed text
const typedEl = document.getElementById('typed-text');

// Roles to cycle through (add more here freely)
const roles = [
  'Full-Stack Developer',
  'MERN Stack Engineer',
  'WhatsApp Bot Builder',
  'Content Creator',
  'Node.js Enthusiast',
];

let roleIndex  = 0;   // Which role we're currently on
let charIndex  = 0;   // How many characters have been typed
let isDeleting = false;

/**
 * Recursive typing loop using setTimeout.
 * Types characters, pauses, then deletes them before
 * moving to the next role.
 */
function typeLoop() {
  const currentRole = roles[roleIndex];

  if (isDeleting) {
    // Remove one character
    charIndex--;
    typedEl.textContent = currentRole.slice(0, charIndex);

    // Once fully deleted, move to next role
    if (charIndex === 0) {
      isDeleting  = false;
      roleIndex   = (roleIndex + 1) % roles.length;
      setTimeout(typeLoop, 400);  // Short pause before typing next
      return;
    }
    setTimeout(typeLoop, 40);     // Deleting speed — fast

  } else {
    // Add one character
    charIndex++;
    typedEl.textContent = currentRole.slice(0, charIndex);

    // Once fully typed, pause then start deleting
    if (charIndex === currentRole.length) {
      isDeleting = true;
      setTimeout(typeLoop, 2000); // Hold the complete word for 2s
      return;
    }
    setTimeout(typeLoop, 65);    // Typing speed — natural feel
  }
}

// Kick off the typing loop after the hero fades in
setTimeout(typeLoop, 1000);


/* ────────────────────────────────────────────
   3. SCROLL REVEAL — IntersectionObserver
   Watches for elements with class "reveal"
   and adds "visible" once they enter the viewport.
──────────────────────────────────────────── */

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Don't keep observing — animation only plays once
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,    // Trigger when 12% of element is visible
    rootMargin: '0px 0px -40px 0px'  // Slightly before bottom edge
  }
);

// Observe all elements marked for scroll reveal
document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});


/* ────────────────────────────────────────────
   4. SKILL BARS — animate widths on scroll
   Uses a separate observer to trigger the CSS
   width transition once skill bars are visible.
──────────────────────────────────────────── */

const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Set the CSS custom property so the transition kicks in
        const fill = entry.target;
        fill.style.width = fill.dataset.pct + '%';
        skillObserver.unobserve(fill);
      }
    });
  },
  { threshold: 0.5 }
);

// Each bar fill element carries its target percentage in data-pct
document.querySelectorAll('.skill-bar-fill').forEach(bar => {
  skillObserver.observe(bar);
});


/* ────────────────────────────────────────────
   5. PHYSICS HERO — Matter.js gravity simulation
   Cards and skill pills "fall" from above and
   settle on the bottom. The user can grab and
   throw them with the mouse.
──────────────────────────────────────────── */

// ── 5a. Matter.js module aliases ──────────────
const {
  Engine, Render, Runner,
  Bodies, Composite, Mouse,
  MouseConstraint, Events
} = Matter;

// ── 5b. Engine setup ──────────────────────────
const engine = Engine.create();
const world  = engine.world;

// Increase gravity slightly for a faster, more dramatic drop
engine.gravity.y = 1.2;

// ── 5c. Transparent canvas for mouse events ───
// The canvas is invisible but it captures mouse input
// so physics objects respond to dragging.
const heroSection  = document.getElementById('hero');
const canvasWidth  = heroSection.offsetWidth;
const canvasHeight = heroSection.offsetHeight;

const render = Render.create({
  element: heroSection,
  engine: engine,
  options: {
    width:      canvasWidth,
    height:     canvasHeight,
    wireframes: false,
    background: 'transparent',  // Critical — HTML content shows through
  }
});

// Make canvas invisible — we only want the HTML card overlays to be seen
render.canvas.id = 'hero-canvas';
render.canvas.style.opacity = '0';

// ── 5d. Boundary walls (floor + side walls) ───
let floor, leftWall, rightWall;
const wallOpts = { isStatic: true, render: { visible: false } };

/**
 * Creates/recreates static boundary bodies around the hero viewport.
 * Called on load and on window resize.
 */
function buildBoundaries() {
  const w = heroSection.offsetWidth;
  const h = heroSection.offsetHeight;
  const t = 60; // Wall thickness

  // Remove previous boundaries before adding new ones
  if (floor) Composite.remove(world, [floor, leftWall, rightWall]);

  floor     = Bodies.rectangle(w / 2, h + t / 2, w * 2, t, wallOpts);
  leftWall  = Bodies.rectangle(-t / 2, h / 2, t, h * 2, wallOpts);
  rightWall = Bodies.rectangle(w + t / 2, h / 2, t, h * 2, wallOpts);

  Composite.add(world, [floor, leftWall, rightWall]);
}
buildBoundaries();

// ── 5e. Map DOM elements to physics bodies ────
// We grab each .phys-el element, get its size,
// create a matching physics rectangle, and track both.
const physContainer = document.getElementById('physics-world');
const physElements  = document.querySelectorAll('.phys-el');
const domBodies     = [];

/**
 * Initialise physics bodies after a short delay
 * (so the browser has laid out and measured all elements).
 */
setTimeout(() => {

  physElements.forEach((el, index) => {
    const rect   = el.getBoundingClientRect();
    const heroRect = heroSection.getBoundingClientRect();

    const w = rect.width;
    const h = rect.height;

    // Start positions: scattered horizontally, stacked above the hero
    const startX = (heroSection.offsetWidth * 0.25) + (Math.random() * heroSection.offsetWidth * 0.5);
    const startY = -120 - (index * 90);    // Each element spawns higher than the last

    // Physics body mirrors the visual card
    const body = Bodies.rectangle(startX, startY, w, h, {
      restitution: 0.55,       // Slight bounce on landing
      friction:    0.15,
      frictionAir: 0.015,      // Gentle air resistance
      chamfer: { radius: 8 },  // Match the border-radius of cards
      render: { visible: false }
    });

    // Store DOM + body pair for the sync loop
    domBodies.push({ dom: el, body, w, h });
    Composite.add(world, body);
  });

  // ── 5f. Mouse interaction ──────────────────
  // Attach a mouse constraint so users can grab and throw cards
  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse,
    constraint: {
      stiffness: 0.2,
      render: { visible: false }
    }
  });
  Composite.add(world, mouseConstraint);
  render.mouse = mouse;

  // ── 5g. Start the engine ───────────────────
  Runner.run(Runner.create(), engine);
  Render.run(render);

  // ── 5h. DOM sync loop ──────────────────────
  /**
   * After every physics tick, sync the DOM card position
   * to match the corresponding physics body.
   *
   * Matter.js positions bodies by their center of mass,
   * but CSS translate uses the top-left corner — we offset
   * by half the element's width and height to correct this.
   */
  Events.on(engine, 'afterUpdate', () => {
    domBodies.forEach(({ dom, body, w, h }) => {
      const x     = body.position.x - w / 2;
      const y     = body.position.y - h / 2;
      const angle = body.angle;

      dom.style.transform = `translate(${x}px, ${y}px) rotate(${angle}rad)`;
    });
  });

}, 600); // 600ms delay — gives the page time to fully render

// ── 5i. Resize handler ────────────────────────
/**
 * When the window is resized, update the canvas dimensions
 * and rebuild boundary walls to match the new hero size.
 */
window.addEventListener('resize', () => {
  const w = heroSection.offsetWidth;
  const h = heroSection.offsetHeight;
  render.canvas.width  = w;
  render.canvas.height = h;
  buildBoundaries();
});


/* ────────────────────────────────────────────
   6. SMOOTH ACTIVE NAV LINK HIGHLIGHTING
   Highlights the nav link corresponding to
   whichever section is currently in view.
──────────────────────────────────────────── */

const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Remove active class from all links
        navAnchors.forEach(a => a.style.color = '');

        // Highlight the matching nav link
        const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.style.color = 'var(--cyan)';
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(section => activeObserver.observe(section));
