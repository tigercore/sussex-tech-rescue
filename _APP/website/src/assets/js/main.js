// Mobile menu and Services dropdown.
(function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }
  document.querySelectorAll(".sub-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var li = btn.closest(".has-sub");
      var open = li.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
    });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    document.querySelectorAll(".has-sub.open").forEach(function (li) {
      li.classList.remove("open");
      li.querySelector(".sub-toggle").setAttribute("aria-expanded", "false");
    });
  });
})();

// Plan buttons preselect the plan in the family form.
document.querySelectorAll("[data-plan]").forEach(function (btn) {
  btn.addEventListener("click", function () {
    var select = document.getElementById("fam-plan");
    if (!select) return;
    var want = btn.getAttribute("data-plan");
    for (var i = 0; i < select.options.length; i++) {
      if (select.options[i].text.indexOf(want) === 0) { select.selectedIndex = i; break; }
    }
  });
});

// Fade items in and up as they scroll into view. Siblings in a grid are staggered slightly.
(function () {
  var root = document.documentElement;
  if (!root.classList.contains("js-reveal")) return;
  window.__revealReady = true;
  var selector = ".snap, .split > *, .ask-list li, .hero-copy, .hero-visual, .card, .price-card, .steps li, .tool-card, .compare-col, .faq, .info-card, .review-card, .about-photo, .booking-form, .book-intro, .section .container > h2, .section .container > .eyebrow, .section-lede, .callout, .cta-inner, .price-strip";
  var items = document.querySelectorAll(selector);
  items.forEach(function (el) {
    var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) { return c.matches(selector); });
    var index = siblings.indexOf(el);
    if (siblings.length > 1 && index > 0) el.style.setProperty("--reveal-delay", Math.min(index, 5) * 0.08 + "s");
  });
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });
  items.forEach(function (el) { observer.observe(el); });
})();

/* Homepage headline: swap "Computer" for other gadgets every couple of seconds. Off for reduced motion. */
(function () {
  var el = document.querySelector(".rotate-word");
  if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var words = el.getAttribute("data-words").split(",");
  var i = 0;
  setInterval(function () {
    el.classList.add("is-out");
    setTimeout(function () {
      i = (i + 1) % words.length;
      el.textContent = words[i];
      el.classList.remove("is-out");
    }, 250);
  }, 2200);
})();
