---
title: "Cómo compilar y ejecutar programas"
---

Suponemos que nuestro programa que hemos estudiado en el apartado anterior lo tenemos guardado en un fichero fuente llamado `programa.cpp`.

Si queremos compilar el programa desde el terminal:

```bash
g++ programa.cpp -o programa
```

Para ejecutar el programa:

```bash
./programa      # Linux/macOS
programa.exe    # Windows
```

Esto se puede realizar desde el **Visual Studio Code** abriendo un terminal: CTRL + SHIFT + `.

Sí queremos ejecutar con **Code Runner** desde **Visual Studio Code**.

1. Abre tu archivo `.cpp` y pulsa `Ctrl+Alt+N`.
2. El programa se compila y se ejecuta automáticamente.

Si no puedes escribir en el terminal del **Code Runner**:

1. Pulsa `Ctrl + ,` para abrir **Configuración**.
2. En la barra de búsqueda, escribe: `code runner run in terminal`.
3. **Marca** la opción: `Wheter to run code in integrated Terminal.`
