---
title: "Introducción a la programación genérica"
---

La **programación genérica** es un paradigma que persigue la elaboración de algoritmos y estructuras de datos **independientes del tipo de datos concreto** sobre el que operan. Su objetivo principal es **abstraer el comportamiento común** de distintas operaciones o estructuras, sin necesidad de duplicar código para cada tipo específico.

Este enfoque permite escribir una **única definición de una función o clase**, que el compilador **instancia automáticamente** con los tipos concretos que se usen en el programa. De este modo, se logra un alto grado de reutilización y flexibilidad, manteniendo la eficiencia característica de C++.

## Programación genérica en C++ moderno

C++ proporciona **soporte nativo para la programación genérica** desde sus primeras versiones a través del mecanismo de **plantillas** (*templates*). Este soporte ha sido ampliado y mejorado en las versiones modernas del lenguaje, incorporando funcionalidades como:

* **Inferencia de tipo más potente**: `auto`, `decltype`, deducción de tipo en funciones.
* **Plantillas**: funciones o clases que aceptan un número arbitrario de parámetros de tipo.
* **Lambdas genéricas**: funciones anónimas con parámetros deducibles por el compilador.

Estas características convierten a C++ moderno en un lenguaje altamente expresivo para desarrollar componentes genéricos de alto rendimiento.

## Programación genérica en la STL

La programación genérica es ampliamente utilizada en la **biblioteca estándar de C++ (STL)**, en la que casi todos los algoritmos y estructuras de datos son plantillas:

* Contenedores: `std::vector<T>`, `std::list<T>`, `std::map<Key, T>`, etc.
* Algoritmos: `std::sort`, `std::accumulate`, `std::find`, etc.

Gracias a las plantillas, estas herramientas pueden utilizarse con distintos tipos de datos sin reescribir el código.

## Plantillas de funciones

En este módulo nos centraremos en un aspecto fundamental de la programación genérica en C++: **las plantillas de funciones**. Estudiaremos cómo declarar y utilizar funciones genéricas, cómo se deducen los tipos automáticamente en el momento de la llamada, y cómo aprovechar esta capacidad para escribir código reutilizable, expresivo y eficiente.

