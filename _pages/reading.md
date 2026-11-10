---
permalink: /reading/
title: "Reading"
excerpt: "Books, films, anime, and other things that stayed with me."
author_profile: false
redirect_from:
  - /2026/05/24/things-i-read-this-week/
---

{% assign library_items = site.data.reading_items %}
{% assign library_types = library_items | map: "category" | uniq | sort %}

<div class="reading-home">
  <a class="life-section__back reading-home__back" href="{{ '/life/' | relative_url }}" target="_self"><span aria-hidden="true">←</span> My Life</a>

  <header class="reading-hero">
    <p class="reading-hero__eyebrow">Personal library</p>
    <h1>Reading &amp; Watching</h1>
    <p class="reading-hero__description">Books, films, anime, and other things that stayed with me.</p>
  </header>

  <section class="reading-now" aria-labelledby="reading-now-title">
    <div class="reading-now__heading">
      <span>Now</span>
      <h2 id="reading-now-title">Currently reading &amp; watching</h2>
    </div>
    <div class="reading-now__items" id="reading-now-items">
      {% for item in library_items %}
        {% if item.status == "Reading" or item.status == "Watching" %}
          <article class="reading-now__item" data-type="{{ item.category | escape }}" data-index="{{ forloop.index0 }}" tabindex="0" aria-haspopup="dialog">
            <div class="reading-now__cover reading-type--{{ item.category | downcase | escape }}" aria-hidden="true">
              {% case item.category %}
                {% when "Film" %}<i class="fas fa-film"></i>
                {% when "Anime" %}<i class="fas fa-star"></i>
                {% else %}<i class="fas fa-book-open"></i>
              {% endcase %}
            </div>
            <div class="reading-now__copy">
              <p>{{ item.status | escape }}</p>
              <h3>{{ item.title | escape }}</h3>
              <span>{% if item.creator %}{{ item.creator | escape }}{% else %}{{ item.category | escape }}{% endif %}</span>
            </div>
          </article>
        {% endif %}
      {% endfor %}
      <p class="reading-now__empty" id="reading-now-empty" hidden>No current items in this category.</p>
    </div>
  </section>

  <div class="reading-workspace">
  <aside class="reading-overview" aria-label="Reading archive overview">
    <section class="reading-archive" aria-labelledby="reading-archive-title">
      <div class="reading-panel-heading">
        <div>
          <p>Archive</p>
          <h2 id="reading-archive-title">At a glance</h2>
        </div>
        <strong id="reading-archive-total">{{ library_items.size }}</strong>
      </div>

      <div class="reading-archive__stats">
        <div><strong id="reading-archive-finished">0</strong><span>Finished</span></div>
        <div><strong id="reading-archive-current">0</strong><span>In progress</span></div>
        <div><strong id="reading-archive-planned">0</strong><span>Planned</span></div>
      </div>

      <div class="reading-type-summary" id="reading-type-summary" aria-label="Items by type"></div>

    </section>

    <section class="reading-recent" aria-labelledby="reading-recent-title">
      <div class="reading-panel-heading reading-panel-heading--activity">
        <div>
          <p>Recent activity</p>
          <h2 id="reading-recent-title">Latest finishes</h2>
        </div>
      </div>
      <ol class="reading-recent__grid" id="reading-recent-list"></ol>
    </section>
  </aside>

  <main class="reading-library" aria-labelledby="reading-library-title">
    <div class="reading-section-heading">
      <div>
        <p>Collection</p>
        <h2 id="reading-library-title">Library log</h2>
      </div>
      <div class="reading-section-meta">
        <span class="reading-result-count" id="reading-result-count">{{ library_items.size }} items</span>
        <button class="reading-reset" id="reading-reset" type="button">Reset</button>
      </div>
    </div>
    <p class="reading-library-hint">Click any record to open its notes.</p>

    <div class="reading-table-wrap">
      <table class="reading-table">
        <thead>
          <tr>
            <th scope="col">
              <label class="reading-table-filter">
                <span class="sr-only">Search title or creator</span>
                <input id="reading-search" type="search" placeholder="Title or creator" autocomplete="off">
              </label>
            </th>
            <th scope="col">
              <label class="reading-table-filter">
                <span class="sr-only">Filter by type</span>
                <select id="reading-type">
                  <option value="all">Type</option>
                  {% for type_name in library_types %}<option value="{{ type_name | escape }}">{{ type_name | escape }}</option>{% endfor %}
                </select>
              </label>
            </th>
            <th scope="col">
              <label class="reading-table-filter">
                <span class="sr-only">Filter by status</span>
                <select id="reading-status">
                  <option value="all">Status</option>
                  <option value="Reading">Reading</option>
                  <option value="Watching">Watching</option>
                  <option value="Finished">Finished</option>
                  <option value="Planning">Planned</option>
                  <option value="Unspecified">Not set</option>
                </select>
              </label>
            </th>
            <th scope="col">
              <label class="reading-table-filter">
                <span class="sr-only">Filter by year</span>
                <select id="reading-year"><option value="all">Year</option></select>
              </label>
            </th>
            <th scope="col">
              <label class="reading-table-filter">
                <span class="sr-only">Filter by rating</span>
                <select id="reading-rating">
                  <option value="all">Rating</option>
                  <option value="Great">Great</option>
                  <option value="Good">Good</option>
                  <option value="soso">So-so</option>
                  <option value="Bad">Bad</option>
                  <option value="Unspecified">Not rated</option>
                </select>
              </label>
            </th>
          </tr>
        </thead>
        <tbody id="reading-table-body">
          {% for item in library_items %}
            <tr class="reading-row"
                data-index="{{ forloop.index0 }}"
                data-search="{{ item.title | append: ' ' | append: item.creator | downcase | escape }}"
                data-type="{{ item.category | escape }}"
                data-status="{% if item.status %}{{ item.status | escape }}{% else %}Unspecified{% endif %}"
                data-year="{% if item.year %}{{ item.year | escape }}{% else %}Unspecified{% endif %}"
                data-rating="{% if item.rating %}{{ item.rating | escape }}{% else %}Unspecified{% endif %}"
                tabindex="0"
                aria-haspopup="dialog"
                aria-label="Open notes for {{ item.title | escape }}">
              <td class="reading-table__title" data-label="Title">
                <strong>{{ item.title | escape }}</strong>
                {% if item.creator %}<span class="reading-table__creator">{{ item.creator | escape }}</span>{% endif %}
              </td>
              <td data-label="Type"><span class="reading-type reading-type--{{ item.category | downcase | escape }}">{{ item.category | escape }}</span></td>
              <td data-label="Status">
                {% if item.status == "Finished" %}
                  <span class="reading-status reading-status--finished">Finished</span>
                {% elsif item.status == "Reading" %}
                  <span class="reading-status reading-status--reading">Reading</span>
                {% elsif item.status == "Watching" %}
                  <span class="reading-status reading-status--watching">Watching</span>
                {% elsif item.status == "Planning" %}
                  <span class="reading-status reading-status--planning">Planned</span>
                {% else %}
                  <span class="reading-muted">Not set</span>
                {% endif %}
              </td>
              <td data-label="Year">{% if item.year %}{{ item.year | escape }}{% else %}<span class="reading-muted">—</span>{% endif %}</td>
              <td data-label="Rating">
                {% if item.rating == "soso" %}
                  <span class="reading-rating">So-so</span>
                {% elsif item.rating %}
                  <span class="reading-rating reading-rating--{{ item.rating | downcase }}">{{ item.rating | escape }}</span>
                {% else %}
                  <span class="reading-muted">—</span>
                {% endif %}
              </td>
            </tr>
          {% endfor %}
          <tr class="reading-empty" id="reading-empty" hidden><td colspan="5">No items match these filters.</td></tr>
        </tbody>
      </table>
    </div>
    <button class="reading-more" id="reading-more" type="button">Show more</button>
  </main>
  </div>

  <footer class="reading-home__footer">
    <a class="life-section__back" href="{{ '/life/' | relative_url }}" target="_self"><span aria-hidden="true">←</span> Back to My Life</a>
  </footer>

  <dialog class="reading-note" id="reading-note" aria-labelledby="reading-note-title">
    <button class="reading-note__close" id="reading-note-close" type="button" aria-label="Close notes">&times;</button>
    <div class="reading-note__header">
      <span class="reading-note__type" id="reading-note-type">Book</span>
      <p>Library note</p>
      <h2 id="reading-note-title"></h2>
      <span class="reading-note__creator" id="reading-note-creator"></span>
    </div>
    <dl class="reading-note__meta">
      <div><dt>Status</dt><dd id="reading-note-status">—</dd></div>
      <div><dt>Year</dt><dd id="reading-note-year">—</dd></div>
      <div><dt>Rating</dt><dd id="reading-note-rating">—</dd></div>
    </dl>
    <section class="reading-note__body" aria-labelledby="reading-note-body-title">
      <p id="reading-note-body-title">Notes</p>
      <div id="reading-note-copy"></div>
    </section>
  </dialog>
