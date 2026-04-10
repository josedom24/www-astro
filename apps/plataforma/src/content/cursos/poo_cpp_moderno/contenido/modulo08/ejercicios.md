---
title: "Ejercicios sobre programación genérica"
---

## Ejercicio 1: Clase plantilla básica

Diseña una clase plantilla `Sensor<T>` que modele un **sensor genérico** capaz de almacenar y mostrar una lectura de cualquier tipo de dato.

1. Define una **plantilla de clase** con un parámetro de tipo `T`, que represente el tipo de dato de la lectura (por ejemplo, `int`, `double`, `std::string`, etc.).
2. La clase debe incluir:

   * Un **atributo privado** `lectura` de tipo `T`.
   * Un **método** `setLectura(const T&)` para asignar un nuevo valor de lectura.
   * Un **método** `getLectura()` que devuelva el valor almacenado.
   * Un **método** `mostrar()` que imprima en pantalla la lectura actual con un mensaje descriptivo.
3. En la función `main()`, crea varios sensores de distinto tipo:

   * Un sensor de temperatura (`double`).
   * Un sensor de humedad (`int`).
   * Un sensor de estado (`std::string`, por ejemplo `"OK"` o `"ERROR"`).
4. Muestra por pantalla los valores de cada sensor.


## Ejercicio 2: Clase plantilla con varios parámetros

Diseña una clase plantilla `Medida<T, U>` que permita **representar una magnitud física** junto con su **unidad de medida**.

1. Define una **plantilla de clase** con dos parámetros de tipo:

   * `T` → para el **valor numérico** de la medida.
   * `U` → para la **unidad**, que puede ser una cadena (`std::string`) u otro tipo.

2. La clase debe incluir:

   * Un **atributo privado** `valor` de tipo `T`.
   * Un **atributo privado** `unidad` de tipo `U`.
   * Un **constructor** que reciba ambos valores.
   * Métodos `getValor()` y `getUnidad()` para acceder a ellos.
   * Un método `mostrar()` que imprima la medida en formato legible (por ejemplo, `"23.5 °C"` o `"100 km/h"`).

3. En la función `main()`, crea varios objetos de tipo `Medida` con diferentes combinaciones de tipos:

   * Temperatura (`double`, `std::string`)
   * Distancia (`int`, `std::string`)
   * Tiempo (`float`, `const char*`)
   * Velocidad (`double`, `std::string`)

4. Muestra los valores por pantalla usando el método `mostrar()`.


## Ejercicio 3: Especialización de plantillas

Diseña una clase plantilla `Registro<T>` que almacene un valor genérico y muestre información sobre su contenido.
Implementa una **especialización total** para el tipo `bool`, de forma que el comportamiento sea distinto para valores lógicos.

1. Define una plantilla de clase `Registro<T>` con:

   * Un atributo privado `valor` de tipo `T`.
   * Un constructor que reciba el valor inicial.
   * Un método `mostrar()` que imprima el contenido con el formato:

     ```
     Valor almacenado: <valor>
     ```

2. Crea una **especialización total** de `Registro<bool>` que redefina el método `mostrar()` para imprimir:

   * `"Valor lógico: verdadero"` cuando el valor sea `true`.
   * `"Valor lógico: falso"` cuando el valor sea `false`.

3. En la función `main()`, crea instancias de `Registro` con distintos tipos de datos (`int`, `double`, `std::string`, `bool`) y muestra su comportamiento.


## Ejercicio 4: Uso de `std::optional`

Implementa una función que lea dos números enteros desde el teclado y calcule su cociente (división entera), utilizando `std::optional` para manejar el caso en que la división no sea válida (por ejemplo, cuando el divisor sea cero).

1. Define la función:

   ```cpp
   std::optional<double> dividir(int numerador, int denominador);
   ```

   * Si el denominador es distinto de cero, devuelve el resultado de la división.
   * Si el denominador es cero, devuelve `std::nullopt` (para indicar que no hay valor válido).

2. En la función `main()`:

   * Pide al usuario que introduzca dos números enteros: numerador y denominador.
   * Llama a la función `dividir()`.
   * Comprueba si el resultado contiene un valor antes de usarlo.
   * Si el resultado está vacío (`std::nullopt`), muestra un mensaje de error indicando que la división por cero no es posible.
   * Usa `value_or(0.0)` para mostrar un valor por defecto en ese caso.

3. Asegúrate de que el programa no se detiene por una excepción, sino que gestiona el error de manera controlada.



## Ejercicio 5: Uso de `std::variant` y `std::visit`

Implementa un programa que gestione diferentes tipos de operaciones bancarias usando `std::variant` para representar los distintos tipos de datos y `std::visit` para procesarlos de forma uniforme.

1. Define un alias de tipo:

   ```cpp
   using Operacion = std::variant<int, double, std::string>;
   ```

   * `int`: representa un código de operación (por ejemplo, 1 = ingreso, 2 = retiro).
   * `double`: representa una cantidad monetaria.
   * `std::string`: representa un comentario o descripción de la transacción.

2. Crea un `std::vector<Operacion>` con una secuencia de operaciones de distinto tipo, por ejemplo:

   ```cpp
   {1, 250.0, "Ingreso en efectivo", 2, 100.0, "Retiro en cajero"}
   ```

3. Usa `std::visit()` con una **clase visitante** que procese cada tipo de operación:

   * Si es `int`, mostrar `"Operación: INGRESO"` o `"Operación: RETIRO"`.
   * Si es `double`, mostrar `"Cantidad: <valor>"`.
   * Si es `std::string`, mostrar `"Comentario: <texto>"`.

