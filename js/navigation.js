/**
 * Navigation Menu Handler
 * Manages responsive mobile menu toggle and smooth scrolling
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  initNavigationMenu();
  initSmoothScrolling();
  initActiveNavLinks();
});

/**
 * Initialize mobile navigation menu toggle
 */
function initNavigationMenu() {
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (!navToggle || !mainNav) {
    console.warn('Navigation elements not found');
    return;
  }

  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';

    // Toggle aria-expanded attribute
    navToggle.setAttribute('aria-expanded', !isExpanded);

    // Toggle active class on nav
    mainNav.classList.toggle('active');
  });

  // Close menu when clicking nav links (mobile)
  const navLinks = mainNav.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Only close on mobile (when nav-toggle is visible)
      if (window.getComputedStyle(navToggle).display !== 'none') {
        mainNav.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Close menu when clicking outside (mobile)
  document.addEventListener('click', (event) => {
    const isClickInsideNav = mainNav.contains(event.target);
    const isClickOnToggle = navToggle.contains(event.target);

    if (!isClickInsideNav && !isClickOnToggle && mainNav.classList.contains('active')) {
      mainNav.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Handle window resize - close mobile menu on desktop
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 767 && mainNav.classList.contains('active')) {
        mainNav.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    }, 250);
  });
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScrolling() {
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');

      // Skip if it's just "#" or empty
      if (!targetId || targetId === '#') {
        return;
      }

      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        event.preventDefault();

        // Calculate offset for sticky header
        const header = document.querySelector('.site-header');
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;

        // Smooth scroll to target
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Update URL without jumping
        if (history.pushState) {
          history.pushState(null, null, targetId);
        }

        // Focus target for accessibility
        targetElement.focus({ preventScroll: true });

        // If element isn't focusable, add tabindex temporarily
        if (document.activeElement !== targetElement) {
          targetElement.setAttribute('tabindex', '-1');
          targetElement.focus({ preventScroll: true });
        }
      }
    });
  });
}

/**
 * Highlight active navigation link based on scroll position
 */
function initActiveNavLinks() {
  const sections = document.querySelectorAll('.module, .hero');
  const navLinks = document.querySelectorAll('.nav-link');

  if (sections.length === 0 || navLinks.length === 0) {
    return;
  }

  // Throttle scroll event for performance
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateActiveNavLink(sections, navLinks);
        ticking = false;
      });
      ticking = true;
    }
  });

  // Initial check
  updateActiveNavLink(sections, navLinks);
}

/**
 * Update which navigation link is active based on scroll position
 */
function updateActiveNavLink(sections, navLinks) {
  const scrollPosition = window.scrollY + 100; // Offset for header

  // Find current section
  let currentSection = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id');
    }
  });

  // Update nav links
  navLinks.forEach(link => {
    link.classList.remove('active');

    const href = link.getAttribute('href');
    if (href === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

/**
 * Add keyboard navigation support
 */
document.addEventListener('keydown', (event) => {
  // ESC key closes mobile menu
  if (event.key === 'Escape') {
    const mainNav = document.querySelector('.main-nav');
    const navToggle = document.querySelector('.nav-toggle');

    if (mainNav && mainNav.classList.contains('active')) {
      mainNav.classList.remove('active');
      if (navToggle) {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    }
  }
});
