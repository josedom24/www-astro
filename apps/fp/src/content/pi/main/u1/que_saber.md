---
title: "Unidad 1: ¿Qué tengo que saber?"
description: "Lista de comprobación de lo que hay que saber y saber hacer en la unidad de infraestructura como código con Ansible y OpenTofu."
---

Usa esta lista para repasar la unidad. Ve marcando lo que ya dominas: se guarda en tu navegador, así que lo verás marcado cuando vuelvas desde el mismo equipo. Si no puedes marcar algún punto, vuelve a la presentación o a la tarea correspondiente.

## Infraestructura como código

- [ ] Sé explicar qué es la infraestructura como código y qué ventajas tiene frente a configurar los servidores a mano (reproducible, versionada en Git, auditable).
- [ ] ¿Sé diferenciar el software de orquestación (OpenTofu) del de gestión de la configuración (Ansible), y en qué orden se usan?
- [ ] Sé explicar qué significa el enfoque declarativo: se describe el estado deseado, no los pasos para llegar a él.
- [ ] Sé explicar qué relación tiene la infraestructura como código con DevOps.

## Ansible: conceptos e instalación

- [ ] Sé explicar qué necesita un nodo gestionado para que Ansible lo configure (SSH y Python) y por qué no hace falta instalar ningún agente.
- [ ] ¿Sé diferenciar el nodo de control de los nodos gestionados?
- [ ] Sé instalar Ansible con `apt` o con `pip` en un entorno virtual.

## Inventario y configuración

- [ ] Sé escribir un inventario con grupos y los datos de conexión de cada nodo (IP, usuario, clave privada).
- [ ] Identifico para qué sirve `ansible.cfg` y qué hacen `inventory` y `host_key_checking`.
- [ ] Sé comprobar la conectividad con `ansible all -m ping` y explicar qué comprueba (no es un ping ICMP).

## Módulos y comandos ad-hoc

- [ ] Sé ejecutar un módulo con un comando ad-hoc (`ansible <hosts> -m <módulo> -a "<parámetros>"`) y cuándo hace falta `--become`.
- [ ] Identifico para qué sirven los módulos básicos: `command`/`shell`, `copy`, `apt`, `service`, `file` y `user`.
- [ ] ¿Sé diferenciar `command` de `shell`, y por qué conviene usar un módulo antes que `shell`?

## Playbooks e idempotencia

- [ ] ¿Sé diferenciar un play de un playbook?
- [ ] Sé escribir un playbook con `hosts`, `become` y una lista de tareas.
- [ ] Sé explicar qué es la idempotencia y comprobarla: la segunda ejecución termina con `changed=0`.
- [ ] Sé reconocer una tarea que no es idempotente (por ejemplo, un `shell` con `>>`) y corregirla con el módulo adecuado (`lineinfile`, `template`, `copy`).
- [ ] Sé leer la salida de un playbook: `ok`, `changed`, `failed`, `skipping` y el `PLAY RECAP`.

## Variables, facts y plantillas

- [ ] ¿Sé diferenciar las variables de nodo (inventario), de grupo (`group_vars`) y los facts?
- [ ] Sé consultar los facts de un nodo con el módulo `setup` y usarlos en una tarea o una plantilla.
- [ ] ¿Sé diferenciar `copy` de `template`?
- [ ] Sé escribir una plantilla Jinja2 con variables, condicionales y bucles.
- [ ] Sé recorrer una lista con `loop` y usar `{{ item }}`.

## Roles y handlers

- [ ] Sé explicar para qué sirve organizar un proyecto en roles y qué contiene cada directorio de un rol (`tasks`, `handlers`, `templates`, `files`, `defaults`).
- [ ] Sé asignar en `site.yaml` un rol a cada grupo de hosts, y uno común a `all`.
- [ ] Sé explicar qué es un handler, cuándo se ejecuta y por qué se usa para reiniciar un servicio en lugar de una tarea normal.
- [ ] Sé modificar una línea de un fichero de configuración con `lineinfile`.
- [ ] Sé instalar y usar una colección (`community.mysql`) para crear una base de datos y un usuario.

## OpenTofu: conceptos

- [ ] Sé explicar por qué usamos OpenTofu y no Terraform.
- [ ] Identifico los cuatro elementos de la configuración: provider, resource, variable y output.
- [ ] Sé explicar qué es un provider y que el lenguaje (HCL) es el mismo con cualquier plataforma.
- [ ] Identifico los ficheros de un proyecto: los que escribo yo (`provider.tf`, `variables.tf`, `main.tf`, `network.tf`, `output.tf`, `cloud-init/`) y los que genera OpenTofu (`terraform.tfstate`, `.terraform/`, `.terraform.lock.hcl`).
- [ ] Sé explicar cómo deduce OpenTofu el orden en que crea los recursos (las referencias entre ellos).

