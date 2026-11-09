---
layout: default
permalink: /life/travel/flights/
title: "All Trip Details"
excerpt: "Flights, trains, and buses in one chronological route ledger."
author_profile: false
---

{% assign verified_flights = site.data.travel_flights %}
{% assign ground_journeys = site.data.travel_ground %}
{% assign segment_count = verified_flights.size | plus: ground_journeys.size %}

<article class="flight-archive-page">
  <a class="life-section__back" href="{{ '/life/travel/' | relative_url }}" target="_self"><span aria-hidden="true">←</span> My Travel</a>

  <header class="flight-archive-page__hero">
    <div>
      <p>Route ledger</p>
      <h1>All Trip Details</h1>
      <span>Flights, Amtrak trains, and FlixBus journeys in one chronological record, newest first.</span>
    </div>
    <div class="flight-archive-page__count">
      <strong>{{ segment_count }}</strong>
      <span>Segments</span>
    </div>
  </header>

  <div class="trip-detail-toolbar">
    <nav class="trip-detail-filters" aria-label="Filter trip details">
      <button type="button" data-trip-mode="all" aria-pressed="true" aria-controls="trip-detail-list">All</button>
      <button type="button" data-trip-mode="flight" aria-pressed="false" aria-controls="trip-detail-list">Flights</button>
      <button type="button" data-trip-mode="train" aria-pressed="false" aria-controls="trip-detail-list">Trains</button>
      <button type="button" data-trip-mode="bus" aria-pressed="false" aria-controls="trip-detail-list">Buses</button>
    </nav>
    <label class="trip-detail-search" for="trip-detail-search">
      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"></circle><path d="m16 16 4 4"></path></svg>
      <span class="screen-reader-text">Search by city, station or airport</span>
      <input id="trip-detail-search" type="search" placeholder="Search city, station, or airport" autocomplete="off" aria-controls="trip-detail-list" aria-describedby="trip-detail-search-status">
    </label>
  </div>
  <p class="trip-detail-search-status" id="trip-detail-search-status" aria-live="polite"></p>

  <section class="flight-archive-ledger" aria-label="All recorded transport, newest first">
    {% if segment_count > 0 %}
      <header class="flight-archive-ledger__columns" aria-hidden="true">
        <span>Date</span>
        <span>Route</span>
        <span>Transport</span>
      </header>
      <div class="flight-archive-ledger__body" id="trip-detail-list">
        {% for flight in verified_flights %}
          {% assign from_location = site.data.travel_airport_details[flight.from_code] %}
          {% assign to_location = site.data.travel_airport_details[flight.to_code] %}
          {% assign from_city = flight.from_city | default: from_location.city | default: flight.from_code %}
          {% assign to_city = flight.to_city | default: to_location.city | default: flight.to_code %}
          <article class="trip-flight" data-mode="flight" data-sort-date="{{ flight.sort_date | escape }}" data-search="{{ flight.from_code | escape }} {{ from_city | escape }} {{ from_location.name | escape }} {{ flight.to_code | escape }} {{ to_city | escape }} {{ to_location.name | escape }}">
            <time datetime="{{ flight.sort_date | escape }}">{{ flight.date | escape }}</time>
            <div class="trip-flight__route">
              <span class="trip-flight__airport" title="{{ from_location.name | escape }}">
                <strong>{{ flight.from_code | escape }}</strong>
                <span class="trip-flight__city">{{ from_city | escape }}</span>
                <span class="trip-flight__location-name">{{ from_location.name | escape }}</span>
                {% if flight.from_time %}<small>{{ flight.from_time | escape }}</small>{% endif %}
              </span>
              <i aria-hidden="true">
                {% if flight.duration %}<span>{{ flight.duration | escape }}</span>{% endif %}
              </i>
              <span class="trip-flight__airport" title="{{ to_location.name | escape }}">
                <strong>{{ flight.to_code | escape }}</strong>
                <span class="trip-flight__city">{{ to_city | escape }}</span>
                <span class="trip-flight__location-name">{{ to_location.name | escape }}</span>
                {% if flight.to_time %}<small>{{ flight.to_time | escape }}</small>{% endif %}
              </span>
            </div>
            <div class="trip-flight__meta">
              <span class="trip-mode trip-mode--flight">Flight</span>
              <strong>{{ flight.carrier | default: "Airline not listed" | escape }}</strong>
              {% if flight.flight_number or flight.cabin or flight.seat or flight.note %}
              <small>
                {% if flight.flight_number %}{{ flight.flight_number | escape }}{% endif %}
                {% if flight.cabin %} · {{ flight.cabin | escape }}{% endif %}
                {% if flight.seat %} · Seat {{ flight.seat | escape }}{% endif %}
                {% if flight.note %} · {{ flight.note | escape }}{% endif %}
              </small>
              {% endif %}
            </div>
          </article>
        {% endfor %}
        {% for segment in ground_journeys %}
          {% assign from_location = site.data.travel_ground_locations[segment.from_id] %}
          {% assign to_location = site.data.travel_ground_locations[segment.to_id] %}
          <article class="trip-flight" data-mode="{{ segment.mode | escape }}" data-sort-date="{{ segment.sort_date | escape }}" data-search="{{ segment.from_code | escape }} {{ from_location.city | escape }} {{ from_location.name | escape }} {{ segment.to_code | escape }} {{ to_location.city | escape }} {{ to_location.name | escape }}">
            <time datetime="{{ segment.sort_date | escape }}">{{ segment.date | escape }}</time>
            <div class="trip-flight__route">
              <span class="trip-flight__airport" title="{{ from_location.name | escape }}">
                <strong>{{ segment.from_code | escape }}</strong>
                <span class="trip-flight__city">{{ from_location.city | default: segment.from_code | escape }}</span>
                <span class="trip-flight__location-name">{{ from_location.name | escape }}</span>
                <small>{{ segment.from_time | escape }}</small>
              </span>
              <i aria-hidden="true">
                {% if segment.duration %}<span>{{ segment.duration | escape }}</span>{% endif %}
              </i>
              <span class="trip-flight__airport" title="{{ to_location.name | escape }}">
                <strong>{{ segment.to_code | escape }}</strong>
                <span class="trip-flight__city">{{ to_location.city | default: segment.to_code | escape }}</span>
                <span class="trip-flight__location-name">{{ to_location.name | escape }}</span>
                {% if segment.to_time %}<small>{{ segment.to_time | escape }}</small>{% endif %}
              </span>
            </div>
            <div class="trip-flight__meta">
              <span class="trip-mode trip-mode--{{ segment.mode | escape }}">{% if segment.mode == 'train' %}Train{% else %}Bus{% endif %}</span>
              <strong>{{ segment.operator | escape }}</strong>
              <small>{{ segment.service | escape }}{% if segment.note %} · {{ segment.note | escape }}{% endif %}</small>
            </div>
          </article>
        {% endfor %}
      </div>
      <div class="trip-detail-search-empty" id="trip-detail-search-empty" hidden>
        <strong>No matching routes</strong>
        <span>Try a city, airport code, airport name, station code, or station name.</span>
      </div>
    {% else %}
      <div class="flight-archive-ledger__empty">
        <p>Recorded journeys</p>
        <h2>No transport details yet.</h2>
        <span>A flight, train, or bus will appear here once its route and travel date are known.</span>
      </div>
    {% endif %}
  </section>

  <footer class="trip-detail__footer">
    <a href="{{ '/life/travel/' | relative_url }}" target="_self">← Back to My Travel</a>
  </footer>
