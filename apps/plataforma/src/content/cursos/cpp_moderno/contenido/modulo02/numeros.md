---
title: "Tipos de datos numéricos y operaciones aritméticas"
---

Los principales tipos de datos numéricos son los siguientes:

* `int`: Nos permite guardar valores enteros.
* `float`: Nos permiten guardar números reales de precisión simple (7 dígitos decimales aproximadamente).
* `double`: Nos permite guardar números reales de doble precisión (16 dígitos decimales aproximadamente).

El tipo de un dato determina el tamaño de memoria que se va a utilizar para guardarlo y, por lo tanto, determina los valores que podemos representar.

| Tipo       | Memoria    | Rango de valores               |
| ---------- |:----------:|-------------------------------:|
| int        | 4 bytes    | -2147483648 a 2147483647       |
| float      | 4 bytes    | -3.4E+38 a +3.4E+38            |
| double     | 8 bytes    | -1.7E+308 a +1.7E+308         |


## Modificadores de tipos

Podemos modificar los tipos anteriores para dos cosas: para aumentar la memoria utilizada y, por lo tanto, aumentar el rango de valores representables, y para indicar si se usan números negativos o no.

Los modificadores son los siguientes: `signed`, `unsigned`, `long` y `short`.

* Los modificadores `signed`, `unsigned`, `long` y `short` se pueden aplicar al tipo `int`.
* Los modificadores `signed`, `unsigned` se puede aplicar al tipo `char`.
* El modificador `long` se puede aplicar al tipo `double`.
* Los modificadores `signed`, `unsigned` también se pueden usar como prefijos de los modificadores `long` y `short`.

Con estas reglas nos quedarían esta tabla con todos los tipos:

| Tipo               | Memoria    | Rango de valores                           |
| -------------------|:----------:|-------------------------------------------:|
| int                | 4 bytes    | -2147483648 a 2147483647                   |
| signed int         | 4 bytes    | -2147483648 a 2147483647                   |
| unsigned int       | 4 bytes    | 0 a 4294967295                             |
| short int          | 2 bytes    | -32768 a 32767                             |
| signed short int   | 2 bytes    | -32768 a 32767                             | 
| unsigned short int | 2 bytes    | 0 a 65535                                  |
| long int           | 8 bytes    | -9223372036854775808 a 9223372036854775807 |
| signed long int    | 8 bytes    | -9223372036854775808 a 9223372036854775807 |
| unsigned long int  | 8 bytes    | 0 a 18446744073709551615                   |
| float              | 4 bytes    | -3.4E+38 a +3.4E+38                        |
| double             | 8 bytes    | -1.7E+308 a +1.7E+308                      |
| long double        | 16 bytes   | 3.3621e-4932 a 1.18973e+4932               |
  
Los tamaños indicados son los más comunes en sistemas de 64 bits, pero pueden variar según la implementación.

Al declarar variables podemos usar una notación corta para declarar enteros largos, cortos o sin signos, donde no tenemos que indicar el tipo `int`, por ejemplo estas dos declaraciones son correctas:

    unsigned short var1;
    long var2;

Podemos usar sufijos para indicar literales numéricos largos (con el sufijo `L`) y sin signo (con el sufijo `U`) O para valores reales el sufijo `f` para valores de precisión simple. Por ejemplo: `123U; 123L; 123UL; 3.14f`.


## Operadores aritméticos

* `+`: Suma dos números
* `-`: Resta dos números
* `*`: Multiplica dos números
* `/`: Divide dos números.
* `%`: Módulo o resto de la división
* `+`, `-`: Operadores unarios positivo y negativo
* `++`: Operador de incremento. Suma uno a la variable, `i++` es lo mismo que `i=i+1`. Dos tipos:
    * `++i`: Pre-incremento:**Primero incrementa**, luego devuelve el valor incrementado.
    * `i++`: Post-incremento:**Primero devuelve el valor actual**, luego incrementa.
* `--`: Operador de decremento. Resta uno a la variable. También existe el pre-decremento y el post-incremento.

La precedencia de operadores es la siguiente:

* Los paréntesis rompen la precedencia.
* Operadores unarios (solo tienen un operador, por ejemplo el -9)
* Multiplicar, dividir y módulo
* Suma y resta
* Operadores de incremento y decremento

Veamos un ejemplo:

```cpp
#include <iostream>
using namespace std;

int main() {
    // Declaración de variables numéricas
    int a = 10;                 // Entero con signo
    unsigned int b = 20U;       // Entero sin signo (sufijo U)
    long c = 1000000L;          // Entero largo (sufijo L)
    float d = 3.14f;            // Número real de precisión simple (sufijo f)
    double e = 2.71828;         // Número real de doble precisión

    // Operaciones aritméticas básicas
    int suma = a + b;           // Suma de int y unsigned int
    int resta = b - a;          // Resta
    int producto = a * 2;       // Multiplicación
    int divisionEntera = b / a; // División entera: 20 / 10 = 2
    double divisionReal = b / d; // División real: convierte a double

    // Uso del operador módulo (solo válido con enteros)
    int resto = b % a;          // 20 % 10 = 0

    // Incremento y decremento
    int x = 5;
    int y = ++x;                // Pre-incremento: x=6, y=6
    int z = x++;                // Post-incremento: z=6, luego x=7

    // Ejemplo de precedencia
    int resultado1 = a + b * 2;     // Multiplicación antes que la suma: 10 + (20*2) = 50
    int resultado2 = (a + b) * 2;  // Paréntesis cambian la precedencia: (10+20)*2 = 60

    // Mostramos resultados
    cout << "Suma: " << suma << endl;
    cout << "Resta: " << resta << endl;
    cout << "Producto: " << producto << endl;
    cout << "Division entera: " << divisionEntera << endl;
    cout << "Division real: " << divisionReal << endl;
    cout << "Resto (modulo): " << resto << endl;
    cout << "Pre-incremento (++x): y = " << y << ", x = " << x << endl;
    cout << "Post-incremento (x++): z = " << z << ", x = " << x << endl;
    cout << "Resultado sin parentesis: " << resultado1 << endl;
    cout << "Resultado con parentesis: " << resultado2 << endl;

    return 0;
}
```

## Funciones matemáticas

En la librería `cmath` tenemos distintas funciones matemáticas. Las más útiles que podemos usar en nuestros programas son:

* `double std::pow(double, double);`: Realiza la potencia, la base es el primer parámetro y el exponente el segundo. Recibe datos de tipo `double` y devuelve también un valor `double`.
* `double std::sqrt(double);`: Realiza la raíz cuadrada del parámetro `double` que recibe. Devuelve un valor `double.
* `int std::abs(int);`: Devuelve el valor absoluto (valor entero) del número entero que recibe como parámetro.

Veamos un ejemplo:

```cpp
#include <iostream>
#include <cmath>
using namespace std;
int main(int argc, char *argv[]) {
	int num1=4, num2=2;
	cout << "Potencia:" << pow(num1,num2) << endl; //Potencia
	cout << "Raíz Cuadrada:" << sqrt(num1) << endl; //Raíz cuadrada
	num1=-4;
	cout << "Valor absoluto:" << abs(num1) << endl; //Valor absoluto
	return 0;
}
```