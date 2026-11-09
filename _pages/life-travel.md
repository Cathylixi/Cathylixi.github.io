---
layout: default
permalink: /life/travel/
title: "My Travel"
excerpt: "A map of the places I have lived in, passed through, and still remember."
author_profile: false
---

{% assign travel_places = site.data.travel_places %}
{% assign travel_countries = travel_places | map: "country" | uniq %}
{% assign travel_homes = travel_places | where: "kind", "lived" %}
{% assign travel_trips = site.trips | sort: "start_date" | reverse %}

<article class="travel-page">
  <a class="life-section__back travel-page__back" href="{{ '/life/' | relative_url }}" target="_self"><span aria-hidden="true">←</span> My Life</a>

  <header class="travel-hero">
    <div>
      <p class="travel-eyebrow">Personal atlas</p>
      <h1>My Travel</h1>
      <p class="travel-intro">A map of the places I have lived in, passed through, and still remember.</p>
    </div>
    <dl class="travel-stats" aria-label="Travel summary">
      <div><dt>{{ travel_trips.size }}</dt><dd>Trips</dd></div>
      <div><dt>{{ travel_places.size }}</dt><dd>Places</dd></div>
      <div><dt>{{ travel_homes.size }}</dt><dd>Homes</dd></div>
    </dl>
  </header>

  <div class="travel-toolbar">
    <div class="travel-filters" role="group" aria-label="Filter places">
      <button type="button" data-travel-filter="all" aria-pressed="true">All places</button>
      <button type="button" data-travel-filter="lived" aria-pressed="false">Lived</button>
      <button type="button" data-travel-filter="visited" aria-pressed="false">Visited</button>
    </div>
    <div class="travel-legend" aria-label="Map legend">
      <span><i class="travel-legend__dot travel-legend__dot--lived" aria-hidden="true"></i>Lived</span>
      <span><i class="travel-legend__dot travel-legend__dot--visited" aria-hidden="true"></i>Visited</span>
      <span><i class="travel-legend__route" aria-hidden="true"></i>Flights</span>
    </div>
  </div>

  <section class="travel-map-shell" aria-label="Interactive world travel map">
    <div class="travel-map-wrap">
      <header class="travel-map-head">
        <div>
          <p>Places &amp; routes</p>
          <h2>Travel atlas</h2>
        </div>
        <a href="{{ '/life/travel/flights/' | relative_url }}" target="_self">View all previous flights <span aria-hidden="true">→</span></a>
      </header>
      <svg class="travel-map" id="travel-map" role="img" aria-labelledby="travel-map-title travel-map-description">
        <title id="travel-map-title">World map of travel places</title>
        <desc id="travel-map-description">Recorded flight routes connect airports across the world. Select a colored location marker to read the place and its travel note.</desc>
      </svg>
      <p class="travel-map__status" id="travel-map-status" aria-live="polite">Loading map…</p>
    </div>

    <aside class="travel-place" aria-live="polite">
      <p class="travel-place__kind" id="travel-place-kind">Lived here</p>
      <h2 id="travel-place-name">{{ travel_places.first.city | escape }}</h2>
      <p class="travel-place__country" id="travel-place-country">{{ travel_places.first.country | escape }} · {{ travel_places.first.years | escape }}</p>
      <span class="travel-place__rule" aria-hidden="true"></span>
      <p class="travel-place__note" id="travel-place-note">{{ travel_places.first.note | escape }}</p>
      <div class="travel-place__memory"><i class="fas fa-camera" aria-hidden="true"></i><span id="travel-place-memory">{{ travel_places.first.memory | escape }}</span></div>
    </aside>
  </section>

  <div class="travel-bottom-grid" id="travel-archive">
    <section class="travel-archive" aria-labelledby="travel-archive-title">
      <header class="travel-archive__header">
        <div>
          <p>Completed journeys</p>
          <h2 id="travel-archive-title">Journey archive</h2>
        </div>
        <a href="{{ '/life/travel/archive/' | relative_url }}" target="_self">View all <span aria-hidden="true">→</span></a>
      </header>
      <div class="travel-archive__list">
        {% for trip in travel_trips limit: 3 %}
          <a class="travel-archive__item" href="{{ trip.url | relative_url }}" target="_self">
            <span class="travel-archive__icon" aria-hidden="true">{{ forloop.index }}</span>
            <span class="travel-archive__copy">
              <strong>{{ trip.title | escape }}</strong>
              <small>{{ trip.date_label | escape }} · {{ trip.days }} days</small>
            </span>
            <span class="travel-archive__arrow" aria-hidden="true">→</span>
          </a>
        {% endfor %}
      </div>
    </section>

    <aside class="travel-upcoming" aria-labelledby="travel-upcoming-title">
      <div>
        <p>Upcoming</p>
        <h2 id="travel-upcoming-title">Next journey</h2>
        <span>No upcoming journey yet. Plans from Notion will appear here.</span>
      </div>
      <div class="travel-upcoming__footer">
        <small>Private preview</small>
        <span class="travel-upcoming__arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="M5 12h13M13 7l5 5-5 5"></path>
          </svg>
        </span>
      </div>
    </aside>
  </div>

  <footer class="travel-page__footer">
    <a class="life-section__back" href="{{ '/life/' | relative_url }}" target="_self"><span aria-hidden="true">←</span> Back to My Life</a>
  </footer>
</article>

