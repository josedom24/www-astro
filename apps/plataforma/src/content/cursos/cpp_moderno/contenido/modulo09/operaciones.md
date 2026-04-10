---
title: "Apertura, lectura y escritura de archivos"
---

Una vez entendida la relación entre archivos, recursos y excepciones, pasamos a la parte práctica: **cómo abrir, leer y escribir archivos en C++ moderno**. Para ello, usamos las clases proporcionadas por la biblioteca estándar `<fstream>`:

* `std::ifstream`: para leer archivos (input file stream).
* `std::ofstream`: para escribir archivos (output file stream).
* `std::fstream`: para leer y escribir (file stream).

Para usar estas clases debemos incluir el archivo de cabeceras `fstream`.

Cuando usamos estas clases, podemos indicar el modo de operación indicando distintos `flags`. Podemos combinar varios flags (modos) usando el operador OR bit a bit `|`. Los modos son los siguientes:


* `std::ifstream` (solo lectura):
  * `std::ios::in` (por defecto): abrir para **leer**.
  * `std::ios::binary`: leer en **modo binario**.
* `std::ofstream` (solo escritura):
  * `std::ios::out` (por defecto): abrir para **escribir**, sobrescribe si el archivo existe.
  * `std::ios::app`: añadir al **final** del archivo.
  * `std::ios::ate`: posiciona el puntero al final al abrir (pero permite escribir en cualquier posición).
  * `std::ios::binary`: escribir en **modo binario**.
  * `std::ios::trunc`: **trunca** el archivo al abrir (borra el contenido).
* `std::fstream` (lectura y escritura):
  * `std::ios::in`: abrir para **leer**.
  * `std::ios::out`: abrir para **escribir**.
  * `std::ios::app`: añadir al **final** del archivo.
  * `std::ios::ate`: posiciona el puntero al final al abrir.
  * `std::ios::binary`: abrir en **modo binario**.
  * `std::ios::trunc`: **trunca** el archivo al abrir (borra el contenido).

  
## Lectura de archivos

Veamos un ejemplo para abrir un archivo de texto para lectura:

```cpp
#include <iostream>
#include <fstream>
#include <string>

int main() {
    std::ifstream archivo;

    try {
        archivo.exceptions(std::ifstream::failbit | std::ifstream::badbit);
        archivo.open("datos.txt");

        std::string linea;
        while (std::getline(archivo, linea)) {
            std::cout << linea << '\n';
        }

    } catch (const std::ios_base::failure& e) {
        std::cerr << "Error al abrir o leer el archivo: " << e.what() << '\n';
    }

    // Cierre automático por RAII
    return 0;
}

```

* Activamos las excepciones sobre el flujo antes de abrirlo. Cualquier fallo lanza `std::ios_base::failure`.
* `std::getline()` permite leer línea a línea.
* No hace falta llamar a `archivo.close()`, porque el objeto se destruye automáticamente al salir del ámbito (RAII).

Estamos diciéndole al flujo de entrada que lance una excepción si se activa `failbit` o `badbit`. Pero al llegar al final del archivo, `std::getline()` establece `failbit`, lo que activa una excepción, incluso aunque la lectura haya sido exitosa hasta ese punto.

Para solucionarlo vamos a hacer la lectura dentro del bucle sin que `failbit` dispare excepciones, y activa excepciones solo para errores críticos (como `badbit`). Haz la lectura dentro del bucle sin que failbit dispare excepciones, y activa excepciones solo para errores críticos (como badbit). Es decir:

```cpp
#include <iostream>
#include <fstream>
#include <string>

int main() {
    std::ifstream archivo;

    try {
        archivo.exceptions(std::ifstream::badbit);  // Solo badbit lanza excepciones
        archivo.open("datos.txt");

        std::string linea;
        while (std::getline(archivo, linea)) {
            std::cout << linea << '\n';
        }

        if (!archivo.eof()) {
            // Si no es fin de archivo, hubo un error inesperado
            std::cerr << "Error: la lectura terminó inesperadamente.\n";
        }

    } catch (const std::ios_base::failure& e) {
        std::cerr << "Error al abrir o leer el archivo: " << e.what() << '\n';
    }

    // Cierre automático por RAII al salir del scope
}
```

## Escritura de archivos

```cpp
#include <iostream>
#include <fstream>
#include <string>

int main() {
    std::ofstream archivo;

    try {
        archivo.exceptions(std::ofstream::failbit | std::ofstream::badbit);
        archivo.open("salida.txt"); // Crea el archivo o lo sobreescribe

        archivo << "Primera línea\n";
        archivo << "Segunda línea\n";

    } catch (const std::ios_base::failure& e) {
        std::cerr << "Error al abrir o escribir en el archivo: " << e.what() << '\n';
    }
}

```

