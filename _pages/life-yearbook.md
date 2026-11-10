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

<div class="yearbook-dense" data-yearbook>
  <section class="yearbook-year-picker" aria-label="Choose a year">
    <div class="yearbook-year-picker__title">
      <span class="yearbook-label">Browse the archive</span>
      <p data-year-summary aria-live="polite">24 entries · newest chapters below</p>
    </div>
    <details class="yearbook-year-menu" data-year-menu>
      <summary>
        <span>Viewing</span>
        <strong data-year-label>All years</strong>
        <i class="fas fa-chevron-down" aria-hidden="true"></i>
      </summary>
      <div class="yearbook-year-menu__options" role="listbox" aria-label="Choose a year">
        <button type="button" class="is-active" role="option" aria-selected="true" data-year-option="all">All years <span>24</span></button>
        {% for chapter in yearbook.chapters %}
          <button type="button" role="option" aria-selected="false" data-year-option="{{ chapter.year }}">{{ chapter.year }} <span>{{ chapter.items.size }}</span></button>
        {% endfor %}
        <button type="button" role="option" aria-selected="false" data-year-option="future">Future wishes <span>10</span></button>
      </div>
    </details>
  </section>

  <div class="yearbook-results" data-yearbook-results>
    {% for chapter in yearbook.chapters %}
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

    <section class="yearbook-collection yearbook-collection--future" data-yearbook-section data-year="future">
      <header class="yearbook-collection__header yearbook-collection__header--simple">
        <h2>Future</h2>
        <span>10 wishes</span>
      </header>

      <div class="yearbook-ledger">
        {% for group in yearbook.future %}
          {% if group.accent == 'mint' %}{% assign future_kind = 'sports' %}{% else %}{% assign future_kind = 'travel' %}{% endif %}
          {% for item in group.items %}
            <article class="yearbook-row yearbook-row--future yearbook-row--{{ future_kind }}"
                     data-yearbook-card
                     data-status="someday"
                     data-year="future"
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
    </section>
  </div>

  <footer class="yearbook-dense__closing">
    <span>14 lived</span><i aria-hidden="true"></i><span>10 waiting</span><i aria-hidden="true"></i><strong>To be continued.</strong>
  </footer>
</div>

<script src="{{ '/assets/js/yearbook.js' | relative_url }}"></script>
