---
layout: default
permalink: /life/travel/flights/
title: "Flight Archive"
excerpt: "Every recorded flight segment, gathered from completed journeys."
author_profile: false
---

{% assign travel_trips = site.trips | sort: "start_date" | reverse %}
{% assign flight_count = 0 %}
{% for trip in travel_trips %}
  {% if trip.flights %}
    {% assign flight_count = flight_count | plus: trip.flights.size %}
  {% endif %}
{% endfor %}

<article class="flight-archive-page">
  <a class="life-section__back" href="{{ '/life/travel/' | relative_url }}" target="_self"><span aria-hidden="true">←</span> My Travel</a>

  <header class="flight-archive-page__hero">
    <div>
      <p>Route ledger</p>
      <h1>Previous Flights</h1>
      <span>Every recorded flight segment, grouped by the journey it belonged to.</span>
    </div>
    <div class="flight-archive-page__count">
      <strong>{{ flight_count }}</strong>
      <span>Segments</span>
    </div>
  </header>

  <div class="flight-archive-page__list" aria-label="All recorded flights">
    {% for trip in travel_trips %}
      {% if trip.flights and trip.flights.size > 0 %}
        <section class="flight-archive-group" aria-labelledby="flight-group-{{ forloop.index }}">
          <header class="flight-archive-group__header">
            <div>
              <p>{{ trip.season | default: trip.year | escape }}</p>
              <h2 id="flight-group-{{ forloop.index }}">{{ trip.title | escape }}</h2>
              <span>{{ trip.date_label | escape }}</span>
            </div>
            <a href="{{ trip.url | relative_url }}" target="_self">View trip <span aria-hidden="true">→</span></a>
          </header>

          <div class="flight-archive-group__body">
            {% for flight in trip.flights %}
              <article class="trip-flight">
                <time>{{ flight.date | escape }}</time>
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
                  <strong>{{ flight.carrier | default: "Carrier not recorded" | escape }}</strong>
                  <small>{% if flight.flight_number %}{{ flight.flight_number | escape }}{% else %}Flight number pending{% endif %}{% if flight.note %} · {{ flight.note | escape }}{% endif %}</small>
                </div>
              </article>
            {% endfor %}
          </div>
        </section>
      {% endif %}
    {% endfor %}
  </div>

  <footer class="trip-detail__footer">
    <a href="{{ '/life/travel/' | relative_url }}" target="_self">← Back to My Travel</a>
  </footer>
</article>
