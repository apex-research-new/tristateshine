(function(){
  "use strict";
  var svcGrid = document.querySelector("#svcGrid");
  var addonGrid = document.querySelector("#addonGrid");
  if(!svcGrid || !addonGrid || !window.SERVICES) return;

  window.SERVICES.forEach(function(svc){
    if(svc.core){
      var card = document.createElement("div");
      card.className = "svc-card" + (svc.badge ? " svc-card-featured" : "");
      card.innerHTML =
        (svc.badge ? '<span class="svc-badge">' + svc.badge + '</span>' : '') +
        '<svg class="svc-icon" viewBox="0 0 48 48" fill="none">' + svc.icon + '</svg>' +
        '<h3>' + svc.name + '</h3>' +
        '<p>' + svc.blurb + '</p>' +
        '<a class="svc-book" href="book.html?service=' + svc.id + '" data-track="book_click">Book this <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></a>';
      svcGrid.appendChild(card);
    } else {
      var addon = document.createElement("div");
      addon.className = "addon-card";
      addon.innerHTML =
        '<svg class="addon-icon" viewBox="0 0 48 48" fill="none">' + svc.icon + '</svg>' +
        '<h4>' + svc.name + (svc.price ? ' <span class="addon-price">' + svc.price + '</span>' : '') + '</h4>' +
        '<p>' + svc.blurb + '</p>' +
        '<a class="addon-book" href="book.html?service=' + svc.id + '" data-track="book_click">Book this <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></a>';
      addonGrid.appendChild(addon);
    }
  });
})();
