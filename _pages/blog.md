---
permalink: /blog/
title: "My Blog"
excerpt: "Long-form notes, essays, and ideas."
author_profile: false
---

<div class="blog-home">
  <header class="blog-home__intro">
    <p class="blog-home__eyebrow">Notes &amp; essays</p>
    <h1>My Blog</h1>
    <p class="blog-home__description">Long-form thoughts on research, technology, learning, and whatever else I find worth thinking through.</p>
  </header>

  {% if site.posts.size > 0 %}
    <div class="blog-content-grid">
      <section class="blog-library" aria-label="Essays">
        {% if site.tags.size > 0 %}
          <nav class="blog-topics" aria-label="Filter essays by topic">
            <button class="blog-topic is-active" type="button" data-blog-filter="all">All essays</button>
            {% assign sorted_tags = site.tags | sort %}
            {% for tag in sorted_tags %}
              <button class="blog-topic" type="button" data-blog-filter="{{ tag[0] | slugify }}">{{ tag[0] }}</button>
            {% endfor %}
          </nav>
        {% endif %}

        <div class="blog-archive" id="blog-archive">
          {% for post in site.posts %}
            {% assign words = post.content | strip_html | number_of_words %}
            {% assign calculated_minutes = words | divided_by: 180 | plus: 1 %}
            {% assign minutes = post.reading_time | default: calculated_minutes %}
            {% capture post_tags %}{% for tag in post.tags %}{{ tag | slugify }}{% unless forloop.last %}|{% endunless %}{% endfor %}{% endcapture %}
            <article class="blog-card" data-blog-tags="{{ post_tags }}">
              <a class="blog-card__link" href="{{ post.url | relative_url }}" target="_self">
                <div class="blog-card__cover">
                  {% if post.cover_image %}
                    <img src="{{ post.cover_image | relative_url }}" alt="{{ post.cover_alt | default: post.title }}">
                  {% else %}
                    <div class="blog-card__cover-placeholder" aria-hidden="true">
                      <span>{{ post.cover_text | default: post.tags.first | default: "Essay" }}</span>
                    </div>
                  {% endif %}
                </div>
                <div class="blog-card__content">
                  <div class="blog-card__overline">
                    {% if post.tags.size > 0 %}<span>{{ post.tags.first }}</span>{% endif %}
                    <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%b %-d, %Y" }}</time>
                  </div>
                  <h2>{{ post.title }}</h2>
                  {% if post.summary %}
                    <p class="blog-card__summary">{{ post.summary }}</p>
                  {% elsif post.subtitle %}
                    <p class="blog-card__summary">{{ post.subtitle }}</p>
                  {% else %}
                    <p class="blog-card__summary">{{ post.excerpt | strip_html | strip_newlines | truncate: 150 }}</p>
                  {% endif %}
                  <div class="blog-card__meta">
                    <span>{{ minutes }} min read</span>
                    <span class="blog-card__read">Read essay <span aria-hidden="true">→</span></span>
                  </div>
                </div>
              </a>
            </article>
          {% endfor %}
        </div>
      </section>

      <aside class="blog-writing-log" aria-label="Writing log">
        <div class="blog-archive-summary">
          <span>Archive</span>
          <div><strong>{{ site.posts.size }}</strong><small>{% if site.posts.size == 1 %}Essay{% else %}Essays{% endif %}</small></div>
          <div><strong>{{ site.tags.size }}</strong><small>{% if site.tags.size == 1 %}Topic{% else %}Topics{% endif %}</small></div>
        </div>

        <header class="blog-log-heading">
          <h2>Writing log</h2>
          <span>RECENTLY PUBLISHED</span>
        </header>

        <ol class="blog-log-timeline">
          {% for post in site.posts limit: 6 %}
            <li>
              <div class="blog-log-icon" aria-hidden="true">✎</div>
              <div>
                <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%b %-d, %Y" }}</time>
                <small>NEW ESSAY</small>
                <a href="{{ post.url | relative_url }}" target="_self">{{ post.title }}</a>
                {% assign log_summary = post.summary | default: post.subtitle %}
                {% if log_summary %}<p>{{ log_summary | strip_html | truncate: 90 }}</p>{% endif %}
              </div>
            </li>
          {% endfor %}
        </ol>

        <div class="blog-log-about">
          <span>ABOUT THIS BLOG</span>
          <p>Long-form notes on research, technology, learning, and questions worth thinking through.</p>
        </div>
      </aside>
    </div>
  {% else %}
    <div class="blog-empty">
      <p class="blog-empty__title">The first essay is on its way.</p>
      <p>Long-form notes and ideas will appear here, one piece at a time.</p>
    </div>
  {% endif %}
</div>

{% if site.tags.size > 0 %}
<script>
  (function () {
    var buttons = document.querySelectorAll('[data-blog-filter]');
    var cards = document.querySelectorAll('[data-blog-tags]');

    Array.prototype.forEach.call(buttons, function (button) {
      button.addEventListener('click', function () {
        var filter = button.getAttribute('data-blog-filter');

        Array.prototype.forEach.call(buttons, function (item) {
          item.classList.toggle('is-active', item === button);
        });

        Array.prototype.forEach.call(cards, function (card) {
          var tags = card.getAttribute('data-blog-tags').split('|');
          card.hidden = filter !== 'all' && tags.indexOf(filter) === -1;
        });
      });
    });
  }());
</script>
{% endif %}
