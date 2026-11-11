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
    </div>
    <p class="blog-home__description">Long-form thoughts on research, technology, learning, and whatever else feels worth thinking through.</p>
  </header>

  {% if site.posts.size > 0 %}
    <div class="blog-content-grid">
      <section class="blog-library" aria-labelledby="essay-archive-title">
        <header class="blog-library__heading">
          <h2 id="essay-archive-title">Essay archive</h2>
          <span>{{ site.posts.size | prepend: "0" | slice: -2, 2 }} {% if site.posts.size == 1 %}essay{% else %}essays{% endif %}</span>
        </header>

        <div class="blog-archive" id="blog-archive">
          {% for post in site.posts %}
            {% assign words = post.content | strip_html | number_of_words %}
            {% assign calculated_minutes = words | divided_by: 180 | plus: 1 %}
            {% assign minutes = post.reading_time | default: calculated_minutes %}
            <article class="blog-entry">
              <a class="blog-entry__link" href="{{ post.url | relative_url }}" target="_self">
                <time class="blog-entry__date" datetime="{{ post.date | date_to_xmlschema }}">
                  <span>{{ post.date | date: "%b %-d" }}</span>
                  <small>{{ post.date | date: "%Y" }}</small>
                </time>

                <div class="blog-entry__body">
                  <h3>{{ post.title }}</h3>
                  {% if post.summary %}
                    <p>{{ post.summary }}</p>
                  {% elsif post.subtitle %}
                    <p>{{ post.subtitle }}</p>
                  {% else %}
                    <p>{{ post.excerpt | strip_html | strip_newlines | truncate: 155 }}</p>
                  {% endif %}
                </div>

                <div class="blog-entry__meta">
                  {% if post.tags.size > 0 %}<span>{{ post.tags | join: " · " }}</span>{% endif %}
                  <span>{{ minutes }} min read</span>
                  <strong>Read <span aria-hidden="true">→</span></strong>
                </div>
              </a>
            </article>
          {% endfor %}
        </div>
      </section>

      <aside class="blog-notebook" aria-label="Notebook index">
        <section class="blog-notebook__index">
          <p class="blog-notebook__eyebrow">Notebook index</p>
          <h2>At a glance</h2>
          <dl>
            <div><dt>Essays</dt><dd>{{ site.posts.size | prepend: "0" | slice: -2, 2 }}</dd></div>
            <div><dt>Topics</dt><dd>{{ site.tags.size | prepend: "0" | slice: -2, 2 }}</dd></div>
            {% if latest_post %}<div><dt>Latest</dt><dd>{{ latest_post.date | date: "%b %-d" }}</dd></div>{% endif %}
          </dl>
        </section>

        <section class="blog-notebook__about">
          <p class="blog-notebook__eyebrow">About</p>
          <p>A quieter archive that lets the writing—not the cards—carry the page.</p>
        </section>
      </aside>
    </div>
  {% else %}
    <div class="blog-empty">
      <p class="blog-empty__title">The first essay is on its way.</p>
      <p>Long-form notes and ideas will appear here, one piece at a time.</p>
    </div>
  {% endif %}
</div>
