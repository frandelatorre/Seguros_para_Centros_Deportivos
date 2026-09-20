# Seguros para Centros Deportivos

Web para contratar y gestionar seguros de centros deportivos.

**Estado: versión de prueba.** Web estática (HTML + CSS + JS mínimo), sin build ni dependencias. No vende seguros, no da presupuestos y no envía ni guarda datos. Todo lo que va entre corchetes (`[CORREDURÍA]`, `[CLAVE DGSFP]`, precios, normas…) es provisional. Marca: **Entrena Seguro**; dominio previsto: **entrenaseguro.es** (pendiente de compra). Los textos legales son borradores pendientes de validación jurídica.

## Páginas

| Archivo | Contenido |
|---|---|
| `index.html` | Home (hero T2 · "¿Tu centro cumple lo que exige tu comunidad?") |
| `box.html` | Página de tipo de centro: boxes de CrossFit y funcional |
| `diagnostico.html` | Wizard de diagnóstico en 7 pasos (el envío está desactivado) |
| `guia-boxes.html` | Landing de prueba sin cotizar: guía + lista de espera. Formulario preparado pero desactivado (ver más abajo) |
| `guia-boxes-contenido.html` | Adelanto del contenido de la guía (Madrid con detalle verificado en el BOCM, Andalucía parcial, resto pendiente) |
| `aviso-legal.html`, `privacidad.html`, `cookies.html`, `informacion-mediador.html` | Textos legales provisionales |

`css/estilos.css` lleva los tokens del Design System "Blanco con carácter". `js/web.js` (menú móvil, banner de cookies de demostración, barra fija) no hace peticiones de red ni usa cookies o almacenamiento del navegador. `js/guia-boxes.js` sí está pensado para enviar datos (ver abajo).

## Formulario de `guia-boxes.html`: cómo activarlo

El HTML y el JS ya están montados (envían por `fetch` a un Google Apps Script que guarda cada alta en una Hoja de cálculo), pero **sigue desactivado a propósito**. Para activarlo de verdad:

1. Desplegar el script de `../mantenimiento/apps-script-guia-boxes.gs` (instrucciones dentro del propio archivo) y copiar la URL del "Web app" que da Google al terminar.
2. Pegar esa URL en `js/guia-boxes.js`, en la constante `APPS_SCRIPT_URL` (sustituye el placeholder `[PEGA_AQUI_LA_URL_DEL_WEB_APP_DE_APPS_SCRIPT]`).
3. Quitar el atributo `disabled` del botón de envío en `guia-boxes.html`.
4. Rellenar `[RESPONSABLE]` en `privacidad.html` y `[NIF]` / `[email]` en el pie de `guia-boxes.html`, porque en ese momento la web empieza a recoger datos reales de personas de verdad.
5. Solo entonces, quitar o reescribir el aviso de "formulario desactivado" que hoy aparece encima del formulario.

Mientras el paso 2 no esté hecho (la URL siga con el placeholder), el formulario no envía nada: avisa con una alerta en vez de fallar en silencio.

**Limitación conocida:** el `fetch` usa `mode: 'no-cors'` porque Google Apps Script no da una respuesta legible entre orígenes distintos sin más configuración. Eso significa que el navegador no puede saber si el envío ha funcionado de verdad del lado del servidor: siempre muestra el mensaje de éxito tras enviarlo. Si hay altas que no llegan a la hoja, revisa primero el propio Apps Script (que esté bien implementado y con los permisos concedidos) antes que este JS.

## Reglas de la versión de prueba

- Todas las páginas llevan `<meta name="robots" content="noindex, nofollow">`; `robots.txt` bloquea todo y `.htaccess` añade la cabecera `X-Robots-Tag`. Esto no impide que la web reciba tráfico directo (mails en frío, anuncios): solo evita que aparezca en buscadores.
- Ningún formulario tiene `action` ni envía nada, salvo `guia-boxes.html` una vez completados los 5 pasos de arriba.
- Sin analítica, píxeles ni scripts de terceros. Solo Google Fonts (y, una vez activado, el Apps Script del formulario).
- Rutas relativas: la web funciona en la raíz de cualquier subdominio.
- Se despliega solo en un subdominio de pruebas, nunca en el dominio principal.

## Caché del CDN de Hostinger

El CDN guarda los CSS y JS durante 7 días (el HTML no). Al cambiar un CSS o JS, sube el número de versión en los enlaces de todas las páginas (`estilos.css?v=2` → `?v=3`) o purga la caché del CDN en hPanel.

## Probar en local

Abrir `index.html` en el navegador o servir la carpeta con cualquier servidor estático.
