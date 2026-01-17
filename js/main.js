/**
 * VICKY'S MUSIC STUDIO
 * Main JavaScript — Handles video, animations, interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const loader = document.querySelector('.loader');
  const video = document.querySelector('.video-hero video');
  const soundToggle = document.querySelector('.sound-toggle');
  const hamburger = document.querySelector('.hamburger');
  const menu = document.querySelector('.menu');
  const heroTitleTexts = document.querySelectorAll('.hero-title-text');
  const heroRule = document.querySelector('.hero-rule');

  // -------------------------------------------------------------------------
  // LOADER
  // -------------------------------------------------------------------------
  function hideLoader() {
    if (loader) {
      loader.classList.add('is-hidden');
      // Start animations after loader hides
      setTimeout(initAnimations, 300);
    }
  }

  // Hide loader when video can play or after timeout
  if (video) {
    video.addEventListener('canplaythrough', hideLoader, { once: true });
    // Fallback timeout
    setTimeout(hideLoader, 3000);
  } else {
    hideLoader();
  }

  // -------------------------------------------------------------------------
  // VIDEO CONTROL
  // -------------------------------------------------------------------------
  if (video) {
    // Ensure video plays (mobile autoplay)
    video.play().catch(() => {
      // Autoplay blocked, that's okay
    });
  }

  // Sound Toggle
  if (soundToggle && video) {
    // Start muted
    video.muted = true;
    soundToggle.classList.add('is-muted');

    soundToggle.addEventListener('click', () => {
      video.muted = !video.muted;
      soundToggle.classList.toggle('is-muted', video.muted);
    });
  }

  // -------------------------------------------------------------------------
  // HAMBURGER MENU
  // -------------------------------------------------------------------------
  if (hamburger && menu) {
    hamburger.addEventListener('click', () => {
      const isOpen = menu.classList.contains('is-open');
      
      hamburger.classList.toggle('is-active', !isOpen);
      menu.classList.toggle('is-open', !isOpen);
      
      // Prevent body scroll when menu is open
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    // Close menu on link click
    const menuLinks = menu.querySelectorAll('.menu-link');
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('is-active');
        menu.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        hamburger.classList.remove('is-active');
        menu.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    });
  }

  // -------------------------------------------------------------------------
  // HERO ANIMATIONS
  // -------------------------------------------------------------------------
  function initAnimations() {
    // Animate hero title lines
    heroTitleTexts.forEach((text, index) => {
      setTimeout(() => {
        text.classList.add('is-visible');
      }, index * 150);
    });

    // Animate hero rule
    if (heroRule) {
      setTimeout(() => {
        heroRule.classList.add('is-visible');
      }, heroTitleTexts.length * 150 + 200);
    }
  }

  // -------------------------------------------------------------------------
  // MAGNETIC EFFECT (Desktop only)
  // -------------------------------------------------------------------------
  if (window.matchMedia('(pointer: fine)').matches) {
    const magneticElements = document.querySelectorAll('.hero-link, .hero-social-link');
    
    magneticElements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  // -------------------------------------------------------------------------
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // -------------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});

// -------------------------------------------------------------------------
// PAGE TRANSITIONS (for multi-page site)
// -------------------------------------------------------------------------
window.addEventListener('pageshow', (event) => {
  // Handle back/forward cache
  if (event.persisted) {
    const loader = document.querySelector('.loader');
    if (loader) {
      loader.classList.add('is-hidden');
    }
  }
});
