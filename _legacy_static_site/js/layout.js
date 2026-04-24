(function () {
  var pages = [
    { href: 'index.html#home',         section: '#home',         label: 'Home' },
    { href: 'index.html#publications', section: '#publications', label: 'Publications' },
    { href: 'index.html#others',       section: '#others',       label: 'Others' },
    { href: 'index.html#open-source',  section: '#open-source',  label: 'Open Source' },
    { href: 'index.html#fun',          section: '#fun',          label: 'Fun' }
  ];

  var currentFile = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if (currentFile === '' || currentFile === '/') currentFile = 'index.html';
  var activeSection = null;

  var pageToSection = {
    'index.html': '#home',
    'publications.html': '#publications',
    'others.html': '#others',
    'open-source.html': '#open-source',
    'fun.html': '#fun'
  };

  function getActiveSection() {
    if (currentFile === 'index.html') {
      return location.hash ? location.hash.toLowerCase() : '#home';
    }
    return pageToSection[currentFile] || '#home';
  }

  function setActiveSection(section) {
    activeSection = section || '#home';
    var navLinks = document.querySelectorAll('#site-nav .nav-links a');

    navLinks.forEach(function (link) {
      var isActive = link.getAttribute('href') === 'index.html' + activeSection;
      link.classList.toggle('active', isActive);

      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  function renderNav() {
    activeSection = getActiveSection();
    var navItems = pages.map(function (p) {
      var isActive = p.section === activeSection;
      return '<li><a href="' + p.href + '"' +
        (isActive ? ' class="active" aria-current="page"' : '') +
        '>' + p.label + '</a></li>';
    }).join('');

    var navHTML =
      '<nav>' +
        '<ul class="nav-links">' + navItems + '</ul>' +
      '</nav>';

    var navSlot = document.getElementById('site-nav');
    if (navSlot) navSlot.innerHTML = navHTML;
  }

  function updateActiveSectionFromScroll() {
    var trackedSections = ['#home', '#publications', '#others', '#open-source', '#fun'];
    var threshold = 140;
    var current = '#home';

    trackedSections.forEach(function (selector) {
      var el = document.querySelector(selector);
      if (!el) return;

      if (el.getBoundingClientRect().top <= threshold) {
        current = selector;
      }
    });

    if (current !== activeSection) {
      setActiveSection(current);
    }
  }

  function setupScrollSpy() {
    var ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(function () {
        updateActiveSectionFromScroll();
        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
  }

  var footerHTML =
    '<footer>' +
      '&copy; 2026 Cathy Li Xi &mdash; Last updated April 2026' +
    '</footer>';

  var footerSlot = document.getElementById('site-footer');
  if (footerSlot) footerSlot.innerHTML = footerHTML;

  renderNav();

  if (currentFile === 'index.html') {
    window.addEventListener('hashchange', function () {
      setActiveSection(getActiveSection());
      updateActiveSectionFromScroll();
    });
    setupScrollSpy();
  }
})();
