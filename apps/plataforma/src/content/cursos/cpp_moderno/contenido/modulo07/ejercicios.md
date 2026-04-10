---
title: "Ejercicios con plantillas de función"
---

## Ejercicio 1: Comparador genérico

Implementa una función plantilla llamada `es_mayor` que reciba dos valores del mismo tipo y devuelva `true` si el primero es mayor que el segundo, y `false` en caso contrario. Usa la deducción de tipos para que la función funcione con `int`, `double`, `std::string`, etc.

## Ejercicio 2: Repetir valor

Crea una función plantilla que reciba un valor genérico y un factor entero, y devuelva el valor repetido ese número de veces:

* Para números (`int`, `double`, ...) devuelve el valor multiplicado por el factor.
* Para `std::string` devuelve la cadena concatenada consigo misma el número de veces indicado.


## Ejercicio 3: Contar coincidencias

Escribir una función plantilla que reciba un contenedor genérico y un valor a buscar, y devuelva cuántas veces aparece ese valor en el contenedor.

* Debe funcionar con cualquier contenedor que soporte iteradores (vector, list, array, etc.).
* Debe funcionar con cualquier tipo de dato que soporte que se pueda comparar con `==` (int, double, std::string, etc.).


## Ejercicio 4: Suma acumulativa de contenedor

Implementa una función plantilla `sumar_elementos` que reciba un contenedor estándar (como `std::vector<T>`, `std::list<T>`, etc.) y devuelva la suma de sus elementos. La función debe deducir automáticamente el tipo de los elementos del contenedor y devolver el tipo adecuado.
