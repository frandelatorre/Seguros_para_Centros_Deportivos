# Entrena Seguro · web

Web estática (HTML + CSS + JS mínimo), sin build ni dependencias. Informa de lo que exige la ley al seguro de un centro deportivo y, a quien lo pide, le pone en contacto con un mediador de seguros. **No vende seguros, no da presupuestos y no asesora.** Las reglas de lo que la web puede y no puede decir están en `docs/validacion-fase-1/fase-1-reglas-copy.md` (fuera del repositorio).

## Páginas

| Archivo | Contenido |
|---|---|
| `index.html` | Portada general para centros deportivos + formulario (con tipo de centro) |
| `box.html` | Landing de boxes: riesgos habituales, qué exige la ley (Madrid y Andalucía) y formulario. **Destino de emails en frío, Instagram y anuncios.** |
| `privacidad.html`, `aviso-legal.html`, `cookies.html` | Textos legales (titular: Francisco de la Torre Rodríguez) |
| `emails.html` | Confirmar la serie de emails (`?confirmar=`) o darse de baja (`?baja=`); enlazada desde los emails |
| `guia/entrena-seguro-guia-boxes-madrid-andalucia.pdf` | La guía que se envía por email |
| `guia-boxes.html`, `guia-boxes-contenido.html`, `diagnostico.html`, `informacion-mediador.html`, `privacidad-guia.html` | Páginas retiradas: redirigen a las nuevas. Se pueden borrar cuando nadie las enlace |

`js/web.js`: menú móvil y botón fijo en móvil. `js/config.js`: URL del Apps Script. `js/formulario.js`: formulario de la guía y de contacto. `js/emails.js`: página `emails.html`. `js/guia-boxes.js` y `js/diagnostico.js`: obsoletos, ya no se cargan.

Las tipografías (Barlow y Barlow Condensed, licencia OFL) están en `fonts/`: la web no carga nada de Google Fonts ni de terceros, salvo el envío del formulario a Google Apps Script.

## Formulario

1. Instalar el Apps Script: `mantenimiento/apps-script/INSTALAR.md` (fuera del repositorio).
2. Pegar la URL de la aplicación web (termina en `/exec`) en `js/config.js`, constante `APPS_SCRIPT_URL`.
3. Mientras la URL no esté pegada, el formulario valida los datos pero no envía nada y lo dice.

Canal de entrada: el formulario guarda `utm_source` y `utm_campaign` del enlace. Ejemplo: `box.html?utm_source=email&utm_campaign=frio-madrid-oct`. Con `&contacto=1` la casilla de contacto aparece ya marcada.

El formulario lee la respuesta JSON del script (Apps Script la sirve con `Access-Control-Allow-Origin: *` tras su redirección). **Comprobarlo en la primera prueba real:** si el navegador no pudiera leerla, la web mostraría "No hemos podido confirmar el envío" aunque los datos sí se hayan guardado. Los fallos internos del script quedan en la pestaña "Errores" de la hoja.

## Antes de publicar en entrenaseguro.es

- [ ] Formulario conectado y probado de principio a fin (ver INSTALAR.md, paso 8).
- [ ] Quitar `<meta name="robots" content="noindex, nofollow">` de `index.html`, `box.html` y las páginas legales (dejarlo en las redirecciones).
- [ ] `robots.txt`: cambiar `Disallow: /` por `Allow: /` y añadir `Sitemap: https://entrenaseguro.es/sitemap.xml`.
- [ ] `.htaccess`: quitar la cabecera `X-Robots-Tag`.
- [ ] Crear `sitemap.xml` con `index.html` y `box.html`.
- [ ] Revisar la checklist de las reglas de copy página por página.

## Caché del CDN de Hostinger

El CDN guarda CSS y JS 7 días. Al cambiar uno, sube la versión en los enlaces (`estilos.css?v=3` → `?v=4`) o purga la caché en hPanel.

## Probar en local

Servir la carpeta con cualquier servidor estático (por ejemplo `python -m http.server`) y abrir `index.html`.
