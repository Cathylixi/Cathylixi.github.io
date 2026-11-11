(function () {
  var historyButtons = document.querySelectorAll('[data-blog-history]');
  var formatButtons = document.querySelectorAll('[data-blog-filter]');
  var seriesButtons = document.querySelectorAll('[data-blog-series-filter]');
  var cards = document.querySelectorAll('[data-blog-format]');
  var count = document.querySelector('[data-blog-count]');
  var empty = document.querySelector('[data-blog-empty]');
  var activeFormat = 'all';
  var activeSeries = 'all';

  historyButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      if (button.getAttribute('data-blog-history') === 'back') {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          window.location.assign(button.ownerDocument.documentElement.getAttribute('data-baseurl') || '/blog/');
        }
      } else {
        window.history.forward();
      }
    });
  });

  if (!cards.length) return;

  function updateArchive() {
    var visible = 0;

    cards.forEach(function (card) {
      var matchesFormat = activeFormat === 'all' || card.getAttribute('data-blog-format') === activeFormat;
      var matchesSeries = activeSeries === 'all' || card.getAttribute('data-blog-series') === activeSeries;
      var show = matchesFormat && matchesSeries;
      card.hidden = !show;
      if (show) visible += 1;
    });

    if (count) count.textContent = visible + (visible === 1 ? ' entry' : ' entries');
    if (empty) empty.hidden = visible !== 0;
  }

  formatButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      activeFormat = button.getAttribute('data-blog-filter');

      formatButtons.forEach(function (item) {
        var active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', active ? 'true' : 'false');
      });

      updateArchive();
    });
  });

  seriesButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var selectedSeries = button.getAttribute('data-blog-series-filter');
      activeSeries = activeSeries === selectedSeries ? 'all' : selectedSeries;

      seriesButtons.forEach(function (item) {
        var active = item.getAttribute('data-blog-series-filter') === activeSeries;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', active ? 'true' : 'false');
      });

      updateArchive();
    });
  });
}());
