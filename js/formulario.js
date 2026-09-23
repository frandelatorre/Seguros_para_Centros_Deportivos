// Entrena Seguro · formulario de la guía y de contacto. Envía a Google Apps Script (ver js/config.js).
(function () {
  'use strict';

  var URL = (window.ENTRENA_CONFIG || {}).APPS_SCRIPT_URL || '';
  var cargada = Date.now();

  function conectado() {
    return /^https:\/\/script\.google\.com\/(a\/macros\/[^/]+|macros)\/s\/[^/]+\/exec$/.test(URL);
  }
  function emailValido(v) { return /^[^\s@'"<>=+\-][^\s@'"<>]*@[^\s@'"<>]+\.[^\s@'"<>]{2,}$/.test(String(v || '').trim()); }
  function telefonoValido(v) {
    var n = String(v || '').replace(/[^\d]/g, '').length;
    return n >= 9 && n <= 15;
  }
  function parametro(nombre) {
    try { return (new URLSearchParams(window.location.search).get(nombre) || '').slice(0, 60); } catch (e) { return ''; }
  }
  function mensaje(form, texto, ok) {
    var el = form.querySelector('.form-mensaje');
    if (!el) return;
    el.hidden = false;
    el.classList.toggle('form-mensaje--error', !ok);
    el.textContent = '';
    setTimeout(function () { el.textContent = texto; }, 30); // para que los lectores de pantalla lo anuncien
    return el;
  }
  function marcar(campo, error) { if (campo) campo.setAttribute('aria-invalid', error ? 'true' : 'false'); }
  function lista(xs) { return xs.length > 1 ? xs.slice(0, -1).join(', ') + ' y ' + xs[xs.length - 1] : xs[0]; }

  var ERRORES = {
    email: 'El email no parece válido.',
    comunidad: 'Elige tu comunidad.',
    contacto_incompleto: 'Para que te llamen necesitamos tu nombre, un teléfono válido y el nombre del centro.',
    limite: 'Ahora mismo no podemos recibir más solicitudes. Inténtalo más tarde o escríbenos a info@entrenaseguro.es.',
    rapido: 'Vuelve a pulsar el botón, por favor.',
    ocupado: 'Estamos ocupados. Inténtalo de nuevo en un momento.',
    interno: 'Algo ha fallado. Inténtalo de nuevo o escríbenos a info@entrenaseguro.es.'
  };

  document.querySelectorAll('form.form-lead').forEach(function (form) {
    var el = form.elements;
    if (parametro('utm_source')) el.canal.value = parametro('utm_source');
    if (parametro('utm_campaign')) el.campana.value = parametro('utm_campaign');

    var casilla = form.querySelector('[data-toggle-contacto]');
    var bloque = form.querySelector('[data-campos-contacto]');
    function actualizarContacto() {
      var on = casilla.checked;
      bloque.hidden = !on;
      ['nombre', 'telefono', 'centro', 'mensaje'].forEach(function (n) {
        el[n].disabled = !on;                 // si no pide contacto, estos datos no se envían
        if (n !== 'mensaje') el[n].required = on;
      });
    }
    if (casilla && bloque) {
      if (parametro('contacto') === '1') casilla.checked = true;
      casilla.addEventListener('change', actualizarContacto);
      actualizarContacto();
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var faltan = [];
      var okEmail = emailValido(el.email.value); marcar(el.email, !okEmail); if (!okEmail) faltan.push('un email válido');
      marcar(el.comunidad, !el.comunidad.value); if (!el.comunidad.value) faltan.push('tu comunidad');
      if (el.tipo_centro && el.tipo_centro.tagName === 'SELECT') {
        marcar(el.tipo_centro, !el.tipo_centro.value); if (!el.tipo_centro.value) faltan.push('el tipo de centro');
      }
      var contacto = casilla && casilla.checked;
      if (contacto) {
        marcar(el.nombre, !el.nombre.value.trim()); if (!el.nombre.value.trim()) faltan.push('tu nombre');
        var okTel = telefonoValido(el.telefono.value); marcar(el.telefono, !okTel); if (!okTel) faltan.push('un teléfono válido');
        marcar(el.centro, !el.centro.value.trim()); if (!el.centro.value.trim()) faltan.push('el nombre del centro');
      }
      if (faltan.length) {
        mensaje(form, 'Revisa el formulario: falta ' + lista(faltan) + '.', false);
        var primero = form.querySelector('[aria-invalid="true"]');
        if (primero) primero.focus();
        return;
      }
      if (!conectado()) {
        mensaje(form, 'El formulario todavía no está conectado. No se ha enviado nada.', false);
        return;
      }

      el.ms.value = String(Date.now() - cargada);
      var boton = form.querySelector('button[type="submit"]');
      var textoBoton = boton.textContent;
      boton.disabled = true;
      boton.textContent = 'Enviando…';

      function fallo(texto) {
        boton.disabled = false;
        boton.textContent = textoBoton;
        mensaje(form, texto, false);
      }

      fetch(URL, { method: 'POST', body: new URLSearchParams(new FormData(form)) })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (!res || !res.ok) { fallo(ERRORES[res && res.error] || ERRORES.interno); return; }
          var email = el.email.value.trim();
          Array.prototype.forEach.call(form.children, function (n) {
            if (!n.classList.contains('form-mensaje')) n.hidden = true;
          });
          var texto = 'Hecho. En unos minutos te llegará la guía a ' + email + '. Si no la ves, mira en spam o promociones.';
          if (el.acepta_emails.checked) texto += ' Si todavía no habías confirmado los 4 emails, en ese mismo email tienes el enlace para hacerlo.';
          if (res.contacto) texto += ' Hemos pasado tus datos a un mediador de seguros, que se pondrá en contacto contigo.';
          var nodo = mensaje(form, texto, true);
          if (nodo) { nodo.tabIndex = -1; nodo.focus(); }
          var barra = document.querySelector('.barra-fija');
          if (barra) barra.remove();
        })
        .catch(function () {
          fallo('No hemos podido confirmar el envío. Si en unos minutos no te llega la guía, vuelve a intentarlo o escríbenos a info@entrenaseguro.es.');
        });
    });
  });
})();
