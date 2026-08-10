/* ════════════════════════════════════════════════════ */
/*  🌐 AZWORD · BOTTOM NAVIGATION COMPONENT            */
/*  Replaces sidebar. 5 tabs: Home / Learn / Practice  */
/*  Rank / Profile. Injects into every page automatically */
/* ════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const NAV_ITEMS = [
    {
      key: 'home',
      label: 'Home',
      href: 'dashboard.html',
      match: ['dashboard.html', 'index.html'],
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 10.5 12 3l9 7.5"/>
        <path d="M5 9.5V21h14V9.5"/>
        <path d="M10 21v-6h4v6"/>
      </svg>`
    },
    {
      key: 'learn',
      label: 'Learn',
      href: 'vocabulary.html',
      match: ['vocabulary.html', 'book.html', 'folder.html', 'folders.html', 'upload.html', 'study.html'],
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v16H6.5A2.5 2.5 0 0 0 4 20.5v-16Z"/>
        <path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20"/>
        <path d="M8 7h7M8 10.5h6"/>
      </svg>`
    },
    {
      key: 'practice',
      label: 'Practice',
      href: 'practice.html',
      match: ['practice.html', 'quiz.html', 'flashcards.html', 'results.html'],
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
        <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>
      </svg>`
    },
    {
      key: 'rank',
      label: 'Rank',
      href: 'leaderboard.html',
      match: ['leaderboard.html', 'achievements.html', 'streak.html'],
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8 21h8"/>
        <path d="M12 17v4"/>
        <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z"/>
        <path d="M17 5h3v2a3 3 0 0 1-3 3"/>
        <path d="M7 5H4v2a3 3 0 0 0 3 3"/>
      </svg>`
    },
    {
      key: 'profile',
      label: 'Profile',
      href: 'profile.html',
      match: ['profile.html', 'settings.html', 'shop.html'],
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 21a8 8 0 0 1 16 0"/>
      </svg>`
    }
  ];

  function detectActiveKey() {
    const path = window.location.pathname;
    const file = path.split('/').pop() || 'dashboard.html';
    for (const item of NAV_ITEMS) {
      if (item.match.some(m => file.toLowerCase().includes(m.toLowerCase()))) {
        return item.key;
      }
    }
    // Generic fallback: route by file name
    if (file.includes('profile') || file.includes('setting') || file.includes('shop')) return 'profile';
    if (file.includes('rank') || file.includes('leaderboard') || file.includes('achievement') || file.includes('streak')) return 'rank';
    if (file.includes('practice') || file.includes('quiz') || file.includes('flashcard')) return 'practice';
    if (file.includes('learn') || file.includes('vocab') || file.includes('book') || file.includes('folder') || file.includes('study')) return 'learn';
    return 'home';
  }

  function buildNav() {
    const activeKey = detectActiveKey();
    const nav = document.createElement('nav');
    nav.className = 'az-bottom-nav';
    nav.setAttribute('role', 'navigation');
    nav.setAttribute('aria-label', 'Main');

    let html = '';
    for (const item of NAV_ITEMS) {
      const isActive = item.key === activeKey ? ' is-active' : '';
      html += `
        <a class="azbn-item${isActive}" href="${item.href}" data-tab="${item.key}" aria-label="${item.label}" aria-current="${item.key === activeKey ? 'page' : 'false'}">
          ${item.icon}
          <span>${item.label}</span>
        </a>
      `;
    }
    nav.innerHTML = html;

    // Press feedback
    nav.addEventListener('click', (e) => {
      const link = e.target.closest('.azbn-item');
      if (!link) return;
      // Visual feedback
      link.animate(
        [{ transform: 'scale(0.92)' }, { transform: 'scale(1)' }],
        { duration: 180, easing: 'cubic-bezier(.34,1.56,.64,1)' }
      );
      // Trigger page transition if available
      if (typeof window.azPageTransition === 'function') {
        e.preventDefault();
        const href = link.getAttribute('href');
        window.azPageTransition(href, link.dataset.tab);
      }
    });

    return nav;
  }

  function isAuthPage() {
    const file = window.location.pathname.split('/').pop().toLowerCase();
    return file === 'index.html' || file === '' || file === 'admin.html';
  }

  function isAdminPage() {
    const file = window.location.pathname.split('/').pop().toLowerCase();
    return file === 'admin.html';
  }

  function hideOldSidebarMarkers() {
    document.body.classList.add('app-shell-body');
    document.documentElement.classList.add('app-mode');
  }

  function setupSwipeGesture() {
    // TODO: left/right swipe to switch tabs (optional future)
  }

  function init() {
    // Skip on auth page
    if (isAuthPage()) return;

    hideOldSidebarMarkers();

    // Append bottom nav
    const nav = buildNav();
    document.body.appendChild(nav);

    setupSwipeGesture();

    // Expose API
    window.AzBottomNav = {
      setActive(key) {
        document.querySelectorAll('.azbn-item').forEach(el => {
          el.classList.toggle('is-active', el.dataset.tab === key);
        });
      },
      show() { nav.classList.remove('hidden'); },
      hide() { nav.classList.add('hidden'); }
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
