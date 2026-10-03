/* ============================================================
   Noah Hammoud — terminal theme interactions
   Kept intentionally minimal: active nav, a typewriter name,
   and a light scroll-reveal.
   ============================================================ */

const navLinks = document.querySelectorAll(".nav-link[data-section]");
const sections = document.querySelectorAll(".section");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Type the name out once, like a terminal echoing input. */
const typeName = () => {
  const target = document.querySelector(".typed");
  if (!target) return;

  const text = target.dataset.text || "";
  const cursor = document.querySelector(".typed-cursor");

  if (prefersReducedMotion) {
    target.textContent = text;
    if (cursor) cursor.remove();
    return;
  }

  let i = 0;
  const step = () => {
    target.textContent = text.slice(0, i);
    i += 1;
    if (i <= text.length) {
      setTimeout(step, 70);
    } else if (cursor) {
      cursor.classList.add("done");
    }
  };

  setTimeout(step, 350);
};

/* Highlight the nav link for the section currently in view. */
const updateActiveNav = () => {
  const marker = window.scrollY + window.innerHeight * 0.5;
  let current = null;

  sections.forEach((section) => {
    if (marker >= section.offsetTop && marker < section.offsetTop + section.offsetHeight) {
      current = section;
    }
  });

  /* Short trailing sections never reach the marker, so pin the last one
     once the page is scrolled to the bottom. */
  const atBottom =
    window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;

  if (atBottom && sections.length) {
    current = sections[sections.length - 1];
  }

  navLinks.forEach((link) => {
    link.classList.toggle("active", current !== null && link.dataset.section === current.id);
  });
};

/* Reveal sections as they scroll into view. */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

sections.forEach((section) => revealObserver.observe(section));

/* Mobile nav toggle */
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");

const closeNav = () => {
  if (!nav || !navToggle) return;
  nav.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
};

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  /* Close after picking a destination */
  nav.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  /* Close on outside click */
  document.addEventListener("click", (event) => {
    if (!nav.classList.contains("open")) return;
    if (nav.contains(event.target) || navToggle.contains(event.target)) return;
    closeNav();
  });

  /* Close on Escape */
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNav();
  });

  /* Reset when resizing back to desktop */
  window.addEventListener("resize", () => {
    if (window.innerWidth > 720) closeNav();
  });
}

let ticking = false;
window.addEventListener("scroll", () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    updateActiveNav();
    ticking = false;
  });
});

window.addEventListener("load", updateActiveNav);
updateActiveNav();
typeName();