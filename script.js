/* ============================================================
   NEON DISTRICT — scroll parallax + reveal logic
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var scene   = document.getElementById("scene");
  var layers  = Array.prototype.slice.call(document.querySelectorAll(".layer[data-speed]"));
  var city    = document.querySelector(".city");
  var transit = document.getElementById("transitFill");

  var ticking = false;

  function updateParallax() {
    var scrollY = window.scrollY || window.pageYOffset;

    // --- hero layers: only bother while the scene is still on screen ---
    var sceneHeight = scene.offsetHeight;
    if (!reduceMotion && scrollY < sceneHeight * 1.5) {
      for (var i = 0; i < layers.length; i++) {
        var speed = parseFloat(layers[i].dataset.speed) || 0;
        var offset = scrollY * speed * -1;
        layers[i].style.transform = "translate3d(0, " + offset + "px, 0)";
      }
    }

    // --- transit line fill: tied to how far the reader has moved through .city ---
    if (city && transit) {
      var rect = city.getBoundingClientRect();
      var viewportH = window.innerHeight;
      var total = rect.height - viewportH * 0.5;
      var traveled = viewportH * 0.5 - rect.top;
      var progress = total > 0 ? traveled / total : 0;
      progress = Math.max(0, Math.min(1, progress));
      transit.style.height = (progress * 100) + "%";
    }

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  updateParallax();

  // --- reveal each district stop as it enters the viewport ---
  var stops = document.querySelectorAll(".stop");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.3 }
    );
    stops.forEach(function (stop) { observer.observe(stop); });
  } else {
    // fallback: just show everything
    stops.forEach(function (stop) { stop.classList.add("is-visible"); });
  }
})();
