(function () {
  "use strict";

  var body = document.getElementById("academic-essay-body");
  var toc = document.getElementById("academic-toc");
  var panel = document.getElementById("academic-toc-panel");
  var mobileToggle = document.querySelector(".academic-post__toc-mobile-toggle");

  if (!body || !toc) return;

  var headings = Array.prototype.slice.call(body.querySelectorAll("h2, h3, h4"));
  if (!headings.length) return;

  var root = document.createElement("ul");
  var lists = { 2: root };
  var lastItems = {};

  function headingId(heading, index) {
    var number = heading.textContent.trim().match(/^([0-9]+(?:\.[0-9]+)*)\.?\s/);
    if (number) return "section-" + number[1].replace(/\./g, "-");
    if (heading.id) return heading.id;
    return "essay-section-" + (index + 1);
  }

  headings.forEach(function (heading, index) {
    var level = Number(heading.tagName.substring(1));
    heading.id = headingId(heading, index);
    heading.classList.add("academic-anchor");

    if (level > 2 && !lists[level]) {
      var parent = lastItems[level - 1] || lastItems[2];
      if (parent) {
        lists[level] = document.createElement("ul");
        parent.appendChild(lists[level]);
        parent.classList.add("academic-post__toc-parent");
      }
    }

    Object.keys(lists).forEach(function (key) {
      if (Number(key) > level) delete lists[key];
    });

    var item = document.createElement("li");
    item.className = "academic-post__toc-item academic-post__toc-item--level-" + level;
    var row = document.createElement("div");
    row.className = "academic-post__toc-row";
    var link = document.createElement("a");
    link.href = "#" + heading.id;
    link.textContent = heading.textContent.trim();
    link.dataset.target = heading.id;
    row.appendChild(link);
    item.appendChild(row);
    (lists[level] || root).appendChild(item);
    lastItems[level] = item;
  });

  root.querySelectorAll(".academic-post__toc-parent").forEach(function (item) {
    var row = item.querySelector(":scope > .academic-post__toc-row");
    var button = document.createElement("button");
    button.type = "button";
    button.className = "academic-post__toc-disclosure";
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", "Show subsections");
    button.innerHTML = "<span aria-hidden=\"true\">+</span>";
    row.appendChild(button);
    button.addEventListener("click", function () {
      var open = item.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(open));
      button.setAttribute("aria-label", open ? "Hide subsections" : "Show subsections");
      button.firstElementChild.textContent = open ? "−" : "+";
    });
  });

  toc.appendChild(root);

  function setTreeState(open) {
    toc.querySelectorAll(".academic-post__toc-parent").forEach(function (item) {
      item.classList.toggle("is-open", open);
      var button = item.querySelector(":scope > .academic-post__toc-row .academic-post__toc-disclosure");
      if (button) {
        button.setAttribute("aria-expanded", String(open));
        button.firstElementChild.textContent = open ? "−" : "+";
      }
    });
  }

  var firstChapter = toc.querySelector(".academic-post__toc-item--level-2");
  if (firstChapter) {
    firstChapter.classList.add("is-open");
    var firstButton = firstChapter.querySelector(":scope > .academic-post__toc-row .academic-post__toc-disclosure");
    if (firstButton) {
      firstButton.setAttribute("aria-expanded", "true");
      firstButton.firstElementChild.textContent = "−";
    }
  }

  document.querySelectorAll("[data-toc-action]").forEach(function (button) {
    button.addEventListener("click", function () {
      setTreeState(button.dataset.tocAction === "expand");
    });
  });

  if (mobileToggle && panel) {
    mobileToggle.addEventListener("click", function () {
      var open = mobileToggle.getAttribute("aria-expanded") !== "true";
      mobileToggle.setAttribute("aria-expanded", String(open));
      mobileToggle.textContent = open ? "Hide" : "Show";
      panel.classList.toggle("is-open", open);
    });
  }

  function revealActive(link) {
    toc.querySelectorAll("a.is-active").forEach(function (active) {
      active.classList.remove("is-active");
      active.removeAttribute("aria-current");
    });
    if (!link) return;
    link.classList.add("is-active");
    link.setAttribute("aria-current", "location");
    var parent = link.closest("li");
    while (parent) {
      parent.classList.add("is-open");
      var disclosure = parent.querySelector(":scope > .academic-post__toc-row .academic-post__toc-disclosure");
      if (disclosure) {
        disclosure.setAttribute("aria-expanded", "true");
        disclosure.firstElementChild.textContent = "−";
      }
      parent = parent.parentElement ? parent.parentElement.closest("li") : null;
    }
  }

  toc.addEventListener("click", function (event) {
    var link = event.target.closest("a");
    if (!link) return;
    revealActive(link);
    if (window.innerWidth <= 960 && mobileToggle && panel) {
      mobileToggle.setAttribute("aria-expanded", "false");
      mobileToggle.textContent = "Show";
      panel.classList.remove("is-open");
    }
  });

  if ("IntersectionObserver" in window) {
    var visible = {};
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) visible[entry.target.id] = entry.target;
        else delete visible[entry.target.id];
      });
      var current = headings.find(function (heading) { return visible[heading.id]; });
      if (current) revealActive(toc.querySelector("a[data-target=\"" + current.id + "\"]"));
    }, { rootMargin: "-12% 0px -75% 0px", threshold: 0 });
    headings.forEach(function (heading) { observer.observe(heading); });
  }
})();
