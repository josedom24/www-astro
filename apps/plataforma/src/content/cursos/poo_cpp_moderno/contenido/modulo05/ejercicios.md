---
title: "Ejercicios sobre conceptos avanzados de programación orientada a objetos"
---

## Ejercicio 1: Copia y movimiento de objetos

Diseña una clase `RecursoAudio` que simule la gestión de un recurso de audio en memoria (por ejemplo, un sonido cargado).
Cada objeto contendrá:

* un **identificador de nombre**,
* un **recurso dinámico simulado** (un entero gestionado con `std::unique_ptr<int>`).

Implementa:

1. **Constructor** que reciba un nombre y un valor inicial del recurso.
2. **Constructor de copia** y **operador de asignación por copia**, que realicen una **copia profunda** (el nuevo objeto obtiene su propio recurso).
3. **Constructor de movimiento** y **operador de asignación por movimiento**, que transfieran la propiedad del recurso mediante `std::move`.
4. Un método `mostrar()` que indique el nombre del objeto y el valor del recurso.

Finalmente, en `main()`, crea, copia y mueve objetos para observar qué operaciones se ejecutan.

## Ejercicio 2: Control de creación, copia y movimiento

Diseña una clase `ConexionBD` que represente una conexión a una base de datos.
Por razones de seguridad y gestión de recursos:

* No debe poder **copiarse** (dos objetos no pueden compartir la misma conexión).
* Sí debe poder **moverse** (una conexión puede transferirse de un objeto a otro).
* Su **creación debe estar controlada** mediante una función estática o amiga.

1. La clase `ConexionBD` debe tener:

   * Un **constructor privado** que reciba el nombre de la base de datos.
   * Un método público `conectar()` que muestre un mensaje simulando la conexión.
   * Un método `cerrar()` que indique el cierre de la conexión.
   * Un método `estaConectada()` que devuelva `true` o `false`.
   * Una **función estática** `crearConexion(const std::string&)` que devuelva un objeto `ConexionBD` válido.

2. Control del ciclo de vida:

   * Prohíbe la **copia** con `= delete`.
   * Permite el **movimiento** (`= default` o implementación manual).
   * Muestra por consola mensajes cuando se construye, mueve o destruye el objeto.


## Ejercicio 3: Clonación de objetos

Crea una jerarquía de clases clonables:

* Una clase abstracta `Figura` con un método virtual `clone()`.
* Dos clases derivadas (`Circulo` y `Rectangulo`) que implementen la clonación profunda.

  * `Circulo` tendrá un atributo `radio` de tipo `double`.
  * `Rectangulo` tendrá atributos `ancho` y `alto` de tipo `double`.
  * Ambas clases tendrán un método `mostrar()` que imprima los atributos y el área.

Permite duplicar objetos desde punteros a `Figura` sin conocer el tipo concreto.


## Ejercicio 4: Sobrecarga de operadores

Crea una clase `Tiempo` que represente una cantidad de tiempo en **horas y minutos**.
Implementa la sobrecarga de operadores para:

* **`+`** → suma de dos tiempos
* **`-`** → resta de dos tiempos
* **`==`** → comparación de igualdad
* **`<<`** → impresión en formato `hh:mm`

## Ejercicio 5: Fluidez de métodos

Diseña una clase `Pedido` que permita construir y configurar un **pedido en línea** de forma **fluida y legible**.

Implementa los métodos:

* `setCliente(const std::string&)`
* `addProducto(const std::string&, double)`
* `aplicarDescuento(double)`
* `mostrarResumen()`

El método `mostrarResumen()` debe cerrar el encadenamiento.

Ejemplo de uso:

```cpp
pedido.setCliente("Ana")
      .addProducto("Portátil", 1200.0)
      .addProducto("Ratón", 25.0)
      .aplicarDescuento(10.0)
      .mostrarResumen();
```
