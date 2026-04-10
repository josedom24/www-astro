---
title: "Ejemplos de paso de argumentos a funciones"
---

## Definición de parámetros opcionales

En ocasiones, una función puede tener **valores predeterminados** para algunos de sus parámetros. Esto permite que el programador pueda **omitir esos argumentos** al llamar a la función, y en su lugar se utilizará un valor por defecto.

Para declarar un parámetro opcional, se asigna un **valor por defecto** en la declaración de la función, veamos un ejemplo:

```cpp
#include <iostream>
#include <string>


// Valor por defecto en la declaración
void saludar(std::string nombre = "Usuario");  

int main() {
    saludar("Carlos"); // Imprime: Hola, Carlos
    saludar();         // Imprime: Hola, Usuario
    return 0;
}

// Definición sin repetir el valor por defecto
void saludar(std::string nombre) {
    std::cout << "Hola, " << nombre << std::endl;
}

```

* Los **parámetros opcionales deben ir al final** de la lista de parámetros.
* Los valores por defecto se especifican en la **declaración** o **definición** de la función, pero nunca en ambas.
* Si se omite un argumento al llamar a la función, se utilizará el valor por defecto especificado.
* Los parámetros opcionales pueden ser de **cualquier tipo**, incluyendo tipos primitivos, objetos de la STL, o incluso punteros.
* Los parámetros opcionales siguen las mismas reglas sobre **paso por valor**, **referencia**, **referencia constante** o **punteros**, según sea necesario para evitar copias costosas y gestionar los recursos de forma eficiente.

Ejemplo con varios parámetros opcionales:

```cpp
#include <iostream>
#include <string>

// Función que imprime una línea decorada
void imprimirLinea(std::string texto = "Línea vacía", char simbolo = '-', int repeticiones = 10) {
    std::cout << texto << " ";
    for (int i = 0; i < repeticiones; ++i) {
        std::cout << simbolo;
    }
    std::cout << std::endl;
}

int main() {
    // Llamada con todos los parámetros personalizados
    imprimirLinea("Título", '*', 20); // Imprime: Título ********************

    // Llamada con valores por defecto de 'simbolo' y 'repeticiones'
    imprimirLinea("Subtítulo");       // Imprime: Subtítulo ----------

    // Llamada con todos los valores por defecto
    imprimirLinea();                  // Imprime: Línea vacía ----------

    return 0;
}

```

## Envío de un `struct` a una función

Los `struct` pueden pasarse a funciones como cualquier otro tipo de dato. Se puede emplear cualquiera de los tipos de paso de argumentos que hemos estudiado. Ejemplo:

```cpp
#include <iostream>

struct Rectangulo {
    double ancho;
    double alto;
};

void mostrarRectangulo(const Rectangulo& r) {
    std::cout << "Ancho: " << r.ancho << ", Alto: " << r.alto << std::endl;
}

void redimensionarRectangulo(Rectangulo& r, double nuevoAncho, double nuevoAlto) {
    r.ancho = nuevoAncho;
    r.alto = nuevoAlto;
}

int main() {
    Rectangulo r{5.0, 3.0};
    mostrarRectangulo(r);

    redimensionarRectangulo(r, 8.0, 4.5);
    std::cout << "Después de redimensionar:" << std::endl;
    mostrarRectangulo(r);

    return 0;
}
```

* Si la función no debe modificar el `struct`, se declara como `const Rectangulo&`.
* Si la función debe modificar el `struct`, se pasa como `Rectangulo&`.

