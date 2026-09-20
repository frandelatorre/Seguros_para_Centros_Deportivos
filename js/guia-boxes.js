(function () {
  'use strict';

  // === Configuración pendiente ===
  // Pega aquí la URL del "Web app" que da Google Apps Script al desplegar el
  // script (ver Code.gs / instrucciones aparte). En Apps Script:
  // Implementar > Nueva implementación > Tipo: Aplicación web >
  // Ejecutar como: Yo > Quién tiene acceso: Cualquier usuario > Implementar.
  // Mientras esta constante siga con el placeholder, el formulario no envía nada
  // y avisa por consola y con una alerta en vez de fallar en silencio.
  var APPS_SCRIPT_URL = '[PEGA_AQUI_LA_URL_DEL_WEB_APP_DE_APPS_SCRIPT]';

  function urlConfigurada() {
    return typeof APPS_SCRIPT_URL === 'string' && APPS_SCRIPT_URL.indexOf('[PEGA_AQUI') === -1;
  }

  function emailValido(valor) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(valor || '').trim());
  }

  function mostrarMensaje(elemento, texto, esExito) {
    if (!elemento) return;
    elemento.textContent = texto;
    elemento.hidden = false;
    elemento.style.color = esExito ? '#C8F03C' : '#ff9e9e';
  }

  document.addEventListener('DOMContentLoaded', function () {
    var formulario = document.getElementById('form-guia');
    if (!formulario) return;

    formulario.addEventListener('submit', function (evento) {
      evento.preventDefault();

      var mensaje = document.getElementById('form-guia-mensaje');

      if (!urlConfigurada()) {
        // Configuración pendiente: no se envía nada, solo se avisa.
        console.warn('guia-boxes.js: falta pegar la URL del Apps Script antes de activar el formulario.');
        window.alert('El formulario todavía no está conectado a ningún sitio (falta configurar el Apps Script). No se ha enviado nada.');
        return;
      }

      var campoEmail = formulario.querySelector('[name="email"]');
      var boton = formulario.querySelector('button[type="submit"]');

      if (!campoEmail || !emailValido(campoEmail.value)) {
        mostrarMensaje(mensaje, 'Revisa el email, no parece válido.', false);
        return;
      }

      var datos = new FormData(formulario);
      var textoOriginalBoton = boton.textContent;
      boton.disabled = true;
      boton.textContent = 'Enviando…';

      // mode: 'no-cors' porque Apps Script no admite fácilmente CORS legible:
      // esto significa que no podemos leer la respuesta real del servidor.
      // El fetch se resuelve igual aunque el script falle por dentro (por ejemplo,
      // por una implementación mal configurada). Si veis altas que no llegan a la
      // hoja, revisad primero el propio Apps Script antes que este archivo.
      fetch(APPS_SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: datos })
        .then(function () {
          formulario.hidden = true;
          mostrarMensaje(mensaje, 'Hecho. Revisa tu correo (y la carpeta de spam) en los próximos minutos.', true);
        })
        .catch(function (error) {
          boton.disabled = false;
          boton.textContent = textoOriginalBoton;
          console.error('guia-boxes.js: error al enviar el formulario', error);
          mostrarMensaje(mensaje, 'No se ha podido enviar. Inténtalo de nuevo en un momento.', false);
        });
    });
  });
})();
