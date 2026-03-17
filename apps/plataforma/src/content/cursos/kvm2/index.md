---
title: "Curso: Profundización a la virtualización con KVM/libvirt (2025)"
toc: false
---

![kvm](img/kvm.png)

* Repositorio del curso: [https://github.com/josedom24/curso_kvm_ow/blob/main/curso2](https://github.com/josedom24/curso_kvm_ow/blob/main/curso2)

El segundo curso está pensado para quienes ya conocen los fundamentos y desean **profundizar en la virtualización usando herramientas de línea de comandos**.

En este curso se trabaja, entre otros aspectos:

* Gestión avanzada de máquinas virtuales con `virsh`
* Definición y modificación de dominios mediante XML
* Redes virtuales avanzadas
* Gestión de almacenamiento con libvirt
* Automatización y administración más cercana a entornos de servidor

Este enfoque resulta especialmente útil para **administradores de sistemas**, laboratorios avanzados o escenarios donde no se dispone de entorno gráfico.

## Contenidos

# Curso: Profundización a la virtualización con KVM/libvirt

1. Introducción a la virtualización con KVM/libvirt
    * [¿Qué es la virtualización?](/pledin/cursos/kvm2/contenidos/unidad01/clase1/)
	* [Tipos de virtualización](/pledin/cursos/kvm2/contenidos/unidad01/clase2/)
	* [Introducción a QEMU/KVM y libvirt](/pledin/cursos/kvm2/contenidos/unidad01/clase3/)

2. Instalación de KVM/libvirt
    * [Preparación del escenario de instalación](/pledin/cursos/kvm2/contenidos/unidad02/clase1/)
    * [Instalación de QEMU/KVM + libvirt](/pledin/cursos/kvm2/contenidos/unidad02/clase2/)
    * [Conexión local privilegiada a libvirt](/pledin/cursos/kvm2/contenidos/unidad02/clase3/)

3. Creación de máquinas virtuales
    * [Definición de un dominio con virsh](/pledin/cursos/kvm2/contenidos/unidad03/clase1/)
    * [Creación de máquinas virtuales con virt-install](/pledin/cursos/kvm2/contenidos/unidad03/clase2/)
    * [Características de las máquinas virtuales](/pledin/cursos/kvm2/contenidos/unidad03/clase3/)
    * [Gestión de máquinas virtuales con virsh](/pledin/cursos/kvm2/contenidos/unidad03/clase4/)
    * [Definición XML de una máquina virtual](/pledin/cursos/kvm2/contenidos/unidad03/clase5/)
    * [Modificación de la definición de una máquina virtual](/pledin/cursos/kvm2/contenidos/unidad03/clase6/)
    * [Acceso a la máquina virtual usando la consola serie](/pledin/cursos/kvm2/contenidos/unidad03/clase7/)
    * [Creación de máquinas virtuales Windows con virt-install](/pledin/cursos/kvm2/contenidos/unidad03/clase8/)
    * [Acceso a las máquinas virtuales desde el exterior](/pledin/cursos/kvm2/contenidos/unidad03/clase9/)
    

4. Gestión del almacenamiento
    * [Introducción al almacenamiento en KVM/libvirt](/pledin/cursos/kvm2/contenidos/unidad04/clase1/)
    * [Gestión de pools de almacenamiento](/pledin/cursos/kvm2/contenidos/unidad04/clase2/)
    * [Gestión de volúmenes de almacenamiento con virsh](/pledin/cursos/kvm2/contenidos/unidad04/clase3/)
    * [Gestión de volúmenes de almacenamiento con herramientas específicas](/pledin/cursos/kvm2/contenidos/unidad04/clase4/)
    * [Trabajar con volúmenes en las máquinas virtuales](/pledin/cursos/kvm2/contenidos/unidad04/clase5/)
    * [Redimensión de discos en máquinas virtuales](/pledin/cursos/kvm2/contenidos/unidad04/clase6/)
    * [Uso de un pool de almacenamiento de tipo disk](/pledin/cursos/kvm2/contenidos/unidad04/clase7/)

5. Clonación e instantáneas de máquinas virtuales
    * [Clonación de máquinas virtuales](/pledin/cursos/kvm2/contenidos/unidad05/clase1/)
    * [Plantillas de máquinas virtuales](/pledin/cursos/kvm2/contenidos/unidad05/clase2/)
    * [Clonación a partir de plantillas](/pledin/cursos/kvm2/contenidos/unidad05/clase3/)
    * [Instantáneas de máquinas virtuales](/pledin/cursos/kvm2/contenidos/unidad05/clase4/)

6. Gestión de redes
    * [Introducción a la gestión de redes](/pledin/cursos/kvm2/contenidos/unidad06/clase1/)
    * [Definición de redes virtuales privadas](/pledin/cursos/kvm2/contenidos/unidad06/clase2/)
    * [Gestión de redes virtuales privadas](/pledin/cursos/kvm2/contenidos/unidad06/clase3/)
    * [Creación de un puente externo con Linux Bridge](/pledin/cursos/kvm2/contenidos/unidad06/clase4/)
    * [Gestión de redes puentes públicas](/pledin/cursos/kvm2/contenidos/unidad06/clase5/)
    * [Configuración de red en las máquinas virtuales](/pledin/cursos/kvm2/contenidos/unidad06/clase6/)
    * [Ejemplo 1: Trabajando con redes puentes públicas](/pledin/cursos/kvm2/contenidos/unidad06/clase7/)
    * [Ejemplo 2: Trabajando con redes virtuales privadas](/pledin/cursos/kvm2/contenidos/unidad06/clase8/)
    * [Ejemplo 3: Configuración de un router/NAT](/pledin/cursos/kvm2/contenidos/unidad06/clase9/)

7. Temas adicionales
    * [Creación de máquinas virtuales por red](/pledin/cursos/kvm2/contenidos/unidad07/clase1/)
    * [Despliegue automatizado de máquinas virtuales con virt-builder](/pledin/cursos/kvm2/contenidos/unidad07/clase2/)
    * [Despliegue automatizado de máquinas virtuales usando cloud-init](/pledin/cursos/kvm2/contenidos/unidad07/clase3/)
    * [Conexión local no privilegiada a libvirt](/pledin/cursos/kvm2/contenidos/unidad07/clase4/)
    * [Conexión remota a libvirt](/pledin/cursos/kvm2/contenidos/unidad07/clase5/)
    * [Copia de seguridad de máquinas virtuales](/pledin/cursos/kvm2/contenidos/unidad07/clase6/)
