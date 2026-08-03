(function(){
  "use strict";

  function setInvalid(fieldEl, invalid){
    if(!fieldEl) return;
    fieldEl.classList.toggle("invalid", invalid);
  }

  function buildMessage(){
    var name = document.getElementById("cName").value.trim();
    var phone = document.getElementById("cPhone").value.trim();
    var email = document.getElementById("cEmail").value.trim();
    var reason = document.querySelector('input[name="reason"]:checked');
    var message = document.getElementById("cMessage").value.trim();

    var lines = ["Hi Tri-State Shine,"];
    if(reason){ lines.push("Reason: " + reason.value); }
    if(message){ lines.push("Message: " + message); }
    lines.push("Name: " + (name || "—"));
    lines.push("Phone: " + (phone || "—"));
    if(email){ lines.push("Email: " + email); }
    return lines.join("\n");
  }

  function refreshLink(){
    var msg = buildMessage();
    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    var sep = isIOS ? "&" : "?";
    var textBtn = document.getElementById("sendTextBtn");
    textBtn.href = "sms:+19143864984" + sep + "body=" + encodeURIComponent(msg);

    var reason = document.querySelector('input[name="reason"]:checked');
    var subject = "Website Contact" + (reason ? " — " + reason.value : "");
    var emailBtn = document.getElementById("sendEmailBtn");
    emailBtn.href = "mailto:chrisrod10.08@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(msg);
  }

  var form = document.getElementById("contactForm");
  form.addEventListener("input", refreshLink);
  refreshLink();

  function validateRequired(){
    var nameEl = document.getElementById("cName");
    var phoneEl = document.getElementById("cPhone");
    var msgEl = document.getElementById("cMessage");
    var nameOk = !!nameEl.value.trim();
    var phoneOk = !!phoneEl.value.trim();
    var msgOk = !!msgEl.value.trim();
    setInvalid(nameEl.closest(".field"), !nameOk);
    setInvalid(phoneEl.closest(".field"), !phoneOk);
    setInvalid(msgEl.closest(".field"), !msgOk);
    return nameOk && phoneOk && msgOk;
  }

  document.getElementById("sendTextBtn").addEventListener("click", function(e){
    if(!validateRequired()){ e.preventDefault(); return; }
    refreshLink();
  });

  document.getElementById("sendEmailBtn").addEventListener("click", function(e){
    if(!validateRequired()){ e.preventDefault(); return; }
    refreshLink();
  });

  document.getElementById("copyBtn").addEventListener("click", function(){
    var msg = buildMessage();
    var feedback = document.getElementById("copyFeedback");
    function shown(){ feedback.style.display = "inline"; setTimeout(function(){ feedback.style.display = "none"; }, 2200); }
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(msg).then(shown).catch(function(){ fallbackCopy(msg); shown(); });
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
})();
