---
title: "Fluidez de métodos"
---

En C++ es común encontrar clases en las que necesitamos **configurar o modificar un objeto mediante varias llamadas consecutivas**. Para mejorar la legibilidad del código y evitar múltiples sentencias repetitivas, podemos emplear la **fluidez de métodos** (*method chaining* en inglés).

La idea es que cada método retorne una **referencia al propio objeto** (`*this`), de manera que podamos encadenar llamadas de forma natural.

## Fundamento: `return *this`

En todo método no estático, el puntero `this` apunta al objeto actual.
Si hacemos `return *this;`, devolvemos una referencia al mismo objeto que está recibiendo la llamada. Esto nos permite continuar aplicando métodos en cadena.

La firma típica de un método fluido es:

```cpp
Tipo& metodo(...args) {
    // ...acciones sobre el objeto...
    return *this;
}
```

Para evitar copias innecesarias, se devuelve **por referencia** (`Tipo&`).
Si el método no modifica el objeto, también puede devolverse por **referencia constante** (`const Tipo&`).

## Ejemplo básico

```cpp
#include <iostream>
#include <string>

class Cadena {
private:
    std::string texto;

public:
    // Método fluido: retorna una referencia al propio objeto
    Cadena& agregar(const std::string& s) {
        texto += s;
        return *this;
    }

    void imprimir() const {
        std::cout << texto << "\n";
    }
};

int main() {
    Cadena c;
    // Encadenamiento fluido
    c.agregar("Hola, ").agregar("mundo").agregar("!");
    c.imprimir();  // Imprime: Hola, mundo!
}
```

En este ejemplo, cada llamada a `agregar` devuelve una referencia a `c`, lo que permite encadenar varias operaciones sobre el mismo objeto en una sola instrucción.

## Ejemplo práctico: configuración encadenada

Veamos un caso más realista: configurar la conexión a un servidor.

```cpp
#include <iostream>
#include <string>

class Conexion {
private:
    std::string host;
    int puerto = 0;
    bool segura = false;

public:
    Conexion& setHost(const std::string& h) {
        host = h;
        return *this;
    }

    Conexion& setPuerto(int p) {
        puerto = p;
        return *this;
    }

    Conexion& usarSSL(bool s) {
        segura = s;
        return *this;
    }

    void conectar() const {
        std::cout << "Conectando a " << host << ":" << puerto
                  << (segura ? " con SSL\n" : " sin SSL\n");
    }
};

int main() {
    Conexion c;
    // Configuración fluida y expresiva
    c.setHost("localhost")
     .setPuerto(443)
     .usarSSL(true)
     .conectar();
}
```

Aquí, el objeto `Conexion` permite configurar de manera encadenada sus parámetros antes de ejecutar `conectar()`. Esto hace el código más claro y cercano a un lenguaje natural.

