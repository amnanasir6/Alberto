// extras.js — visitor counter, live ticker (date/time/geolocation), price list, nav active state
document.addEventListener('DOMContentLoaded', function () {

  // ===== 1. VISITOR COUNTER (counts once per browser session, stored in localStorage) =====
  (function () {
    var el = document.getElementById('visitorCount');
    if (!el) return;
    var count = 0;
    try {
      count = parseInt(localStorage.getItem('albertoVisitors'), 10) || 0;
      if (!sessionStorage.getItem('albertoCounted')) {
        count += 1;
        localStorage.setItem('albertoVisitors', String(count));
        sessionStorage.setItem('albertoCounted', '1');
      }
    } catch (e) { count = count || 1; }
    el.textContent = String(count).padStart(6, '0');
  })();

  // ===== 2. SCROLLING TICKER: live date, time, location =====
  (function () {
    var track = document.getElementById('tickerTrack');
    if (!track) return;
    var locEls = [];

    function paint() {
      var now = new Date();
      var d = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      var t = now.toLocaleTimeString('en-GB');
      document.querySelectorAll('.js-date').forEach(function (n) { n.textContent = d; });
      document.querySelectorAll('.js-time').forEach(function (n) { n.textContent = t; });
      var lt = document.getElementById('liveTime');
      if (lt) lt.textContent = t;
    }
    paint();
    setInterval(paint, 1000);

    function setLoc(text) {
      document.querySelectorAll('.js-loc').forEach(function (n) { n.textContent = text; });
    }

    // duplicate the set once so the -50% loop is seamless (clone keeps the js- classes)
    var originals = Array.prototype.slice.call(track.children);
    originals.forEach(function (n) { track.appendChild(n.cloneNode(true)); });
    paint();
    setLoc('Locating…');

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(function (pos) {
        var lat = pos.coords.latitude.toFixed(4), lon = pos.coords.longitude.toFixed(4);
        setLoc('Lat ' + lat + ', Lon ' + lon);
        // optional friendlier place name; silently keeps coordinates if blocked/offline
        fetch('https://nominatim.openstreetmap.org/reverse?format=json&zoom=10&lat=' + lat + '&lon=' + lon)
          .then(function (r) { return r.json(); })
          .then(function (j) {
            var a = j.address || {};
            var place = [a.city || a.town || a.village || a.county, a.country].filter(Boolean).join(', ');
            if (place) setLoc(place + ' (' + lat + ', ' + lon + ')');
          }).catch(function () {});
      }, function () {
        setLoc('Location unavailable (permission denied)');
      }, { timeout: 10000 });
    } else {
      setLoc('Geolocation not supported');
    }
  })();

  // ===== 3. COMPLETE PRICE LIST (built from the product cards so it never goes out of date) =====
  (function () {
    var body = document.getElementById('priceBody');
    var filter = document.getElementById('plFilter');
    if (!body) return;
    var names = { men: "Men's", women: "Women's", luxury: 'Luxury', smart: 'Smart Watches', vintage: 'Vintage', wall: 'Wall & Desk Clock' };
    var cards = document.querySelectorAll('#watchesList .watch-card');
    var rows = [];
    cards.forEach(function (card) {
      var name = card.querySelector('h3').textContent.trim();
      var spec = (card.querySelector('.spec') || {}).textContent || '';
      var price = card.querySelector('.price b').textContent.trim();
      var cat = card.getAttribute('data-cat');
      var tr = document.createElement('tr');
      tr.className = 'pl-row';
      tr.setAttribute('data-cat', cat);
      tr.innerHTML = '<td></td><td class="pl-cat"></td><td></td><td class="pl-price"></td>';
      tr.children[0].textContent = name;
      tr.children[1].textContent = names[cat] || cat;
      tr.children[2].textContent = spec;
      tr.children[3].textContent = price;
      tr.addEventListener('click', function () { card.click(); });
      body.appendChild(tr);
      rows.push(tr);
    });
    if (filter) {
      filter.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        filter.querySelectorAll('button').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        var f = b.getAttribute('data-f');
        rows.forEach(function (r) { r.style.display = (f === 'all' || r.getAttribute('data-cat') === f) ? '' : 'none'; });
      });
    }
  })();

  // ===== 4. NAV: clicked + current-section colour =====
  (function () {
    var links = Array.prototype.slice.call(document.querySelectorAll('.site-header .nav-links > .nav-item > .nav-link'));
    function setActive(a) { links.forEach(function (l) { l.classList.toggle('active', l === a); }); }
    links.forEach(function (l) { l.addEventListener('click', function () { setActive(l); }); });
    var map = links.map(function (l) { return { a: l, sec: document.querySelector(l.getAttribute('href')) }; })
                   .filter(function (x) { return x.sec; });
    window.addEventListener('scroll', function () {
      var y = window.scrollY + 140, cur = null;
      map.forEach(function (x) { if (x.sec.offsetTop <= y) cur = x.a; });
      setActive(cur);
    }, { passive: true });
  })();
  // ===== 5. WELCOME POPUP (shows once per browser session, ~2.5s after load) =====
  (function () {
    var ov = document.getElementById('welcomeOverlay');
    if (!ov) return;
    try { if (sessionStorage.getItem('albertoWelcomeSeen')) return; } catch (e) {}
    function open() { ov.classList.add('open'); ov.setAttribute('aria-hidden', 'false'); }
    function close() {
      ov.classList.remove('open'); ov.setAttribute('aria-hidden', 'true');
      try { sessionStorage.setItem('albertoWelcomeSeen', '1'); } catch (e) {}
    }
    setTimeout(open, 2500);
    ['welcomeClose', 'welcomeSkip', 'welcomeCta'].forEach(function (id) {
      var b = document.getElementById(id); if (b) b.addEventListener('click', close);
    });
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && ov.classList.contains('open')) close(); });
  })();
});
