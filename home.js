
  // Navbar background on scroll
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    const mobileMenu = document.getElementById('mobileMenu');

    if(window.scrollY > 300) {
      nav.classList.add('scrolled');
      mobileMenu.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
      mobileMenu.classList.remove('scrolled');
    }
  });
  // // Mobile menu toggle
  // const hamburger = document.getElementById('hamburger');
  // hamburger.addEventListener('click', () => {
  //   mobileMenu.classList.toggle('active');
  //   hamburger.classList.toggle('active');
  // });
  // // Mobile dropdown toggles
  // const mobileDropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');
  // mobileDropdownToggles.forEach(toggle => {
  //   toggle.addEventListener('click', () => {
  //     const content = toggle.nextElementSibling;
  //     content.classList.toggle('active');
  //   });
  // });
  
  (function(){
  const toggles = document.querySelectorAll('.mobile-dropdown-toggle');

  toggles.forEach(toggle => {
    const content = toggle.nextElementSibling;

    // Ensure we reflect initial open state if present
    if (content && content.classList.contains('active')) {
      toggle.classList.add('active');
    }

    toggle.addEventListener('click', () => {
      if (!content) return;
      // Toggle content visibility (you already do this)
      content.classList.toggle('active');
      // Toggle arrow rotation state
      toggle.classList.toggle('active');
    });
  });
})();


(function(){
  const nav = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (!nav || !hamburger || !mobileMenu) return;

  const MOBILE_BREAKPOINT = 1150; // matches your CSS @media (max-width:1150px)

  // Helpers
  const isOpen = () => mobileMenu.classList.contains('active');
  const openMenu = () => { mobileMenu.classList.add('active'); hamburger.classList.add('active'); };
  const closeMenu = () => { mobileMenu.classList.remove('active'); hamburger.classList.remove('active'); };

  // 1) Toggle on hamburger click
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    isOpen() ? closeMenu() : openMenu();
  });

  // 2) Close when clicking outside (anywhere not inside menu or hamburger)
  document.addEventListener('click', (e) => {
    if (!isOpen()) return;
    const clickedInsideMenu = e.target.closest('#mobileMenu');
    const clickedHamburger = e.target.closest('#hamburger');
    if (!clickedInsideMenu && !clickedHamburger) closeMenu();
  });

  // 3) Close when a menu link is clicked (common UX)
  mobileMenu.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link) closeMenu();
  });

  // 4) Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) closeMenu();
  });

  // 5) Auto-close if viewport changes to desktop layout
  const onResize = () => {
    if (window.innerWidth > MOBILE_BREAKPOINT && isOpen()) {
      closeMenu();
    }
  };
  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', onResize);

  // 6) Keep scrolled class synced for mobile panel when nav changes
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      mobileMenu.classList.add('scrolled');
    } else {
      mobileMenu.classList.remove('scrolled');
    }
  }, { passive:true });

})();
  






(function(){
  const nav = document.getElementById('navbar');
  if (!nav) return;

  // Items that contain a panel (megamenu or dropdown)
  const items = Array.from(nav.querySelectorAll('.nav-item'))
    .filter(item => item.querySelector('.megamenu, .dropdown'));

  // Close all open items
  const closeAll = () => {
    items.forEach(item => {
      item.classList.remove('open');
      const panel = item.querySelector('.megamenu, .dropdown');
      const arrow = item.querySelector('.dropdown-arrow svg');
      if (panel) panel.classList.remove('show');
      if (arrow) arrow.style.transform = '';
    });
  };

  // Toggle one item (enforces single-open)
  const toggleItem = (item) => {
    const panel = item.querySelector('.megamenu, .dropdown');
    const arrow = item.querySelector('.dropdown-arrow svg');
    const isOpen = item.classList.contains('open');

    if (isOpen) {
      // Close current item
      item.classList.remove('open');
      if (panel) panel.classList.remove('show');
      if (arrow) arrow.style.transform = '';
    } else {
      // Ensure only one is open at a time
      closeAll();
      // Open the requested item
      item.classList.add('open');
      if (panel) panel.classList.add('show'); // keep visible without hover
      if (arrow) arrow.style.transform = 'rotate(180deg)';
    }
  };

  // Bind click and keyboard events on each item's main link
  items.forEach(item => {
    const trigger = item.querySelector(':scope > a');
    if (!trigger) return;

    trigger.addEventListener('click', (e) => {
      const href = trigger.getAttribute('href');
      if (!href || href === '#') e.preventDefault();
      toggleItem(item);
    });

    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleItem(item);
      }
    });
  });

  // Close when clicking outside navbar
  document.addEventListener('click', (e) => {
    const insideNav = e.target.closest('#navbar');
    if (!insideNav) closeAll();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll();
  });
})();
  







