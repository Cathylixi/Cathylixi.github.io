---
layout: default
permalink: /life/travel/flights/
title: "All Trip Details"
excerpt: "Flights, trains, and buses in one chronological route ledger."
author_profile: false
---

{% assign verified_flights = site.data.travel_flights | where_exp: "flight", "flight.flight_number" %}
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

  <nav class="trip-detail-filters" aria-label="Filter trip details">
    <button type="button" data-trip-mode="all" aria-pressed="true">All</button>
    <button type="button" data-trip-mode="flight" aria-pressed="false">Flights</button>
    <button type="button" data-trip-mode="train" aria-pressed="false">Trains</button>
    <button type="button" data-trip-mode="bus" aria-pressed="false">Buses</button>
  </nav>

  <section class="flight-archive-ledger" aria-label="All recorded transport, newest first">
    {% if segment_count > 0 %}
      <header class="flight-archive-ledger__columns" aria-hidden="true">
        <span>Date</span>
        <span>Route</span>
        <span>Transport</span>
      </header>
      <div class="flight-archive-ledger__body" id="trip-detail-list">
        {% for flight in verified_flights %}
          <article class="trip-flight" data-mode="flight" data-sort-date="{{ flight.sort_date | escape }}">
            <time datetime="{{ flight.sort_date | escape }}">{{ flight.date | escape }}</time>
            <div class="trip-flight__route">
              <span class="trip-flight__airport">
                <strong>{{ flight.from_code | escape }}</strong>
                <small>{{ flight.from_time | default: flight.from_city | escape }}</small>
              </span>
              <i aria-hidden="true"></i>
              <span class="trip-flight__airport">
                <strong>{{ flight.to_code | escape }}</strong>
                <small>{{ flight.to_time | default: flight.to_city | escape }}</small>
              </span>
            </div>
            <div class="trip-flight__meta">
              <span class="trip-mode trip-mode--flight">Flight</span>
              <strong>{{ flight.carrier | escape }}</strong>
              <small>
                {{ flight.flight_number | escape }}
                {% if flight.duration %} · {{ flight.duration | escape }}{% endif %}
                {% if flight.cabin %} · {{ flight.cabin | escape }}{% endif %}
                {% if flight.seat %} · Seat {{ flight.seat | escape }}{% endif %}
                {% if flight.note %} · {{ flight.note | escape }}{% endif %}
              </small>
            </div>
          </article>
        {% endfor %}
        {% for segment in ground_journeys %}
          <article class="trip-flight" data-mode="{{ segment.mode | escape }}" data-sort-date="{{ segment.sort_date | escape }}">
            <time datetime="{{ segment.sort_date | escape }}">{{ segment.date | escape }}</time>
            <div class="trip-flight__route">
              <span class="trip-flight__airport">
                <strong>{{ segment.from_code | escape }}</strong>
                <small>{{ segment.from_time | escape }}</small>
              </span>
              <i aria-hidden="true"></i>
              <span class="trip-flight__airport">
                <strong>{{ segment.to_code | escape }}</strong>
                <small>{{ segment.to_time | escape }}</small>
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
    if (!page || !list) return;
    [...list.children]
      .sort((a, b) => b.dataset.sortDate.localeCompare(a.dataset.sortDate))
      .forEach((item) => list.appendChild(item));

    page.querySelectorAll('[data-trip-mode]').forEach((button) => {
      button.addEventListener('click', () => {
        const mode = button.dataset.tripMode;
        page.querySelectorAll('[data-trip-mode]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
        [...list.children].forEach((item) => { item.hidden = mode !== 'all' && item.dataset.mode !== mode; });
      });
    });
  })();
</script>
