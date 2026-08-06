(function(){
  "use strict";

  // ---- Lead capture backup (Web3Forms) ----
  // Booking and Contact already hand the visitor a pre-filled sms:/mailto: link
  // (see booking.js / contact.js) — that stays the primary path. This is a silent
  // backup copy sent straight to Web3Forms so a lead is never lost just because a
  // visitor's device has no default text/mail app (common on desktop).
  //
  // To activate: go to https://web3forms.com, enter the business email, and it
  // instantly emails back an access key — no password or account needed. Paste
  // that key below in place of the placeholder.
  window.TSS = window.TSS || {};
  TSS.WEB3FORMS_ACCESS_KEY = "e66e1e19-cd7b-4c22-b9b0-273d4b1639e4";
  TSS.submitLead = function(payload){
    if(!TSS.WEB3FORMS_ACCESS_KEY || TSS.WEB3FORMS_ACCESS_KEY.indexOf("PASTE_YOUR_") === 0){
      return; // not configured yet — no-op, primary sms:/mailto: flow is unaffected
    }
    var body = Object.assign({ access_key: TSS.WEB3FORMS_ACCESS_KEY }, payload);
    try{
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(body)
      }).catch(function(){ /* silent — sms:/mailto: already carried the lead */ });
    }catch(e){ /* no-op */ }
  };

  // ---- Analytics events (Vercel Analytics custom events) ----
  // The queue shim below lets us call TSS.trackEvent(...) even before
  // /_vercel/insights/script.js has finished loading — it just queues the
  // calls, same as Vercel's own documented pattern.
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  TSS.trackEvent = function(name, data){
    try{ window.va("event", data ? { name: name, data: data } : { name: name }); }catch(e){ /* no-op */ }
  };
  // Any element with data-track="event_name" gets tracked on click automatically.
  document.addEventListener("click", function(e){
    var el = e.target.closest("[data-track]");
    if(el){ TSS.trackEvent(el.getAttribute("data-track")); }
  });

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
