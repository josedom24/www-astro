---
title: "Ejercicios sobre abstracción de comportamiento"
---

## Ejercicio 1: Delegación de comportamiento mediante interfaces

Crea una interfaz `EstrategiaImpresion` con un método virtual puro `imprimir(const std::string&)`.

1. Implementa dos clases concretas:

   * `ImpresionConsola` — muestra el mensaje por consola.
   * `ImpresionArchivo` — muestra `"Guardando en archivo: [mensaje]"`.
2. Crea una clase `Documento` que contenga un puntero inteligente a `EstrategiaImpresion` y un método `procesar(const std::string&)` que delegue la acción en la estrategia.
3. En `main()`, crea un `Documento` con cada estrategia y llama a `procesar("Hola mundo")`.
4. Comprueba que el comportamiento cambia sin modificar `Documento`.


## Ejercicio 2: Uso de lambdas para comportamiento intercambiable

Dado un vector de cadenas:

```cpp
{"cereza", "manzana", "banana", "arándano", "kiwi"}
```

1. Usa `std::find_if` con una lambda para buscar la **primera cadena que tenga más de 5 caracteres**.
2. Vuelve a usar `std::find_if` con **otra lambda distinta**, que busque la **primera cadena que empiece por la letra 'b'**.
3. Muestra el resultado de cada búsqueda (o indica que no se ha encontrado nada).

## Ejercicio 3: Encapsulación de comportamiento con `std::function`

Escribe una función

`validarEntrada(const std::string& valor, std::function<bool(const std::string&)> validador)`

que reciba una cadena y una función de validación. La función debe imprimir si la entrada es válida o no dependiendo del resultado de `validador(valor)`.

En `main()`, define tres lambdas:

1. `esNumero`: comprueba si la cadena contiene únicamente dígitos.
2. `esEmailSimple`: comprueba que la cadena contiene exactamente un `@` y al menos un `.` después.
3. `longitudAdecuada`: comprueba si la longitud está entre 5 y 10 caracteres.

Llama a `validarEntrada()` varias veces usando distintos valores y distintos validadores, para observar cómo la validación cambia sin modificar la función principal.


## Ejercicio 4: Functores con estado interno

Define una clase `FormateadorMensaje` con un atributo privado `std::string prefijo_`.

* En el constructor, inicializa `prefijo_` con el valor que se le pase como parámetro.
* Implementa `operator()(const std::string& mensaje)` para que devuelva una cadena con el formato:
  `prefijo_ + ": " + mensaje`.

En `main()`:

1. Crea un objeto `FormateadorMensaje info("INFO")`.
2. Crea un objeto `FormateadorMensaje error("ERROR")`.
3. Define un conjunto de mensajes, por ejemplo: `{"Inicio del programa", "Archivo no encontrado", "Operación completada"}`.
4. Aplica ambos functores a cada mensaje y muestra el resultado por pantalla, algo como:

   * `INFO: Inicio del programa`
   * `ERROR: Inicio del programa`
   * ...

## Ejercicio 5: Inyección de comportamiento mediante composición

Supón que tienes valores leídos de un sensor, y quieres aplicar diferentes estrategias de filtrado sin crear una jerarquía de clases para cada una.

1. Define un alias
   `using Filtro = std::function<double(double)>;`

2. Crea una clase `ProcesadorSensor` que reciba un `Filtro` en su constructor y lo almacene internamente.

3. Implementa un método `double procesar(double valor)` que aplique el filtro recibido.

4. En `main()`, crea tres `ProcesadorSensor` distintos:

   * Uno con una lambda que no modifica el valor (filtro *identidad*).
   * Otro con una lambda que aplica un *umbral mínimo*, por ejemplo:
     si `valor < 10`, devolver `10`, en caso contrario devolver `valor`.
   * Otro con una lambda que aplique un *suavizado simple*, por ejemplo:
     devolver `(valor * 0.8)`.

5. Aplica cada filtro a un valor ejemplo, por ejemplo `5.0`, y muestra los resultados.

