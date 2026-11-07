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
        {% assign minutes = words | divided_by: 180 | plus: 1 %}
        {% capture post_tags %}{% for tag in post.tags %}{{ tag | slugify }}{% unless forloop.last %}|{% endunless %}{% endfor %}{% endcapture %}
        <article class="blog-card" data-blog-tags="{{ post_tags }}">
          <a class="blog-card__link" href="{{ post.url | relative_url }}" target="_self">
            <div class="blog-card__meta">
              <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%b %-d, %Y" }}</time>
              <span aria-hidden="true">·</span>
              <span>{{ minutes }} min read</span>
            </div>
            <h2>{{ post.title }}</h2>
            {% if post.subtitle %}
              <p class="blog-card__summary">{{ post.subtitle }}</p>
            {% elsif post.summary %}
              <p class="blog-card__summary">{{ post.summary }}</p>
            {% else %}
              <p class="blog-card__summary">{{ post.excerpt | strip_html | strip_newlines | truncate: 220 }}</p>
            {% endif %}
            <div class="blog-card__footer">
              {% if post.tags.size > 0 %}
                <span class="blog-card__tags" aria-label="Topics">
                  {% for tag in post.tags %}<span>{{ tag }}</span>{% endfor %}
                </span>
              {% endif %}
              <span class="blog-card__read">Read essay <span aria-hidden="true">→</span></span>
            </div>
          </a>
        </article>
      {% endfor %}
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
