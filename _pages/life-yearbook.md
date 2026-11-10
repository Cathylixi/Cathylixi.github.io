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
{% assign sport_count = 0 %}
{% assign experience_count = 0 %}
{% assign other_count = 0 %}
{% for chapter in sorted_chapters %}
  {% for item in chapter.items %}
    {% if item.kind == "sports" %}
      {% assign sport_count = sport_count | plus: 1 %}
    {% elsif item.kind == "activity" %}
      {% assign experience_count = experience_count | plus: 1 %}
    {% else %}
      {% assign other_count = other_count | plus: 1 %}
    {% endif %}
  {% endfor %}
{% endfor %}

<div class="yearbook-dense" data-yearbook>
  <section class="yearbook-archive-pane" aria-label="Yearbook archive">
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
      <span>{{ lived_count }} lived</span><i aria-hidden="true"></i><strong>To be continued.</strong>
    </footer>
  </section>

  <aside class="yearbook-overview" aria-label="Yearbook overview">
    <section class="yearbook-glance" aria-labelledby="yearbook-glance-title">
      <header class="yearbook-glance__header">
        <div>
          <p>Archive</p>
          <h2 id="yearbook-glance-title">At a glance</h2>
        </div>
        <strong>{{ lived_count }}</strong>
      </header>
      <div class="yearbook-glance__stats">
        <div><strong>{{ lived_count }}</strong><span>Lived</span></div>
        <div><strong>{{ future_count }}</strong><span>Waiting</span></div>
        <div><strong>{{ sorted_chapters.size }}</strong><span>Years</span></div>
      </div>
      <div class="yearbook-glance__tags" aria-label="Entries by type">
        <span><b>{{ sport_count }}</b> Sport</span>
        <span><b>{{ experience_count }}</b> Experience</span>
        <span><b>{{ other_count }}</b> Other</span>
      </div>
    </section>

    <section class="yearbook-wishlist" aria-labelledby="yearbook-wishlist-title">
      <header class="yearbook-wishlist__header">
        <div>
          <p>Someday</p>
          <h2 id="yearbook-wishlist-title">To-do list</h2>
        </div>
        <span>{{ future_count }}</span>
      </header>

      <div class="yearbook-wishlist__list">
        {% for group in yearbook.future %}
          {% for item in group.items %}
            <article class="yearbook-wish">
              <span class="yearbook-wish__infinity" aria-hidden="true">∞</span>
              <div>
                <small>Someday</small>
                <h3>{{ item }}</h3>
              </div>
            </article>
          {% endfor %}
        {% endfor %}
      </div>
    </section>
  </aside>
</div>

<script src="{{ '/assets/js/yearbook.js' | relative_url }}"></script>
