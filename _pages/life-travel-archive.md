---
layout: default
permalink: /life/travel/archive/
title: "Journey Archive"
excerpt: "All completed journeys in one place."
author_profile: false
---

{% assign travel_trips = site.trips | sort: "start_date" | reverse %}

<article class="trip-archive-page">
  <a class="life-section__back" href="{{ '/life/travel/' | relative_url }}" target="_self"><span aria-hidden="true">←</span> My Travel</a>

  <header class="trip-archive-page__hero">
    <div>
      <p>Completed journeys</p>
      <h1>Journey Archive</h1>
      <span>Journeys arranged from the most recent record backward.</span>
    </div>
    <strong>{{ travel_trips.size }}</strong>
  </header>

  <div class="trip-archive-page__list" aria-label="All completed trips">
    {% for trip in travel_trips %}
      <a class="trip-archive-card" href="{{ trip.url | relative_url }}" target="_self">
        <span class="trip-archive-card__number" aria-hidden="true">{{ forloop.index }}</span>
        <span class="trip-archive-card__copy">
          <small>{{ trip.season | escape }}</small>
          <strong>{{ trip.title | escape }}</strong>
          <span>{{ trip.summary | escape }}</span>
        </span>
        <span class="trip-archive-card__meta">
          <b>{{ trip.date_label | escape }}</b>
          <small>{% if trip.days %}{{ trip.days }} days · {% endif %}{{ trip.route.size }} stops</small>
        </span>
        <i aria-hidden="true">→</i>
      </a>
    {% endfor %}
  </div>

  <footer class="trip-detail__footer">
    <a href="{{ '/life/travel/' | relative_url }}" target="_self">← Back to My Travel</a>
  </footer>
</article>