(function () {
  // Utility: normalize paths (ignore protocol, host, trailing slash, query, hash)
  const normalize = (url) => {
    try {
      const u = new URL(url, window.location.origin);
      let p = u.pathname.replace(/\/+$/, ''); // remove trailing slash
      if (p === '') p = '/';
      return p.toLowerCase();
    } catch {
      // For relative hrefs like "#", "javascript:void(0)", or invalid URLs
      return '';
    }
  };

  const currentPath = normalize(window.location.href);

  // Scope: navbar, megamenus, and mobile menu if present
  const scopeSelectors = [
    '#navbar',
    '#navbar .megamenu',
    '#mobilemenu',
    '#mobilemenu .megamenu'
  ].join(',');

  const scopes = document.querySelectorAll(scopeSelectors);

  // Gather all candidate links
  const links = [];
  scopes.forEach(scope => {
    links.push(...scope.querySelectorAll('a[href]'));
  });

  // Filter out non-navigational hrefs
  const isRealLink = (a) => {
    const href = a.getAttribute('href') || '';
    if (href === '#' || href.startsWith('javascript:')) return false;
    return true;
  };

  // Choose the "best match":
  // 1) exact match by path
  // 2) longest prefix match by path for parent sections
  const candidates = links.filter(isRealLink).map(a => {
    return { a, path: normalize(a.href) };
  });

  // Remove any previous states (in case of PJAX/hot reload)
  const clearActive = () => {
    document.querySelectorAll('.active-link').forEach(el => el.classList.remove('active-link'));
  };

  const applyActive = (anchorEl) => {
    // Mark the anchor
    anchorEl.classList.add('active-link');

    // Optionally, also mark its parent .nav-item for arrow/parent highlighting
    const navItem = anchorEl.closest('.nav-item');
    if (navItem) navItem.classList.add('active-link');
  };

  const setActiveByPath = () => {
    clearActive();
    if (!currentPath) return;

    // Exact matches first
    const exact = candidates.filter(c => c.path === currentPath);
    if (exact.length > 0) {
      // Prefer the shortest text or topmost nav item if duplicates
      applyActive(exact[0].a);
      return;
    }

    // Fallback: longest common prefix match (e.g., /services/web matches /services/web/project-a)
    const prefixMatches = candidates
      .filter(c => c.path && currentPath.startsWith(c.path) && c.path !== '/')
      .sort((a, b) => b.path.length - a.path.length);

    if (prefixMatches.length > 0) {
      applyActive(prefixMatches[0].a);
      return;
    }

    // Final fallback: if on root "/", highlight Home if present
    if (currentPath === '/') {
      const home = candidates.find(c => c.a.textContent.trim().toLowerCase() === 'home' || c.path === '/home');
      if (home) applyActive(home.a);
    }
  };

  setActiveByPath();

  // If using client-side routing (SPA), expose a helper to refresh active state after route change
  window.refreshNavActiveState = setActiveByPath;
})();


 // Example: highlight current page link in both desktop and mobile menus
const current = location.pathname.split('/').pop();
document.querySelectorAll('nav a[href], .mobile-menu a[href]').forEach(a => {
  const file = a.getAttribute('href')?.split('/').pop();
  if (file === current) a.classList.add('active-link');
});
