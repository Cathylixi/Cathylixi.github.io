---
layout: default
permalink: /life/travel/flights/
title: "Flight Archive"
excerpt: "Verified flights, arranged from the most recent journey backward."
author_profile: false
---

{% assign travel_trips = site.trips | sort: "start_date" | reverse %}
{% assign all_flights = "" | split: "" %}
{% for trip in travel_trips %}
  {% if trip.flights %}
    {% assign all_flights = all_flights | concat: trip.flights %}
  {% endif %}
{% endfor %}
{% assign verified_flights = all_flights | where_exp: "flight", "flight.flight_number" | sort: "sort_date" | reverse %}

<article class="flight-archive-page">
  <a class="life-section__back" href="{{ '/life/travel/' | relative_url }}" target="_self"><span aria-hidden="true">←</span> My Travel</a>

  <header class="flight-archive-page__hero">
    <div>
      <p>Route ledger</p>
      <h1>Previous Flights</h1>
      <span>Verified flights in one chronological record, newest first.</span>
    </div>
    <div class="flight-archive-page__count">
      <strong>{{ verified_flights.size }}</strong>
      <span>Segments</span>
    </div>
  </header>

  <section class="flight-archive-ledger" aria-label="Verified flights, newest first">
    {% if verified_flights.size > 0 %}
      <header class="flight-archive-ledger__columns" aria-hidden="true">
        <span>Date</span>
        <span>Route</span>
        <span>Flight</span>
      </header>
      <div class="flight-archive-ledger__body">
        {% for flight in verified_flights %}
          <article class="trip-flight">
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
              <strong>{{ flight.carrier | escape }}</strong>
              <small>{{ flight.flight_number | escape }}{% if flight.note %} · {{ flight.note | escape }}{% endif %}</small>
            </div>
          </article>
        {% endfor %}
      </div>
    {% else %}
      <div class="flight-archive-ledger__empty">
        <p>Verified records only</p>
        <h2>No numbered flights yet.</h2>
        <span>A flight will appear here after its exact flight number and travel date have been confirmed.</span>
      </div>
    {% endif %}
  </section>

  <footer class="trip-detail__footer">
    <a href="{{ '/life/travel/' | relative_url }}" target="_self">← Back to My Travel</a>
  </footer>
</article>
