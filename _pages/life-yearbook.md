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
{% assign wellbeing_count = 0 %}
{% assign culture_count = 0 %}
{% assign travel_count = 0 %}
{% assign career_count = 0 %}
{% assign education_count = 0 %}
{% assign milestone_count = 0 %}
{% for chapter in sorted_chapters %}
  {% for item in chapter.items %}
    {% case item.kind %}
    {% when "wellbeing" %}
      {% assign wellbeing_count = wellbeing_count | plus: 1 %}
    {% when "culture" %}
      {% assign culture_count = culture_count | plus: 1 %}
    {% when "travel" %}
      {% assign travel_count = travel_count | plus: 1 %}
    {% when "career" %}
      {% assign career_count = career_count | plus: 1 %}
    {% when "education" %}
      {% assign education_count = education_count | plus: 1 %}
    {% when "milestone" %}
      {% assign milestone_count = milestone_count | plus: 1 %}
    {% endcase %}
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
                  <p>{% case item.kind %}{% when 'wellbeing' %}Sports &amp; Wellbeing{% when 'culture' %}Culture &amp; Experiences{% when 'travel' %}Travel{% when 'career' %}Career &amp; Creation{% when 'education' %}Learning &amp; Education{% when 'milestone' %}Life Milestone{% else %}{{ item.kind }}{% endcase %}</p>
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
        <div class="yearbook-glance__total">
          <strong>{{ lived_count }}</strong>
          <span>Life moments</span>
        </div>
      </header>
      <div class="yearbook-glance__categories" aria-label="Life moments by category">
        <div class="yearbook-category yearbook-category--wellbeing">
          <span class="yearbook-category__icon" aria-hidden="true"><i class="fas fa-heartbeat"></i></span>
          <div><strong>{{ wellbeing_count }}</strong><span>Sports &amp; Wellbeing</span></div>
        </div>
        <div class="yearbook-category yearbook-category--culture">
          <span class="yearbook-category__icon" aria-hidden="true"><i class="fas fa-ticket-alt"></i></span>
          <div><strong>{{ culture_count }}</strong><span>Culture &amp; Experiences</span></div>
        </div>
        <div class="yearbook-category yearbook-category--travel">
          <span class="yearbook-category__icon" aria-hidden="true"><i class="fas fa-plane"></i></span>
          <div><strong>{{ travel_count }}</strong><span>Travel</span></div>
        </div>
        <div class="yearbook-category yearbook-category--career">
          <span class="yearbook-category__icon" aria-hidden="true"><i class="fas fa-seedling"></i></span>
          <div><strong>{{ career_count }}</strong><span>Career &amp; Creation</span></div>
        </div>
        <div class="yearbook-category yearbook-category--education">
          <span class="yearbook-category__icon" aria-hidden="true"><i class="fas fa-graduation-cap"></i></span>
          <div><strong>{{ education_count }}</strong><span>Learning &amp; Education</span></div>
        </div>
        <div class="yearbook-category yearbook-category--milestone">
          <span class="yearbook-category__icon" aria-hidden="true"><i class="fas fa-flag"></i></span>
          <div><strong>{{ milestone_count }}</strong><span>Life Milestones</span></div>
        </div>
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
