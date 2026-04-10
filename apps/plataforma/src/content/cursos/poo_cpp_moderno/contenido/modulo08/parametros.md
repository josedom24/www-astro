---
title: "Clases genéricas con uno o varios parámetros de tipo"
---

En el apartado anterior se vio cómo definir plantillas con un único parámetro de tipo.
Sin embargo, en muchos casos una clase necesita trabajar con **varios tipos simultáneamente**.
C++ permite declarar **múltiples parámetros de tipo** en una plantilla, lo que proporciona gran flexibilidad.

## Plantillas con varios tipos

Una clase plantilla puede parametrizarse con **más de un tipo genérico**, lo que permite combinar objetos de tipos distintos dentro de una misma estructura. El siguiente ejemplo muestra cómo definir y usar una plantilla con dos parámetros de tipo:

```cpp
#include <iostream>
#include <string>

// Definición de una clase plantilla con dos tipos genéricos
template <typename T1, typename T2>
class Par {
private:
    T1 primero;
    T2 segundo;

public:
    Par(const T1& a, const T2& b) : primero(a), segundo(b) {}

    T1 getPrimero() const { return primero; }
    T2 getSegundo() const { return segundo; }
};

int main() {
    // Instanciación con tipos distintos
    Par<int, std::string> p1(1, "uno");
    std::cout << "Par 1 -> " << p1.getPrimero() << ", " << p1.getSegundo() << '\n';

    Par<double, char> p2(3.14, 'π');
    std::cout << "Par 2 -> " << p2.getPrimero() << ", " << p2.getSegundo() << '\n';

    return 0;
}
```

* `template <typename T1, typename T2>` indica que la clase depende de dos tipos genéricos.
* El compilador genera automáticamente versiones especializadas de `Par` para cada combinación de tipos (`int, std::string` y `double, char`).
* Este mecanismo permite **combinar tipos heterogéneos** sin duplicar código, con el mismo rendimiento que las clases concretas.


## Comparación con `std::pair`

La STL ofrece una plantilla genérica equivalente: `std::pair<T1, T2>`, definida en `<utility>`. Permite almacenar dos valores de tipos posiblemente distintos:

```cpp
#include <iostream>
#include <utility>
#include <string>

int main() {
    std::pair<int, std::string> p = std::make_pair(2, "dos");
    std::cout << p.first << ", " << p.second << '\n';
}
```

* `std::make_pair` deduce automáticamente los tipos de sus argumentos.
* Esta clase sirve, por ejemplo, para devolver dos valores desde una función o como base de estructuras como `std::map`.
* Crear nuestras propias versiones, como `Par`, ayuda a entender el modelo genérico y a añadir comportamientos personalizados.

## Parámetros no tipo

Además de tipos, las plantillas pueden recibir **valores constantes** como parámetros. Esto permite definir estructuras parametrizadas por tamaño o capacidad:

```cpp
#include <iostream>

template <typename T, int N>
class Arreglo {
private:
    T datos[N];
public:
    T& operator[](int i) { return datos[i]; }
    const T& operator[](int i) const { return datos[i]; }
    constexpr int size() const { return N; }
};

int main() {
    Arreglo<int, 5> arr;
    for (int i = 0; i < arr.size(); ++i)
        arr[i] = i * 10;

    for (int i = 0; i < arr.size(); ++i)
        std::cout << arr[i] << ' ';
}
```

* Esta plantilla recibe un tipo `T` y un entero constante `N`, creando un array de tamaño fijo.
* El concepto es similar a `std::array<T, N>` de la STL.