## Estado, plan y ciclo de vida

- [ ] Sé usar el flujo de trabajo: `tofu init`, `plan`, `apply`, `output` y `destroy`.
- [ ] Sé explicar qué guarda `terraform.tfstate` y qué pasa si se pierde.
- [ ] Sé explicar qué compara `tofu plan` (el código, el estado y la realidad) y por qué conviene revisarlo antes de aplicar.
- [ ] ¿Sé diferenciar en un `plan` un cambio en el sitio (`~`), un reemplazo (`-/+`) y una creación (`+`)?
- [ ] Sé explicar por qué cambiar la imagen base recrea también la máquina, aunque no se toque el recurso `libvirt_domain`.
- [ ] Sé explicar qué hace OpenTofu si un recurso se ha borrado a mano (*drift*).

## OpenTofu con libvirt

- [ ] Sé preparar las imágenes cloud en el pool y explicar por qué hace falta `virsh pool-refresh default`.
- [ ] Sé explicar qué es un clon ligero (`base_volume_name`) y crear un disco adicional.
- [ ] Sé explicar qué hace cloud-init, qué va en `user-data` y qué en `network-config`, y cuándo se aplica.
- [ ] Sé configurar en `user-data` el usuario con mi clave pública.
- [ ] ¿Sé diferenciar una red NAT, una aislada y una muy aislada, y si el anfitrión tiene IP en cada una?
- [ ] ¿Sé diferenciar `network_name` de `network_id`, y cuándo se usa `wait_for_lease`?
- [ ] Sé explicar por qué conectar una máquina a una red no basta para que tenga IP en ella (hay que configurar la interfaz en `network-config`).
- [ ] Sé explicar por qué el `output` muestra las IP estáticas solo con `qemu_agent = true`, y qué necesita la máquina para ello.

## De OpenTofu a Ansible

- [ ] Sé generar el inventario de Ansible desde OpenTofu con `local_file` y `templatefile`.
- [ ] Sé acceder a una máquina que solo está en una red interna saltando por otra (`ssh -A`, `ProxyJump`).

## Comprobar y razonar lo que pasa

- [ ] Sé crear un escenario con varias máquinas y redes, configurarlo con Ansible y comprobar que funciona.
- [ ] Sé destruir el escenario y volver a crearlo, y explicar por qué hay que destruirlo antes de crear otro con redes del mismo rango.
- [ ] Sé encontrar la causa de los problemas habituales: el pool sin refrescar, una red que ya existe, la clave SSH, cloud-init sin salida a internet o una interfaz sin configurar.

<style>
  .task-list-item {
    list-style: none;
    position: relative;
    padding-left: 2rem;
    margin-left: -1.25rem;
  }
  .task-list-item input[type="checkbox"] {
    appearance: none;
    -webkit-appearance: none;
    position: absolute;
    left: 0;
    top: 0.2em;
    width: 1.2rem;
    height: 1.2rem;
    margin: 0;
    border: 2px solid var(--color-text-muted);
    border-radius: 0.3rem;
    background: var(--color-bg);
    cursor: pointer;
    transition: background-color 0.15s, border-color 0.15s;
  }
  .task-list-item input[type="checkbox"]:hover {
    border-color: var(--color-accent);
  }
  .task-list-item input[type="checkbox"]:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }
  .task-list-item input[type="checkbox"]:checked {
    border-color: var(--color-accent);
    background: var(--color-accent) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M3.5 8.5l3 3 6-7' fill='none' stroke='white' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center / 85% no-repeat;
  }
  .task-list-item:has(input:checked) {
    color: var(--color-text-muted);
  }
</style>

<script>
  (() => {
    const clave = "fp-pi-u1-que-saber";
    let marcadas = [];
    try { marcadas = JSON.parse(localStorage.getItem(clave)) || []; } catch (e) {}
    const casillas = document.querySelectorAll(".task-list-item input[type=checkbox]");
    casillas.forEach((c, i) => {
      c.disabled = false;
      c.checked = marcadas.includes(i);
      c.addEventListener("change", () => {
        const lista = [];
        casillas.forEach((x, j) => x.checked && lista.push(j));
        try { localStorage.setItem(clave, JSON.stringify(lista)); } catch (e) {}
      });
    });
  })();
</script>
