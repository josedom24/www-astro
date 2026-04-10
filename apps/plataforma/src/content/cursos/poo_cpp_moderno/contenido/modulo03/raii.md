---
title: "Propiedad de recursos y patrón RAII"
---

En C++, la gestión segura de recursos se basa en dos conceptos fundamentales: la **propiedad** y el **patrón RAII (Resource Acquisition Is Initialization)**.
Ambos permiten evitar errores como fugas de memoria, doble liberación o acceso a recursos liberados, y preparan el camino hacia herramientas modernas como los punteros inteligentes.

## ¿Qué es RAII?

El patrón RAII vincula la vida de un recurso al ciclo de vida de un objeto:

* El recurso se **adquiere en el constructor**.
* El recurso se **libera en el destructor**.

De esta forma, el recurso se gestiona de manera automática y segura, incluso si ocurren excepciones.

Este principio no solo aplica a memoria dinámica, sino también a:

* Archivos abiertos
* Conexiones de red
* Sockets
* Mutexes y sincronización

## Propiedad de los recursos

La propiedad responde a la pregunta: **¿qué entidad es responsable de liberar un recurso?**
Cuando un objeto adquiere un recurso siguiendo RAII, se convierte en su **propietario**.

Existen distintos modelos de propiedad:

* **Exclusiva**: un único objeto posee el recurso.
* **Compartida**: varios objetos comparten la responsabilidad de liberarlo.
* **Observador**: un objeto accede al recurso, pero no lo posee ni lo libera.

Definir la propiedad evita problemas como:

* Fugas de recursos (si nadie los libera).
* Doble liberación (si varios intentan liberarlo).
* Accesos inválidos (si se usa tras ser liberado).

## Gestión automática de recursos

En C++ moderno, el enfoque recomendado es **delegar la gestión de recursos a objetos que encapsulan y controlan su vida útil**.
Este modelo ofrece:

* **Encapsulación**: el recurso se envuelve en un objeto que lo gestiona.
* **Transferencia controlada de propiedad**: se puede ceder de un objeto a otro explícitamente.
* **Liberación automática**: al destruirse el objeto propietario, el recurso se libera.

Ventajas principales:

* Menos errores de gestión manual.
* Recursos liberados de forma predecible, incluso ante excepciones.
* Código más claro y mantenible, con relaciones de propiedad explícitas.

En el siguiente apartado veremos cómo los **punteros inteligentes** implementan estos principios para la gestión segura de memoria dinámica.
