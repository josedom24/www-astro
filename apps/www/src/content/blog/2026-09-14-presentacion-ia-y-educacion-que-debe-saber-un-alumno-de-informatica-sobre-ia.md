---
title: "Presentación: IA y educación — Qué debe saber un alumno de informática sobre IA"
date: 2026-09-14
slug: "blog/2026/09/presentacion-ia-y-educacion-que-debe-saber-un-alumno-de-informatica-sobre-ia"
tags:
  - "IA"
  - "Educación"
---

![Presentación: IA y educación — Qué debe saber un alumno de informática sobre IA](/pledin/assets/2024/09/ia.png)

He desarrollado **IA y educación**, una presentación pensada para mi alumnado de ASIR, con dos objetivos que me parecen igual de importantes. El primero, que tengan los **conceptos fundamentales** de cómo funciona realmente la IA: qué es, cómo aprende una máquina, qué es la IA generativa, el vocabulario básico de agentes y seguridad, y cuáles son sus límites y su marco legal. El segundo, y el que más me importa, que aprendan a **usarla como herramienta educativa** de verdad, integrada en su forma de estudiar y de trabajar — no como una curiosidad, y desde luego no como un atajo para copiar sin entender.

<!--more-->

## ¿Qué es la Inteligencia Artificial?

Arrancamos por lo básico: la IA es el conjunto de técnicas que permiten a una máquina realizar tareas que, hechas por una persona, diríamos que requieren inteligencia. No es magia ni es lo mismo que automatizar un script: es estadística aplicada a gran escala.

La idea clave para entender el salto de la programación clásica a la IA moderna es esta: en la programación clásica el programador escribe las reglas paso a paso (*si pasa X, haz Y*); en la IA moderna no se escriben reglas, se le muestran al sistema muchísimos ejemplos y aprende a descubrir los patrones por sí mismo — como enseñar a un niño a reconocer un gato enseñándole muchos gatos, no dándole una lista de características.

También dejamos clara una distinción que se presta a confusión: la IA actual es **estrecha** (resuelve muy bien una tarea concreta, y solo esa), frente a la **IA general (AGI)**, que razonaría en cualquier ámbito como una persona y que, a día de hoy, sigue siendo un objetivo de investigación, no una realidad. Y aunque un chatbot escriba con fluidez y hasta programe, conviene tener claro que no tiene conciencia, no razona como una persona y no entiende el significado como tú: predice qué palabra es más probable a continuación, a partir de patrones aprendidos en billones de textos.

## Cómo aprende una máquina

Este bloque entra en el mecanismo real: el **aprendizaje automático (machine learning)**, en sus tres modalidades — supervisado (con ejemplos ya etiquetados), no supervisado (el sistema descubre patrones solo) y por refuerzo (aprendizaje por ensayo y error con recompensas).

Explicamos qué es una **red neuronal artificial**: neuronas conectadas en capas que reciben números, los multiplican por unos *pesos* y producen una salida que pasa a la siguiente capa. Y recorremos el ciclo de entrenamiento paso a paso — se muestra un ejemplo, la red predice (al principio casi al azar), se compara con la respuesta correcta, se mide el error, y un algoritmo (no una persona) ajusta los pesos para reducirlo. Se repite con millones de ejemplos hasta que el error es muy pequeño.

De ahí llegamos al **aprendizaje profundo (deep learning)**: una red con muchas capas apiladas, el tipo que hay detrás de casi todos los avances recientes, desde el reconocimiento facial hasta ChatGPT o Claude.

## IA generativa y modelos de lenguaje

Aquí seguimos, paso a paso, cómo un modelo de lenguaje (LLM) llega de una pregunta a una respuesta: la frase se trocea en **tokens**, cada token se convierte en un vector de números (**embedding**), el **Transformer** procesa toda la frase a la vez gracias al mecanismo de **atención** para resolver ambigüedades de contexto, y el modelo genera la respuesta palabra a palabra, de forma **autoregresiva** — repitiendo el proceso completo en cada paso, mirando también lo que él mismo acaba de escribir.

También aclaramos algo que se malinterpreta con frecuencia: qué significa que una IA "recuerde" algo entre sesiones (casi siempre es contexto de la conversación o memoria de la aplicación, no conocimiento nuevo grabado en sus parámetros), y por qué entiende un texto con faltas de ortografía o responde en cualquier idioma sin que nadie le haya programado ese idioma explícitamente.

## Vocabulario, agentes y seguridad

