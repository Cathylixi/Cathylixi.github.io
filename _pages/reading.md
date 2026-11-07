---
permalink: /reading/
title: "Reading"
excerpt: "Books, films, anime, and other things that stayed with me."
author_profile: false
redirect_from:
  - /2026/05/24/things-i-read-this-week/
---

{% assign library_items = site.data.reading_items %}
{% assign finished_items = library_items | where: "status", "Finished" %}
{% assign current_items = library_items | where: "status", "Reading" %}
{% assign planning_items = library_items | where: "status", "Planning" %}
{% assign great_items = library_items | where: "rating", "Great" %}
{% assign favorite_author_items = library_items | where: "author", "水千丞" %}
{% assign y2026 = finished_items | where: "year", 2026 %}
{% assign y2025 = finished_items | where: "year", 2025 %}
{% assign y2024 = finished_items | where: "year", 2024 %}
{% assign y2023 = finished_items | where: "year", 2023 %}
{% assign y2022 = finished_items | where: "year", 2022 %}
{% assign y2021 = finished_items | where: "year", 2021 %}
{% assign y2019 = finished_items | where: "year", 2019 %}

<div class="reading-home">
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
    <div class="reading-now__items">
      {% for item in current_items %}
        <article class="reading-now__item">
          <div class="reading-now__cover" aria-hidden="true">BL</div>
          <div>
            <p>Reading</p>
            <h3>{{ item.title | escape }}</h3>
            {% if item.author %}<span>{{ item.author | escape }}</span>{% else %}<span>Author not listed</span>{% endif %}
          </div>
        </article>
      {% endfor %}
    </div>
  </section>

  <div class="reading-layout">
    <main class="reading-library" aria-labelledby="reading-library-title">
      <div class="reading-section-heading">
        <div>
          <p>Collection</p>
          <h2 id="reading-library-title">Library log</h2>
        </div>
        <span class="reading-result-count" id="reading-result-count">{{ library_items.size }} items</span>
      </div>

      <div class="reading-filters" aria-label="Filter the library">
        <label class="reading-search">
          <span class="sr-only">Search title or author</span>
          <input id="reading-search" type="search" placeholder="Search title or author" autocomplete="off">
        </label>
        <label>
          <span class="sr-only">Filter by status</span>
          <select id="reading-status">
            <option value="all">All statuses</option>
            <option value="Reading">Reading</option>
            <option value="Finished">Finished</option>
            <option value="Planning">To read</option>
            <option value="Unspecified">Not set</option>
          </select>
        </label>
        <label>
          <span class="sr-only">Filter by year</span>
          <select id="reading-year">
            <option value="all">All years</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2019">2019</option>
            <option value="Unspecified">Not set</option>
          </select>
        </label>
        <label>
          <span class="sr-only">Filter by rating</span>
          <select id="reading-rating">
            <option value="all">All ratings</option>
            <option value="Great">Great</option>
            <option value="Good">Good</option>
            <option value="soso">So-so</option>
            <option value="Bad">Bad</option>
            <option value="Unspecified">Not rated</option>
          </select>
        </label>
        <button class="reading-reset" id="reading-reset" type="button">Reset</button>
      </div>

      <div class="reading-table-wrap">
        <table class="reading-table">
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Writer</th>
              <th scope="col">Status</th>
              <th scope="col">Year</th>
              <th scope="col">Rating</th>
            </tr>
          </thead>
          <tbody id="reading-table-body">
            {% for item in library_items %}
              <tr class="reading-row"
                  data-search="{{ item.title | append: ' ' | append: item.author | downcase | escape }}"
                  data-status="{% if item.status %}{{ item.status | escape }}{% else %}Unspecified{% endif %}"
                  data-year="{% if item.year %}{{ item.year }}{% else %}Unspecified{% endif %}"
                  data-rating="{% if item.rating %}{{ item.rating | escape }}{% else %}Unspecified{% endif %}">
                <td class="reading-table__title" data-label="Title">{{ item.title | escape }}<span>BL</span></td>
                <td data-label="Writer">{% if item.author %}{{ item.author | escape }}{% else %}<span class="reading-muted">—</span>{% endif %}</td>
                <td data-label="Status">
                  {% if item.status == "Finished" %}
                    <span class="reading-status reading-status--finished">Finished</span>
                  {% elsif item.status == "Reading" %}
                    <span class="reading-status reading-status--reading">Reading</span>
                  {% elsif item.status == "Planning" %}
                    <span class="reading-status reading-status--planning">To read</span>
                  {% else %}
                    <span class="reading-muted">Not set</span>
                  {% endif %}
                </td>
                <td data-label="Year">{% if item.year %}{{ item.year }}{% else %}<span class="reading-muted">—</span>{% endif %}</td>
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
            <tr class="reading-empty" id="reading-empty" hidden>
              <td colspan="5">No items match these filters.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <button class="reading-more" id="reading-more" type="button">Show more</button>
    </main>

    <aside class="reading-activity" aria-label="Reading activity and achievements">
      <section class="reading-stats">
        <div class="reading-stats__title">
          <p>Archive</p>
          <h2>{{ library_items.size }}</h2>
          <span>BL titles logged</span>
        </div>
        <div class="reading-stats__grid">
          <div><strong>{{ finished_items.size }}</strong><span>Finished</span></div>
          <div><strong>{{ current_items.size }}</strong><span>Reading</span></div>
          <div><strong>{{ planning_items.size }}</strong><span>To read</span></div>
        </div>
      </section>

      <section class="reading-timeline" aria-labelledby="reading-activity-title">
        <p class="reading-rail-label">Activity</p>
        <h2 id="reading-activity-title">By year</h2>
        <ol>
          <li><span>2026</span><strong>{{ y2026.size }} finished</strong></li>
          <li><span>2025</span><strong>{{ y2025.size }} finished</strong></li>
          <li><span>2024</span><strong>{{ y2024.size }} finished</strong></li>
          <li><span>2023</span><strong>{{ y2023.size }} finished</strong></li>
          <li><span>2022</span><strong>{{ y2022.size }} finished</strong></li>
          <li><span>2021</span><strong>{{ y2021.size }} finished</strong></li>
          <li><span>2019</span><strong>{{ y2019.size }} finished</strong></li>
        </ol>
      </section>

      <section class="reading-achievements" aria-labelledby="reading-achievements-title">
        <p class="reading-rail-label">Achievements</p>
        <h2 id="reading-achievements-title">Milestones</h2>
        <div class="reading-achievement">
          <span>100+</span>
          <div><strong>Century shelf</strong><p>{{ finished_items.size }} titles finished.</p></div>
        </div>
        <div class="reading-achievement">
          <span>{{ y2025.size }}</span>
          <div><strong>Biggest year</strong><p>{{ y2025.size }} titles finished in 2025.</p></div>
        </div>
        <div class="reading-achievement">
          <span>{{ great_items.size }}</span>
          <div><strong>Great reads</strong><p>{{ great_items.size }} titles received the top rating.</p></div>
        </div>
        <div class="reading-achievement">
          <span>{{ favorite_author_items.size }}</span>
          <div><strong>Most logged writer</strong><p>{{ favorite_author_items.size }} titles by 水千丞.</p></div>
        </div>
        <p class="reading-activity-note">The spreadsheet records years rather than exact finish dates, so activity is shown by year for now.</p>
      </section>
    </aside>
  </div>
