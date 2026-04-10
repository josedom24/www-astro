---
title: "Tipos de datos carácter y booleano"
---

## Tipos de datos carácter

Nos permiten representar caracteres. Sin embargo, internamente, estos tipos son tratados como tipos enteros, lo que permite realizar operaciones aritméticas o bit a bit sobre ellos.

* `char` o `signed char`: Normalmente, aunque depende del compilador, **son equivalentes**. El tamaño de este tipo es de **1 byte**, por lo que me permite guardar valores enteros **desde el -128 hasta el 127**. Por lo que permite representar **caracteres ASCII estándar**.
* `unsigned char`: En este caso, también ocupa **1 byte**, pero me permite representar enteros sin signos, por lo tanto, el rango representado es **desde el 0 al 255**. Permite representar **caracteres ASCII extendido**.
* Existen otros tipos como `char8_t`, `char16_t`, `char32_t` o `wchar_t` que nos permiten representar caracteres que ocupan más de 1 byte. Aunque depende de la plataforma y el compilador normalmente nos permiten **representar  caracteres UTF_8, UTF-16, UTF-32 y Unicode** respectivamente.

Por último indicar que los literales de tipo de caracteres se indican entre comillas simples, por ejemplo `'A'`. Tenemos algunos caracteres especiales (**caracteres de escape**) que son muy útiles, por ejemplo `\n` indica nueva línea y `\t` indica tabulador.

## Tipo de datos booleano

El **tipo de datos booleano** nos permite representar situaciones en las que solo hay dos posibilidades: **verdadero** o **falso**.

En C++, usamos el tipo `bool` (que ocupa **1 byte**) para trabajar con este tipo de datos. Y sus valores posibles son:
* `true`: Representa que la condición o el valor es **verdadero**.
* `false`: Representa que la condición o el valor es **falso**.

Hay que tener en cuenta que **cualquier valor distinto de 0** se interpreta como **verdadero** en una condición.

Utilizaremos los **Operadores relacionales y lógicos** para obtener el resultado booleanos de expresiones lógicas.

## Ejemplo

```cpp
#include <iostream>
using namespace std;

int main() {
    // ----- Tipos de datos carácter -----
    char letra = 'A';                // Literal de carácter (ASCII 65)
    unsigned char simbolo = 200;     // ASCII extendido
    char saltoLinea = '\n';          // Carácter de escape: nueva línea
    char tabulador = '\t';           // Carácter de escape: tabulador

    // Operaciones aritméticas con caracteres
    char siguiente = letra + 1;      // 'B' porque internamente 'A' es 65 y 65+1 = 66
    int codigo = letra;              // Conversión implícita de char a int (imprime 65)

    cout << "Letra: " << letra << endl;
    cout << "Siguiente letra: " << siguiente << endl;
    cout << "Codigo ASCII de " << letra << ": " << codigo << endl;
    cout << "Caracter especial (tabulador + texto):" << tabulador << "Hola" << endl;

    // ----- Tipos de datos booleanos -----
    bool valorVerdadero = true;
    bool valorFalso = false;

    cout << boolalpha; // Para imprimir true/false en lugar de 1/0
    cout << "Valor booleano verdadero: " << valorVerdadero << endl;
    cout << "Valor booleano falso: " << valorFalso << endl;

    return 0;
}
```