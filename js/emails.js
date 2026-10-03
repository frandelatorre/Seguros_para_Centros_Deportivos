// Entrena Seguro · confirmar la serie de emails (?confirmar=TOKEN) o darse de baja (?baja=TOKEN).
(function () {
  'use strict';
  var URL = (window.ENTRENA_CONFIG || {}).APPS_SCRIPT_URL || '';
  var q; try { q = new URLSearchParams(window.location.search); } catch (e) { q = { get: function () { return null; } }; }
  var confirmar = q.get('confirmar');
  var baja = q.get('baja');
  var texto = document.getElementById('emails-texto');
  var boton = document.getElementById('emails-boton');

  function enviar(accion, token) {
    boton.disabled = true;
    texto.textContent = 'Un momento…';
    fetch(URL, { method: 'POST', body: new URLSearchParams({ accion: accion, token: token }) })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (!res || (res.ok === false && !res.mensaje)) throw new Error('sin confirmar');   // el servidor falló: no decir «Hecho.» si no se ha hecho
        texto.textContent = res.mensaje || 'Hecho.'; boton.hidden = true;
      })
      .catch(function () {
        boton.disabled = false;
        texto.textContent = 'No hemos podido completarlo. Recarga la página para intentarlo de nuevo o escríbenos a info@entrenaseguro.es.';
      });
  }

  if (!/\/exec$/.test(URL)) { texto.textContent = 'Esta página todavía no está conectada. Escríbenos a info@entrenaseguro.es.'; return; }
  if (confirmar) {
    texto.textContent = 'Confirma que quieres recibir por email novedades, avisos y ofertas de Entrena Seguro para tu centro (cuatro emails durante el primer mes y, después, como mucho uno al mes, más un aviso antes de tu renovación si nos dices el mes). Podrás darte de baja con un clic desde cualquiera de ellos.';
    boton.textContent = 'Sí, quiero recibirlos';
    boton.hidden = false;
    boton.addEventListener('click', function () { enviar('confirmar', confirmar.slice(0, 64)); });
  } else if (baja) {
    boton.hidden = true;
    enviar('baja', baja.slice(0, 64));
  } else {
    texto.textContent = 'Enlace incompleto. Si quieres darte de baja, responde a cualquiera de nuestros emails con la palabra BAJA.';
  }
})();
