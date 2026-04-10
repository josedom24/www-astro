---
title: "Los pilares de la programación orientada a objetos"
---

La programación orientada a objetos (POO) se fundamenta en cuatro pilares que guían el diseño de sistemas de software bien estructurados: **encapsulación, abstracción, herencia y polimorfismo**. Estos principios permiten modelar entidades del mundo real y favorecen la modularidad, la reutilización y la escalabilidad del software.

## Encapsulación

La encapsulación consiste en **ocultar los detalles internos de un objeto** y exponer únicamente lo necesario para su uso. De esta manera, el estado interno se protege y solo puede modificarse mediante métodos controlados.

Ejemplo: un objeto `Vehiculo` tiene un atributo `velocidadActual`. El sistema no permite modificarlo directamente, sino a través de métodos como `acelerar()` y `frenar()`.

Ventajas:

* Se garantiza coherencia en la lógica de control.
* Se reduce la dependencia entre componentes.

## Abstracción

La abstracción implica **resaltar las características esenciales** de una entidad, ignorando los detalles innecesarios. Se enfoca en el *qué hace* un objeto, no en el *cómo lo hace*.

Ejemplo: en un sistema de transporte, una clase abstracta `Vehiculo` puede definir propiedades y métodos comunes como `matricula`, `capacidad`, `iniciarMarcha()` y `detenerMarcha()`, sin importar si el objeto concreto es un coche, un autobús o una motocicleta.

Ventajas:

* Permite construir modelos simples de entidades complejas.
* Facilita trabajar con la funcionalidad esencial.


## Herencia

La herencia permite que una clase **derive de otra**, reutilizando atributos y métodos comunes. La clase base define un comportamiento genérico y las clases derivadas lo especializan.

Ejemplo: de la clase `Vehiculo` se derivan `Coche`, `Camion`, `Motocicleta` y `Autobus`. Cada una hereda atributos y métodos comunes, y puede añadir características propias (como `capacidadDeCarga` en `Camion` o `abrirPuertas()` en `Autobus`).

Ventajas:

* Evita duplicar código.
* Permite representar relaciones jerárquicas.
* Facilita la extensión del sistema.

## Polimorfismo

El polimorfismo permite que **objetos de distintas clases compartan una misma interfaz** y se traten de forma uniforme, aunque su implementación sea distinta.

Ejemplo: todos los vehículos implementan el método `realizarMantenimiento()`, pero cada clase lo ejecuta de manera diferente:

* `Coche`: revisa aceite, frenos y filtros.
* `Motocicleta`: revisa cadenas y neumáticos.
* `Autobus`: revisa puertas automáticas y sistemas eléctricos.

Ventajas:

* Permite escribir código más general y reutilizable.
* Facilita la incorporación de nuevos tipos sin modificar el código existente.
* Reduce el acoplamiento entre componentes.

