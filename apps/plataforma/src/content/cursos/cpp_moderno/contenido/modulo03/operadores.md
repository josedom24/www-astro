---
title: "Operadores relacionales y lógicos"
---

En C++, el tipo de dato **booleano** o **lógico**, representado por la palabra clave `bool`, puede contener únicamente dos valores: `true` (verdadero) y `false` (falso). Internamente, `true` se representa como el valor entero 1 y `false` como el valor entero 0. Cabe destacar que, al evaluar valores enteros en un contexto booleano, cualquier valor distinto de cero se considera `true`, mientras que el valor 0 se considera `false`.

## Operadores relacionales (de comparación)

Los operadores relacionales permiten comparar dos valores y devuelven un resultado de tipo booleano (`true` o `false`). Los principales operadores relacionales son:

* `>` : Mayor que
* `<` : Menor que
* `==` : Igual a
* `<=` : Menor o igual que
* `>=` : Mayor o igual que
* `!=` : Diferente de

Ejemplo:

```cpp
bool resultado = (5 > 3);  // resultado es true
```


## Operadores lógicos

Los operadores lógicos combinan o modifican valores booleanos y también devuelven un resultado booleano. Los operadores lógicos básicos son:

* `&&` : Conjunción lógica (AND). El resultado es `true` si y solo si ambos operandos son `true`.
* `||` : Disyunción lógica (OR). El resultado es `true` si al menos uno de los operandos es `true`.
* `!` : Negación lógica (NOT). Invierte el valor lógico del operando (`true` pasa a `false` y viceversa).


### Tablas de verdad

**Operador AND (`&&`):**

| a | b | a && b |
| - | - | ------ |
| V | V | V      |
| V | F | F      |
| F | V | F      |
| F | F | F      |

**Operador OR (`||`):**

| a | b | a \|\| b |
| - | - | -------- |
| V | V | V        |
| V | F | V        |
| F | V | V        |
| F | F | F        |

**Operador NOT (`!`):**

| a | !a |
| - | -- |
| V | F  |
| F | V  |


## Comparación de cadenas de caracteres

En C++, las cadenas de caracteres (`std::string`) se comparan lexicográficamente, es decir, carácter a carácter. La comparación continúa hasta que se encuentre un par de caracteres diferentes o se termine una de las cadenas. Los caracteres se comparan según su valor en el código ASCII.

Algunos ejemplos:

* `"a" > "A"` es `true`, ya que el código ASCII de `'a'` (97) es mayor que el de `'A'` (65).
* `"informatica" > "informacion"` es `true`, porque la comparación se decide en el carácter 't' (ASCII 116) frente a 'o' (ASCII 111).
* `"abcde" > "abcdef"` es `false`, ya que la primera cadena es un prefijo de la segunda y, por tanto, menor lexicográficamente.

