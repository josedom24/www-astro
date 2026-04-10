---
title: "Introducción al encapsulamiento"
---

Uno de los pilares fundamentales de la programación orientada a objetos es el **encapsulamiento**, que consiste en **ocultar los detalles internos de una clase** y exponer únicamente lo necesario para su uso externo.
En C++, esto se logra utilizando **modificadores de acceso**, que determinan qué partes del programa pueden acceder a los miembros (atributos y métodos) de una clase. 

El **encapsulamiento** permite:

* **Proteger el estado interno** del objeto de modificaciones indebidas.
* **Restringir el acceso directo** a los atributos. Utilizamos métodos especiales (**gettes y setters**) par ael acceso y modificación de los atributos.
* **Definir una interfaz pública clara**, mientras se ocultan los detalles de implementación.

## Modificadores de acceso

Los **modificadores de acceso** determinan la visibilidad de los atributos y métodos de la clase. Los más utilizados son:

* `public`: Los miembros declarados como `public` son accesibles desde cualquier parte del programa.
* `private`: Los miembros declarados como `private` solo son accesibles desde dentro de la propia clase. Se utilizan para proteger el estado interno del objeto. 

Veamos el mismo ejemplo que en el apartado anterior, pero ocultando los atributos:

```cpp
#include <iostream>

class Rectangulo {
private:
    double base;
    double altura;

public:
    // Constructor por defecto
    Rectangulo() {
        base = 0.0;  
        altura = 0.0; 
    }

    // Constructor con parámetros
    Rectangulo(double b, double h) {
        base = b;
        altura = h;
    }

    // Método para calcular el área
    double calcularArea() const {
        return base * altura;
    }
};

int main() {
    // Crear un objeto usando el constructor por defecto
    Rectangulo r1;
    std::cout << "Área del rectángulo r1 (por defecto): " << r1.calcularArea() << std::endl;

    // Crear un objeto usando el constructor con parámetros
    Rectangulo r2{5.0, 3.0};
    std::cout << "Área del rectángulo r2 (con parámetros): " << r2.calcularArea() << std::endl;

    // Modificar las dimensiones de r1 usando los setters
    r1.setBase(7.0);
    r1.setAltura(4.0);
    std::cout << "Área del rectángulo r1 después de actualizar dimensiones: " << r1.calcularArea() << std::endl;

    return 0;
}
```

## Introducción de getters y setters

El **encapsulamiento** es un principio fundamental de la POO que consiste en proteger los atributos internos de los objetos, permitiendo su acceso o modificación únicamente a través de métodos públicos controlados, conocidos como **getters** (métodos que permiten el valor de los atributos) y **setters** (métodos que permiten modificar los atributos).

Veamos el ejemplo:

```cpp
#include <iostream>

class Rectangulo {
private:
    double base;   
    double altura; 

public:
    // Constructor por defecto
    Rectangulo() {
        base = 0.0;  
        altura = 0.0; 
    }

    // Constructor con parámetros
    Rectangulo(double b, double h) {
        base = b;
        altura = h;
    }

    // Métodos setters
    void setBase(double b) {
        base = b;
    }

    void setAltura(double h) {
        altura = h;
    }

    // Métodos getters
    double getBase() const {
        return base;
    }

    double getAltura() const {
        return altura;
    }

    // Método para calcular el área
    double calcularArea() const {
        return base * altura;
    }
};

int main() {
    // Crear un objeto usando el constructor por defecto
    Rectangulo r1;

    // Usar los setters para asignar valores
    r1.setBase(7.0);
    r1.setAltura(4.0);

    // Usar los getters para obtener los valores de base y altura y mostrar el área
    std::cout << "Área del rectángulo r1 (por defecto, luego usando setters): " 
              << r1.calcularArea() << " (Base: " << r1.getBase() 
              << ", Altura: " << r1.getAltura() << ")" << std::endl;

    // Crear un objeto usando el constructor con parámetros
    Rectangulo r2{5.0, 3.0};  // Inicialización uniforme

    // Usar los getters para obtener los valores de base y altura y mostrar el área
    std::cout << "Área del rectángulo r2 (con parámetros): " 
              << r2.calcularArea() << " (Base: " << r2.getBase() 
              << ", Altura: " << r2.getAltura() << ")" << std::endl;

    // Modificar las dimensiones de r2 usando los setters
    r2.setBase(10.0);
    r2.setAltura(2.0);

    // Usar los getters para obtener los valores de base y altura y mostrar el área
    std::cout << "Área del rectángulo r2 después de actualizar dimensiones con setters: " 
              << r2.calcularArea() << " (Base: " << r2.getBase() 
              << ", Altura: " << r2.getAltura() << ")" << std::endl;

    return 0;
}
```
Los getters y setters:

* Permiten controlar cómo se accede o modifica el estado del objeto.
* Facilitan la validación de datos antes de modificar atributos (como en el caso de la edad).
* Mejoran la seguridad y robustez del código.
* Mantienen el principio de encapsulamiento.


## Ejemplo completo: Clase `Coche`

```cpp
#include <iostream>
#include <string>

class Coche {
private:
    std::string marca;
    std::string modelo;
    int anio;

public:
    // Setter para la marca
    void setMarca(const std::string& m) {
        marca = m;
    }

    // Getter para la marca
    std::string getMarca() const {
        return marca;
    }

    // Setter para el modelo
    void setModelo(const std::string& mod) {
        modelo = mod;
    }

    // Getter para el modelo
    std::string getModelo() const {
        return modelo;
    }

    // Setter para el año (con validación)
    void setAnio(int a) {
        if (a > 1885) { // Primer automóvil se inventó alrededor de 1886
            anio = a;
        } else {
            std::cout << "Año no válido. Debe ser mayor a 1885." << std::endl;
        }
    }

    // Getter para el año
    int getAnio() const {
        return anio;
    }

    // Método para mostrar la información del coche
    void mostrarInformacion() const {
        std::cout << "Marca: " << marca 
                  << ", Modelo: " << modelo 
                  << ", Año: " << anio << std::endl;
    }
};

int main() {
    Coche coche1;

    // Inicialización de los atributos usando setters
    coche1.setMarca("Toyota");
    coche1.setModelo("Corolla");
    coche1.setAnio(2020);

    // Mostrar información usando un método
    coche1.mostrarInformacion();

    // Ejemplo de uso de getters
    std::cout << "La marca del coche es: " << coche1.getMarca() << std::endl;

    return 0;
}
```

* La clase `Coche` encapsula tres atributos privados: `marca`, `modelo` y `anio`.
* Se proporcionan métodos públicos (`set` y `get`) para controlar el acceso y modificación de esos atributos.
* El método `setAnio` incluye una validación para evitar valores inválidos.
* El método `mostrarInformacion` imprime el estado del objeto de forma legible.
* En la función `main`, se crea un objeto `coche1`, se inicializa mediante setters y se accede a su información.
