---
title: "Ejercicios con excepciones"
---

## Ejercicio 1: Acceso seguro a cadenas de texto**

Escribe un programa que tenga un `std::string` con algún texto.

* Pide al usuario un índice y accede al carácter correspondiente usando `string::at()`.
* Captura la excepción `std::out_of_range` si el índice está fuera del rango válido y muestra un mensaje de error adecuado.
* Después de manejar la excepción (o si el acceso fue correcto), muestra `"Programa finalizado"` y el carácter obtenido (si se pudo acceder correctamente).


## Ejercicio 2: Conversión segura de enteros

Escribe un programa que lea una cadena de texto del usuario e intente convertirla a entero usando `std::stoi`.

* Captura la excepción `std::invalid_argument` si la cadena no es un número válido.
* Captura la excepción `std::out_of_range` si el número es demasiado grande para un `int`.
* Después de manejar la excepción, muestra `"Programa finalizado"` y, si la conversión fue correcta, imprime el número convertido.

## Ejercicio 3: División segura con excepciones propias

Escribe una función `double raiz_cuadrada(double x)` que:

* Devuelva la raíz cuadrada de `x` si `x` es mayor o igual a cero.
* Lance una excepción de tipo `std::domain_error` usando `throw` si `x` es negativo, con un mensaje adecuado, por ejemplo `"No se puede calcular la raíz cuadrada de un número negativo"`.

Luego, en `main`:

* Pide al usuario un número.
* Llama a la función `raiz_cuadrada`.
* Captura la excepción si se lanza y muestra el mensaje de error.
* Después de manejar la excepción (o si la función se ejecuta correctamente), imprime `"Programa finalizado"` y, si la operación fue válida, el resultado de la raíz cuadrada.

