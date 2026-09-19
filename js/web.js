// Versión de prueba: este script no envía, no guarda ni lee datos.
// No usa cookies, localStorage ni peticiones de red.
(function () {
  // Menú en móvil
  var boton = document.querySelector('.menu-boton');
  var menu = document.getElementById('menu');
  if (boton && menu) {
    boton.addEventListener('click', function () {
      var abierto = menu.classList.toggle('abierto');
      boton.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    });
  }

  // Banner de cookies de demostración: se oculta al elegir, pero no guarda la elección
  var banner = document.getElementById('cookies');
  if (banner) {
    banner.querySelectorAll('[data-cookies]').forEach(function (b) {
      b.addEventListener('click', function () { banner.hidden = true; });
    });
  }
  document.querySelectorAll('[data-mostrar-cookies]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (!banner) return;
      banner.hidden = false;
      banner.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Barra fija inferior en móvil: aparece cuando el botón principal sale de la pantalla
  var barra = document.querySelector('.barra-fija');
  var ancla = document.querySelector('[data-cta-principal]');
  if (barra && ancla && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entradas) {
      var fuera = !entradas[0].isIntersecting && entradas[0].boundingClientRect.top < 0;
      barra.classList.toggle('visible', fuera);
      barra.setAttribute('aria-hidden', fuera ? 'false' : 'true');
      barra.querySelectorAll('a').forEach(function (a) { a.tabIndex = fuera ? 0 : -1; });
    }).observe(ancla);
  }

  // Ningún formulario de esta versión se puede enviar
  document.addEventListener('submit', function (e) { e.preventDefault(); }, true);
})();
