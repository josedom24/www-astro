---
title: "Introducción a la programación estructurada y uso de funciones"
---

## Programación estructurada

La programación estructurada es un paradigma que promueve el diseño de programas claros, comprensibles y fáciles de mantener, mediante la **descomposición del problema en partes más pequeñas y manejables**.

Este enfoque surge como respuesta a las dificultades que presentan los programas escritos de forma desorganizada, donde el flujo de ejecución y la gestión de datos se mezclan, generando código difícil de leer, depurar y ampliar.

**C++**, a pesar de ser un lenguaje multiparadigma, integra de forma natural los principios de la programación estructurada, permitiendo combinar su potencia y control con un diseño limpio y organizado.

Los pilares fundamentales de la programación estructurada son:

* **División en bloques funcionales:** El programa se organiza en funciones que realizan tareas concretas.
* **Control explícito del flujo:** Se utilizan estructuras de control claras como `if`, `while`, `for` o `switch`.
* **Evitar el uso innecesario de saltos incondicionales (`goto`)**, que dificultan el seguimiento del flujo.
* **Facilita la comprensión y el mantenimiento:** Al dividir el código en partes lógicas independientes.

## Definición y uso de funciones

Dentro de la programación estructurada, las **funciones** son la herramienta principal para dividir un programa en bloques reutilizables y comprensibles.

Una función es un bloque de código que:

* Tiene un **nombre** que lo identifica.
* Puede recibir **parámetros** de entrada.
* Puede devolver un **valor de salida** (aunque no es obligatorio).
* Encapsula una tarea o cálculo concreto.

La sintaxis básica en C++ es:

```cpp
tipo_de_retorno nombre_de_la_funcion(parámetros) {
    // Bloque de instrucciones
    return valor; // si hay valor de retorno
}
```

Veamos un ejemplo:

```cpp
#include <iostream>

// Declaración y definición de la función
int suma(int a, int b) {
    return a + b;
}

int main() {
    int resultado = suma(3, 4); //Llamada a la función
    std::cout << "La suma es: " << resultado << std::endl;
    return 0;
}
```

Las funciones también pueden **no devolver ningún resultado**, solo realizar una tarea. Veamos un  ejemplo:

```cpp
#include <iostream>

// Declaración y definición de la función
void saludar() {
    std::cout << "¡Hola! Bienvenido al programa.\n";
}

int main() {
    saludar();  // Llamada a la función
    return 0;
}

```
### Ventajas de usar funciones

* **Modularidad:** El código se divide en bloques lógicos más fáciles de entender y mantener.
* **Reutilización:** Una función puede invocarse múltiples veces, evitando duplicación de código.
* **Claridad:** Los nombres de las funciones describen su propósito, lo que mejora la legibilidad.
* **Facilita la depuración:** Los errores se localizan más fácilmente al estar el código segmentado.

### Prototipos de funciones

Un **prototipo de función** es una declaración previa que informa al compilador acerca del nombre, el tipo de retorno y la lista y tipo de los parámetros de una función. Permite al compilador verificar las llamadas a la función antes de que su definición completa aparezca en el código.

* Normalmente, escribimos los prototipos **antes de `main()`**. Permite que `main()` o cualquier otra función puedan invocar a esa función, incluso si su definición completa viene después.
* La definición de la función se puede escribir **antes o después de `main()`**, siempre que el prototipo esté presente si la definición está después.

Los ejemplos anteriores quedarían con prototipo:

```cpp
#include <iostream>

//Prototipo de la función
int suma(int a, int b);

int main() {
    int resultado = suma(3, 4);
    std::cout << "La suma es: " << resultado << std::endl;
    return 0;
}

// Declaración y definición de la función
int suma(int a, int b) {
    return a + b;
}
```

Y el ejemplo de función sin retorno:

```cpp
#include <iostream>

//Prototipo de la función
void saludar();

int main() {
    saludar();  // Llamada a la función
    return 0;
}

// Declaración y definición de la función
void saludar() {
    std::cout << "¡Hola! Bienvenido al programa.\n";
}
```