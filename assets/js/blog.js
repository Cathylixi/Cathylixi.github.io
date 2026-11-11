(function () {
  var formatButtons = document.querySelectorAll('[data-blog-filter]');
  var topicButtons = document.querySelectorAll('[data-blog-topic-filter]');
  var seriesButtons = document.querySelectorAll('[data-blog-series-filter]');
  var cards = document.querySelectorAll('[data-blog-format]');
  var count = document.querySelector('[data-blog-count]');
  var empty = document.querySelector('[data-blog-empty]');
  var activeFormat = 'all';
  var activeTopic = 'all';
  var activeSeries = 'all';

  if (!cards.length) return;

  function updateArchive() {
    var visible = 0;

    cards.forEach(function (card) {
      var matchesFormat = activeFormat === 'all' || card.getAttribute('data-blog-format') === activeFormat;
      var cardTopics = (card.getAttribute('data-blog-topics') || '').split(/\s+/);
      var matchesTopic = activeTopic === 'all' || cardTopics.indexOf(activeTopic) !== -1;
      var matchesSeries = activeSeries === 'all' || card.getAttribute('data-blog-series') === activeSeries;
      var show = matchesFormat && matchesTopic && matchesSeries;
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

  topicButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      activeTopic = button.getAttribute('data-blog-topic-filter');

      topicButtons.forEach(function (item) {
        var active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', active ? 'true' : 'false');
      });

      updateArchive();
    });
  });

  seriesButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      activeSeries = button.getAttribute('data-blog-series-filter');

      seriesButtons.forEach(function (item) {
        var active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', active ? 'true' : 'false');
      });

      updateArchive();
    });
  });
}());
