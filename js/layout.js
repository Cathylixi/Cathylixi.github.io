(function () {
  var pages = [
    { href: 'index.html',        label: 'Home' },
    { href: 'publications.html', label: 'Publications' },
    { href: 'others.html',       label: 'Others' },
    { href: 'open-source.html',  label: 'Open Source' },
    { href: 'fun.html',          label: 'Fun' }
  ];

  var currentFile = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if (currentFile === '' || currentFile === '/') currentFile = 'index.html';

  var navItems = pages.map(function (p) {
    var isActive = p.href.toLowerCase() === currentFile;
    return '<li><a href="' + p.href + '"' +
      (isActive ? ' class="active" aria-current="page"' : '') +
      '>' + p.label + '</a></li>';
  }).join('');

  var navHTML =
    '<nav>' +
      '<ul class="nav-links">' + navItems + '</ul>' +
    '</nav>';

  var footerHTML =
    '<footer>' +
      '&copy; 2026 Cathy Li Xi &mdash; Last updated April 2026' +
    '</footer>';

  var navSlot = document.getElementById('site-nav');
  if (navSlot) navSlot.outerHTML = navHTML;

  var footerSlot = document.getElementById('site-footer');
  if (footerSlot) footerSlot.outerHTML = footerHTML;
})();
