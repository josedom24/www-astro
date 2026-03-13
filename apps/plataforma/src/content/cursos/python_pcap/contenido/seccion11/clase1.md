---
title: "El bloque else y finally en las excepciones"
---

## Bloque else

Las excepciones son un componente fundamental en la programación orientada a objetos en Python. Ofrecen una manera flexible de manejar errores y situaciones inesperadas, adaptándose a necesidades específicas en el desarrollo de software. 

El bloque `try` es donde se coloca el código que puede generar excepciones. Si ocurre un error en este bloque, el flujo del programa salta al bloque `except`, donde se maneja la excepción. Aquí hay un aspecto importante: Python permite incluir un bloque `else` después del bloque `except`. Este bloque se ejecuta únicamente si el código dentro del bloque `try` no genera ninguna excepción.

La inclusión de un bloque `else` puede mejorar la claridad del código al separar la lógica de manejo de errores del flujo normal de ejecución. A continuación, se muestra un ejemplo práctico que ilustra este comportamiento:

```
def reciprocal(n):
    try:
        n = 1 / n
    except ZeroDivisionError:
        print("División fallida")
        return None
    else:
        print("Todo salió bien")
        return n

print(reciprocal(2))  # Salida esperada: "Todo salió bien" seguido de "0.5"
print(reciprocal(0))  # Salida esperada: "División fallida" seguido de "None"
```

## Bloque finally

En Python, el manejo de excepciones no solo se limita a los bloques `try`, `except` y `else`. También se puede extender con un bloque `finally`, que garantiza la ejecución de un conjunto de instrucciones al final del bloque `try-except`, independientemente de si se generó una excepción o no. Esto proporciona una forma confiable de realizar tareas de limpieza, como cerrar archivos o liberar recursos.

El bloque `finally` se coloca después de los bloques `try`, `except` y `else`, y se ejecutará siempre, sin importar el resultado de la ejecución anterior. Esto lo convierte en una herramienta útil para asegurar que ciertos códigos siempre se ejecuten.

A continuación, se presenta un ejemplo que ilustra cómo funciona el bloque `finally` junto con los bloques `try`, `except` y `else`:

```
def reciprocal(n):
    try:
        n = 1 / n
    except ZeroDivisionError:
        print("División fallida")
        n = None
    else:
        print("Todo salió bien")
    finally:
        print("Es momento de decir adiós")
    return n

print(reciprocal(2))  # Salida esperada: "Todo salió bien", "Es momento de decir adiós", "0.5"
print(reciprocal(0))  # Salida esperada: "División fallida", "Es momento de decir adiós", "None"
```