</div>

<script>
  (function () {
    var rows = Array.prototype.slice.call(document.querySelectorAll('.reading-row'));
    var search = document.getElementById('reading-search');
    var status = document.getElementById('reading-status');
    var year = document.getElementById('reading-year');
    var rating = document.getElementById('reading-rating');
    var reset = document.getElementById('reading-reset');
    var more = document.getElementById('reading-more');
    var empty = document.getElementById('reading-empty');
    var count = document.getElementById('reading-result-count');
    var pageSize = 30;
    var visibleLimit = pageSize;

    function matches(row) {
      var query = search.value.trim().toLowerCase();
      return (!query || row.dataset.search.indexOf(query) !== -1) &&
        (status.value === 'all' || row.dataset.status === status.value) &&
        (year.value === 'all' || row.dataset.year === year.value) &&
        (rating.value === 'all' || row.dataset.rating === rating.value);
    }

    function update(resetLimit) {
      if (resetLimit) visibleLimit = pageSize;
      var matched = rows.filter(matches);
      rows.forEach(function (row) { row.hidden = true; });
      matched.slice(0, visibleLimit).forEach(function (row) { row.hidden = false; });
      count.textContent = matched.length + (matched.length === 1 ? ' item' : ' items');
      empty.hidden = matched.length !== 0;
      more.hidden = matched.length <= visibleLimit;
    }

    [search, status, year, rating].forEach(function (control) {
      control.addEventListener(control === search ? 'input' : 'change', function () { update(true); });
    });

    reset.addEventListener('click', function () {
      search.value = '';
      status.value = 'all';
      year.value = 'all';
      rating.value = 'all';
      update(true);
      search.focus();
    });

    more.addEventListener('click', function () {
      visibleLimit += pageSize;
      update(false);
    });

    update(true);
  }());
</script>