</article>

<script>
  (() => {
    const page = document.querySelector('.flight-archive-page');
    const list = document.getElementById('trip-detail-list');
    const search = document.getElementById('trip-detail-search');
    const status = document.getElementById('trip-detail-search-status');
    const empty = document.getElementById('trip-detail-search-empty');
    if (!page || !list) return;
    const routes = [...list.querySelectorAll('.trip-flight')];
    routes
      .sort((a, b) => b.dataset.sortDate.localeCompare(a.dataset.sortDate))
      .forEach((item) => list.appendChild(item));

    let activeMode = 'all';
    const normalize = (value) => value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase()
      .trim();

    const applyFilters = () => {
      const query = normalize(search?.value || '');
      let visible = 0;
      routes.forEach((item) => {
        const matchesMode = activeMode === 'all' || item.dataset.mode === activeMode;
        const matchesQuery = !query || normalize(item.dataset.search || item.textContent).includes(query);
        item.hidden = !(matchesMode && matchesQuery);
        if (!item.hidden) visible += 1;
      });
      page.querySelectorAll('.trip-flight__airport strong, .trip-flight__city, .trip-flight__location-name').forEach((element) => {
        const original = element.dataset.originalText || element.textContent;
        element.dataset.originalText = original;
        element.replaceChildren(document.createTextNode(original));
        if (!query) return;
        const originalLower = original.toLocaleLowerCase();
        const queryLower = (search?.value || '').toLocaleLowerCase().trim();
        if (!queryLower) return;
        let cursor = 0;
        let matchIndex = originalLower.indexOf(queryLower, cursor);
        if (matchIndex < 0) return;
        const fragment = document.createDocumentFragment();
        while (matchIndex >= 0) {
          if (matchIndex > cursor) fragment.append(document.createTextNode(original.slice(cursor, matchIndex)));
          const mark = document.createElement('mark');
          mark.className = 'trip-search-highlight';
          mark.textContent = original.slice(matchIndex, matchIndex + queryLower.length);
          fragment.append(mark);
          cursor = matchIndex + queryLower.length;
          matchIndex = originalLower.indexOf(queryLower, cursor);
        }
        if (cursor < original.length) fragment.append(document.createTextNode(original.slice(cursor)));
        element.replaceChildren(fragment);
      });
      if (empty) empty.hidden = visible !== 0;
      if (status) status.textContent = query ? `${visible} matching route${visible === 1 ? '' : 's'}` : '';
    };

    page.querySelectorAll('[data-trip-mode]').forEach((button) => {
      button.addEventListener('click', () => {
        activeMode = button.dataset.tripMode;
        page.querySelectorAll('[data-trip-mode]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
        applyFilters();
      });
    });

    search?.addEventListener('input', applyFilters);
    applyFilters();
  })();
</script>
