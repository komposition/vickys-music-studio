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

  function setHeroVideoSpeed() {
    if (!heroVideo) return;
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    heroVideo.playbackRate = isMobile ? 0.75 : 0.5;
  }

  setHeroVideoSpeed();
  if (heroVideo) {
    heroVideo.addEventListener('loadedmetadata', setHeroVideoSpeed, { once: true });
    window.addEventListener('resize', setHeroVideoSpeed, { passive: true });
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
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        target.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Mobile program switcher
  const programTabs = document.querySelectorAll('[data-program-tab]');
  const programPanels = document.querySelectorAll('[data-program-panel]');
  const programSwitcher = document.querySelector('.program-switcher');
  const mobileProgramQuery = window.matchMedia('(max-width: 767px)');

  function selectProgramTab(selectedProgram) {
    programTabs.forEach((currentTab, index) => {
      const isActive = currentTab.dataset.programTab === selectedProgram;
      currentTab.classList.toggle('is-active', isActive);
      currentTab.setAttribute('aria-selected', String(isActive));
      currentTab.setAttribute('tabindex', isActive ? '0' : '-1');

      if (isActive && programSwitcher) {
        programSwitcher.style.setProperty('--active-tab', index);
      }
    });

    programPanels.forEach(panel => {
      const isActive = panel.dataset.programPanel === selectedProgram;
      panel.classList.toggle('is-active', isActive);
      panel.hidden = !isActive;
      panel.setAttribute('aria-hidden', String(!isActive));
    });
  }

  function syncProgramLayout() {
    if (mobileProgramQuery.matches) {
      const selectedTab = document.querySelector('[data-program-tab].is-active') || programTabs[0];
      if (selectedTab) {
        selectProgramTab(selectedTab.dataset.programTab);
      }
      return;
    }

    programTabs.forEach(currentTab => {
      currentTab.removeAttribute('tabindex');
      currentTab.setAttribute('aria-selected', String(currentTab.classList.contains('is-active')));
    });

    programPanels.forEach(panel => {
      panel.hidden = false;
      panel.removeAttribute('aria-hidden');
      panel.classList.add('is-active');
    });
  }

  programTabs.forEach((tab, index) => {
    tab.addEventListener('click', function () {
      selectProgramTab(this.dataset.programTab);
    });

    tab.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;

      e.preventDefault();
      const direction = e.key === 'ArrowRight' ? 1 : -1;
      const nextTab = programTabs[(index + direction + programTabs.length) % programTabs.length];
      nextTab.focus();
      selectProgramTab(nextTab.dataset.programTab);
    });
  });

  mobileProgramQuery.addEventListener('change', syncProgramLayout);

  // Initialize
  syncProgramLayout();
  onScroll();
})();
