(function(){
  "use strict";
  var root = document;

  var SERVICES = [
    { id:"express", name:"Exterior Detail", blurb:"Hand foam wash, wheel & rim cleaning, tire shine, streak-free windows, and spray sealant protection. Starting at $80.", icon:'<path d="M6 24c0-9 8-16 18-16s18 7 18 16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M10 30h28M13 36h22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' },
    { id:"full", name:"Full Detail", blurb:"The complete Interior + Exterior service, bundled with an automatic $20 discount. Starting at $180.", icon:'<rect x="8" y="16" width="32" height="18" rx="6" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="16" cy="36" r="3.2" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="32" cy="36" r="3.2" stroke="currentColor" stroke-width="2" fill="none"/>', badge:"Best Value" },
    { id:"ceramic", name:"Ceramic Coating", blurb:"Paint-safe decontamination wash followed by a hand-applied ceramic layer for lasting shine.", icon:'<path d="M24 6 34 12v12c0 10-6.5 15.5-10 18-3.5-2.5-10-8-10-18V12Z" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/>' },
    { id:"interior", name:"Interior Detail", blurb:"Complete cabin & trunk vacuum, thorough scrub and sanitize on all plastics, dash & console, leather conditioning, vent cleaning, and streak-free inner glass. Starting at $120.", icon:'<rect x="10" y="10" width="28" height="28" rx="5" stroke="currentColor" stroke-width="2" fill="none"/><path d="M16 24h16M16 30h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' },
    { id:"bugsap", name:"Bug &amp; Sap Removal", blurb:"Safe, targeted removal of bug splatter, tree sap and road grime from paint and windshield.", icon:'<circle cx="18" cy="18" r="3" fill="currentColor"/><circle cx="30" cy="14" r="2" fill="currentColor"/><circle cx="32" cy="28" r="2.6" fill="currentColor"/><path d="M8 36c8-10 24-10 32 0" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>' },
    { id:"commercial", name:"Commercial &amp; Fleet", blurb:"Recurring wash plans for business vehicles, fleets and dealerships across Westchester.", icon:'<rect x="6" y="20" width="20" height="12" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><path d="M26 24h8l6 6v2h-14z" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/><circle cx="14" cy="34" r="2.6" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="32" cy="34" r="2.6" stroke="currentColor" stroke-width="2" fill="none"/>' },
    { id:"recurring", name:"Recurring Residential Plan", blurb:"Set it and forget it — regular washes on a schedule that works for you, weekly, biweekly, or monthly. Ask us for recurring pricing.", icon:'<path d="M35 14a15 15 0 1 0 3 9" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M38 6v9h-9" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' }
  ];

  var state = { service:null, vehicleType:null, vehicleDesc:"", address:"", date:"", timeWindow:null, fullName:"", phone:"", email:"", referredBy:"", notes:"" };
  var currentStep = 1;
  var TOTAL_STEPS = 5;

  var svcGrid = root.querySelector("#svcGrid");
  var serviceOptions = root.querySelector("#serviceOptions");

  SERVICES.forEach(function(svc){
    var card = document.createElement("div");
    card.className = "svc-card" + (svc.badge ? " svc-card-featured" : "");
    card.innerHTML =
      (svc.badge ? '<span class="svc-badge">' + svc.badge + '</span>' : '') +
      '<svg class="svc-icon" viewBox="0 0 48 48" fill="none">' + svc.icon + '</svg>' +
      '<h3>' + svc.name + '</h3>' +
      '<p>' + svc.blurb + '</p>' +
      '<button type="button" class="svc-book" data-svc="' + svc.id + '">Book this <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>';
    svcGrid.appendChild(card);

    var opt = document.createElement("label");
    opt.className = "option-card";
    opt.setAttribute("data-svc-option", svc.id);
    opt.innerHTML = '<input type="radio" name="service" value="' + svc.id + '"><strong>' + svc.name + '</strong><span>' + svc.blurb + '</span>';
    serviceOptions.appendChild(opt);
  });

  function svcName(id){
    var m = SERVICES.filter(function(s){ return s.id === id; })[0];
    return m ? m.name.replace(/&amp;/g,"&") : "";
  }

  root.querySelectorAll(".svc-book").forEach(function(btn){
    btn.addEventListener("click", function(){
      var id = btn.getAttribute("data-svc");
      selectRadio("service", id);
      state.service = id;
      goToStep(1);
      scrollToBooking();
    });
  });

  function selectRadio(name, value){
    root.querySelectorAll('input[name="' + name + '"]').forEach(function(input){
      input.checked = (input.value === value);
      var card = input.closest(".option-card");
      if(card){ card.classList.toggle("selected", input.checked); }
    });
  }

  root.querySelectorAll('input[name="service"], input[name="vehicleType"]').forEach(function(input){
    input.addEventListener("change", function(){
      root.querySelectorAll('input[name="' + input.name + '"]').forEach(function(i){
        var card = i.closest(".option-card");
        if(card){ card.classList.toggle("selected", i.checked); }
      });
    });
  });

  function scrollToBooking(){
    var el = root.querySelector("#booking");
    if(el){ el.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block:"start" }); }
  }

  root.querySelector("#navBookBtn").addEventListener("click", function(e){ e.preventDefault(); goToStep(1); scrollToBooking(); });
  root.querySelector("#heroBookBtn").addEventListener("click", function(e){ e.preventDefault(); goToStep(1); scrollToBooking(); });

  // ---- step machine ----
  var panels = root.querySelectorAll(".step-panel");
  var segs = root.querySelectorAll(".progress-seg");
  var labels = root.querySelectorAll(".step-labels span");
  var backBtn = root.querySelector("#backBtn");
  var nextBtn = root.querySelector("#nextBtn");

  function goToStep(n){
    currentStep = Math.max(1, Math.min(TOTAL_STEPS, n));
    panels.forEach(function(p){ p.classList.toggle("active", Number(p.getAttribute("data-step")) === currentStep); });
    segs.forEach(function(s){
      var idx = Number(s.getAttribute("data-seg"));
      s.classList.toggle("done", idx < currentStep);
      s.classList.toggle("active", idx === currentStep);
    });
    labels.forEach(function(l){ l.classList.toggle("on", Number(l.getAttribute("data-label")) <= currentStep); });
    backBtn.disabled = currentStep === 1;
    nextBtn.textContent = currentStep === TOTAL_STEPS ? "Start Over" : (currentStep === 4 ? "Review Request" : "Continue");
    if(currentStep === TOTAL_STEPS){ renderReview(); }
  }

  function setInvalid(fieldEl, invalid){
    if(!fieldEl) return;
    fieldEl.classList.toggle("invalid", invalid);
  }

  function validateStep(n){
    if(n === 1){
      var svc = root.querySelector('input[name="service"]:checked');
      state.service = svc ? svc.value : null;
      return !!state.service;
    }
    if(n === 2){
      var vt = root.querySelector('input[name="vehicleType"]:checked');
      state.vehicleType = vt ? vt.value : null;
      var errBox = root.querySelector("#vehicleTypeErrorField");
      errBox.style.display = state.vehicleType ? "none" : "block";
      state.vehicleDesc = root.querySelector("#vehicleDesc").value.trim();
      return !!state.vehicleType;
    }
    if(n === 3){
      var addressInput = root.querySelector("#address");
      var dateInput = root.querySelector("#date");
      var tw = root.querySelector('input[name="timeWindow"]:checked');
      state.address = addressInput.value.trim();
      state.date = dateInput.value;
      state.timeWindow = tw ? tw.value : null;
      var dField = dateInput.closest(".field");
      setInvalid(dField, !state.date);
      return !!state.date;
    }
    if(n === 4){
      var nameInput = root.querySelector("#fullName");
      var phoneInput = root.querySelector("#phone");
      state.fullName = nameInput.value.trim();
      state.phone = phoneInput.value.trim();
      state.email = root.querySelector("#email").value.trim();
      state.referredBy = root.querySelector("#referredBy").value.trim();
      state.notes = root.querySelector("#notes").value.trim();
      var nameField = nameInput.closest(".field");
      var phoneField = phoneInput.closest(".field");
      setInvalid(nameField, !state.fullName);
      setInvalid(phoneField, !state.phone);
      return !!(state.fullName && state.phone);
    }
    return true;
  }

  nextBtn.addEventListener("click", function(){
    if(currentStep === TOTAL_STEPS){
      resetForm();
      return;
    }
    if(!validateStep(currentStep)){ return; }
    goToStep(currentStep + 1);
    root.querySelector(".ticket").scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block:"start" });
  });
  backBtn.addEventListener("click", function(){ goToStep(currentStep - 1); });

  function resetForm(){
    root.querySelector("#bookingForm").reset();
    root.querySelectorAll(".option-card.selected").forEach(function(c){ c.classList.remove("selected"); });
    state = { service:null, vehicleType:null, vehicleDesc:"", address:"", date:"", timeWindow:null, fullName:"", phone:"", email:"", referredBy:"", notes:"" };
    root.querySelector("#copyFeedback").style.display = "none";
    goToStep(1);
  }

  function fmtDate(iso){
    if(!iso) return "—";
    var parts = iso.split("-");
    if(parts.length !== 3) return iso;
    var d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return d.toLocaleDateString(undefined, { weekday:"short", month:"short", day:"numeric", year:"numeric" });
  }

  function buildMessage(){
    var lines = [
      "Hi Tri-State Shine, I'd like to request a booking:",
      "Service: " + (svcName(state.service) || "—"),
      "Vehicle: " + (state.vehicleType || "—") + (state.vehicleDesc ? " (" + state.vehicleDesc + ")" : ""),
      "Address: " + (state.address || "—"),
      "Date: " + fmtDate(state.date) + (state.timeWindow ? ", " + state.timeWindow : ""),
      "Name: " + (state.fullName || "—"),
      "Phone: " + (state.phone || "—")
    ];
    if(state.email){ lines.push("Email: " + state.email); }
    if(state.referredBy){ lines.push("Referred by: " + state.referredBy + " (referral — $20 off this booking, $20 to referrer once complete)"); }
    if(state.notes){ lines.push("Notes: " + state.notes); }
    return lines.join("\n");
  }

  function renderReview(){
    var list = root.querySelector("#reviewList");
    var rows = [
      ["Service", svcName(state.service) || "—"],
      ["Vehicle", (state.vehicleType || "—") + (state.vehicleDesc ? " · " + state.vehicleDesc : "")],
      ["Address", state.address || "—"],
      ["Date", fmtDate(state.date)],
      ["Time", state.timeWindow || "—"],
      ["Name", state.fullName || "—"],
      ["Phone", state.phone || "—"]
    ];
    if(state.email){ rows.push(["Email", state.email]); }
    if(state.referredBy){ rows.push(["Referred by", state.referredBy + " ($20 off + $20 referral)"]); }
    if(state.notes){ rows.push(["Notes", state.notes]); }
    list.innerHTML = rows.map(function(r){
      return "<li><dt>" + r[0] + "</dt><dd>" + escapeHtml(r[1]) + "</dd></li>";
    }).join("");

    var msg = buildMessage();
    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    var sep = isIOS ? "&" : "?";
    var textBtn = root.querySelector("#sendTextBtn");
    textBtn.href = "sms:+19143864984" + sep + "body=" + encodeURIComponent(msg);

    var emailBtn = root.querySelector("#sendEmailBtn");
    var subject = "Booking Request — " + (svcName(state.service) || "Tri-State Shine");
    emailBtn.href = "mailto:chrisrod10.08@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(msg);
  }

  function submitLeadBackup(){
    if(window.TSS && TSS.submitLead){
      TSS.submitLead({
        subject: "Booking Request — " + (svcName(state.service) || "Tri-State Shine"),
        name: state.fullName,
        phone: state.phone,
        email: state.email || undefined,
        message: buildMessage()
      });
    }
  }
  // Google Ads conversion — "Book appointment" (fires once per completed request)
  function trackBookingConversion(){
    if(typeof gtag === "function"){
      try{ gtag('event', 'conversion', {'send_to': 'AW-18371223681/nISpCPGShtwcEIHBirhE'}); }catch(e){ /* no-op */ }
    }
  }
  root.querySelector("#sendTextBtn").addEventListener("click", function(){
    submitLeadBackup();
    trackBookingConversion();
    if(window.TSS && TSS.trackEvent){ TSS.trackEvent("booking_lead_sent_text", { service: state.service }); }
  });
  root.querySelector("#sendEmailBtn").addEventListener("click", function(){
    submitLeadBackup();
    trackBookingConversion();
    if(window.TSS && TSS.trackEvent){ TSS.trackEvent("booking_lead_sent_email", { service: state.service }); }
  });

  function escapeHtml(str){
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  root.querySelector("#copyBtn").addEventListener("click", function(){
    var msg = buildMessage();
    var feedback = root.querySelector("#copyFeedback");
    function shown(){ feedback.style.display = "inline"; setTimeout(function(){ feedback.style.display = "none"; }, 2200); }
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(msg).then(shown).catch(function(){
        fallbackCopy(msg); shown();
      });
    } else {
      fallbackCopy(msg); shown();
    }
  });

  function fallbackCopy(text){
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try{ document.execCommand("copy"); }catch(e){}
    document.body.removeChild(ta);
  }

  // set min date to today
  var dateInput = root.querySelector("#date");
  var today = new Date();
  var iso = today.getFullYear() + "-" + String(today.getMonth()+1).padStart(2,"0") + "-" + String(today.getDate()).padStart(2,"0");
  dateInput.setAttribute("min", iso);

  goToStep(1);
})();
