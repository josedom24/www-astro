---
title: "Plantillas de funciones"
---

Las **plantillas de funciones** permiten definir funciones genéricas que pueden operar con diferentes tipos de datos sin necesidad de reescribir el código para cada tipo concreto. El compilador crea automáticamente instancias específicas de la función para cada tipo utilizado, lo que se conoce como **instanciación de plantilla**.

La utilización de las **plantillas de funciones** favorece la **reutilización de código**, un solo bloque de código sirve para múltiples tipos y la **abstrcción**, ya que nos centramos en la lógica y no en los tipos.

Veamos un ejemplo:

```cpp
#include <iostream>
#include <string>

// Función plantilla que compara dos valores de tipo genérico T
template<typename T>
bool esIgual(const T& a, const T& b) {
    return a == b;
}

int main() {
    // Ejemplo con enteros
    int x = 5, y = 5;
    bool resultado1 = esIgual(x, y);
    std::cout << "x y y son iguales? " << (resultado1 ? "Sí" : "No") << std::endl;

    // Ejemplo con double
    double a = 3.14, b = 2.71;
    bool resultado2 = esIgual(a, b);
    std::cout << "a y b son iguales? " << (resultado2 ? "Sí" : "No") << std::endl;

    // Ejemplo con std::string
    std::string s1 = "hola", s2 = "hola";
    bool resultado3 = esIgual(s1, s2);
    std::cout << "s1 y s2 son iguales? " << (resultado3 ? "Sí" : "No") << std::endl;

    return 0;
}
```


* La palabra clave `template` indica que lo que sigue es una plantilla.
* `typename T` declara un parámetro de tipo genérico `T`.
* La función `esIgual` recibe dos parámetros genéricos `a` y `b` de tipo `T` por referencia constante.
* Devuelve `true` si `a` y `b` son iguales (usando el operador `==`), o `false` en caso contrario.
* El tipo `T` se deduce automáticamente al llamar a la función.

