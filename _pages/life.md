---
permalink: /life/
title: "My Life"
excerpt: "A living atlas of what I read, where I go, and the small moments I want to keep."
author_profile: false
---

{% assign life_items = site.data.reading_items %}
{% assign latest_finished = life_items | where: "status", "Finished" %}

<div class="life-atlas">
  <header class="life-atlas__hero">
    <div>
      <p class="life-atlas__eyebrow">Personal archive</p>
      <h1>My Life</h1>
      <p class="life-atlas__intro">A living atlas of what I read, where I go, and the small moments I want to keep.</p>
    </div>
    <div class="life-atlas__chapter">
      <span>Current chapter</span>
      <strong>Boston → Singapore</strong>
      <small>Learning, moving, becoming.</small>
    </div>
  </header>

  <main class="life-atlas__grid" aria-label="Life collections">
    <article class="life-atlas-card life-atlas-reading" data-count="{{ life_items.size }}">
      <span class="life-atlas-card__icon" aria-hidden="true"><i class="fas fa-book-open"></i></span>
      <div class="life-atlas-reading__latest">
        <span>Latest finished</span>
        <strong>{% for item in latest_finished limit: 2 %}{{ item.title | escape }}{% unless forloop.last %} · {% endunless %}{% endfor %}</strong>
      </div>
      <div class="life-atlas-card__body">
        <h2>Reading &amp; Watching</h2>
        <p>Books, films, and anime that have passed through my life—and sometimes stayed.</p>
        <a class="life-atlas__link" href="{{ '/reading/' | relative_url }}">Enter the library <i class="fas fa-external-link-alt" aria-hidden="true"></i></a>
      </div>
    </article>

    <article class="life-atlas-card life-atlas-travel">
      <span class="life-atlas-card__icon" aria-hidden="true"><i class="fas fa-map"></i></span>
      <div class="life-atlas-travel__route" aria-label="Boston to Singapore">
        <span>Boston</span><i aria-hidden="true"></i><span>Singapore</span>
      </div>
      <div class="life-atlas-card__body">
        <h2>My Travel</h2>
        <p>A map made from cities, train windows, borrowed rooms, and details I almost forgot.</p>
        <span class="life-atlas__link life-atlas__link--soon">Travel journal · coming next</span>
      </div>
    </article>

    <div class="life-atlas__bottom">
      <article class="life-atlas-mini">
        <i class="fas fa-camera" aria-hidden="true"></i>
        <h3>Small Moments</h3>
        <p>Photographs, fragments, and ordinary days worth remembering.</p>
        <span>Future collection</span>
      </article>

      <article class="life-atlas-mini">
        <i class="fas fa-map-marker-alt" aria-hidden="true"></i>
        <h3>Places</h3>
        <p>A personal index of cafés, streets, museums, and quiet corners.</p>
        <span>Future collection</span>
      </article>

      <article class="life-atlas-mini">
        <i class="fas fa-clock" aria-hidden="true"></i>
        <h3>Yearbook</h3>
        <p>One page for every year—what changed, what lasted, what began.</p>
        <span>Future collection</span>
      </article>
    </div>
  </main>
</div>
