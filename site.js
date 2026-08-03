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
})();