<script type="application/json" id="travel-place-data">{{ travel_places | jsonify }}</script>
<script type="application/json" id="travel-flight-data">{{ site.data.travel_flights | jsonify }}</script>
<script type="application/json" id="travel-airport-data">{{ site.data.travel_airports | jsonify }}</script>
<script type="module">
  import { geoNaturalEarth1, geoPath, geoGraticule10 } from "https://esm.sh/d3-geo@3.1.1";
  import { select } from "https://esm.sh/d3-selection@3.0.0";
  import { feature } from "https://esm.sh/topojson-client@3.1.0";
  import world from "https://esm.sh/@d3-maps/atlas@1.0.0/world/countries/countries-110m";

  const root = document.querySelector(".travel-page");
  const places = JSON.parse(document.getElementById("travel-place-data").textContent);
  const flights = JSON.parse(document.getElementById("travel-flight-data").textContent);
  const airports = JSON.parse(document.getElementById("travel-airport-data").textContent);
  const svgElement = document.getElementById("travel-map");
  const mapWrap = root.querySelector(".travel-map-wrap");
  const mapStatus = document.getElementById("travel-map-status");
  let selectedId = places.length ? places[0].id : null;
  let activeFilter = "all";
  let mapFeatures = [];

  const recordedRoutes = Array.from(flights.reduce((routes, flight) => {
    const from = airports[flight.from_code];
    const to = airports[flight.to_code];
    if (!from || !to) return routes;

    const key = [flight.from_code, flight.to_code].sort().join("-");
    if (!routes.has(key)) {
      routes.set(key, {
        key,
        from: flight.from_code,
        to: flight.to_code,
        geometry: { type: "LineString", coordinates: [from, to] }
      });
    }
    return routes;
  }, new Map()).values());

  function visiblePlaces() {
    return activeFilter === "all" ? places : places.filter((place) => place.kind === activeFilter);
  }

  function updateDetail(id) {
    const place = places.find((entry) => entry.id === id);
    if (!place) return;
    selectedId = id;
    document.getElementById("travel-place-kind").textContent = place.kind === "lived" ? "Lived here" : "Visited";
    document.getElementById("travel-place-name").textContent = place.city;
    document.getElementById("travel-place-country").textContent = `${place.country} · ${place.years}`;
    document.getElementById("travel-place-note").textContent = place.note;
    document.getElementById("travel-place-memory").textContent = place.memory;
    root.querySelectorAll(".travel-marker").forEach((marker) => marker.setAttribute("aria-pressed", String(marker.dataset.id === id)));
  }

  function drawMap() {
    if (!mapFeatures.length) return;
    const width = Math.max(320, mapWrap.clientWidth);
    const height = width < 600 ? 330 : Math.min(500, Math.max(420, width * 0.61));
    const svg = select(svgElement);
    svg.attr("viewBox", `0 0 ${width} ${height}`).attr("height", height);
    svg.selectAll("g.travel-map__rendered").remove();

    const projection = geoNaturalEarth1().fitExtent([[20, 22], [width - 20, height - 22]], { type: "Sphere" });
    const path = geoPath(projection);
    const layer = svg.append("g").attr("class", "travel-map__rendered");
    layer.append("path").datum(geoGraticule10()).attr("class", "travel-map__graticule").attr("d", path);
    layer.selectAll("path.travel-map__country").data(mapFeatures).join("path").attr("class", "travel-map__country").attr("d", path);

    const routes = layer.append("g").attr("class", "travel-map__routes");
    routes.selectAll("path.travel-map__route")
      .data(recordedRoutes, (route) => route.key)
      .join("path")
      .attr("class", "travel-map__route")
      .attr("d", (route) => path(route.geometry))
      .append("title")
      .text((route) => `${route.from} → ${route.to}`);

    const markers = layer.selectAll("g.travel-marker").data(visiblePlaces(), (place) => place.id).join("g")
      .attr("class", "travel-marker")
      .attr("data-kind", (place) => place.kind)
      .attr("data-id", (place) => place.id)
      .attr("role", "button")
      .attr("tabindex", 0)
      .attr("aria-label", (place) => `${place.city}, ${place.country}, ${place.kind === "lived" ? "lived here" : "visited"} ${place.years}`)
      .attr("aria-pressed", (place) => String(place.id === selectedId))
      .attr("transform", (place) => {
        const point = projection([Number(place.longitude), Number(place.latitude)]);
        return `translate(${point[0]},${point[1]})`;
      });

    markers.append("circle").attr("class", "travel-marker__hit").attr("r", 19);
    markers.append("circle").attr("class", "travel-marker__ring").attr("r", 10);
    markers.append("circle").attr("class", "travel-marker__core").attr("r", 5);
    markers.on("click", (_, place) => updateDetail(place.id));
    markers.on("keydown", (event, place) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        updateDetail(place.id);
      }
    });
    mapStatus.hidden = true;
  }

  root.querySelectorAll("[data-travel-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.travelFilter;
      root.querySelectorAll("[data-travel-filter]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      const filtered = visiblePlaces();
      if (filtered.length && !filtered.some((place) => place.id === selectedId)) updateDetail(filtered[0].id);
      drawMap();
      if (!filtered.length) {
        mapStatus.textContent = "No places in this category yet.";
        mapStatus.hidden = false;
      }
    });
  });

  try {
    mapFeatures = feature(world, world.objects.features).features;
    drawMap();
    updateDetail(selectedId);
    new ResizeObserver(drawMap).observe(mapWrap);
  } catch (error) {
    mapStatus.textContent = "The map could not be loaded.";
  }
</script>
