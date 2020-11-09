# Basket
Scrip para **automatizar** procesos de youtube, noche de programación y cración de contenidos de ALSW


## Estructura de folder de proyectos

```
1.Guion
2.TomaA
3.TomaB
4.Audio
5.Recursos
6.Render
7.Miniatura
8.Gif
```

### 1.Guión
Documentación o metadata que se usara para noche de programación y videos de youtube

#### Estructura de archivos de 1.Guión

```
1.Info.md
2.SEO.md
3.Texto.md
4.Indice.md
5.Link.md
6.Piezas.md
```
#### Estructura del archivo 1.Info.md

Valores **obligatorios**
```Markdown
---
titulo: Titulo Video
id: 000
fecha: 2020-12-24
youtube_id: ID_Youtube

```

donde:
* **titulo** del video
* **id** video del tutorial o curso o streaming
* **fecha**  de publicacion de youtube
* **youtube_id** id del video de youtube (Ejemplo video https://youtu.be/PqzgYv7lpl0  el id es **PqzgYv7lpl0**)

valores **Opciones**

```Markdown
titulo_np: Titulo NocheProgramacion
id_Curso: 1
codigo: Codigo
```

donde:
* **titulo_np** titulo para nocheprogramacion
* **id_Curso** ID del curso que pertenece el video
* **codigo** directorio donde este el codigo del proyecto


### 2.TomaA
Tomas principales del video casi siempre las de OBS

### 3.TomaB
Tomas de apoyo como circuitos o tomas que ayudan a explicar mejor el contenido.

### 4.Audio
Audios extras de apoyo o audio limpio de la grabación.

### 5.Recursos
Partes extras del video, tomas extras del video, imagenes, y recursos extras a utilizar en el video.

### 6.Render
Proyecto del video y render final del video.

### 7.Miniatura
Imagen principal del video.

### 8.GIf
Animación pequeña del proyecto.

## Reglas de nombres de archivos

* Los nombres no pueden incluir espacios.
* Los nombres no pueden incluir caracteres extraños ( *, /, ?, etc.)
* Los nombres no pueden incluir la letra ñ
* Los nombres deben usarse con mayuscula o separados con guión bajo
