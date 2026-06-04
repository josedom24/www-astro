---
title: "Introducción a la virtualización con Proxmox VE"
date: 2026-06-04
slug: "blog/2026/06/introduccion-a-la-virtualizacion-con-proxmox-ve"
tags:
  - "Proxmox"
  - "Virtualización"
  - "Curso"
---

![Introducción a la virtualización con Proxmox VE](/pledin/assets/2026/06/proxmox.)

En estas últimas semanas he tenido la oportunidad de impartir un curso sobre virtualización con Proxmox VE, dentro del marco del proyecto de innovación **"Igualdad Digital a través de la Virtualización de un Centro de Procesamiento de Datos Educativo" (IDVCPDE)**, cofinanciado por la Unión Europea y el Ministerio de Educación, Formación Profesional y Deportes, en el marco del programa de Formación Profesional.

## El proyecto IDVCPDE

El objetivo general del proyecto es diseñar, implementar y explotar didácticamente un **Centro de Procesamiento de Datos (CPD) virtualizado en un instituto de educación**, que permita optimizar los recursos TIC del centro, mejorar la calidad del proceso de enseñanza-aprendizaje en Formación Profesional y proporcionar al alumnado entornos de trabajo profesionales, homogéneos y sostenibles, tanto dentro como fuera del centro.

El proyecto surge de una necesidad real y muy habitual en los centros de FP: infraestructuras TIC heterogéneas, aulas dependientes del hardware del alumnado, obsolescencia del parque informático y una pérdida considerable de tiempo lectivo dedicado a reinstalar y configurar equipos. La virtualización, con Proxmox VE como plataforma central, permite centralizar servicios, ofrecer entornos homogéneos y acercar el aprendizaje técnico a escenarios reales del sector TIC.

En el proyecto participan los siguientes centros educativos:

- **Centro coordinador:** I.E.S. Gregorio Prieto (Valdepeñas, Ciudad Real)
- **Centro colaborador:** I.E.S. Modesto Navarro (La Solana, Ciudad Real)
- **Centro colaborador:** I.E.S. Valdehierro (Madridejos, Toledo)

## El curso de formación

Para apoyar el proyecto, se me encargó impartir un curso de formación dirigido al profesorado de los centros participantes, estructurado en **4 sesiones** en las que se cubrieron los conceptos fundamentales y el uso práctico de Proxmox VE.

**Sesión 1: Introducción a la virtualización con Proxmox VE**

En la primera sesión se sentaron las bases conceptuales: qué es la virtualización, qué ventajas ofrece en el contexto educativo y cómo se posiciona Proxmox VE frente a otras soluciones del mercado. También se compartió la experiencia acumulada en el IES Gonzalo Nazareno, donde llevamos años usando Proxmox VE como plataforma de virtualización, describiendo la infraestructura actual y la evolución que ha seguido a lo largo del tiempo. La sesión finalizó con una demostración de acceso y navegación por el entorno Proxmox VE.

**Sesión 2: Uso básico de Proxmox VE**

La segunda sesión fue eminentemente práctica, centrada en la gestión del día a día con Proxmox VE. A través de demostraciones en vivo, se trabajó la creación y administración de máquinas virtuales con sistemas Linux y Windows, así como la gestión de contenedores LXC, una opción ligera y muy útil para ciertos casos de uso en entornos educativos.

**Sesión 3: Almacenamiento y redes en Proxmox VE**

En la tercera sesión se profundizó en dos aspectos clave de cualquier infraestructura virtualizada: el almacenamiento y la red. Se explicaron los distintos tipos de almacenamiento disponibles en Proxmox VE y cómo gestionar discos en máquinas virtuales y contenedores. En el apartado de redes, se introdujo la gestión de interfaces y redes virtuales. La sesión concluyó con una parte muy práctica sobre clonación de máquinas, creación de plantillas, uso de snapshots y realización de copias de seguridad, herramientas esenciales para el trabajo cotidiano en un entorno educativo.

**Sesión 4: Configuración específica de Proxmox VE en el IES Gonzalo Nazareno**

La última sesión estuvo dedicada a mostrar cómo hemos adaptado Proxmox VE a las necesidades concretas de nuestro centro. Se explicó la clonación de máquinas virtuales para el alumnado, la configuración automatizada mediante **cloud-init**, los scripts de administración que hemos desarrollado para simplificar tareas repetitivas y, finalmente, las posibilidades de ampliación y escalabilidad del sistema de cara al futuro.

## Materiales del curso

Todos los contenidos del curso están disponibles de forma libre y abierta:

- Repositorio GitHub: [github.com/josedom24/curso_proxmox_2026](https://github.com/josedom24/curso_proxmox_2026)
- Página web del curso: [josedom24.github.io/curso_proxmox_2026](https://josedom24.github.io/curso_proxmox_2026)

Los materiales incluyen las presentaciones en formato HTML y PDF para cada una de las sesiones. Espero que sean de utilidad no solo para los centros participantes en el proyecto, sino para cualquier docente o técnico interesado en la virtualización con Proxmox VE.
