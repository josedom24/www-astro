---
title: "Instalación de un entorno de desarrollo para C++"
---

Para programar en C++ se requieren dos herramientas:

1. **Compilador C++**: Convierte el código fuente en un programa ejecutable.
2. **Editor de texto o entorno de desarrollo (IDE)**: Donde escribimos nuestro código.

En este curso vamos a utilizar como IDE **Visual Studio Code**: [https://code.visualstudio.com](https://code.visualstudio.com)

## Windows

La opción recomendada es instalar el compilador MinGW (GCC para Windows)

* Enlace de descarga: [https://www.mingw-w64.org/](https://www.mingw-w64.org/)
* Recomendación: usa el instalador de la comunidad ([https://winlibs.com](https://winlibs.com)), elige la versión *"MinGW-w64 GCC"* de 64 bits.
* Descarga y descomprime el archivo ZIP.
* Copia la ruta de la carpeta `bin`, por ejemplo:
  `C:\mingw-w64\bin`

Configurar variables de entorno:

* Abre el Panel de control → Sistema → Configuración avanzada → Variables de entorno.
* En la variable `Path`, haz clic en *Editar* y añade la ruta del compilador (`C:\mingw-w64\bin`).

Para verificar la instalación:

* Abre la terminal (CMD o PowerShell) y escribe:

```bash
g++ --version
```

Deberías ver la versión del compilador.

## GNU/Linux (Ubuntu, Debian)

Usaremos el compilador `g++`. Para su instalación:

```bash
sudo apt update
sudo apt install g++
```

Verificamos la instalación:

```bash
g++ --version
```

## macOS

Podemos usar el compilador `clang` incluido en Xcode Command Line Tools. Abre el terminal y escribir:

```bash
xcode-select --install
```

Esto instalará las herramientas necesarias (incluye `clang`, compatible con C++). Para verificar la instalación:

```bash
clang++ --version
```


## Instalar extensiones en VS Code

En **Visual Studio Code**:

* Abre el panel de extensiones. Haz clic en el icono de cuadrados (barra lateral izquierda) o pulsa `Ctrl+Shift+X`.
* Instala la extensión **C/C++**.
* Instala **Code Runner**. Esto es opcional, pero nos permite ejecutar tu programa con un solo clic o atajo.

La extensión C/C++:

* Te da resaltado de errores, autocompletado, navegación por símbolos, etc.
* No compila ni ejecuta por sí sola: necesita que lo hagas tú por terminal o tareas.
