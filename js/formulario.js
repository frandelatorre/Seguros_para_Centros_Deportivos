// Entrena Seguro · formulario de la guía y de contacto. Envía a Google Apps Script (ver js/config.js), que guarda una fila por envío.
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

  // Cuenta la visita para medir de la visita al formulario. Sin cookies ni datos personales: solo la página y el canal.
  // No se cuenta si la web no está conectada ni en navegadores automatizados.
  var visitaContada = false;
  function contarVisita(pagina, canal) {
    if (visitaContada || !conectado() || navigator.webdriver) return;
    visitaContada = true;
    try {
      fetch(URL, { method: 'POST', keepalive: true, body: new URLSearchParams({ accion: 'visita', pagina: pagina, canal: canal }) }).catch(function () {});
    } catch (e) { /* una visita perdida no importa */ }
  }

  document.querySelectorAll('form.form-lead').forEach(function (form) {
    var el = form.elements;
    if (parametro('utm_source')) el.canal.value = parametro('utm_source');
    contarVisita(el.pagina.value, el.canal.value);
    if (parametro('utm_campaign')) el.campana.value = parametro('utm_campaign');
    // Enlaces del PDF de la guía: capítulo de origen, comunidad ya elegida y aviso visual en la pregunta de contacto.
    if (el.capitulo && parametro('utm_content')) el.capitulo.value = parametro('utm_content');
    var comunidadUrl = parametro('comunidad');
    if (comunidadUrl && el.comunidad && el.comunidad.tagName === 'SELECT') {
      Array.prototype.forEach.call(el.comunidad.options, function (o) {
        if (o.value && o.text === comunidadUrl) el.comunidad.value = o.value;   // solo si coincide exactamente con una opción
      });
    }

    var bloque = form.querySelector('[data-campos-contacto]');
    function eleccion(nombre) {
      var marcada = form.querySelector('input[name="' + nombre + '"]:checked');
      return marcada ? marcada.value : '';
    }
    function actualizarContacto() {
      var on = eleccion('quiere_contacto') === 'si';
      bloque.hidden = !on;
      ['nombre', 'telefono', 'centro', 'mensaje'].forEach(function (n) {
        el[n].disabled = !on;                 // si no pide contacto, estos datos no se envían
        if (n !== 'mensaje') el[n].required = on;
      });
    }
    if (bloque) {
      form.querySelectorAll('input[name="quiere_contacto"]').forEach(function (r) {
        r.addEventListener('change', actualizarContacto);
      });
      actualizarContacto();
    }
    // Quien llega desde el PDF ya tiene la guía: no se le obliga a aceptar los emails para nada (elige emails, llamada o las dos).
    var desdeGuia = parametro('utm_source') === 'guia';
    var casilla = el.acepta_emails;
    if (desdeGuia && casilla) {
      casilla.required = false;
      var textoCasilla = casilla.parentNode.querySelector('[data-texto-guia]');
      if (textoCasilla) textoCasilla.textContent = textoCasilla.getAttribute('data-texto-guia');
    }
    form.querySelectorAll('.eleccion').forEach(function (f) {
      f.addEventListener('change', function () { f.removeAttribute('aria-invalid'); });
    });
    if (casilla) casilla.addEventListener('change', function () { marcar(casilla, false); });

    // contacto=1: lleva a la persona al formulario y resalta la pregunta. NO marca ninguna respuesta: el consentimiento lo da ella.
    if (parametro('contacto') === '1') {
      var pregunta = form.querySelector('[data-grupo="quiere_contacto"]');
      if (pregunta) {
        pregunta.classList.add('eleccion--destacada');
        setTimeout(function () { pregunta.classList.remove('eleccion--destacada'); }, 6000);
        var formularioSeccion = document.getElementById('guia') || form;
        setTimeout(function () {
          try { formularioSeccion.scrollIntoView({ behavior: 'auto', block: 'start' }); } catch (e) { formularioSeccion.scrollIntoView(); }
        }, 50);
      }
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var faltan = [];
      var okEmail = emailValido(el.email.value); marcar(el.email, !okEmail); if (!okEmail) faltan.push('un email válido');
      marcar(el.comunidad, !el.comunidad.value); if (!el.comunidad.value) faltan.push('tu comunidad');
      if (el.tipo_centro && el.tipo_centro.tagName === 'SELECT') {
        marcar(el.tipo_centro, !el.tipo_centro.value); if (!el.tipo_centro.value) faltan.push('el tipo de centro');
      }
      var grupo = form.querySelector('[data-grupo="quiere_contacto"]');
      if (!eleccion('quiere_contacto')) {
        if (grupo) grupo.setAttribute('aria-invalid', 'true');
        faltan.push('decir si quieres que te llamen');
      }
      var contacto = eleccion('quiere_contacto') === 'si';
      var emails = eleccion('acepta_emails') === 'si';
      if (!desdeGuia && !emails) {
        marcar(casilla, true);
        faltan.push('marcar la casilla para recibir la guía y los emails');
      } else if (desdeGuia && !emails && !contacto) {
        marcar(casilla, true);
        faltan.push('marcar la casilla de los emails o pedir que te llamen');
      }
      if (contacto) {
        marcar(el.nombre, !el.nombre.value.trim()); if (!el.nombre.value.trim()) faltan.push('tu nombre');
        var okTel = telefonoValido(el.telefono.value); marcar(el.telefono, !okTel); if (!okTel) faltan.push('un teléfono válido');
        marcar(el.centro, !el.centro.value.trim()); if (!el.centro.value.trim()) faltan.push('el nombre del centro');
      }
      if (faltan.length) {
        mensaje(form, 'Revisa el formulario: falta ' + lista(faltan) + '.', false);
        var primero = form.querySelector('[aria-invalid="true"]');
        if (primero && primero.tagName === 'FIELDSET') primero = primero.querySelector('input');
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
          Array.prototype.forEach.call(form.children, function (n) {
            if (!n.classList.contains('form-mensaje')) n.hidden = true;
          });
          var email = el.email.value.trim();
          var texto = desdeGuia
            ? 'Hecho. Te hemos escrito a ' + email + '. Si no lo ves en unos minutos, mira en spam o promociones.'
            : 'Hecho. Te hemos enviado la guía a ' + email + '. Si no la ves en unos minutos, mira en spam o promociones.';
          if (emails) texto += ' Recibirás también nuestras novedades; puedes darte de baja con un clic desde cualquier email.';
          if (res.contacto) texto += ' Un mediador de seguros se pondrá en contacto contigo.';
          var nodo = mensaje(form, texto, true);
          if (nodo) { nodo.tabIndex = -1; nodo.focus(); }
          var barra = document.querySelector('.barra-fija');
          if (barra) barra.remove();
        })
        .catch(function () {
          fallo('No hemos podido confirmar el envío. Vuelve a intentarlo o escríbenos a info@entrenaseguro.es.');
        });
    });
  });
})();