</div>

<script type="application/json" id="reading-data">{{ library_items | jsonify }}</script>
<script>
  (function () {
    var items = JSON.parse(document.getElementById('reading-data').textContent);
    var rows = Array.prototype.slice.call(document.querySelectorAll('.reading-row'));
    var nowItems = Array.prototype.slice.call(document.querySelectorAll('.reading-now__item'));
    var search = document.getElementById('reading-search');
    var type = document.getElementById('reading-type');
    var status = document.getElementById('reading-status');
    var year = document.getElementById('reading-year');
    var rating = document.getElementById('reading-rating');
    var reset = document.getElementById('reading-reset');
    var more = document.getElementById('reading-more');
    var empty = document.getElementById('reading-empty');
    var count = document.getElementById('reading-result-count');
    var recentList = document.getElementById('reading-recent-list');
    var note = document.getElementById('reading-note');
    var noteClose = document.getElementById('reading-note-close');
    var pageSize = 30;
    var visibleLimit = pageSize;

    function valueOrUnspecified(value) { return value === null || value === '' ? 'Unspecified' : String(value); }
    function selectedTypeItems() { return type.value === 'all' ? items : items.filter(function (item) { return item.category === type.value; }); }
    function yearRank(value) { var number = Number(value); return Number.isFinite(number) ? number : -1; }
    function escapeHtml(value) {
      return String(value).replace(/[&<>'"]/g, function (character) {
        return {'&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'}[character];
      });
    }

    function populateYears() {
      var values = [];
      items.forEach(function (item) {
        var value = valueOrUnspecified(item.year);
        if (values.indexOf(value) === -1) values.push(value);
      });
      values.sort(function (a, b) {
        if (a === 'Unspecified') return 1;
        if (b === 'Unspecified') return -1;
        return yearRank(b) - yearRank(a) || a.localeCompare(b);
      });
      values.forEach(function (value) {
        var option = document.createElement('option');
        option.value = value;
        option.textContent = value === 'Unspecified' ? 'Not set' : value;
        year.appendChild(option);
      });
    }

    function matches(row) {
      var query = search.value.trim().toLowerCase();
      return (!query || row.dataset.search.indexOf(query) !== -1) &&
        (type.value === 'all' || row.dataset.type === type.value) &&
        (status.value === 'all' || row.dataset.status === status.value) &&
        (year.value === 'all' || row.dataset.year === year.value) &&
        (rating.value === 'all' || row.dataset.rating === rating.value);
    }

    function renderNow() {
      var shown = 0;
      nowItems.forEach(function (item) {
        var matchesType = type.value === 'all' || item.dataset.type === type.value;
        item.hidden = !matchesType || shown >= 4;
        if (!item.hidden) shown += 1;
      });
      document.getElementById('reading-now-empty').hidden = shown !== 0;
    }

    function renderArchive() {
      var scoped = selectedTypeItems();
      var finished = scoped.filter(function (item) { return item.status === 'Finished'; });
      var current = scoped.filter(function (item) { return item.status === 'Reading' || item.status === 'Watching'; });
      var planned = scoped.filter(function (item) { return item.status === 'Planning'; });
      var byType = {};

      scoped.forEach(function (item) { byType[item.category] = (byType[item.category] || 0) + 1; });

      document.getElementById('reading-archive-total').textContent = scoped.length;
      document.getElementById('reading-archive-finished').textContent = finished.length;
      document.getElementById('reading-archive-current').textContent = current.length;
      document.getElementById('reading-archive-planned').textContent = planned.length;
      document.getElementById('reading-type-summary').innerHTML = Object.keys(byType).sort().map(function (name) {
        return '<span><strong>' + byType[name] + '</strong> ' + escapeHtml(name) + '</span>';
      }).join('');
    }

    function renderRecent() {
      var recent = selectedTypeItems().map(function (item) { return {item: item, index: items.indexOf(item)}; })
        .filter(function (entry) { return entry.item.status === 'Finished' && entry.item.year !== null && entry.item.year !== ''; })
        .sort(function (a, b) { return yearRank(b.item.year) - yearRank(a.item.year) || a.index - b.index; })
        .slice(0, 4);
      recentList.innerHTML = recent.map(function (entry) {
        var item = entry.item;
        var creator = item.creator ? '<span>' + escapeHtml(item.creator) + '</span>' : '<span>' + escapeHtml(item.category) + '</span>';
        return '<li data-index="' + entry.index + '" tabindex="0" aria-haspopup="dialog"><time>' + escapeHtml(item.year) + '</time><div><small>' + escapeHtml(item.category) + '</small><strong>' + escapeHtml(item.title) + '</strong>' + creator + '</div></li>';
      }).join('');
      if (!recent.length) recentList.innerHTML = '<li class="reading-recent__empty">No finished items with a recorded year.</li>';
    }

    function update(resetLimit) {
      if (resetLimit) visibleLimit = pageSize;
      var matched = rows.filter(matches);
      rows.forEach(function (row) { row.hidden = true; });
      matched.slice(0, visibleLimit).forEach(function (row) { row.hidden = false; });
      count.textContent = matched.length + (matched.length === 1 ? ' item' : ' items');
      empty.hidden = matched.length !== 0;
      more.hidden = matched.length <= visibleLimit;
      renderNow();
      renderArchive();
      renderRecent();
    }

    function displayValue(value) {
      return value === null || value === '' || typeof value === 'undefined' ? '—' : String(value);
    }

    function openNote(index) {
      var item = items[Number(index)];
      if (!item) return;
      document.getElementById('reading-note-title').textContent = item.title;
      document.getElementById('reading-note-creator').textContent = displayValue(item.creator);
      document.getElementById('reading-note-status').textContent = displayValue(item.status);
      document.getElementById('reading-note-year').textContent = displayValue(item.year);
      document.getElementById('reading-note-rating').textContent = item.rating === 'soso' ? 'So-so' : displayValue(item.rating);
      var noteType = document.getElementById('reading-note-type');
      noteType.textContent = item.category;
      noteType.className = 'reading-note__type reading-type--' + item.category.toLowerCase();
      var noteCopy = document.getElementById('reading-note-copy');
      noteCopy.textContent = item.notes || 'No notes yet.';
      noteCopy.classList.toggle('reading-note__empty', !item.notes);
      note.showModal();
    }

    function openFromTarget(target) {
      var entry = target.closest('[data-index]');
      if (entry) openNote(entry.dataset.index);
    }

    function openFromKeyboard(event) {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      var entry = event.target.closest('[data-index]');
      if (!entry) return;
      event.preventDefault();
      openNote(entry.dataset.index);
    }

    [search, type, status, year, rating].forEach(function (control) {
      control.addEventListener(control === search ? 'input' : 'change', function () { update(true); });
    });

    reset.addEventListener('click', function () {
      search.value = '';
      type.value = 'all';
      status.value = 'all';
      year.value = 'all';
      rating.value = 'all';
      update(true);
      search.focus();
    });

    more.addEventListener('click', function () { visibleLimit += pageSize; update(false); });
    document.getElementById('reading-table-body').addEventListener('click', function (event) { openFromTarget(event.target); });
    document.getElementById('reading-table-body').addEventListener('keydown', openFromKeyboard);
    document.getElementById('reading-now-items').addEventListener('click', function (event) { openFromTarget(event.target); });
    document.getElementById('reading-now-items').addEventListener('keydown', openFromKeyboard);
    recentList.addEventListener('click', function (event) { openFromTarget(event.target); });
    recentList.addEventListener('keydown', openFromKeyboard);
    noteClose.addEventListener('click', function () { note.close(); });
    note.addEventListener('click', function (event) {
      if (event.target === note) note.close();
    });
    populateYears();
    update(true);
  }());
</script>
