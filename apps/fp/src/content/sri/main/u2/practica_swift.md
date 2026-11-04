---
title: "Añadir a la práctica: almacenamiento de objetos"
---

<!--
BORRADOR: apartado nuevo para la «Práctica: Protocolo HTTP y almacenamiento».
Iría después de «Servidor NAS» y antes de «Vídeo de demostración».
Las entregas siguen la numeración de la práctica (14, 15…) y el punto del vídeo sería el 6.
Al añadirlo a practica.md, comprobar que pruebas/asir-sri-sri_práctica_2_protocolo_http_y_almacenamiento/prueba.md (Redmine) sigue enlazando a la web.
-->

## Almacenamiento de objetos

Para terminar, vamos a usar el **almacenamiento de objetos** de la nube del instituto (**OpenStack Swift**) para guardar los **contenidos estáticos** (imágenes y hojas de estilo) de la aplicación balanceada `app.tunombre.org`. Las páginas las seguirán sirviendo `backend1` y `backend2`, pero el **navegador** pedirá las imágenes y la hoja de estilo **directamente a Swift** por HTTP, sin pasar por el proxy inverso ni por el balanceador.

Puedes repasar cómo se trabaja con Swift en el [Ejercicio 2: Almacenamiento de objetos con OpenStack Swift](../ejercicio2/).

### Contenedor y objetos

* Crea en Swift un contenedor llamado `app-tunombre` con el cliente **`openstack`**.
* Sube al contenedor, **con `curl`** (peticiones `PUT` a la API), la hoja de estilo de la aplicación y al menos dos imágenes (por ejemplo, un logo y una imagen de fondo). Guarda la hoja de estilo con el nombre `css/estilo.css` y las imágenes con nombres que empiecen por `img/`.
* Añade a la hoja de estilo un metadato propio `X-Object-Meta-Autor` con tu nombre.
* Haz **público** el contenedor **con `curl`**, asignándole una ACL de lectura.
* Comprueba **sin token** que puedes descargar los objetos y que **no** puedes listar el contenido del contenedor.

### La aplicación usa Swift

* Modifica la aplicación PHP de **los dos backends** para que la hoja de estilo y las imágenes se carguen desde Swift, usando la **URL** de cada objeto (`https://openstack.gonzalonazareno.org/swift/v1/AUTH_<proyecto>/app-tunombre/...`). Borra de los backends las copias locales de esos ficheros.
* Accede a `app.tunombre.org` y comprueba con las **herramientas para desarrolladores** del navegador (pestaña *Red*) a qué servidor se hace cada petición.

**Pregunta**: Cuando accedes a `app.tunombre.org`, ¿qué peticiones atiende tu escenario (proxy inverso, balanceador y backends) y cuáles atiende Swift? ¿Qué ventajas tiene esto? Para que los dos backends sirvan las mismas imágenes también podríamos haberlas guardado en el directorio compartido por **NFS**: ¿qué diferencias hay entre las dos soluciones? Piensa en quién accede al almacenamiento, con qué protocolo y desde dónde.

**Pregunta**: Los PDF de `nas.tunombre.org/documentos` están protegidos con autenticación básica. ¿Sería buena idea guardarlos en el contenedor público de Swift y enlazarlos desde la página? ¿Por qué?

:::tip[Entrega del almacenamiento de objetos]
Las comprobaciones con `curl` se entregan como texto, con el comando y su salida (puedes acortar el token).

14. El comando con el que has creado el contenedor, y las peticiones `curl` con las que has subido los objetos, has añadido el metadato y has hecho público el contenedor, con su **código de estado**. Explica qué método HTTP has usado en cada una y por qué.
15. La salida de `openstack object list app-tunombre` y un `curl -I` **sin token** a la hoja de estilo, donde se vean el código de estado, el `Content-Type`, el `Etag` y el metadato `X-Object-Meta-Autor`. Un `curl -i` **sin token** al contenedor, donde se vea que no puedes listarlo.
16. El código HTML de la aplicación donde se cargan la hoja de estilo y las imágenes desde Swift, y una captura de la pestaña *Red* de las herramientas para desarrolladores donde se vea a qué servidor se pide cada recurso.
17. Contesta las preguntas.
:::

<!--
Punto nuevo para «Qué debe mostrar el vídeo»:

6. Acceso a `app.tunombre.org` con las herramientas para desarrolladores abiertas, comentando en voz qué recursos llegan desde los backends y cuáles desde Swift. Haz privado el contenedor (petición `POST` con `curl` y la cabecera `X-Remove-Container-Read: x`) y recarga la página: explica qué ocurre y por qué.
-->
