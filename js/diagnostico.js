// Diagnóstico · versión de prueba
// Todo ocurre en el navegador y en memoria: no hay envío, ni peticiones de red,
// ni cookies, ni localStorage. Al recargar la página se pierde todo.
(function () {
  var TOTAL = 7;
  var pasos = Array.prototype.slice.call(document.querySelectorAll('.paso'));
  var actual = 1;
  var respuestas = {};

  var volver = document.getElementById('volver');
  var siguiente = document.getElementById('siguiente');
  var nombre = document.getElementById('paso-nombre');
  var progreso = document.getElementById('progreso');
  var barra = document.getElementById('progreso-barra');
  var nota = document.getElementById('barra-nota');

  var botones = {
    4: { texto: 'Ver mi orientación' },
    5: { texto: 'Recibe tu propuesta', nota: 'Ahora sí te pedimos tus datos de contacto' },
    7: { texto: 'Enviar y recibir mi propuesta', desactivado: true,
         nota: 'Versión de prueba: el envío está desactivado. No se envía ni se guarda nada.' }
  };

  function mostrar(n, inicial) {
    actual = n;
    pasos.forEach(function (p) { p.hidden = Number(p.dataset.paso) !== n; });
    var paso = pasos[n - 1];
    nombre.textContent = 'Paso ' + n + ' de ' + TOTAL + ' · ' + paso.dataset.nombre;
    progreso.setAttribute('aria-valuenow', String(n));
    barra.style.width = (n / TOTAL * 100) + '%';
    volver.disabled = n === 1;

    var b = botones[n] || { texto: 'Siguiente' };
    siguiente.textContent = b.texto;
    siguiente.disabled = !!b.desactivado;
    nota.hidden = !b.nota;
    nota.textContent = b.nota || '';

    if (n === 5) pintarOrientacion();
    if (!inicial) window.scrollTo(0, 0);
    var titulo = paso.querySelector('h1');
    if (titulo && !inicial) titulo.focus({ preventScroll: true });
  }

  siguiente.addEventListener('click', function () {
    if (actual < TOTAL && !siguiente.disabled) mostrar(actual + 1);
  });
  volver.addEventListener('click', function () { if (actual > 1) mostrar(actual - 1); });
  document.querySelectorAll('[data-ir]').forEach(function (b) {
    b.addEventListener('click', function () { mostrar(Number(b.dataset.ir)); });
  });

  // Grupos de chips de una sola opción
  document.querySelectorAll('[data-grupo]').forEach(function (grupo) {
    grupo.addEventListener('click', function (e) {
      var chip = e.target.closest('.chip');
      if (!chip) return;
      grupo.querySelectorAll('.chip').forEach(function (c) {
        c.setAttribute('aria-pressed', c === chip ? 'true' : 'false');
      });
      respuestas[grupo.dataset.grupo] = chip.textContent.trim();
    });
  });

  // Contadores
  document.querySelectorAll('[data-contador]').forEach(function (c) {
    var valor = c.querySelector('.contador__valor');
    respuestas[c.dataset.contador] = 0;
    c.addEventListener('click', function (e) {
      var b = e.target.closest('[data-paso-contador]');
      if (!b) return;
      var n = Math.max(0, Math.min(99, respuestas[c.dataset.contador] + Number(b.dataset.pasoContador)));
      respuestas[c.dataset.contador] = n;
      valor.textContent = n;
    });
  });

  // Paso 2: preguntas solo para Madrid
  var comunidad = document.getElementById('comunidad');
  comunidad.addEventListener('change', function () {
    document.getElementById('solo-madrid').hidden = comunidad.value !== 'Madrid';
  });

  // Paso 3: número de competiciones solo si organiza
  var actComp = document.getElementById('act-competiciones');
  actComp.addEventListener('change', function () {
    document.getElementById('bloque-competiciones').hidden = !actComp.checked;
  });

  // Paso 6: recordatorio en cuanto hay email; WhatsApp comercial solo si hay teléfono
  var email = document.getElementById('email');
  email.addEventListener('input', function () {
    document.getElementById('recordatorio').hidden = email.value.indexOf('@') < 1;
  });
  var telefono = document.getElementById('telefono');
  telefono.addEventListener('input', function () {
    document.getElementById('check-whatsapp').hidden = telefono.value.trim().length < 6;
  });

  // Paso 7: aviso de dirección postal si elige papel
  document.querySelectorAll('input[name="soporte"]').forEach(function (r) {
    r.addEventListener('change', function () {
      document.getElementById('nota-papel').hidden = !document.getElementById('soporte-papel').checked;
    });
  });

  function pintarOrientacion() {
    var partes = [];
    var com = comunidad.options[comunidad.selectedIndex];
    partes.push(comunidad.value ? com.textContent : '[comunidad]');
    if (comunidad.value === 'Madrid' && respuestas.aforo) partes.push('aforo ' + respuestas.aforo);
    if (respuestas.coaches) partes.push(respuestas.coaches + (respuestas.coaches === 1 ? ' coach autónomo' : ' coaches autónomos'));
    if (actComp.checked) partes.push('competiciones');
    if (document.getElementById('act-exterior').checked) partes.push('entrenos al aire libre');
    if (respuestas.local) partes.push('local ' + respuestas.local.toLowerCase());
    document.getElementById('resumen').textContent = partes.join(' · ');

    document.getElementById('txt-aforo').textContent =
      comunidad.value === 'Madrid' && respuestas.aforo && respuestas.aforo !== 'No lo sé'
        ? 'para aforo ' + respuestas.aforo.toLowerCase() : '';
    document.getElementById('txt-coaches').textContent = respuestas.coaches
      ? (respuestas.coaches === 1 ? 'Tu coach autónomo debe tenerla.' : 'Tus ' + respuestas.coaches + ' coaches autónomos deben tenerla.')
      : 'Si trabajas con coaches autónomos, deben tenerla.';
    document.getElementById('cob-eventos').hidden = !actComp.checked;
    document.getElementById('cob-locativa').hidden = respuestas.local === 'Propio';
  }

  // Ningún formulario de esta versión se puede enviar
  document.addEventListener('submit', function (e) { e.preventDefault(); }, true);

  mostrar(1, true);
})();
