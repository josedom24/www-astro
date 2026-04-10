---
title: "Introducción a las cadenas de caracteres"
---

En C++ moderno existen dos formas principales de trabajar con cadenas de caracteres:

1. **La forma tradicional heredada de C:** Una cadena de caracteres es simplemente un **array de caracteres** terminado en un carácter especial `'\0'` (llamado **carácter nulo**). Esta forma sigue existiendo, pero es más propensa a errores y requiere mayor cuidado por parte del programador.
2. **La forma moderna usando la clase `std::string`:** C++ proporciona la clase `std::string` en la biblioteca estándar, que permite trabajar con cadenas de forma más segura, sencilla y flexible.

## Clases y objetos

* **Clase**: **Tipo de dato personalizado**. 
* **Objeto:** es una **variable de ese tipo de clase**. Cada objeto guarda su propia información.
* **Atributos (o miembros de datos):** son las **variables dentro de la clase**, que guardan la información del objeto.
* **Métodos (o funciones miembro):** son las **acciones que puede hacer el objeto**, es decir, funciones asociadas a la clase.

## Uso de la clase `std::string`

Para declarar una variable de tipo cadena, utilizamos la clase `std::string`. Podemos inicializarla directamente en el momento de la declaración utilizando **inicialización uniforme `{}`**, que es la forma recomendada en C++ moderno. 

Podemos acceder a un carácter de la cadena, es lo que se llama **indexación** y lo hacemos utilizando un **índice numérico**, teniendo en cuenta que el primer carácter está en la posición `0`. 

Ejemplo:

```cpp
#include <iostream>
#include <string>

int main() {

    //Definición de una cadena en C clásico
    //Tiene 5 caracteres, el último '\0'
    char saludo[] = "Hola";

    //Uso de la clase String
    std::string cadena1 {};
    std::string cadena2 {"Hola Mundo"};

    std::cout << cadena2 << std::endl;
    std::cout << cadena2[0] << std::endl;  // Imprime: H
    std::cout << cadena2.at(1) << std::endl;  // Imprime: o
    return 0;
}
```

* Es necesario incluir el archivo de cabeceras `string` para trabajar con la clase `std::string`.
* Hay que tener en cuenta que el acceso con `texto[índice]` **no realiza comprobación de límites**. Si se desea una forma más segura, se puede utilizar el método `at()`:

## Tamaño de la cadena

El método `length()` o `size()` devuelve el número de caracteres que contiene la cadena. Veamos un ejemplo:

```cpp
#include <iostream>
#include <string>

int main() {
    std::string texto {"Hola Mundo"};

    std::cout << "La longitud es: " << texto.length() << std::endl;
    std::cout << "Último carácter: " << texto[texto.size() - 1] << std::endl;
    return 0;
}
```

Ambos métodos `length()` y `size()` son equivalentes en `std::string`.


## Concatenación de cadenas

El operador `+` permite **unir** dos o más cadenas, generando una nueva. Veamos un ejemplo:

```cpp
#include <iostream>
#include <string>

int main() {
    std::string nombre {"Pepe"};
    std::string apellidos {"García"};
    std::string nombre_completo {};

    nombre_completo = nombre + " " + apellidos;

    std::cout << nombre_completo << std::endl;
    return 0;
}
```
