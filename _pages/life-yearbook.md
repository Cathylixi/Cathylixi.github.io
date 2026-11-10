---
layout: life-section
permalink: /life/yearbook/
title: "Yearbook"
excerpt: "A life list, by year."
life_eyebrow: "To do before I die"
life_icon: "fa-clock"
life_style: "yearbook"
author_profile: false
---

{% assign yearbook = site.data.yearbook %}
{% assign sorted_chapters = yearbook.chapters | sort: "year" | reverse %}
{% assign lived_count = 0 %}
{% for chapter in sorted_chapters %}
  {% assign chapter_count = chapter.items | size %}
  {% assign lived_count = lived_count | plus: chapter_count %}
{% endfor %}
{% assign future_count = 0 %}
{% for group in yearbook.future %}
  {% assign group_count = group.items | size %}
  {% assign future_count = future_count | plus: group_count %}
{% endfor %}

<div class="yearbook-dense" data-yearbook>
  <section class="yearbook-year-picker" aria-label="Choose a year">
    <div class="yearbook-year-picker__title">
      <span class="yearbook-label">Browse the archive</span>
      <p data-year-summary aria-live="polite">{{ lived_count }} entries · newest chapters below</p>
    </div>
    <details class="yearbook-year-menu" data-year-menu>
      <summary>
        <span>Viewing</span>
        <strong data-year-label>All years</strong>
        <i class="fas fa-chevron-down" aria-hidden="true"></i>
      </summary>
      <div class="yearbook-year-menu__options" role="listbox" aria-label="Choose a year">
        <button type="button" class="is-active" role="option" aria-selected="true" data-year-option="all">All years <span>{{ lived_count }}</span></button>
        {% for chapter in sorted_chapters %}
          <button type="button" role="option" aria-selected="false" data-year-option="{{ chapter.year }}">{{ chapter.year }} <span>{{ chapter.items.size }}</span></button>
        {% endfor %}
      </div>
    </details>
  </section>

  <details class="yearbook-wishlist">
    <summary>
      <span class="yearbook-wishlist__identity">
        <span class="yearbook-wishlist__icon" aria-hidden="true"><i class="fas fa-star"></i></span>
        <span><small>Someday</small><strong>To-do list</strong></span>
      </span>
      <span class="yearbook-wishlist__count">{{ future_count }} wishes</span>
      <i class="fas fa-chevron-down yearbook-wishlist__chevron" aria-hidden="true"></i>
    </summary>

    <div class="yearbook-wishlist__body">
      <div class="yearbook-ledger">
        {% for group in yearbook.future %}
          {% if group.accent == 'mint' %}{% assign future_kind = 'sports' %}{% else %}{% assign future_kind = 'travel' %}{% endif %}
          {% for item in group.items %}
            <article class="yearbook-row yearbook-row--future yearbook-row--{{ future_kind }}"
                     data-status="someday"
                     data-kind="{{ future_kind }}">
              <div class="yearbook-row__date yearbook-row__date--future"><strong>∞</strong><span>Someday</span></div>
              <span class="yearbook-row__marker" aria-hidden="true"><i class="fas {{ group.icon }}"></i></span>
              <div class="yearbook-row__title">
                <p>{% if future_kind == 'sports' %}Adventure{% else %}Travel{% endif %}</p>
                <h3>{{ item }}</h3>
              </div>
              <p class="yearbook-row__note">{{ group.note }}</p>
              <span class="yearbook-row__status">Waiting</span>
            </article>
          {% endfor %}
        {% endfor %}
      </div>
    </div>
  </details>

  <div class="yearbook-results" data-yearbook-results>
    {% for chapter in sorted_chapters %}
      <section class="yearbook-collection" data-yearbook-section data-year="{{ chapter.year }}">
        <header class="yearbook-collection__header yearbook-collection__header--simple">
          <h2>{{ chapter.year }}</h2>
          <span>{{ chapter.items.size }} entries</span>
        </header>

        <div class="yearbook-ledger">
          {% for item in chapter.items %}
            <article class="yearbook-row yearbook-row--{{ item.kind }}"
                     data-yearbook-card
                     data-status="lived"
                     data-year="{{ chapter.year }}"
                     data-kind="{{ item.kind }}">
              <time class="yearbook-row__date">
                <strong>{{ item.date }}</strong>
                <span>{{ chapter.year }}</span>
              </time>
              <span class="yearbook-row__marker" aria-hidden="true"><i class="fas {{ item.icon }}"></i></span>
              <div class="yearbook-row__title">
                <p>{% case item.kind %}{% when 'sports' %}Sport{% when 'travel' %}Travel{% when 'activity' %}Experience{% when 'view' %}Scenery{% when 'startup' %}Created{% else %}{{ item.kind }}{% endcase %}</p>
                <h3>{{ item.title }}</h3>
                {% if item.subtitle %}<span>{{ item.subtitle }}</span>{% endif %}
              </div>
              <div class="yearbook-row__detail">
                <span>Where</span>
                <strong>{{ item.location }}</strong>
              </div>
              <div class="yearbook-row__detail">
                <span>With</span>
                <strong>{{ item.company }}</strong>
              </div>
              <span class="yearbook-row__status"><i aria-hidden="true">✓</i> Lived</span>
            </article>
          {% endfor %}
        </div>
      </section>
    {% endfor %}

  </div>

  <footer class="yearbook-dense__closing">
    <span>{{ lived_count }} lived</span><i aria-hidden="true"></i><span>{{ future_count }} waiting</span><i aria-hidden="true"></i><strong>To be continued.</strong>
  </footer>
</div>

<script src="{{ '/assets/js/yearbook.js' | relative_url }}"></script>
