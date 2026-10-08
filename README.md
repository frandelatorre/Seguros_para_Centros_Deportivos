# Entrena Seguro · web

Web estática (HTML + CSS + JS mínimo), sin build ni dependencias. Informa de lo que exige la ley al seguro de un centro deportivo y, a quien lo pide, le pone en contacto con un mediador de seguros. **No vende seguros, no da presupuestos y no asesora.** Las reglas de lo que la web puede y no puede decir están en `docs/validacion-fase-1/fase-1-reglas-copy.md` (fuera del repositorio).

## Páginas

| Archivo | Contenido |
|---|---|
| `index.html` | Portada general para centros deportivos + formulario (con tipo de centro) |
| `gimnasio.html`, `estudio.html`, `club.html` | Landings de gimnasios, estudios de pilates/yoga/boutique y clubes/entrenadores, con la misma estructura que `box.html`. Cada una rellena `pagina` y el tipo de centro. |
| `box.html` | Landing de boxes: riesgos habituales, qué exige la ley (todas las comunidades) y formulario. **Destino de emails en frío, Instagram y anuncios.** |
| `privacidad.html`, `aviso-legal.html`, `cookies.html` | Textos legales (titular: Francisco de la Torre Rodríguez) |
| `emails.html` | Confirmar la serie de emails (`?confirmar=`) o darse de baja (`?baja=`); enlazada desde los emails |
| `guia/entrena-seguro-guia-centros-deportivos-v2.pdf` | La guía que se envía por email (todas las comunidades). La antigua `guia-boxes-madrid-andalucia.pdf` se mantiene porque los emails ya enviados la enlazan |
| `guia-boxes.html`, `guia-boxes-contenido.html`, `diagnostico.html`, `privacidad-guia.html` | Páginas retiradas: redirigen a las nuevas. Se pueden borrar cuando nadie las enlace |

`js/web.js`: menú móvil y botón fijo en móvil. `js/config.js`: URL del Apps Script. `js/formulario.js`: formulario de la guía y de contacto. `js/emails.js`: página `emails.html`.

`img/`: logo horizontal (cabecera y pie) y favicon, copiados de `docs/marca-logo/final/` sin los metadatos C2PA. Si cambia el logo, regenerarlos desde ahí.

Las tipografías (Barlow y Barlow Condensed, licencia OFL) están en `fonts/`: la web no carga nada de Google Fonts ni de terceros, salvo el envío del formulario a Google Apps Script.

## Formulario

1. Instalar el Apps Script: `mantenimiento/apps-script/INSTALAR.md` (fuera del repositorio).
2. Pegar la URL de la aplicación web (termina en `/exec`) en `js/config.js`, constante `APPS_SCRIPT_URL`.
3. Mientras la URL no esté pegada, el formulario valida los datos pero no envía nada y lo dice.

Canal de entrada: el formulario guarda `utm_source` y `utm_campaign` del enlace. Ejemplo: `box.html?utm_source=email&utm_campaign=frio-madrid-oct`. Con `&contacto=1` la casilla de contacto aparece ya marcada.

El formulario lee la respuesta JSON del script (Apps Script la sirve con `Access-Control-Allow-Origin: *` tras su redirección). **Comprobarlo en la primera prueba real:** si el navegador no pudiera leerla, la web mostraría "No hemos podido confirmar el envío" aunque los datos sí se hayan guardado. Los fallos internos del script quedan en la pestaña "Errores" de la hoja.

## Antes de publicar en entrenaseguro.es

- [ ] Formulario conectado y probado de principio a fin (ver INSTALAR.md, paso 8).
- [x] Quitado `<meta name="robots" content="noindex, nofollow">` de `index`, `box`, `gimnasio`, `estudio` y `club` (8-oct-2026). Se mantiene en las redirecciones y en las páginas legales (`aviso-legal`, `privacidad`, `cookies`) hasta la revisión jurídica.
- [x] `robots.txt` con `Allow: /` y `Sitemap`.
- [x] `.htaccess` sin `X-Robots-Tag`; redirección 301 de `www` a `entrenaseguro.es`.
- [x] `sitemap.xml` con las 5 páginas de contenido (añadir las legales cuando se indexen).
- [ ] Revisar la checklist de las reglas de copy página por página.

## Caché del CDN de Hostinger

El CDN guarda CSS y JS 7 días. Al cambiar uno, sube la versión en los enlaces (`estilos.css?v=3` → `?v=4`) o purga la caché en hPanel.

## Probar en local

Servir la carpeta con cualquier servidor estático (por ejemplo `python -m http.server`) y abrir `index.html`.
