---
permalink: /blog/
title: "My Blog"
excerpt: "Long-form notes, essays, and ideas."
author_profile: false
---

{% assign latest_post = site.posts | first %}

<div class="blog-home">
  <header class="blog-home__intro">
    <div class="blog-home__title">
      <p class="blog-home__eyebrow">Field notes · {{ site.time | date: "%Y" }}</p>
      <h1>My Blog</h1>
      <p class="blog-home__description">Long-form thoughts on research, technology, learning, and whatever else feels worth thinking through.</p>
    </div>

    {% if site.posts.size > 0 %}
      <aside class="blog-home__glance" aria-label="Notebook index">
        <p class="blog-home__glance-label">At a glance</p>
        <dl>
          <div><dt>Essays</dt><dd>{{ site.posts.size | prepend: "0" | slice: -2, 2 }}</dd></div>
          <div><dt>Topics</dt><dd>{{ site.tags.size | prepend: "0" | slice: -2, 2 }}</dd></div>
          {% if latest_post %}<div><dt>Latest</dt><dd>{{ latest_post.date | date: "%b %-d" }}</dd></div>{% endif %}
        </dl>
      </aside>
    {% endif %}
  </header>

  {% if site.posts.size > 0 %}
    <section class="blog-library" aria-labelledby="essay-archive-title">
      <header class="blog-library__heading">
        <div>
          <p>Browse the notebook</p>
          <h2 id="essay-archive-title">Essay archive</h2>
        </div>
        <span>{{ site.posts.size | prepend: "0" | slice: -2, 2 }} {% if site.posts.size == 1 %}essay{% else %}essays{% endif %}</span>
      </header>

      <div class="blog-archive" id="blog-archive">
        {% for post in site.posts %}
          {% assign words = post.content | strip_html | number_of_words %}
          {% assign calculated_minutes = words | divided_by: 180 | plus: 1 %}
          {% assign minutes = post.reading_time | default: calculated_minutes %}
          {% assign tone = forloop.index0 | modulo: 4 %}
          <article class="blog-card blog-card--tone-{{ tone }}">
            <a class="blog-card__link" href="{{ post.url | relative_url }}" target="_self">
              <div class="blog-card__cover">
                <div class="blog-card__issue">
                  <span>Field note</span>
                  <span>{{ forloop.index | prepend: "0" | slice: -2, 2 }}</span>
                </div>
                <p class="blog-card__cover-title">{{ post.cover_text | default: post.title }}</p>
                <div class="blog-card__cover-footer">
                  <span>{{ post.date | date: "%Y" }}</span>
                  {% if post.tags.size > 0 %}<span>{{ post.tags | first }}</span>{% endif %}
                </div>
              </div>

              <div class="blog-card__content">
                <div class="blog-card__meta">
                  <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%b %-d, %Y" }}</time>
                  <span>{{ minutes }} min read</span>
                </div>
                <h3>{{ post.title }}</h3>
                {% if post.summary %}
                  <p>{{ post.summary }}</p>
                {% elsif post.subtitle %}
                  <p>{{ post.subtitle }}</p>
                {% else %}
                  <p>{{ post.excerpt | strip_html | strip_newlines | truncate: 155 }}</p>
                {% endif %}
                <div class="blog-card__action">
                  {% if post.tags.size > 0 %}<span>{{ post.tags | join: " · " }}</span>{% endif %}
                  <strong>Read essay <span aria-hidden="true">→</span></strong>
                </div>
              </div>
            </a>
          </article>
        {% endfor %}
      </div>
    </section>
  {% else %}
    <div class="blog-empty">
      <p class="blog-empty__title">The first essay is on its way.</p>
      <p>Long-form notes and ideas will appear here, one piece at a time.</p>
    </div>
  {% endif %}
</div>
