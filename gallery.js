(function(){
  "use strict";

  var sliders = document.querySelectorAll(".ba-slider");
  sliders.forEach(function(slider){
    var afterWrap = slider.querySelector(".ba-after-wrap");
    var handle = slider.querySelector(".ba-handle");
    var pos = 50;

    function setPos(pct){
      pos = Math.max(0, Math.min(100, pct));
      afterWrap.style.clipPath = "inset(0 " + (100 - pos) + "% 0 0)";
      handle.style.left = pos + "%";
      slider.setAttribute("aria-valuenow", Math.round(pos));
    }

    function pctFromClientX(clientX){
      var rect = slider.getBoundingClientRect();
      return ((clientX - rect.left) / rect.width) * 100;
    }

    var dragging = false;

    function onPointerDown(e){
      dragging = true;
      slider.classList.add("ba-touched");
      slider.setPointerCapture && e.pointerId != null && slider.setPointerCapture(e.pointerId);
      setPos(pctFromClientX(e.clientX));
      e.preventDefault();
    }
    function onPointerMove(e){
      if(!dragging) return;
      setPos(pctFromClientX(e.clientX));
    }
    function onPointerUp(){
      dragging = false;
    }

    slider.addEventListener("pointerdown", onPointerDown);
    slider.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    // Keyboard support
    slider.setAttribute("tabindex", "0");
    slider.setAttribute("role", "slider");
    slider.setAttribute("aria-valuemin", "0");
    slider.setAttribute("aria-valuemax", "100");
    slider.setAttribute("aria-label", "Drag to compare before and after");
    slider.addEventListener("keydown", function(e){
      if(e.key === "ArrowLeft"){ setPos(pos - 5); slider.classList.add("ba-touched"); e.preventDefault(); }
      else if(e.key === "ArrowRight"){ setPos(pos + 5); slider.classList.add("ba-touched"); e.preventDefault(); }
    });

    setPos(50);
  });
})();
