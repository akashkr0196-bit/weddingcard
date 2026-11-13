/* Puts the client's details over the sample before the page scripts start.
   In the editor the live form wins; on a saved card window.__WV_WD wins. */
(function () {
  var S = window.__TMN_SAMPLE, live = null;
  try { if (window.parent !== window && window.parent.__WV_FORM_CFG) live = window.parent.__WV_FORM_CFG(); } catch (e) {}
  var C = live || window.__WV_WD || {}, D = JSON.parse(JSON.stringify(S));
  (function merge(a, b) {
    Object.keys(b || {}).forEach(function (k) {
      var x = b[k];
      if (x && typeof x === 'object' && !Array.isArray(x) && a[k] && typeof a[k] === 'object') merge(a[k], x); else a[k] = x;
    });
  })(D, C);
  window.__TMN = D;
  window.__TM_SONG = D.song || './assets/bgm.mp3';
})();
