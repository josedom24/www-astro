---
title: "Uso específico de variables: contadores, acumuladores e indicadores"
---

En muchos programas usamos variables con un propósito concreto: contar sucesos, acumular valores o recordar si ha ocurrido algo. Estas variables se conocen como **contadores**, **acumuladores** e **indicadores**.

## Contadores

Un **contador** es una variable entera que utilizamos para contar cuántas veces ocurre un suceso. Su uso conlleva las siguientes etapas:

1. **Declaración** de la variable:

   ```cpp
   int contador{};
   ```

2. **Inicialización** a 0:

   ```cpp
   contador = 0;
   ```

3. **Incremento** cada vez que ocurre el suceso:

   ```cpp
   contador = contador + 1;
   // o de forma abreviada:
   contador++;
   ```

Ejemplo con contador:

```cpp
#include <iostream>

int main() {
    int contador{0};
    int numero{};

    for (int i = 1; i <= 5; i++) {
        std::cout << "Dime un número: ";
        std::cin >> numero;

        if (numero % 2 == 0) {
            contador++;
        }
    }

    std::cout << "Has introducido " << contador << " números pares." << std::endl;
    return 0;
}
```

## Acumuladores

Un **acumulador** es una variable numérica que usamos para sumar, multiplicar o acumular resultados parciales. Las etapas habituales son:

1. **Declaración**:

   ```cpp
   int suma{};
   ```

2. **Inicialización**, normalmente:

   * A 0 si se va a realizar una suma.
   * A 1 si se va a realizar un producto.

3. **Acumulación** del valor:

   ```cpp
   suma = suma + valor;
   // o de forma abreviada:
   suma += valor;
   ```
En el ejemplo vamos a sumar los números pares introducidos:

```cpp
#include <iostream>

int main() {
    int suma{0};
    int numero{};

    for (int i = 1; i <= 5; i++) {
        std::cout << "Dime un número: ";
        std::cin >> numero;

        if (numero % 2 == 0) {
            suma += numero;
        }
    }

    std::cout << "La suma de los números pares es " << suma << std::endl;
    return 0;
}
```

## Indicadores

Un **indicador** o **bandera** es una variable booleana (`true` o `false`) que usamos para recordar si un suceso ha ocurrido. Las etapas de uso son:

1. **Declaración**:

   ```cpp
   bool ha_ocurrido{};
   ```

2. **Inicialización**, normalmente a `false`:

   ```cpp
   ha_ocurrido = false;
   ```

3. **Actualización** cuando el suceso ocurre:

   ```cpp
   ha_ocurrido = true;
   ```

En el ejemplo vamos a comprobar si se ha introducido algún número par:

```cpp
#include <iostream>

int main() {
    bool hay_par{false};
    int numero{};

    for (int i = 1; i <= 5; i++) {
        std::cout << "Dime un número: ";
        std::cin >> numero;

        if (numero % 2 == 0) {
            hay_par = true;
        }
    }

    if (hay_par) {
        std::cout << "Has introducido al menos un número par." << std::endl;
    } else {
        std::cout << "No has introducido ningún número par." << std::endl;
    }

    return 0;
}
```
