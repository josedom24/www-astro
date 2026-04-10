---
title: "Estructuras repetitivas: do-while"
---

La instrucción `do-while` permite ejecutar un bloque de instrucciones **al menos una vez**, y seguir repitiéndolo mientras se cumpla una condición lógica. La sintaxis es:

```cpp
do {
    // Bloque de instrucciones
} while (condición lógica);
```

* Se ejecuta primero el bloque de instrucciones.
* Después, se evalúa la condición lógica.
* Si la condición es verdadera (`true`), se vuelve a ejecutar el bloque.
* Este proceso se repite hasta que la condición sea falsa (`false`).
* Este tipo de estructura es útil cuando necesitamos que el bloque de instrucciones se ejecute **al menos una vez**, independientemente de la condición inicial.
* Para evitar ciclos infinitos, el bloque de instrucciones debe modificar alguna de las variables que intervienen en la condición, de modo que eventualmente la condición pueda ser falsa y se finalice el bucle.

Veamos un ejemplo de un programa similar al del apartado anterior que solicita al usuario una contraseña. 

```cpp
#include <iostream>
#include <string>

int main() {
    std::string secreto = "asdasd";
    std::string clave;

    do {
        std::cout << "Dime la clave: ";
        std::getline(std::cin, clave);

        if (clave != secreto) {
            std::cout << "Clave incorrecta." << std::endl;
        }
    } while (clave != secreto);

    std::cout << "Bienvenido." << std::endl;

    return 0;
}
```
