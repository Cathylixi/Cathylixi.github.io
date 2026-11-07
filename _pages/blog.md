---
permalink: /blog/
title: "My Blog"
excerpt: "Notes and writing."
author_profile: true
---

# My Blog

{% if site.posts.size > 0 %}
<ul class="blog-list">
  {% for post in site.posts %}
  <li>
    <span class="post-date">{{ post.date | date: "%Y-%m-%d" }}</span>
    <a href="{{ post.url | relative_url }}" target="_self">{{ post.title }}</a>
  </li>
  {% endfor %}
</ul>
{% else %}
Posts will be added here.
{% endif %}

<style>
  .blog-list {
    list-style: none;
    padding-left: 0;
  }

  .blog-list li {
    margin-bottom: 0.5em;
  }

  .blog-list .post-date {
    color: #888;
    margin-right: 0.8em;
    font-variant-numeric: tabular-nums;
  }
</style>
