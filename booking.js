(function(){
  "use strict";
  var root = document;
  var SERVICES = window.SERVICES || [];
  var ADDON_SERVICES = SERVICES.filter(function(s){ return s.addon; });

  var state = { service:null, addons:[], vehicleType:null, vehicleDesc:"", address:"", date:"", timeWindow:null, fullName:"", phone:"", email:"", referredBy:"", notes:"" };
  var currentStep = 1;
  var TOTAL_STEPS = 5;

  var serviceOptions = root.querySelector("#serviceOptions");
  var addonCheckWrap = root.querySelector("#addonChecklist");

  SERVICES.forEach(function(svc){
    var opt = document.createElement("label");
    opt.className = "option-card";
    opt.setAttribute("data-svc-option", svc.id);
    opt.innerHTML = '<input type="radio" name="service" value="' + svc.id + '"><strong>' + svc.name + '</strong><span>' + svc.blurb + '</span>';
    serviceOptions.appendChild(opt);
  });

  ADDON_SERVICES.forEach(function(svc){
    var row = document.createElement("label");
    row.className = "addon-check-row";
    row.setAttribute("data-addon-option", svc.id);
    row.innerHTML =
      '<input type="checkbox" name="addons" value="' + svc.id + '">' +
      '<span class="addon-check-name">' + svc.name + (svc.price ? ' <em>' + svc.price + '</em>' : '') + '</span>';
    addonCheckWrap.appendChild(row);
  });

  function svcName(id){
    var m = SERVICES.filter(function(s){ return s.id === id; })[0];
    return m ? m.name.replace(/&amp;/g,"&") : "";
  }

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
      if(input.name === "service"){ refreshAddonChecklist(); }
    });
  });

  // Hide the addon checkbox that matches whatever's picked as the primary
  // service, so nothing gets offered as "extra" alongside itself.
  function refreshAddonChecklist(){
    var picked = root.querySelector('input[name="service"]:checked');
    var pickedId = picked ? picked.value : null;
    root.querySelectorAll("[data-addon-option]").forEach(function(row){
      var isSelf = row.getAttribute("data-addon-option") === pickedId;
      row.style.display = isSelf ? "none" : "";
      if(isSelf){
        var cb = row.querySelector('input[type="checkbox"]');
        if(cb){ cb.checked = false; }
      }
    });
  }

  // ---- pre-select a service from ?service=ID in the URL (linked from services.html) ----
  (function preselectFromQuery(){
    var params = new URLSearchParams(window.location.search);
    var svcId = params.get("service");
    if(svcId && SERVICES.some(function(s){ return s.id === svcId; })){
      selectRadio("service", svcId);
      state.service = svcId;
      refreshAddonChecklist();
    }
  })();

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
      state.addons = Array.from(root.querySelectorAll('input[name="addons"]:checked')).map(function(cb){ return cb.value; });
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
    state = { service:null, addons:[], vehicleType:null, vehicleDesc:"", address:"", date:"", timeWindow:null, fullName:"", phone:"", email:"", referredBy:"", notes:"" };
    root.querySelector("#copyFeedback").style.display = "none";
    refreshAddonChecklist();
    goToStep(1);
  }

  function fmtDate(iso){
    if(!iso) return "—";
    var parts = iso.split("-");
    if(parts.length !== 3) return iso;
    var d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return d.toLocaleDateString(undefined, { weekday:"short", month:"short", day:"numeric", year:"numeric" });
  }

  function addonNames(){
    return state.addons.map(function(id){ return svcName(id); }).filter(Boolean);
  }

  function buildMessage(){
    var lines = [
      "Hi Tri-State Shine, I'd like to request a booking:",
      "Service: " + (svcName(state.service) || "—")
    ];
    if(state.addons.length){ lines.push("Add-ons: " + addonNames().join(", ")); }
    lines.push(
      "Vehicle: " + (state.vehicleType || "—") + (state.vehicleDesc ? " (" + state.vehicleDesc + ")" : ""),
      "Address: " + (state.address || "—"),
      "Date: " + fmtDate(state.date) + (state.timeWindow ? ", " + state.timeWindow : ""),
      "Name: " + (state.fullName || "—"),
      "Phone: " + (state.phone || "—")
    );
    if(state.email){ lines.push("Email: " + state.email); }
    if(state.referredBy){ lines.push("Referred by: " + state.referredBy + " (referral — $20 off this booking, $20 to referrer once complete)"); }
    if(state.notes){ lines.push("Notes: " + state.notes); }
    return lines.join("\n");
  }

  function renderReview(){
    var list = root.querySelector("#reviewList");
    var rows = [
      ["Service", svcName(state.service) || "—"]
    ];
    if(state.addons.length){ rows.push(["Add-ons", addonNames().join(", ")]); }
    rows.push(
      ["Vehicle", (state.vehicleType || "—") + (state.vehicleDesc ? " · " + state.vehicleDesc : "")],
      ["Address", state.address || "—"],
      ["Date", fmtDate(state.date)],
      ["Time", state.timeWindow || "—"],
      ["Name", state.fullName || "—"],
      ["Phone", state.phone || "—"]
    );
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
  root.querySelector("#sendTextBtn").addEventListener("click", function(){
    submitLeadBackup();
    if(window.TSS && TSS.trackEvent){ TSS.trackEvent("booking_lead_sent_text", { service: state.service, addons: state.addons.join(",") }); }
  });
  root.querySelector("#sendEmailBtn").addEventListener("click", function(){
    submitLeadBackup();
    if(window.TSS && TSS.trackEvent){ TSS.trackEvent("booking_lead_sent_email", { service: state.service, addons: state.addons.join(",") }); }
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

  refreshAddonChecklist();
  goToStep(1);
})();
