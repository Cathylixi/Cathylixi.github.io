(function () {
  var buttons = document.querySelectorAll('[data-blog-filter]');
  var cards = document.querySelectorAll('[data-blog-format]');
  var count = document.querySelector('[data-blog-count]');
  var empty = document.querySelector('[data-blog-empty]');

  if (!buttons.length || !cards.length) return;

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      var filter = button.getAttribute('data-blog-filter');
      var visible = 0;

      buttons.forEach(function (item) {
        var active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', active ? 'true' : 'false');
      });

      cards.forEach(function (card) {
        var show = filter === 'all' || card.getAttribute('data-blog-format') === filter;
        card.hidden = !show;
        if (show) visible += 1;
      });

      if (count) count.textContent = visible + (visible === 1 ? ' entry' : ' entries');
      if (empty) empty.hidden = visible !== 0;
    });
  });
}());
