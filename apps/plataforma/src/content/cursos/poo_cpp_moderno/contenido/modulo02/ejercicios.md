---
title: "Ejercicios sobre clases y objetos"
---

## Ejercicio 1: Clase `Rectangulo`

Crea una clase `Rectangulo` que modele un rectángulo en el plano.

* La clase debe tener dos atributos privados: `base` y `altura` (ambos de tipo `double`).
* Debe incluir:

  * Un **constructor parametrizado** que inicialice los atributos mediante **lista de inicialización**.
  * Métodos **getters y setters** con validación: la base y la altura no pueden ser negativas.
  * Un método `area()` que devuelva el área del rectángulo.
  * Un método `perimetro()` que devuelva el perímetro.
* Crea un programa en `main()` que construya un rectángulo, modifique su base con el setter y muestre área y perímetro.

## Ejercicio 2: Clase `CuentaBancaria`

Diseña una clase `CuentaBancaria` que represente una cuenta sencilla.

* Atributos privados: `titular` (string) y `saldo` (double).
* Un **constructor delegante**:

  * Constructor por defecto que delegue en otro, inicializando el titular como `"Desconocido"` y el saldo en `0.0`.
  * Constructor con parámetros `(nombre, saldoInicial)` que use lista de inicialización.
* Métodos públicos:

  * `depositar(double cantidad)`: incrementa el saldo (solo si la cantidad es positiva).
  * `retirar(double cantidad)`: decrementa el saldo (solo si la cantidad es positiva y no supera el saldo disponible).
  * `mostrar()`: imprime la información de la cuenta.
* Implementa un `main()` que cree varias cuentas y realice operaciones de depósito y retiro.

## Ejercicio 3: Clase `Empleado` con atributos estáticos

Implementa una clase `Empleado` que gestione información básica de empleados de una empresa.

* Atributos privados: `nombre` (string), `salario` (double).
* Atributo estático privado: `totalEmpleados`, que lleve la cuenta de cuántos empleados se han creado.
* Constructores:
  * Constructor parametrizado para inicializar nombre y salario (usando lista de inicialización).
  * Incrementar `totalEmpleados` en cada construcción.
* Métodos públicos:
  * `getNombre()` y `getSalario()` como **getters const**.
  * `setSalario(double nuevoSalario)` con validación (el salario no puede ser negativo).
  * `static int getTotalEmpleados()` para consultar cuántos empleados existen.
* En `main()`, crea varios empleados, modifica alguno de sus salarios y muestra cuántos empleados se han creado usando el método estático.