* Si el archivo ya existe, se **sobrescribe** por defecto.
* Puedes usar `archivo << ...` igual que `std::cout`.

Para abrir el archivo en  modo **adjuntar (append)**:

```cpp
#include <iostream>
#include <fstream>

int main() {
    try {
        std::ofstream archivo;
        archivo.exceptions(std::ofstream::failbit | std::ofstream::badbit);
        archivo.open("log.txt", std::ios::app);

        archivo << "Nueva línea de log\n";

    } catch (const std::ios_base::failure& e) {
        std::cerr << "Error al escribir en log.txt: " << e.what() << '\n';
    }
}
```

## Leer archivos palabra por palabra

```cpp
#include <iostream>
#include <fstream>
#include <string>

int main() {
    try {
        std::ifstream archivo;
        archivo.exceptions(std::ifstream::badbit);  // Solo badbit lanza excepción
        archivo.open("palabras.txt");

        std::string palabra;
        while (archivo >> palabra) {
            std::cout << "Leído: " << palabra << '\n';
        }

        if (!archivo.eof()) {
            // Si no es fin de archivo, ocurrió un error inesperado
            std::cerr << "Error: la lectura terminó inesperadamente.\n";
        }

    } catch (const std::ios_base::failure& e) {
        std::cerr << "Error durante la lectura: " << e.what() << '\n';
    }
}
```

* Aquí se usa el operador `>>` para extraer palabras separadas por espacios.

## Leer y escribir con `std::fstream`

```cpp
#include <iostream>
#include <fstream>
#include <string>

int main() {
    try {
        std::fstream archivo;
        archivo.exceptions(std::fstream::badbit);  // Solo badbit lanza excepción
        archivo.open("archivo.txt", std::ios::in | std::ios::out);

        std::string linea;
        if (std::getline(archivo, linea)) {
            std::cout << "Primera línea: " << linea << '\n';
        } else if (!archivo.eof()) {
            std::cerr << "Error inesperado al leer la línea.\n";
        }

        archivo.clear();  // Limpiar posibles flags de error antes de escribir
        archivo << "\nNueva línea añadida.";

    } catch (const std::ios_base::failure& e) {
        std::cerr << "Error durante lectura o escritura: " << e.what() << '\n';
    }
}
```

* En este caso, hemos concatenado dos banderas `std::ios::in | std::ios::out` para poder realizar las dos operaciones.

## Modo binario

Si estás trabajando con archivos binarios (imágenes, estructuras serializadas, etc.), añade la bandera `std::ios::binary` en la apertura del archivo.  `std::ios::binary` abre el archivo **en modo binario**, lo cual es esencial para archivos no de texto (como imágenes, sonidos, etc.). Si no se usa este modo, el sistema podría intentar interpretar los bytes como texto y alterar el contenido. Veamos un ejemplo:

```cpp
#include <iostream>
#include <fstream>
#include <vector>

int main() {
    try {
        std::ifstream archivo;
        archivo.exceptions(std::ifstream::failbit | std::ifstream::badbit);
        archivo.open("imagen.jpg", std::ios::binary);

        std::vector<char> buffer((std::istreambuf_iterator<char>(archivo)),
                                  std::istreambuf_iterator<char>());

        std::cout << "Tamaño de archivo: " << buffer.size() << " bytes\n";

    } catch (const std::ios_base::failure& e) {
        std::cerr << "Error al leer archivo binario: " << e.what() << '\n';
    }
}
```


* Crea un `std::vector<char>` llamado `buffer`.
* Usa **iteradores de flujo de entrada binaria** (`std::istreambuf_iterator`) para leer todos los bytes del archivo desde el principio hasta el final.
* El constructor del `vector` lee el archivo completo y almacena sus bytes dentro del `buffer`.
* Se imprime la cantidad total de bytes almacenados en el vector, que es equivalente al tamaño del archivo. Esto se hace con el método `buffer.size()`.

Si queremos escribir en un fichero binario, utilizarenos el método `write` indicando los datos que queremos escribir como bytes y su tamño en memoria. Veamos un ejemplo:

```cpp
#include <iostream>
#include <fstream>

int main() {
    try {
        std::ofstream archivo("datos.bin", std::ios::binary);
        archivo.exceptions(std::ofstream::failbit | std::ofstream::badbit);

        int numeros[] = {10, 20, 30, 40, 50};
        archivo.write(reinterpret_cast<const char*>(numeros), sizeof(numeros));

        std::cout << "Datos escritos correctamente en datos.bin\n";

    } catch (const std::ios_base::failure& e) {
        std::cerr << "Error al escribir en el archivo binario: " << e.what() << '\n';
    }

    return 0;
}
```

* El método `write` solo escribe punteros al tipo `char`.
* `reinterpret_cast<const char*>(numeros)`: Convierte la dirección del array `int[]` a un `const char*` para que lo escriba `write`.

