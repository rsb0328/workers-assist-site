/* =========================================================================
   scroll.js — scrollytelling enhancement.

   The two-column sticky layout is pure CSS (see styles.css), so the page is
   fully usable with JS off. This script only ADDS an .is-active class to the
   beat currently in view, for the subtle lift/shadow on its photo. No layout
   depends on it; if IntersectionObserver is missing, nothing breaks.
   ========================================================================= */

(function () {
  "use strict";

  if (!("IntersectionObserver" in window)) return;

  document.addEventListener("DOMContentLoaded", function () {
    var beats = document.querySelectorAll(".beat");
    if (!beats.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          for (var i = 0; i < beats.length; i++) beats[i].classList.remove("is-active");
          entry.target.classList.add("is-active");
        }
      });
    }, {
      // Activate a beat when it's roughly centered in the viewport.
      rootMargin: "-45% 0px -45% 0px",
      threshold: 0
    });

    for (var i = 0; i < beats.length; i++) observer.observe(beats[i]);
  });
})();
