(function () {
  "use strict";

  var root = document.querySelector("[data-yearbook]");
  if (!root) return;

  var sections = Array.prototype.slice.call(root.querySelectorAll("[data-yearbook-section]"));
  var menu = root.querySelector("[data-year-menu]");
  var options = Array.prototype.slice.call(root.querySelectorAll("[data-year-option]"));
  var label = root.querySelector("[data-year-label]");
  var summary = root.querySelector("[data-year-summary]");
  var archive = root.querySelector(".yearbook-archive-pane");
  var overview = root.querySelector(".yearbook-overview");
  var desktop = window.matchMedia("(min-width: 861px)");

  function syncWorkspaceHeight() {
    if (!archive || !overview) return;
    if (!desktop.matches) {
      root.style.removeProperty("--yearbook-workspace-height");
      return;
    }
    root.style.setProperty(
      "--yearbook-workspace-height",
      Math.ceil(overview.getBoundingClientRect().height) + "px"
    );
  }

  if (overview && "ResizeObserver" in window) {
    new ResizeObserver(function () {
      window.requestAnimationFrame(syncWorkspaceHeight);
    }).observe(overview);
  }
  if (desktop.addEventListener) desktop.addEventListener("change", syncWorkspaceHeight);
  window.addEventListener("load", syncWorkspaceHeight);
  window.addEventListener("resize", syncWorkspaceHeight);
  syncWorkspaceHeight();

  if (!menu || !options.length) return;

  function showYear(year, option) {
    var visible = 0;

    sections.forEach(function (section) {
      var show = year === "all" || section.dataset.year === year;
      section.hidden = !show;
      if (show) visible += section.querySelectorAll("[data-yearbook-card]").length;
    });

    if (summary) {
      summary.textContent = visible + " entries · " +
        (year === "all" ? "newest chapters below" : option.childNodes[0].nodeValue.trim());
    }

    if (label) label.textContent = option.childNodes[0].nodeValue.trim();

    options.forEach(function (candidate) {
      var active = candidate === option;
      candidate.classList.toggle("is-active", active);
      candidate.setAttribute("aria-selected", active ? "true" : "false");
    });

    menu.open = false;
  }

  options.forEach(function (option) {
    option.addEventListener("click", function () {
      showYear(option.dataset.yearOption, option);
    });
  });

  document.addEventListener("click", function (event) {
    if (menu.open && !menu.contains(event.target)) menu.open = false;
  });

  showYear("all", options[0]);
})();
