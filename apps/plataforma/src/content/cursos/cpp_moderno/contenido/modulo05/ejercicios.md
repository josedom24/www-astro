---
title: "Ejercicios de programación orientada a objetos"
---

## Ejercicio 1

Define una clase llamada `Empleado` que represente un empleado de una empresa con los siguientes atributos privados:

* `nombre` (`std::string`)
* `edad` (`int`)
* `sueldo` (`double`)
* `departamento` (`std::string`)

La clase debe incluir:

* Un **constructor por defecto** que inicialice todos los atributos con valores razonables (por ejemplo: nombre vacío, edad 0, sueldo 0, departamento vacío).
* Un **constructor que reciba todos los atributos** como parámetros.
* Métodos `double calcularBono()` y `double calcularSalarioAnual()` que devuelvan, respectivamente:

  * Bono = 10% del sueldo
  * Salario anual = sueldo mensual × 12 + bono
* Métodos **setters y getters** para cada atributo.
* Un método `mostrarInformacion()` que imprima todos los datos del empleado.
* En el `main`, crea al menos **dos empleados**, uno usando el constructor por defecto y otro usando el constructor con parámetros, y muestra su información completa junto con el bono y el salario anual.

## Ejercicio 2

Partiendo de la clase `Empleado`, modifica la clase para incluir:

* Un **atributo estático** `contadorEmpleados` que lleve la cuenta de cuántos empleados se han creado.
* Un **método estático** `totalEmpleados()` que devuelva el valor de `contadorEmpleados`.
* Actualiza los **constructores** (por defecto y con parámetros) para incrementar `contadorEmpleados` cada vez que se crea un empleado.
* Mantén todos los atributos anteriores (`nombre`, `edad`, `sueldo`, `departamento`) y los métodos de cálculo (`calcularBono()`, `calcularSalarioAnual()`) y de mostrar información.
* En el `main`, crea varios empleados y, además de mostrar su información, muestra el **total de empleados creados** usando el método estático.

## Ejercicio 3

1. Define una clase llamada `Fecha` con los siguientes atributos privados:

   * `dia` (`int`)
   * `mes` (`int`)
   * `anio` (`int`)

   La clase debe incluir:

   * Constructor por defecto que inicialice la fecha a 1/1/2000.
   * Constructor que reciba día, mes y año.
   * Métodos **setters y getters** para cada atributo.
   * Método `mostrar()` que imprima la fecha en formato `dd/mm/aaaa`.

2. Modifica la clase `Empleado` del ejercicio anterior para añadir un **atributo privado `fechaIncorporacion`** de tipo `Fecha`.

   La clase `Empleado` debe incluir:

   * Modificar los constructores para inicializar también `fechaIncorporacion`.
   * Métodos **setters y getters** para `fechaIncorporacion`.
   * Actualizar el método `mostrarInformacion()` para mostrar también la fecha de incorporación.

3. En el `main`, crea varios empleados con distintas fechas de incorporación y muestra toda su información.


## Ejercicio 4

1. Partiendo de la clase `Empleado` que ya has creado (con atributos `nombre`, `edad`, `sueldo` y `departamento`, y métodos de cálculo de bono y salario anual), define una **clase derivada** llamada `EmpleadoTemporal`.

2. La clase `EmpleadoTemporal` debe incluir:

   * Un **atributo privado** `duracionContrato` (`int`) que represente la duración del contrato en meses.
   * Un **constructor** que reciba todos los atributos de `Empleado` más `duracionContrato`.
   * Métodos **setters y getters** para `duracionContrato`.
   * Un método `mostrarInformacion()` que sobrescriba el de la clase base y muestre también la duración del contrato.

3. Define otra clase derivada llamada `EmpleadoFijo` que represente un empleado con contrato indefinido:

   * Un **atributo privado** `beneficios` (`std::string`) que indique beneficios adicionales (por ejemplo: “Seguro médico”).
   * Constructor que reciba los atributos de `Empleado` y `beneficios`.
   * Métodos **setters y getters** para `beneficios`.
   * Método `mostrarInformacion()` que sobrescriba el de la clase base y muestre también los beneficios.

4. En el `main`, crea al menos **un `EmpleadoTemporal` y un `EmpleadoFijo`**, y llama a `mostrarInformacion()` para ambos.

5. **Opcional:** Haz que `mostrarInformacion()` en la clase base sea **virtual** para preparar el polimorfismo dinámico.

