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
  const marker = window.scrollY + window.innerHeight * 0.35;
  let current = null;

  sections.forEach((section) => {
    if (marker >= section.offsetTop && marker < section.offsetTop + section.offsetHeight) {
      current = section;
    }
  });

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