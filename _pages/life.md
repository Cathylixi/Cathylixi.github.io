---
permalink: /life/
title: "My Life"
excerpt: "Reading, travel, moments, and the years that shape a life."
author_profile: false
---

{% assign life_items = site.data.reading_items %}

<div class="life-home">
  <header class="life-hero">
    <div class="life-hero__copy">
      <p class="life-eyebrow">An evolving collection</p>
      <h1>The Life Cabinet</h1>
      <p>Open a drawer. Find a book, a place, a photograph, or a version of me from another year.</p>
    </div>
    <div class="life-hero__chapter" aria-label="Current chapter: 2026">
      <span>Current chapter</span>
      <strong>2026</strong>
    </div>
  </header>

  <div class="life-cabinet">
    <main class="life-shelves" aria-label="Life collections">
      <a class="life-drawer life-drawer--open" href="{{ '/reading/' | relative_url }}">
        <span class="life-drawer__number" aria-hidden="true">01</span>
        <span class="life-drawer__copy">
          <small>Books · Films · Anime</small>
          <strong>Reading &amp; Watching</strong>
          <span>The library, with ratings and personal notes.</span>
        </span>
        <span class="life-drawer__meta">
          <strong>{{ life_items.size }}</strong>
          <small>entries</small>
        </span>
        <span class="life-drawer__arrow" aria-hidden="true">→</span>
      </a>

      <section class="life-drawer" aria-labelledby="life-travel-title">
        <span class="life-drawer__number" aria-hidden="true">02</span>
        <span class="life-drawer__copy">
          <small>Places · Routes · Postcards</small>
          <strong id="life-travel-title">My Travel</strong>
          <span>A map of places I have lived in, passed through, and want to remember.</span>
        </span>
        <span class="life-drawer__meta life-drawer__meta--soon">
          <strong>Next</strong>
          <small>Boston → Singapore</small>
        </span>
      </section>

      <section class="life-drawer" aria-labelledby="life-moments-title">
        <span class="life-drawer__number" aria-hidden="true">03</span>
        <span class="life-drawer__copy">
          <small>Photographs · Fragments</small>
          <strong id="life-moments-title">Moments</strong>
          <span>Small scenes, ordinary days, and things too lovely to lose.</span>
        </span>
        <span class="life-drawer__meta life-drawer__meta--quiet">
          <strong>Soon</strong>
          <small>A visual journal</small>
        </span>
      </section>

      <section class="life-drawer" aria-labelledby="life-yearbook-title">
        <span class="life-drawer__number" aria-hidden="true">04</span>
        <span class="life-drawer__copy">
          <small>Chapters · Seasons · Changes</small>
          <strong id="life-yearbook-title">Yearbook</strong>
          <span>One page for every year, with the people and changes that shaped it.</span>
        </span>
        <span class="life-drawer__meta life-drawer__meta--quiet">
          <strong>Later</strong>
          <small>Stories by year</small>
        </span>
      </section>
    </main>

    <aside class="life-side" aria-label="Recently filed">
      <section class="life-recent">
        <p class="life-side__eyebrow">Recently filed</p>
        <h2>New in the cabinet</h2>
        <ol>
          {% for item in life_items limit: 2 %}
            <li>
              <a href="{{ '/reading/' | relative_url }}">
                <span class="life-recent__mark" aria-hidden="true">R</span>
                <span>
                  <small>{{ item.category | escape }} · {{ item.year | escape }}</small>
                  <strong>{{ item.title | escape }}</strong>
                  <em>{{ item.rating | default: item.status | escape }}</em>
                </span>
              </a>
            </li>
          {% endfor %}
          <li class="life-recent__future">
            <span class="life-recent__mark" aria-hidden="true">✦</span>
            <span>
              <small>New chapter · 2027</small>
              <strong>Singapore</strong>
              <em>What comes next</em>
            </span>
          </li>
        </ol>
      </section>

      <blockquote class="life-note">
        <p>A personal website can be more than a record of work. It can also remember a life.</p>
        <span>— a note to my future self</span>
      </blockquote>
    </aside>
  </div>
</div>
