---
layout: default
title: "My Blog"
permalink: /blog/
author_profile: true
---

<style>
  .blog-list { list-style: none; padding-left: 0; }
  .blog-list li { margin-bottom: 0.6em; }
  .blog-list .post-date { color: #888; margin-right: 0.6em; font-variant-numeric: tabular-nums; }
</style>

# My Blog

<ul class="blog-list">
{% for post in site.posts %}
  <li><span class="post-date">{{ post.date | date: "%Y-%m-%d" }}</span> <a href="{{ post.url | relative_url }}">{{ post.title }}</a></li>
{% endfor %}
</ul>
