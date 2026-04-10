---
title: "Introducción a la programación orientada a objetos"
---

La **Programación Orientada a Objetos (POO)** es un paradigma de programación que organiza el código en torno a **objetos**, los cuales representan entidades del mundo real o conceptos abstractos. Cada objeto combina datos y comportamientos, encapsulándolos en una misma unidad.

La POO busca modelar sistemas complejos de una forma más natural y modular, facilitando el desarrollo, mantenimiento y comprensión de los programas. A diferencia de la programación estructurada, que organiza el código en funciones y estructuras de control, la POO agrupa los datos y las operaciones que se pueden realizar sobre ellos dentro de objetos.

## Ventajas de la POO frente a la programación estructurada

A continuación se presentan algunas de las ventajas más relevantes que ofrece la POO en comparación con la programación estructurada tradicional:

* **Modularidad**: El código se organiza en clases, lo que facilita su división en módulos reutilizables.
* **Abstracción**: Permite ocultar los detalles de implementación y trabajar con modelos conceptuales.
* **Encapsulamiento**: Los datos y los métodos se agrupan en clases, lo que protege el estado interno del objeto.
* **Reutilización de código**: Gracias a la herencia y la composición, es posible reutilizar código existente sin duplicación.
* **Mantenimiento simplificado**: Al estar el código dividido en componentes bien definidos, resulta más sencillo localizar y corregir errores.
* **Extensibilidad**: Los programas se pueden ampliar y modificar de forma controlada, gracias a mecanismos como la herencia y el polimorfismo.

## Conceptos básicos: objetos, clases, atributos y métodos

Para comprender la POO en C++, es necesario familiarizarse con sus conceptos fundamentales:

* **Clases**: Una **clase** es un plano o plantilla que define las características y comportamientos de un conjunto de objetos. Especifica:
    * Los **atributos** o **miembros de datos**: las propiedades o características de los objetos.
    * Los **métodos** o **miembros función**: las operaciones o comportamientos que los objetos pueden realizar.
* **Objetos**: Un **objeto** es una instancia concreta de una clase. Representa una entidad específica que posee un estado propio (atributos) y puede ejecutar acciones definidas por la clase (métodos).

## Ejemplo conceptual

Imaginemos que queremos modelar una **bicicleta** en un sistema.

* La **clase** sería el modelo general de una bicicleta: describe qué características tiene y qué puede hacer.
* Un **objeto** sería una bicicleta concreta, por ejemplo, la que usas para ir al trabajo.
* Los **atributos** podrían ser: color, número de marchas, presión de las ruedas, si está en movimiento o detenida.
* Los **métodos** podrían ser: cambiar de marcha, inflar ruedas, empezar a pedalear, frenar.

Cada vez que creamos una nueva bicicleta en nuestro sistema, estaríamos creando un nuevo objeto a partir de la clase "Bicicleta". Cada objeto tiene su propio estado: una bicicleta puede estar detenida, otra en movimiento; una puede tener las ruedas bien infladas, otra desinfladas.
