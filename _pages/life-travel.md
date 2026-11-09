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
    <div class="travel-selectors" aria-label="Map filters">
      <label class="travel-selector">
        <span>Places</span>
        <select id="travel-place-filter" aria-label="Filter places">
          <option value="all">All places</option>
          <option value="lived">Lived</option>
          <option value="visited">Visited</option>
        </select>
      </label>
      <label class="travel-selector">
        <span>Routes</span>
        <select id="travel-route-filter" aria-label="Filter transport routes">
          <option value="all">All routes</option>
          <option value="flight">Flights</option>
          <option value="train">Trains</option>
          <option value="bus">Buses</option>
        </select>
      </label>
      <label class="travel-selector">
        <span>Year</span>
        <select id="travel-year-filter" aria-label="Filter routes by year">
          <option value="all">All years</option>
        </select>
      </label>
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
        <button type="button" data-map-action="reset" aria-label="Reset map">⌖</button>
        <button type="button" data-map-action="expand" aria-label="Expand map" aria-pressed="false">⛶</button>
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
      <div class="travel-map-tooltip" id="travel-map-tooltip" role="status" hidden></div>
      <div class="travel-map-scale" id="travel-map-scale" aria-hidden="true"><span></span><strong>2,000 km</strong></div>
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
  const cities = await fetch("{{ '/assets/data/travel-cities.json' | relative_url }}").then((response) => response.ok ? response.json() : []);
  const svgElement = document.getElementById("travel-map");
  const mapWrap = root.querySelector(".travel-map-wrap");
  const mapShell = root.querySelector(".travel-map-shell");
  const mapStatus = document.getElementById("travel-map-status");
  const connectionPanel = document.getElementById("travel-connection");
  const mapTooltip = document.getElementById("travel-map-tooltip");
  const scaleBar = document.getElementById("travel-map-scale");
  let selectedId = places.length ? places[0].id : null;
  let activeFilter = "all";
  let activeRouteFilter = "all";
  let activeYear = "all";
  let mapFeatures = [];
  let currentTransform = zoomIdentity;
  let viewport;
  let currentProjection;
  let endpointLayer;
  let cityLabelLayer;
  let selectedRouteKey = null;
  let cityLabelFrame = 0;
  const previousCityAnchors = new Map();
  const cityLabelCanvas = document.createElement("canvas");
  const cityLabelContext = cityLabelCanvas.getContext("2d");
  const cityRecords = cities.map((city) => ({
    key: `${String(city.n || "").toLowerCase().replace(/[^a-z0-9]+/g, "")}-${city.x}-${city.y}`,
    name: city.n,
    coord: [city.x, city.y],
    rank: Number(city.r),
    population: Number(city.p) || 0,
    capital: Boolean(city.c)
  }));

  const modeNames = { flight: "Flight", train: "Train", bus: "Bus" };
  const airportMeta = {
    ATL: ["Atlanta", "Hartsfield–Jackson Atlanta International Airport"],
    BOO: ["Bodø", "Bodø Airport"], BOS: ["Boston", "Boston Logan International Airport"],
    CDG: ["Paris", "Paris Charles de Gaulle Airport"], CTS: ["Sapporo", "New Chitose Airport"],
    DCA: ["Washington, D.C.", "Reagan National Airport"], EWR: ["Newark", "Newark Liberty International Airport"],
    FCO: ["Rome", "Rome Fiumicino Airport"], FLR: ["Florence", "Florence Airport"],
    HEL: ["Helsinki", "Helsinki Airport"], HKG: ["Hong Kong", "Hong Kong International Airport"],
    HNL: ["Honolulu", "Daniel K. Inouye International Airport"], IST: ["Istanbul", "Istanbul Airport"],
    ITO: ["Hilo", "Hilo International Airport"], KIX: ["Osaka", "Kansai International Airport"],
    KOA: ["Kona", "Kona International Airport"], LAS: ["Las Vegas", "Harry Reid International Airport"],
    LAX: ["Los Angeles", "Los Angeles International Airport"], MDW: ["Chicago", "Chicago Midway International Airport"],
    MIA: ["Miami", "Miami International Airport"], NKG: ["Nanjing", "Nanjing Lukou International Airport"],
    NRT: ["Tokyo", "Narita International Airport"], OSL: ["Oslo", "Oslo Airport"],
    PEK: ["Beijing", "Beijing Capital International Airport"], PHL: ["Philadelphia", "Philadelphia International Airport"],
    PHX: ["Phoenix", "Phoenix Sky Harbor International Airport"], SAN: ["San Diego", "San Diego International Airport"],
    SEA: ["Seattle", "Seattle–Tacoma International Airport"], SFO: ["San Francisco", "San Francisco International Airport"],
    SHA: ["Shanghai", "Shanghai Hongqiao International Airport"], SJC: ["San Jose", "San José Mineta International Airport"],
    SLC: ["Salt Lake City", "Salt Lake City International Airport"], STL: ["St. Louis", "St. Louis Lambert International Airport"],
    TFU: ["Chengdu", "Chengdu Tianfu International Airport"], TOS: ["Tromsø", "Tromsø Airport"],
    XMN: ["Xiamen", "Xiamen Gaoqi International Airport"], YTZ: ["Toronto", "Billy Bishop Toronto City Airport"]
  };

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
      from_name: airportMeta[flight.from_code]?.[1] || `${flight.from_code} Airport`,
      to_name: airportMeta[flight.to_code]?.[1] || `${flight.to_code} Airport`,
      from_city: flight.from_city || airportMeta[flight.from_code]?.[0] || flight.from_code,
      to_city: flight.to_city || airportMeta[flight.to_code]?.[0] || flight.to_code,
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
      from_name: from.name,
      to_name: to.name,
      from_city: from.city,
      to_city: to.city,
      from_key: `hub-${segment.from_id}`,
      to_key: `hub-${segment.to_id}`,
      from_coord: [Number(from.longitude), Number(from.latitude)],
      to_coord: [Number(to.longitude), Number(to.latitude)]
    }];
  });

  const allSegments = [...flightSegments, ...groundSegments];
  const yearFilter = document.getElementById("travel-year-filter");
  Array.from(new Set(allSegments.map((segment) => String(segment.sort_date || "").slice(0, 4)).filter(Boolean)))
    .sort((a, b) => b.localeCompare(a))
    .forEach((year) => yearFilter.add(new Option(year, year)));

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

  function endpointLocationsFor(routes) {
    return Array.from(routes.flatMap((route) => route.segments).reduce((locations, segment) => {
    [
      { key: segment.from_key, code: segment.from_code, coord: segment.from_coord, mode: segment.mode, city: segment.from_city, name: segment.from_name },
      { key: segment.to_key, code: segment.to_code, coord: segment.to_coord, mode: segment.mode, city: segment.to_city, name: segment.to_name }
    ].forEach((point) => {
      if (!locations.has(point.key)) locations.set(point.key, { ...point, modes: new Set() });
      locations.get(point.key).modes.add(segment.mode);
    });
      return locations;
    }, new Map()).values()).map((location) => ({ ...location, modes: [...location.modes] }));
  }

  function visiblePlaces() {
    return activeFilter === "all" ? places : places.filter((place) => place.kind === activeFilter);
  }

  function visibleRoutes() {
    return routeGroups.flatMap((route) => {
      if (activeRouteFilter !== "all" && route.mode !== activeRouteFilter) return [];
      const segments = activeYear === "all"
        ? route.segments
        : route.segments.filter((segment) => String(segment.sort_date || "").startsWith(activeYear));
      return segments.length ? [{ ...route, segments }] : [];
    });
  }

  function normaliseCityName(value) {
    return String(value || "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "");
  }

  function cityLabelTier(scale) {
    if (scale < 1.5) return { rank: 0, population: 7000000, limit: 8 };
    if (scale < 2.3) return { rank: 1, population: 5000000, limit: 10 };
    if (scale < 3.5) return { rank: 1, population: 4000000, limit: 12 };
    if (scale < 5) return { rank: 2, population: 3500000, limit: 14 };
    if (scale < 7) return { rank: 2, population: 3000000, limit: 16 };
    return { rank: 2, population: 2500000, limit: 18 };
  }

  function labelBox(point, width, height, anchor) {
    const gap = 7;
    const placements = [
      [point[0] + gap, point[1] - height / 2],
      [point[0] - gap - width, point[1] - height / 2],
      [point[0] - width / 2, point[1] - gap - height],
      [point[0] - width / 2, point[1] + gap],
      [point[0] + gap, point[1] - gap - height],
      [point[0] - gap - width, point[1] - gap - height],
      [point[0] + gap, point[1] + gap],
      [point[0] - gap - width, point[1] + gap]
    ];
    const [x, y] = placements[anchor] || placements[0];
    return { x1: x - 2, y1: y - 2, x2: x + width + 2, y2: y + height + 2, textX: x, textY: y + height * 0.78 };
  }

  function collisionGrid(cellSize = 56) {
    const cells = new Map();
    const cellKeys = (box) => {
      const keys = [];
      for (let x = Math.floor(box.x1 / cellSize); x <= Math.floor(box.x2 / cellSize); x += 1) {
        for (let y = Math.floor(box.y1 / cellSize); y <= Math.floor(box.y2 / cellSize); y += 1) keys.push(`${x}:${y}`);
      }
      return keys;
    };
    return {
      collides(box) {
        return cellKeys(box).some((key) => (cells.get(key) || []).some((other) => !(box.x2 < other.x1 || box.x1 > other.x2 || box.y2 < other.y1 || box.y1 > other.y2)));
      },
      add(box) {
        cellKeys(box).forEach((key) => {
          if (!cells.has(key)) cells.set(key, []);
          cells.get(key).push(box);
        });
      }
    };
  }

  function renderCityLabels() {
    if (!cityLabelLayer || !currentProjection) return;
    const width = Math.max(320, mapWrap.clientWidth);
    const height = Number(svgElement.getAttribute("height")) || 420;
    const scale = Math.max(1, currentTransform.k || 1);
    const tier = cityLabelTier(scale);
    const endpoints = endpointLocationsFor(visibleRoutes());
    const endpointNames = new Set(endpoints.map((endpoint) => normaliseCityName(endpoint.city)));
    const selectedRoute = visibleRoutes().find((route) => route.key === selectedRouteKey);
    const selectedEndpoints = selectedRoute ? selectedRoute.segments.flatMap((segment) => [
      { city: segment.from_city, coord: segment.from_coord },
      { city: segment.to_city, coord: segment.to_coord }
    ]) : [];
    const selectedNames = new Set(selectedEndpoints.map((endpoint) => normaliseCityName(endpoint.city)));
    const livedNames = new Set(places.filter((place) => place.kind === "lived").map((place) => normaliseCityName(place.city)));
    const source = cityRecords.slice();

    endpoints.forEach((endpoint) => {
      if (!source.some((city) => normaliseCityName(city.name) === normaliseCityName(endpoint.city) && Math.hypot(endpoint.coord[0] - city.coord[0], endpoint.coord[1] - city.coord[1]) < 4)) {
        source.push({ key: `route-${endpoint.key}`, name: endpoint.city, coord: endpoint.coord, rank: 9, population: 0, capital: false });
      }
    });

    const candidates = source.flatMap((city) => {
      const nameKey = normaliseCityName(city.name);
      const samePlace = (endpoint) => normaliseCityName(endpoint.city) === nameKey && Math.hypot(endpoint.coord[0] - city.coord[0], endpoint.coord[1] - city.coord[1]) < 4;
      const routeEndpoint = endpointNames.has(nameKey) && endpoints.some(samePlace);
      const selectedEndpoint = selectedNames.has(nameKey) && selectedEndpoints.some(samePlace);
      if (livedNames.has(nameKey) || (!selectedEndpoint && (city.rank > tier.rank || city.population < tier.population))) return [];
      const projected = currentProjection(city.coord);
      if (!projected) return [];
      const point = currentTransform.apply(projected);
      if (point[0] < -40 || point[0] > width + 40 || point[1] < -30 || point[1] > height + 30) return [];
      const priority = (selectedEndpoint ? 1000000 : 0) + (routeEndpoint ? 200000 : 0) + (city.capital ? 50000 : 0) + ((10 - city.rank) * 5000) + Math.log10(Math.max(10, city.population)) * 100;
      return [{ ...city, point, routeEndpoint, selectedEndpoint, priority }];
    }).sort((a, b) => b.priority - a.priority || a.name.localeCompare(b.name));

    const grid = collisionGrid(64);
    const placed = [];
    cityLabelContext.font = "600 11px Georgia, serif";

    places.filter((place) => place.kind === "lived").forEach((place) => {
      const projected = currentProjection([Number(place.longitude), Number(place.latitude)]);
      if (!projected) return;
      const point = currentTransform.apply(projected);
      const textWidth = cityLabelContext.measureText(place.city).width + 16;
      grid.add(labelBox(point, textWidth, 14, 0));
    });
    grid.add({ x1: 0, y1: height - 58, x2: 135, y2: height });
    grid.add({ x1: width - 170, y1: height - 58, x2: width, y2: height });

    candidates.some((city) => {
      const fontSize = city.selectedEndpoint || city.rank <= 1 ? 12 : city.routeEndpoint || city.rank <= 3 ? 11 : 10;
      cityLabelContext.font = `${city.rank <= 1 ? 700 : 600} ${fontSize}px Georgia, serif`;
      const textWidth = Math.ceil(cityLabelContext.measureText(city.name).width);
      const textHeight = fontSize + 2;
      const previous = previousCityAnchors.get(city.key);
      const anchors = previous == null ? [0, 1, 2, 3, 4, 5, 6, 7] : [previous, ...[0, 1, 2, 3, 4, 5, 6, 7].filter((anchor) => anchor !== previous)];
      let placement = null;
      let chosenAnchor = anchors[0];
      for (const anchor of anchors) {
        const box = labelBox(city.point, textWidth, textHeight, anchor);
        if (!grid.collides(box)) {
          placement = box;
          chosenAnchor = anchor;
          break;
        }
      }
      if (!placement && city.selectedEndpoint) placement = labelBox(city.point, textWidth, textHeight, chosenAnchor);
      if (placement) {
        grid.add(placement);
        previousCityAnchors.set(city.key, chosenAnchor);
        placed.push({ ...city, ...placement, fontSize });
      }
      return placed.length >= tier.limit;
    });

    cityLabelLayer.selectAll("text.travel-city-label")
      .data(placed, (city) => city.key)
      .join(
        (enter) => enter.append("text").attr("class", "travel-city-label").attr("opacity", 0),
        (update) => update,
        (exit) => exit.remove()
      )
      .attr("class", (city) => `travel-city-label${city.rank <= 1 ? " travel-city-label--major" : ""}${city.routeEndpoint ? " travel-city-label--route" : ""}`)
      .attr("x", (city) => city.textX)
      .attr("y", (city) => city.textY)
      .attr("font-size", (city) => city.fontSize)
      .attr("opacity", 1)
      .text((city) => city.name);
  }

  function scheduleCityLabels() {
    cancelAnimationFrame(cityLabelFrame);
    cityLabelFrame = requestAnimationFrame(renderCityLabels);
  }

  function showTooltip(html, event) {
    mapTooltip.innerHTML = html;
    mapTooltip.hidden = false;
    if (event) {
      const bounds = mapWrap.getBoundingClientRect();
      const left = Math.min(bounds.width - 190, Math.max(12, event.clientX - bounds.left + 14));
      const top = Math.min(bounds.height - 92, Math.max(76, event.clientY - bounds.top + 14));
      mapTooltip.style.left = `${left}px`;
      mapTooltip.style.top = `${top}px`;
    }
  }

  function hideTooltip() {
    mapTooltip.hidden = true;
  }

  function updateScaleBar() {
    if (!scaleBar) return;
    const width = Math.max(320, mapWrap.clientWidth);
    const kilometresPerPixel = 40075 / (width * Math.max(1, currentTransform.k));
    const candidates = [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000];
    const distance = candidates.reduce((best, value) => Math.abs(value / kilometresPerPixel - 76) < Math.abs(best / kilometresPerPixel - 76) ? value : best, candidates[0]);
    const barWidth = Math.max(34, Math.min(96, distance / kilometresPerPixel));
    scaleBar.querySelector("span").style.width = `${barWidth}px`;
    scaleBar.querySelector("strong").textContent = `${distance.toLocaleString()} km`;
  }

  function focusRoute(route) {
    if (!currentProjection) return;
    const first = currentProjection(route.geometry.coordinates[0]);
    const last = currentProjection(route.geometry.coordinates[1]);
    if (!first || !last) return;
    const width = Math.max(320, mapWrap.clientWidth);
    const height = Number(svgElement.getAttribute("height")) || 420;
    const dx = Math.max(24, Math.abs(last[0] - first[0]));
    const dy = Math.max(24, Math.abs(last[1] - first[1]));
    const scale = Math.max(1.55, Math.min(7, 0.72 / Math.max(dx / width, dy / height)));
    const centerX = (first[0] + last[0]) / 2;
    const centerY = (first[1] + last[1]) / 2;
    const nextTransform = zoomIdentity.translate(width / 2 - scale * centerX, height / 2 - scale * centerY).scale(scale);
    select(svgElement).call(zoomBehavior.transform, nextTransform);
  }

  function clusterEndpoints(locations) {
    if (!currentProjection) return [];
    const scale = Math.max(1, currentTransform.k || 1);
    const threshold = scale < 1.5 ? 20 / scale : scale < 2.7 ? 10 / scale : 0;
    const clusters = [];
    locations.forEach((location) => {
      const point = currentProjection(location.coord);
      if (!point) return;
      const nearby = threshold && clusters.find((cluster) => Math.hypot(cluster.point[0] - point[0], cluster.point[1] - point[1]) <= threshold);
      if (nearby) {
        nearby.members.push(location);
        nearby.point = [
          nearby.members.reduce((sum, member) => sum + currentProjection(member.coord)[0], 0) / nearby.members.length,
          nearby.members.reduce((sum, member) => sum + currentProjection(member.coord)[1], 0) / nearby.members.length
        ];
      } else {
        clusters.push({ key: location.key, point, members: [location] });
      }
    });
    return clusters;
  }

  function renderEndpointMarkers() {
    if (!endpointLayer || !currentProjection) return;
    const scale = Math.max(1, currentTransform.k || 1);
    const clusters = clusterEndpoints(endpointLocationsFor(visibleRoutes()));
    const markers = endpointLayer.selectAll("g.travel-hub-marker")
      .data(clusters, (cluster) => cluster.members.map((member) => member.key).join("-"))
      .join((enter) => {
        const marker = enter.append("g").attr("class", "travel-hub-marker").attr("tabindex", "0").attr("role", "button");
        marker.append("circle");
        marker.append("text").attr("class", "travel-hub-label");
        return marker;
      })
      .attr("data-mode", (cluster) => cluster.members[0].modes[0])
      .attr("aria-label", (cluster) => cluster.members.length > 1
        ? `${cluster.members.length} travel stops near ${cluster.members[0].city}`
        : `${cluster.members[0].city}, ${cluster.members[0].name}`)
      .attr("transform", (cluster) => `translate(${cluster.point[0]},${cluster.point[1]})`);

    markers.select("circle")
      .attr("class", (cluster) => cluster.members.length > 1 ? "travel-hub-marker__cluster" : "")
      .attr("r", (cluster) => `${(cluster.members.length > 1 ? 5.2 : 3.2) / scale}`);

    markers.select("text")
      .attr("x", `${7 / scale}`)
      .attr("y", `${-5 / scale}`)
      .attr("font-size", `${10 / scale}`)
      .text((cluster) => {
        if (cluster.members.length > 1 && scale < 2.7) return cluster.members.length;
        if (scale >= 3.1) return cluster.members[0].code;
        return "";
      });

    markers
      .on("mouseenter", (event, cluster) => {
        const member = cluster.members[0];
        const title = cluster.members.length > 1 ? `${member.city} area` : member.city;
        const detail = cluster.members.length > 1
          ? `${cluster.members.length} airports or stations`
          : `${member.code} · ${member.name}`;
        showTooltip(`<strong>${title}</strong><span>${detail}</span>`, event);
      })
      .on("mousemove", (event, cluster) => {
        const member = cluster.members[0];
        const title = cluster.members.length > 1 ? `${member.city} area` : member.city;
        const detail = cluster.members.length > 1 ? `${cluster.members.length} airports or stations` : `${member.code} · ${member.name}`;
        showTooltip(`<strong>${title}</strong><span>${detail}</span>`, event);
      })
      .on("mouseleave", hideTooltip)
      .on("focus", (event, cluster) => {
        const member = cluster.members[0];
        showTooltip(`<strong>${member.city}</strong><span>${member.code} · ${member.name}</span>`);
      })
      .on("blur", hideTooltip);
  }

  function showRouteDetail(route) {
    selectedRouteKey = route.key;
    const records = [...route.segments].sort((a, b) => String(b.sort_date).localeCompare(String(a.sort_date)));
    document.getElementById("travel-connection-mode").textContent = `${modeNames[route.mode]} route · ${records.length} recorded ${records.length === 1 ? "journey" : "journeys"}`;
    document.getElementById("travel-connection-title").textContent = `${route.from} → ${route.to}`;
    document.getElementById("travel-connection-list").innerHTML = records.slice(0, 5).map((record) => {
      const service = [record.operator, record.service].filter(Boolean).join(" · ");
      const times = [record.from_time, record.to_time].filter(Boolean).join(" → ");
      return `<p><strong>${record.date || record.sort_date}</strong><span>${service}${times ? ` · ${times}` : ""}</span></p>`;
    }).join("");
    connectionPanel.hidden = false;
    root.querySelectorAll(".travel-map__route").forEach((path) => {
      path.classList.toggle("is-selected", path.dataset.key === route.key);
      path.classList.toggle("is-dimmed", path.dataset.key !== route.key);
    });
    focusRoute(route);
    scheduleCityLabels();
  }

  function updateSemanticZoom() {
    const scale = Math.max(1, currentTransform.k || 1);
    renderEndpointMarkers();
    scheduleCityLabels();

    root.querySelectorAll(".travel-marker__hit").forEach((circle) => circle.setAttribute("r", String(19 / scale)));
    root.querySelectorAll(".travel-marker__ring").forEach((circle) => circle.setAttribute("r", String(10 / scale)));
    root.querySelectorAll(".travel-marker__core").forEach((circle) => circle.setAttribute("r", String(5 / scale)));
    root.querySelectorAll(".travel-marker__label").forEach((label) => {
      label.setAttribute("x", String(13 / scale));
      label.setAttribute("y", String(4 / scale));
      label.setAttribute("font-size", String(11 / scale));
    });
    updateScaleBar();
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
    currentProjection = projection;
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
        hideTooltip();
        showRouteDetail(route);
      });
      hitPath.addEventListener("mouseenter", (event) => {
        showTooltip(`<strong>${route.from} → ${route.to}</strong><span>${modeNames[route.mode]} · ${route.segments.length} recorded</span>`, event);
      });
      hitPath.addEventListener("mousemove", (event) => {
        showTooltip(`<strong>${route.from} → ${route.to}</strong><span>${modeNames[route.mode]} · ${route.segments.length} recorded</span>`, event);
      });
      hitPath.addEventListener("mouseleave", hideTooltip);
      hitPath.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          showRouteDetail(route);
        }
      });
    });

    endpointLayer = viewport.append("g").attr("class", "travel-hub-markers");
    cityLabelLayer = svg.append("g").attr("class", "travel-map__rendered travel-city-labels");

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
    markers.append("text").attr("class", "travel-marker__label").text((place) => place.city);
    root.querySelectorAll(".travel-marker").forEach((marker) => {
      marker.addEventListener("click", () => updateDetail(marker.__data__.id));
      marker.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          updateDetail(marker.__data__.id);
        }
      });
    });
    updateSemanticZoom();
    mapStatus.hidden = true;
  }

  const zoomBehavior = zoom().scaleExtent([1, 9]).on("zoom", (event) => {
    currentTransform = event.transform;
    if (viewport) viewport.attr("transform", currentTransform);
    updateSemanticZoom();
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
    updateSemanticZoom();
  }

  document.getElementById("travel-place-filter").addEventListener("change", (event) => {
    activeFilter = event.target.value;
    const filtered = visiblePlaces();
    if (filtered.length && !filtered.some((place) => place.id === selectedId)) updateDetail(filtered[0].id);
    drawMap();
    if (!filtered.length) {
      mapStatus.textContent = "No places in this category yet.";
      mapStatus.hidden = false;
    }
  });

  document.getElementById("travel-route-filter").addEventListener("change", (event) => {
    activeRouteFilter = event.target.value;
    selectedRouteKey = null;
    connectionPanel.hidden = true;
    hideTooltip();
    drawMap();
  });

  yearFilter.addEventListener("change", (event) => {
    activeYear = event.target.value;
    selectedRouteKey = null;
    connectionPanel.hidden = true;
    hideTooltip();
    drawMap();
    if (!visibleRoutes().length) {
      mapStatus.textContent = "No routes recorded for this year.";
      mapStatus.hidden = false;
    }
  });

  root.querySelector(".travel-connection__close").addEventListener("click", () => {
    connectionPanel.hidden = true;
    selectedRouteKey = null;
    root.querySelectorAll(".travel-map__route").forEach((path) => path.classList.remove("is-selected", "is-dimmed"));
    scheduleCityLabels();
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
        updateSemanticZoom();
      }
      if (action === "expand") {
        const expanded = mapShell.classList.toggle("is-expanded");
        document.body.classList.toggle("travel-map-open", expanded);
        button.setAttribute("aria-pressed", String(expanded));
        button.textContent = expanded ? "×" : "⛶";
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
      button.textContent = "⛶";
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