Un bloque muy práctico, con el vocabulario que un alumno de informática se va a encontrar constantemente: qué es un **prompt** y por qué unos son mucho más eficaces que otros; la diferencia entre un **chatbot** (solo responde), un **asistente** (ejecuta una acción fija ya programada) y un **agente** (usa un LLM como "cerebro" para encadenar varias acciones, decidiendo sobre la marcha); qué son las **herramientas** y las **skills** que le dan a un agente capacidad de actuar, no solo de hablar.

Dedicamos tiempo especial a la seguridad: qué es el **prompt injection** (instrucciones maliciosas escondidas en contenido que un agente procesa) y por qué la mitigación real es aplicar el **mínimo privilegio** de toda la vida en sysadmin — nunca como root, sandboxing, y acceso limitado solo a lo que la tarea necesita. Y cerramos con modelos **abiertos frente a cerrados**, y las distintas formas de contratar una IA (gratis, suscripción, API, empresa).

## Límites y marco legal

Antes de confiar en la IA hay que conocer sus límites: **alucinaciones** (genera lo plausible, no necesariamente lo verdadero), **sesgo** heredado de sus datos de entrenamiento, **corte de conocimiento** y **no determinismo** (la misma pregunta puede dar respuestas distintas). Hablamos también de su **coste ambiental**, con cifras orientativas del INTEF, y del marco normativo vigente en 2026: el **Reglamento Europeo de IA (AI Act)**, el **RGPD**, la **LOPDGDD** y la zona gris de la **propiedad intelectual** sobre contenido generado.

## Usar la IA para aprender: una metodología de 6 etapas

Este es el bloque central de la presentación, y el motivo real por el que la preparé: un cambio de mentalidad (el objetivo ya no es repetir procedimientos de memoria, sino aprender a tomar decisiones fundamentadas) llevado a una metodología concreta de **6 etapas**, aplicable a cualquier tarea técnica:

1. **Comprensión del problema.** Antes de preguntarle nada a la IA, hay que poder responder uno mismo qué se quiere conseguir, con qué restricciones y qué conceptos técnicos están implicados. Si no puedes responder esto, no estás listo para usar la IA de forma útil: pedirás cosas vagas y obtendrás respuestas genéricas.

2. **Formulación precisa de la consulta.** Se entrena aquí una habilidad nueva: saber hablar con la IA con precisión técnica. El nivel de detalle de la pregunta determina la calidad de la respuesta — no es lo mismo pedir "configura DNS" que especificar el servidor, la distribución, el dominio y el comportamiento exacto que necesitas.

3. **Análisis crítico de la respuesta.** La IA responde, pero no se ejecuta nada todavía. Toca preguntarse si se entiende lo que ha generado, si tiene sentido para el entorno concreto, y qué dice la documentación oficial de la herramienta. Es la etapa que más diferencia a quien aprende de quien copia — y la que permite detectar cuándo la IA se ha equivocado, algo que solo puedes hacer si sabes más o menos lo mismo que ella.

4. **Experimentación controlada.** Ahora sí se ejecuta, pero de forma progresiva, en un entorno de pruebas y con un plan de vuelta atrás. Si algo falla, el error se convierte en material de aprendizaje y la IA en herramienta de diagnóstico. Generar no es lo mismo que ejecutar: entre una cosa y otra sigue siendo el alumno quien decide.

5. **Consolidación y automatización.** Una vez que la tarea funciona, se automatiza (un script, un playbook de Ansible...), se versiona con Git y se piensa qué pasaría si algo fallara. Esta etapa transforma una tarea puntual en una solución profesional.

6. **Reflexión y documentación propia.** La etapa que más se suele saltar y más valor tiene: documentar con tus propias palabras qué problema tenías, qué le preguntaste a la IA, qué tuviste que corregir de lo que te dio y qué aprendiste que no sabías antes. Consolida el aprendizaje real y genera un portfolio técnico propio — el propio INTEF propone en su guía un modelo oficial de "declaración de uso de IA" con esta misma idea.

Cerramos con los riesgos de depender demasiado de la IA sin pasar por estas etapas — externalización cognitiva, ilusión de competencia, sedentarismo cognitivo — y con una idea que resume todo lo anterior: el profesor no evalúa solo si el alumno llegó al resultado correcto, sino cómo llegó, qué entendió por el camino y qué sería capaz de hacer ante un problema distinto. Un escenario que funciona pero que el alumno no sabe explicar vale menos que uno con algún problema que sabe diagnosticar y razonar correctamente. Eso es, en definitiva, lo que el mercado laboral le va a exigir: saber qué pedirle a la IA, entender lo que devuelve, y tomar buenas decisiones cuando la IA no llega.

Puedes consultar la presentación completa aquí: [IA y educación](https://cdn.jsdelivr.net/gh/josedom24/marp-presentaciones@main/ia/ia_educacion.pdf)
