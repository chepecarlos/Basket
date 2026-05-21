# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is this

`basket` es una herramienta CLI de automatización para producción de contenido de ALSW (YouTube, Blender, artículos, subtítulos). Se instala como `basket-cli` y se ejecuta desde el directorio del proyecto de video.

## Comandos

```bash
# Instalar el paquete en el entorno activo
make install           # equivale a: pipx install . --force

# Ejecutar desde el entorno virtual dedicado (sin activarlo manualmente)
bash basket.sh <args>  # venv en ~/5.Programas/2.Heramientas/3.Basket/venv

# Documentación con pdoc
make docs              # genera HTML en docs/
make serve-docs        # sirve en http://localhost:1234

# Desarrollo: instalar en modo editable
pip install -e .

# Activar depuración en cualquier comando
basket-cli <comando> --depuracion
```

## Arquitectura

```
src/basket/
├── main.py              # Entry point: argparse, despacha a operaciones
├── operaciones/         # Una función por operación del CLI
│   ├── OperacionesBlender.py  # CrearProxy, RenderizarVideo, RenderizarAudio, SubirVideo (llama a bpsrender/tooltube)
│   ├── Pantillas.py     # CrearFolderVideo, CrearArticulo (copia plantillas + crea en Notion)
│   ├── subtitulo.py     # crearSubtituloWhisper (usa transcribe-anything)
│   ├── Video.py         # ConvertirVideo a 60fps con ffmpeg
│   ├── convertir.py     # convertir_wav con pydub
│   ├── IconoFolder.py   # actualizarIconoFolder (icono GTK)
│   ├── graficaSun.py    # graficaSun (matplotlib)
│   ├── Miembros.py      # Gestión de miembros YouTube
│   └── presente.py      # cargarPresente (asistentes de en vivo)
├── miLibrerias/         # Utilidades compartidas (importadas con `import basket.miLibrerias as miLibrerias`)
│   ├── FuncionesArchivos.py   # Sistema de config: ObtenerValor, SalvarValor, ObtenerArchivo (YAML .md / JSON)
│   ├── FuncionesLogging.py    # ConfigurarLogging: colorlog en consola + archivo en ~/.config/basket/logs/
│   ├── FuncionesBotTelegram.py # EnviarMensajeTelegram para notificaciones de procesos largos
│   └── FuncionesMQTT.py       # Publicación MQTT
└── extra/
    └── SubProceso.py    # EmpezarSubProceso: wrapper de subprocess con logging en tiempo real
```

## Sistema de configuración

Los archivos de configuración viven en `~/.config/basket/`. Se leen con `miLibrerias.ObtenerValor(archivo, atributo)` que busca primero `.md` (YAML con frontmatter) y luego `.json`. Por ejemplo, `data/plantilla` contiene la ruta del folder base para proyectos de video.

Los logs van a `~/.config/basket/logs/basket.log`.

## Integraciones externas

- **bpsrender** — renderizado de Blender (proxy y video)
- **tooltube** — subida a YouTube y Notion
- **transcribe-anything / Whisper** — generación de subtítulos `.sbv` desde audio `.flac`
- **ffmpeg / pydub** — conversión de video y audio
- **Telegram Bot** — notificaciones al terminar procesos largos (configurado en miLibrerias)
- **MQTT** — publicación de eventos

## Convenciones del código

- Nombres en español (funciones, variables, logs). Solo los módulos auxiliares usan inglés.
- Cada operación envía una notificación a Telegram al inicio y al final (con tiempo transcurrido).
- `EmpezarSubProceso` es el único punto para lanzar comandos externos; no usar `subprocess` directamente en las operaciones.
- Las rutas de plantillas se leen desde config, nunca se hardcodean en el código.
