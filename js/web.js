// Entrena Seguro · comportamiento común. Sin cookies ni almacenamiento local.
(function () {
  'use strict';
  // Menú en móvil
  var boton = document.querySelector('.menu-boton');
  var menu = document.getElementById('menu');
  if (boton && menu) {
    boton.addEventListener('click', function () {
      var abierto = menu.classList.toggle('abierto');
      boton.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('abierto');
        boton.setAttribute('aria-expanded', 'false');
      });
    });
  }
  // Móvil: barra fija con el botón de la guía mientras el formulario no está en pantalla
  var barra = document.querySelector('.barra-fija');
  var formulario = document.getElementById('guia');
  if (barra && formulario && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entradas) {
      var visible = !entradas[0].isIntersecting;
      barra.classList.toggle('visible', visible);
      barra.setAttribute('aria-hidden', visible ? 'false' : 'true');
      barra.querySelectorAll('a').forEach(function (a) { a.tabIndex = visible ? 0 : -1; });
    }).observe(formulario);
  }
})();
