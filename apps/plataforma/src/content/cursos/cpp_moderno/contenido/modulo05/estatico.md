---
title: "Miembros estáticos de clases"
---

En programación orientada a objetos, cada instancia de una clase suele tener sus propios atributos y métodos (miembros de datos), lo que permite que cada objeto mantenga su propio estado. Sin embargo, en ciertos casos, es necesario disponer de información **compartida por todas las instancias** de una clase. Para ello, C++ proporciona los **miembros estáticos**.

## ¿Qué es un miembro estático?

Un **miembro estático** es un miembro (atributo o método) de una clase que **pertenece a la clase en sí**, y no a las instancias individuales. Esto significa que:

* Existe una sola copia compartida por todas las instancias.
* Puede accederse sin necesidad de crear un objeto (usando el nombre de la clase).
* La declaración de un miembro estático se realiza dentro de la clase. 
* Su inicialización se hace fuera de la clase.


## Ejemplo de atributo estático

Quemos contar el números de tickets que se crean. Veamos el ejemplo:

```cpp
#include <iostream>
#include <string>

class Ticket {
private:
    std::string asunto;
    int id;

public:
    // Atributo estático: contador de tickets creados
    static int contadorTickets;

    // Constructor usando lista de inicialización
    Ticket(const std::string& asunto_) 
        : asunto{asunto_}, id{++contadorTickets} 
    {
        std::cout << "Ticket creado: " << id << " - " << asunto << '\n';
    }

    int getId() const { 
        return id; 
    }

    const std::string& getAsunto() const { 
        return asunto; 
    }

};

// Inicialización del atributo estático (fuera de main)
int Ticket::contadorTickets = 0;

int main() {
    Ticket t1("Problema con la impresora");
    Ticket t2("Fallo en el correo");
    Ticket t3("Solicitud de acceso a la VPN");

    std::cout << "\nTotal tickets creados: " << Ticket::contadorTickets << '\n';

    return 0;
}
```

## Ejemplo de métodos estático

En este caso declaramos el atributo estático como privado y necesitamos un **método estático** que nos permita obtener el valor de ese atributo.

```cpp
#include <iostream>
#include <string>

class Ticket {
private:
    std::string asunto;
    int id;

    // Atributo estático: contador de tickets creados
    static int contadorTickets;

public:
    // Constructor usando lista de inicialización
    Ticket(const std::string& asunto_) 
        : asunto{asunto_}, id{++contadorTickets} 
    {
        std::cout << "Ticket creado: " << id << " - " << asunto << '\n';
    }

    int getId() const { 
        return id; 
    }

    const std::string& getAsunto() const { 
        return asunto; 
    }

    // Método estático para acceder al contador
    static int totalTicketsCreados() { 
        return contadorTickets; 
    }
};

// Inicialización del atributo estático (fuera de la clase)
int Ticket::contadorTickets = 0;

int main() {
    Ticket t1("Problema con la impresora");
    Ticket t2("Fallo en el correo");
    Ticket t3("Solicitud de acceso a la VPN");

    std::cout << "\nTotal tickets creados: " 
              << Ticket::totalTicketsCreados() << '\n';

    return 0;
}
```
