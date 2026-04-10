---
title: "Ejercicios sobre interfaces y diseño polimórfico"
---

## Ejercicio 1: Jerarquía de clases con métodos virtuales puros

Crea una jerarquía de clases que represente distintos tipos de **dispositivos multimedia**.

1. Define una clase abstracta `Reproductor` con un método virtual puro `reproducir()` y un destructor virtual.
2. Implementa dos clases concretas:

   * `ReproductorAudio`, que muestra por pantalla `"Reproduciendo audio..."`.
   * `ReproductorVideo`, que muestra por pantalla `"Reproduciendo video..."`.
3. En `main()`, declara un `std::vector<std::unique_ptr<Reproductor>>` y almacena instancias de ambos tipos.
4. Recorre el vector y llama al método `reproducir()` para demostrar el **polimorfismo dinámico**.


## Ejercicio 2: Interfaces puras y desacoplamiento del cliente

Crea una interfaz `Notificador` que defina un contrato completo para distintos tipos de sistemas de notificación.

La interfaz debe incluir varios métodos virtuales puros:

* `enviarMensaje(const std::string&)`
* `establecerRemitente(const std::string&)`
* `obtenerTipo() const`

Implementa tres clases concretas:

* `NotificadorEmail`
* `NotificadorSMS`
* `NotificadorPush` (para notificaciones en aplicaciones o web)

Después, implementa una función `registrarEvento()` que reciba una referencia a `Notificador` y simule el envío de un mensaje de alerta.


## Ejercicio 3: Devolución de interfaces mediante punteros inteligentes

Diseña un pequeño sistema para crear **dispositivos de salida de audio** que implementen una misma interfaz común.

1. Define una **interfaz pura** llamada `DispositivoAudio` con un método virtual puro `emitirSonido() const`.
   Declara también un destructor virtual por seguridad.

2. Implementa dos clases concretas:

   * `Altavoz`, que imprima `"Emitiendo sonido por altavoz"`.
   * `Auriculares`, que imprima `"Emitiendo sonido por auriculares"`.

3. Implementa una función:

   ```cpp
   std::unique_ptr<DispositivoAudio> crearDispositivo(const std::string& tipo);
   ```

   que devuelva un objeto dinámico del tipo solicitado:

   * Si `tipo == "altavoz"`, devuelve un `std::make_unique<Altavoz>()`.
   * Si `tipo == "auriculares"`, devuelve un `std::make_unique<Auriculares>()`.

4. En `main()`, solicita al usuario el tipo de dispositivo y recibe el objeto devuelto por la función.
   Llama al método `emitirSonido()` para verificar el **polimorfismo dinámico**.

5. Asegúrate de:

   * Usar `std::unique_ptr` en todas las funciones.
   * No utilizar punteros crudos.
   * Emplear `override` en las clases derivadas.


