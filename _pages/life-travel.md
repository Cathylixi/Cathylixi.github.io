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
{% assign travel_segment_count = site.data.travel_flights.size | plus: site.data.travel_ground.size %}

<article class="travel-page">
  <a class="life-section__back travel-page__back" href="{{ '/life/' | relative_url }}" target="_self"><span aria-hidden="true">←</span> My Life</a>

  <header class="travel-hero">
    <div>
      <p class="travel-eyebrow">Personal atlas</p>
      <h1>My Travel</h1>
      <p class="travel-intro">A map of the places I have lived in, passed through, and still remember.</p>
    </div>
    <dl class="travel-stats" aria-label="Travel summary">
      <div><dt>{{ travel_segment_count }}</dt><dd>Segments</dd></div>
      <div><dt>{{ travel_places.size }}</dt><dd>Places</dd></div>
      <div><dt>{{ travel_homes.size }}</dt><dd>Homes</dd></div>
    </dl>
  </header>

  <div class="travel-toolbar">
    <div class="travel-filter-stack">
      <div class="travel-filters" role="group" aria-label="Filter places">
        <button type="button" data-travel-filter="all" aria-pressed="true">All places</button>
        <button type="button" data-travel-filter="lived" aria-pressed="false">Lived</button>
        <button type="button" data-travel-filter="visited" aria-pressed="false">Visited</button>
      </div>
      <div class="travel-filters travel-filters--modes" role="group" aria-label="Filter transport routes">
        <button type="button" data-route-filter="all" aria-pressed="true">All routes</button>
        <button type="button" data-route-filter="flight" aria-pressed="false">Flights</button>
        <button type="button" data-route-filter="train" aria-pressed="false">Trains</button>
        <button type="button" data-route-filter="bus" aria-pressed="false">Buses</button>
      </div>
    </div>
    <div class="travel-legend" aria-label="Map legend">
      <span><i class="travel-legend__dot travel-legend__dot--lived" aria-hidden="true"></i>Lived</span>
      <span><i class="travel-legend__dot travel-legend__dot--visited" aria-hidden="true"></i>Visited</span>
      <span><i class="travel-legend__route travel-legend__route--flight" aria-hidden="true"></i>Flight</span>
      <span><i class="travel-legend__route travel-legend__route--train" aria-hidden="true"></i>Train</span>
      <span><i class="travel-legend__route travel-legend__route--bus" aria-hidden="true"></i>Bus</span>
    </div>
  </div>

  <section class="travel-map-shell" aria-label="Interactive world travel map">
    <div class="travel-map-wrap">
      <header class="travel-map-head">
        <div>
          <p>Places &amp; routes</p>
          <h2>Travel atlas</h2>
        </div>
        <a href="{{ '/life/travel/flights/' | relative_url }}" target="_self">View all trip details <span aria-hidden="true">→</span></a>
      </header>
      <div class="travel-map-controls" aria-label="Map controls">
        <button type="button" data-map-action="zoom-in" aria-label="Zoom in">+</button>
        <button type="button" data-map-action="zoom-out" aria-label="Zoom out">−</button>
        <button type="button" data-map-action="reset" aria-label="Reset map">⌂</button>
        <button type="button" data-map-action="expand" aria-label="Expand map" aria-pressed="false">↗</button>
      </div>
      <svg class="travel-map" id="travel-map" role="img" aria-labelledby="travel-map-title travel-map-description">
        <title id="travel-map-title">World map of travel places</title>
        <desc id="travel-map-description">Flights, Amtrak trains, and FlixBus journeys connect small location markers. Zoom, pan, or select a route to read its details.</desc>
      </svg>
      <aside class="travel-connection" id="travel-connection" hidden>
        <button type="button" class="travel-connection__close" aria-label="Close route details">×</button>
        <p id="travel-connection-mode">Route</p>
        <h3 id="travel-connection-title">Recorded connection</h3>
        <div id="travel-connection-list"></div>
        <a href="{{ '/life/travel/flights/' | relative_url }}" target="_self">View all trip details →</a>
      </aside>
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
<script type="application/json" id="travel-ground-data">{{ site.data.travel_ground | jsonify }}</script>
<script type="application/json" id="travel-hub-data">{{ site.data.travel_hubs | jsonify }}</script>
<script type="module">
  import { geoNaturalEarth1, geoPath, geoGraticule10 } from "https://esm.sh/d3-geo@3.1.1";
  import { select } from "https://esm.sh/d3-selection@3.0.0";
  import { zoom, zoomIdentity } from "https://esm.sh/d3-zoom@3.0.0";
  import { feature } from "https://esm.sh/topojson-client@3.1.0";
  import world from "https://esm.sh/@d3-maps/atlas@1.0.0/world/countries/countries-110m";

  const root = document.querySelector(".travel-page");
  const places = JSON.parse(document.getElementById("travel-place-data").textContent);
  const flights = JSON.parse(document.getElementById("travel-flight-data").textContent);
  const airports = JSON.parse(document.getElementById("travel-airport-data").textContent);
  const ground = JSON.parse(document.getElementById("travel-ground-data").textContent);
  const hubs = JSON.parse(document.getElementById("travel-hub-data").textContent);
  const svgElement = document.getElementById("travel-map");
  const mapWrap = root.querySelector(".travel-map-wrap");
  const mapShell = root.querySelector(".travel-map-shell");
  const mapStatus = document.getElementById("travel-map-status");
  const connectionPanel = document.getElementById("travel-connection");
  let selectedId = places.length ? places[0].id : null;
  let activeFilter = "all";
  let activeRouteFilter = "all";
  let mapFeatures = [];
  let currentTransform = zoomIdentity;
  let viewport;

  const modeNames = { flight: "Flight", train: "Train", bus: "Bus" };

  const flightSegments = flights.flatMap((flight, index) => {
    const from = airports[flight.from_code];
    const to = airports[flight.to_code];
    if (!from || !to) return [];
    return [{
      ...flight,
      id: `flight-${index}`,
      mode: "flight",
      operator: flight.carrier,
      service: flight.flight_number,
      from_key: `airport-${flight.from_code}`,
      to_key: `airport-${flight.to_code}`,
      from_coord: from,
      to_coord: to
    }];
  });

  const groundSegments = ground.flatMap((segment) => {
    const from = hubs[segment.from_id];
    const to = hubs[segment.to_id];
    if (!from || !to) return [];
    return [{
      ...segment,
      from_key: `hub-${segment.from_id}`,
      to_key: `hub-${segment.to_id}`,
      from_coord: [Number(from.longitude), Number(from.latitude)],
      to_coord: [Number(to.longitude), Number(to.latitude)]
    }];
  });

  const allSegments = [...flightSegments, ...groundSegments];

  const routeGroups = Array.from(allSegments.reduce((groups, segment) => {
    const endpoints = [segment.from_key, segment.to_key].sort();
    const key = `${segment.mode}:${endpoints.join("-")}`;
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        mode: segment.mode,
        from: segment.from_code,
        to: segment.to_code,
        geometry: { type: "LineString", coordinates: [segment.from_coord, segment.to_coord] },
        segments: []
      });
    }
    groups.get(key).segments.push(segment);
    return groups;
  }, new Map()).values());

  const endpointLocations = Array.from(allSegments.reduce((locations, segment) => {
    [
      { key: segment.from_key, code: segment.from_code, coord: segment.from_coord, mode: segment.mode },
      { key: segment.to_key, code: segment.to_code, coord: segment.to_coord, mode: segment.mode }
    ].forEach((point) => {
      if (!locations.has(point.key)) locations.set(point.key, { ...point, modes: new Set() });
      locations.get(point.key).modes.add(segment.mode);
    });
    return locations;
  }, new Map()).values()).map((location) => ({ ...location, modes: [...location.modes] }));

  function visiblePlaces() {
    return activeFilter === "all" ? places : places.filter((place) => place.kind === activeFilter);
  }

  function visibleRoutes() {
    return activeRouteFilter === "all" ? routeGroups : routeGroups.filter((route) => route.mode === activeRouteFilter);
  }

  function showRouteDetail(route) {
    const records = [...route.segments].sort((a, b) => String(b.sort_date).localeCompare(String(a.sort_date)));
    document.getElementById("travel-connection-mode").textContent = `${modeNames[route.mode]} route · ${records.length} recorded ${records.length === 1 ? "journey" : "journeys"}`;
    document.getElementById("travel-connection-title").textContent = `${route.from} → ${route.to}`;
    document.getElementById("travel-connection-list").innerHTML = records.slice(0, 5).map((record) => {
      const service = [record.operator, record.service].filter(Boolean).join(" · ");
      const times = [record.from_time, record.to_time].filter(Boolean).join(" → ");
      return `<p><strong>${record.date || record.sort_date}</strong><span>${service}${times ? ` · ${times}` : ""}</span></p>`;
    }).join("");
    connectionPanel.hidden = false;
    root.querySelectorAll(".travel-map__route").forEach((path) => path.classList.toggle("is-selected", path.dataset.key === route.key));
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
    viewport = svg.append("g").attr("class", "travel-map__rendered").attr("transform", currentTransform);
    viewport.append("path").datum(geoGraticule10()).attr("class", "travel-map__graticule").attr("d", path);
    viewport.selectAll("path.travel-map__country").data(mapFeatures).join("path").attr("class", "travel-map__country").attr("d", path);

    const routes = viewport.append("g").attr("class", "travel-map__routes");
    routes.selectAll("path.travel-map__route")
      .data(visibleRoutes(), (route) => route.key)
      .join("path")
      .attr("class", (route) => `travel-map__route travel-map__route--${route.mode}`)
      .attr("data-key", (route) => route.key)
      .attr("d", (route) => path(route.geometry))
      .append("title")
      .text((route) => `${modeNames[route.mode]} · ${route.from} → ${route.to} · ${route.segments.length} recorded`);

    root.querySelectorAll(".travel-map__route").forEach((routePath) => {
      const hitPath = routePath.cloneNode(false);
      const route = routePath.__data__;
      hitPath.__data__ = route;
      hitPath.setAttribute("class", "travel-map__route-hit");
      hitPath.setAttribute("tabindex", "0");
      hitPath.setAttribute("role", "button");
      hitPath.setAttribute("aria-label", `${modeNames[route.mode]} · ${route.from} to ${route.to} · ${route.segments.length} recorded`);
      routePath.parentNode.insertBefore(hitPath, routePath);
      hitPath.addEventListener("click", (event) => {
        event.stopPropagation();
        showRouteDetail(route);
      });
      hitPath.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          showRouteDetail(route);
        }
      });
    });

    const hubMarkers = viewport.append("g").attr("class", "travel-hub-markers")
      .selectAll("g.travel-hub-marker")
      .data(endpointLocations.filter((location) => activeRouteFilter === "all" || location.modes.includes(activeRouteFilter)), (location) => location.key)
      .join("g")
      .attr("class", "travel-hub-marker")
      .attr("data-mode", (location) => location.modes[0])
      .attr("transform", (location) => {
        const point = projection(location.coord);
        return `translate(${point[0]},${point[1]})`;
      });
    hubMarkers.append("circle").attr("r", 2.6);
    hubMarkers.append("title").text((location) => `${location.code} · ${location.modes.map((mode) => modeNames[mode]).join(", ")}`);

    const markers = viewport.selectAll("g.travel-marker").data(visiblePlaces(), (place) => place.id).join("g")
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
    root.querySelectorAll(".travel-marker").forEach((marker) => {
      marker.addEventListener("click", () => updateDetail(marker.__data__.id));
      marker.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          updateDetail(marker.__data__.id);
        }
      });
    });
    mapStatus.hidden = true;
  }

  const zoomBehavior = zoom().scaleExtent([1, 9]).on("zoom", (event) => {
    currentTransform = event.transform;
    if (viewport) viewport.attr("transform", currentTransform);
  });
  select(svgElement).call(zoomBehavior).on("dblclick.zoom", null);

  function zoomFromCenter(multiplier) {
    const height = Number(svgElement.getAttribute("height")) || 420;
    const center = [mapWrap.clientWidth / 2, height / 2];
    const nextScale = Math.max(1, Math.min(9, currentTransform.k * multiplier));
    const ratio = nextScale / currentTransform.k;
    const nextTransform = zoomIdentity
      .translate(
        center[0] - (center[0] - currentTransform.x) * ratio,
        center[1] - (center[1] - currentTransform.y) * ratio
      )
      .scale(nextScale);

    currentTransform = nextTransform;
    svgElement.__zoom = nextTransform;
    if (viewport) viewport.attr("transform", nextTransform);
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

  root.querySelectorAll("[data-route-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      activeRouteFilter = button.dataset.routeFilter;
      root.querySelectorAll("[data-route-filter]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      connectionPanel.hidden = true;
      drawMap();
    });
  });

  root.querySelector(".travel-connection__close").addEventListener("click", () => {
    connectionPanel.hidden = true;
    root.querySelectorAll(".travel-map__route").forEach((path) => path.classList.remove("is-selected"));
  });

  root.querySelectorAll("[data-map-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const svg = select(svgElement);
      const action = button.dataset.mapAction;
      if (action === "zoom-in") zoomFromCenter(1.45);
      if (action === "zoom-out") zoomFromCenter(1 / 1.45);
      if (action === "reset") {
        currentTransform = zoomIdentity;
        svgElement.__zoom = zoomIdentity;
        if (viewport) viewport.attr("transform", zoomIdentity);
      }
      if (action === "expand") {
        const expanded = mapShell.classList.toggle("is-expanded");
        document.body.classList.toggle("travel-map-open", expanded);
        button.setAttribute("aria-pressed", String(expanded));
        button.textContent = expanded ? "×" : "↗";
        setTimeout(drawMap, 50);
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mapShell.classList.contains("is-expanded")) {
      const button = root.querySelector('[data-map-action="expand"]');
      mapShell.classList.remove("is-expanded");
      document.body.classList.remove("travel-map-open");
      button.setAttribute("aria-pressed", "false");
      button.textContent = "↗";
      setTimeout(drawMap, 50);
    }
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
