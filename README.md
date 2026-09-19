# Seguros para Centros Deportivos

Web para contratar y gestionar seguros de centros deportivos.

**Estado: versión de prueba.** Web estática (HTML + CSS + JS mínimo), sin build ni dependencias. No vende seguros, no da presupuestos y no envía ni guarda datos. Todo lo que va entre corchetes (`[MARCA]`, `[CORREDURÍA]`, `[CLAVE DGSFP]`, precios, normas…) es provisional. Los textos legales son borradores pendientes de validación jurídica.

## Páginas

| Archivo | Contenido |
|---|---|
| `index.html` | Home (hero T2 · "¿Tu centro cumple lo que exige tu comunidad?") |
| `box.html` | Página de tipo de centro: boxes de CrossFit y funcional |
| `diagnostico.html` | Wizard de diagnóstico en 7 pasos (el envío está desactivado) |
| `guia-boxes.html` | Landing de prueba sin cotizar: guía + lista de espera (formulario desactivado) |
| `aviso-legal.html`, `privacidad.html`, `cookies.html`, `informacion-mediador.html` | Textos legales provisionales |

`css/estilos.css` lleva los tokens del Design System "Blanco con carácter". `js/web.js` (menú móvil, banner de cookies de demostración, barra fija) y `js/diagnostico.js` (pasos del wizard) no hacen peticiones de red ni usan cookies o almacenamiento del navegador.

## Reglas de la versión de prueba

- Todas las páginas llevan `<meta name="robots" content="noindex, nofollow">`; `robots.txt` bloquea todo y `.htaccess` añade la cabecera `X-Robots-Tag`.
- Ningún formulario tiene `action` ni envía nada; los botones de envío están desactivados.
- Sin analítica, píxeles ni scripts de terceros. Solo Google Fonts.
- Rutas relativas: la web funciona en la raíz de cualquier subdominio.
- Se despliega solo en un subdominio de pruebas, nunca en el dominio principal.

## Caché del CDN de Hostinger

El CDN guarda los CSS y JS durante 7 días (el HTML no). Al cambiar un CSS o JS, sube el número de versión en los enlaces de todas las páginas (`estilos.css?v=2` → `?v=3`) o purga la caché del CDN en hPanel.

## Probar en local

Abrir `index.html` en el navegador o servir la carpeta con cualquier servidor estático.
