---
title: "Ejercicios sobre gestión de memoria dinámica"
---

## Ejercicio 1: Propiedad exclusiva con `std::unique_ptr`

Crea un programa que utilice `std::unique_ptr` para gestionar recursos con **propiedad exclusiva**.

1. Define una clase `Sensor` con un método `leer()` que muestre un valor simulado.
2. En `main()`, crea un `std::unique_ptr<Sensor>` mediante `std::make_unique`.
3. Transfiere la propiedad del sensor a otro puntero mediante `std::move`.
4. Comprueba que el puntero original deja de ser propietario tras la transferencia.


## Ejercicio 2: Propiedad compartida con `std::shared_ptr`

Diseña un programa que utilice `std::shared_ptr` para simular un recurso compartido entre varios objetos.

1. Define una clase `RecursoCompartido` con un método `usar()` que muestre un mensaje.
2. Crea varios `std::shared_ptr<RecursoCompartido>` que apunten al mismo objeto.
3. Muestra el valor de `use_count()` en distintos momentos para observar cómo cambia el contador de referencias.
4. Comprueba que el recurso se libera automáticamente cuando el último `shared_ptr` desaparece.


## Ejercicio 3: Prevención de ciclos de referencias con `std::weak_ptr`

Implementa una pequeña estructura de objetos enlazados que utilice `std::weak_ptr` para evitar ciclos de referencias.

1. Define una clase `Nodo` con:

   * Un `std::string nombre`;
   * Un `std::shared_ptr<Nodo> siguiente`;
   * Un `std::weak_ptr<Nodo> anterior`.
2. Crea tres nodos y enlázalos en una lista doblemente enlazada.
3. Usa `use_count()` para verificar que el contador de referencias no crece indefinidamente.
4. Realiza un recorrido desde el `nodo1` al `nodo3`. Y posteriormente otroo recorrido desde el `nodo3` al `nodo1`.
5. Explica cómo el uso de `weak_ptr` evita la fuga de memoria causada por referencias circulares.
