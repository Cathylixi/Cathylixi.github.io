---
permalink: /blog/
title: "My Blog"
excerpt: "Essays, reviews, and research notes."
author_profile: false
---

<div class="blog-home">
  <header class="blog-home__intro">
    <div class="blog-home__title">
      <p class="blog-eyebrow">Field notes · {{ site.time | date: "%Y" }}</p>
      <h1>My Blog</h1>
      <p class="blog-home__description">Essays, reviews, and research notes on AI, gender, queer culture, film, and the questions that connect them.</p>
    </div>
    <aside class="blog-glance" aria-label="Notebook index">
      <p>At a glance</p>
      <dl>
        <div><dt>Notes</dt><dd>{{ site.posts.size | prepend: "0" | slice: -2, 2 }}</dd></div>
        <div><dt>Topics</dt><dd>{{ site.data.blog_topics.size | prepend: "0" | slice: -2, 2 }}</dd></div>
        <div><dt>Series</dt><dd>{{ site.data.blog_series.size | prepend: "0" | slice: -2, 2 }}</dd></div>
      </dl>
    </aside>
  </header>

  <section class="blog-section">
    <header class="blog-section__heading">
      <div><p class="blog-eyebrow">Ongoing inquiries</p><h2>Featured series</h2></div>
      <span>Research that grows over time</span>
    </header>
    <div class="blog-series-grid">
      {% for series in site.data.blog_series %}
        {% assign series_count = 0 %}
        {% for post in site.posts %}{% if post.series_slug == series.slug %}{% assign series_count = series_count | plus: 1 %}{% endif %}{% endfor %}
        <a class="blog-series-card blog-tone--{{ series.tone }}" href="{{ series.url | relative_url }}">
          <span>{{ series_count | prepend: "0" | slice: -2, 2 }} {% if series_count == 1 %}note{% else %}notes{% endif %}</span>
          <h3>{{ series.title }}</h3><p>{{ series.description }}</p>
        </a>
      {% endfor %}
    </div>
  </section>

  <section class="blog-section blog-library" aria-labelledby="latest-writing-title">
    <header class="blog-section__heading blog-section__heading--filters">
      <div>
        <p class="blog-eyebrow">Formats</p><h2 id="latest-writing-title">Latest writing</h2>
        <div class="blog-filters" aria-label="Filter writing by format">
          <button class="is-active" type="button" data-blog-filter="all" aria-pressed="true">All</button>
          <button type="button" data-blog-filter="essay" aria-pressed="false">Essay</button>
          <button type="button" data-blog-filter="review" aria-pressed="false">Review</button>
          <button type="button" data-blog-filter="research-note" aria-pressed="false">Research Note</button>
          <button type="button" data-blog-filter="field-note" aria-pressed="false">Field Note</button>
        </div>
      </div>
      <span data-blog-count>{{ site.posts.size }} {% if site.posts.size == 1 %}entry{% else %}entries{% endif %}</span>
    </header>

    <div class="blog-archive" id="blog-archive">
      {% for post in site.posts %}{% assign tone = forloop.index0 | modulo: 4 %}{% include blog/post-card.html post=post tone=tone %}{% endfor %}
    </div>
    <p class="blog-empty-state" data-blog-empty hidden>This format does not have a note yet.</p>
  </section>

  <section class="blog-section">
    <header class="blog-section__heading"><div><p class="blog-eyebrow">Research map</p><h2>Explore by topic</h2></div></header>
    <div class="blog-topic-chips">{% for topic in site.data.blog_topics %}<a href="{{ topic.url | relative_url }}" title="{{ topic.description }}">{{ topic.title }}</a>{% endfor %}</div>
  </section>
</div>

<script src="{{ '/assets/js/blog.js' | relative_url }}" defer></script>
