---
permalink: /blog/writing/
title: "All Writing"
excerpt: "Browse every essay, review, and research note."
author_profile: false
---

<div class="blog-collection blog-writing">
  {% include blog/collection-nav.html %}

  <header class="blog-writing__header">
    <div>
      <p class="blog-eyebrow">Writing archive · {{ site.posts.size | prepend: "0" | slice: -2, 2 }} notes</p>
      <h1>All writing</h1>
    </div>
    <p>Browse every essay, review, and research note—or narrow the archive by format, topic, or series.</p>
  </header>

  <section class="blog-filter-panel" aria-label="Filter the writing archive">
    <div class="blog-filter-group">
      <p>Format</p>
      <div class="blog-filters">
        <button class="is-active" type="button" data-blog-filter="all" aria-pressed="true">All</button>
        <button type="button" data-blog-filter="essay" aria-pressed="false">Essay</button>
        <button type="button" data-blog-filter="review" aria-pressed="false">Review</button>
        <button type="button" data-blog-filter="research-note" aria-pressed="false">Research Note</button>
        <button type="button" data-blog-filter="field-note" aria-pressed="false">Field Note</button>
      </div>
    </div>

    <div class="blog-filter-group">
      <p>Topic</p>
      <div class="blog-filters">
        <button class="is-active" type="button" data-blog-topic-filter="all" aria-pressed="true">All topics</button>
        {% for topic in site.data.blog_topics %}<button type="button" data-blog-topic-filter="{{ topic.slug }}" aria-pressed="false">{{ topic.title }}</button>{% endfor %}
      </div>
    </div>

    <div class="blog-filter-group">
      <p>Series</p>
      <div class="blog-filters">
        <button class="is-active" type="button" data-blog-series-filter="all" aria-pressed="true">All series</button>
        {% for series in site.data.blog_series %}<button type="button" data-blog-series-filter="{{ series.slug }}" aria-pressed="false">{{ series.title }}</button>{% endfor %}
      </div>
    </div>
  </section>

  <section class="blog-section blog-writing__results" aria-labelledby="all-writing-title">
    <header class="blog-section__heading">
      <div><p class="blog-eyebrow">Archive</p><h2 id="all-writing-title">Every note</h2></div>
      <span data-blog-count>{{ site.posts.size }} {% if site.posts.size == 1 %}entry{% else %}entries{% endif %}</span>
    </header>

    <div class="blog-archive" id="blog-archive">
      {% for post in site.posts %}{% assign tone = forloop.index0 | modulo: 4 %}{% include blog/post-card.html post=post tone=tone %}{% endfor %}
    </div>
    <p class="blog-empty-state" data-blog-empty hidden>No writing matches this combination yet.</p>
  </section>
</div>

<script src="{{ '/assets/js/blog.js' | relative_url }}" defer></script>
