(function(){
  "use strict";
  var navToggle = document.getElementById("navToggle");
  var navMobile = document.getElementById("navMobile");
  if(navToggle && navMobile){
    navToggle.addEventListener("click", function(){
      var open = navMobile.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navMobile.querySelectorAll("a").forEach(function(a){
      a.addEventListener("click", function(){ navMobile.classList.remove("open"); });
    });
  }
  var yearEls = document.querySelectorAll("[data-year]");
  yearEls.forEach(function(el){ el.textContent = new Date().getFullYear(); });

  // Scroll-reveal: fade/slide sections up as they enter view.
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(!reduceMotion && "IntersectionObserver" in window){
    var revealEls = document.querySelectorAll(".section");
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add("reveal-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
    revealEls.forEach(function(el){
      el.classList.add("reveal");
      io.observe(el);
    });
  }
})();
