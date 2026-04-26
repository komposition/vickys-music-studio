/**
 * Vicky's Music Studio
 * Minimal, purposeful interactions
 */

(function () {
  'use strict';

  // Header scroll behavior
  const header = document.querySelector('.header');
  const scrollIndicator = document.querySelector('.scroll-indicator');
  const heroVideo = document.querySelector('.hero-video video');
  
  let lastScroll = 0;
  const scrollThreshold = 50;

  function slowHeroVideo() {
    if (!heroVideo) return;
    heroVideo.playbackRate = 0.5;
  }

  slowHeroVideo();
  if (heroVideo) {
    heroVideo.addEventListener('loadedmetadata', slowHeroVideo, { once: true });
  }

  function onScroll() {
    const currentScroll = window.scrollY;

    // Header background on scroll
    if (currentScroll > scrollThreshold) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }

    // Hide scroll indicator after scrolling
    if (scrollIndicator && currentScroll > 100) {
      scrollIndicator.classList.add('is-hidden');
    } else if (scrollIndicator) {
      scrollIndicator.classList.remove('is-hidden');
    }

    lastScroll = currentScroll;
  }

  // Debounced scroll handler
  let ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Mobile program switcher
  const programTabs = document.querySelectorAll('[data-program-tab]');
  const programPanels = document.querySelectorAll('[data-program-panel]');

  programTabs.forEach(tab => {
    tab.addEventListener('click', function () {
      const selectedProgram = this.dataset.programTab;

      programTabs.forEach(currentTab => {
        const isActive = currentTab.dataset.programTab === selectedProgram;
        currentTab.classList.toggle('is-active', isActive);
        currentTab.setAttribute('aria-selected', String(isActive));
      });

      programPanels.forEach(panel => {
        panel.classList.toggle('is-active', panel.dataset.programPanel === selectedProgram);
      });
    });
  });

  // Initialize
  onScroll();
})();
