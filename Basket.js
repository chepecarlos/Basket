#!/usr/bin/env node

/*jshint esversion: 8 */

// https://www.npmjs.com/package/yaml
const yaml = require('js-yaml');
let fs = require('fs');
const path = require('path');
let fsExtra = require('fs-extra');
const TelegramBot = require('node-telegram-bot-api');
const yargs = require("yargs");

var Contastes = require('./Token');

const bot = new TelegramBot(Contastes.token, {
  polling: false
});

const HomeDirector = require('os').homedir();

function ObtenerTitulo(Data) {
  let Titulo = Data.titulo;
  if(Data.titulo_np != null){
    Titulo = Data.titulo_np;
  }
  // TODO id con tres digitos
  let Indice = Data.id;
  Titulo = Titulo.replace(/ /g, "_");
  if (Data.id_Curso != null) {
    Indice = Data.id_Curso + "." + Indice;
  }
  Titulo = Indice + "_" + Titulo;
  return Titulo;
}

function CrearFolder(Titulo) {
  fsExtra.copy(__dirname + '/000_Nombre_Video', Titulo, err => {
    if (err) return console.error(err);
    console.log('Folde Creados con titulo: ' + Titulo);
  });
}

function CargarIndice(Direcion) {
  let Data = [];
  let Indices = fs.readFileSync(Direcion, 'utf8');
  Indices = Indices.split('\n');
  Indices.forEach((IndiceTemporal, i) => {
    let valor = IndiceTemporal.match('^[0-9][0-9]:[0-9][0-9]');
    if (valor != null) {
      IndiceTemporal = IndiceTemporal.replace(valor + ' ', '');
      Data.push({
        "title": IndiceTemporal,
        "time": valor[0]
      });
    }
  });
  return Data;
}


function CargarArchivoYAML(Archivo) {
  try {
    let Data = yaml.safeLoad(fs.readFileSync(Archivo, 'utf8'));
    return Data;
  } catch (e) {
    console.log("No encontrado " + Archivo);
    return null;
  }
}

function CargarData(Direcion) {

  let Data = CargarArchivoYAML(Direcion + '/1.Guion/1.Info.md');

  let SEO = CargarArchivoYAML(Direcion + '/1.Guion/2.SEO.md');
  Object.assign(Data, SEO);

  let Texto = CargarArchivoYAML(Direcion + '/1.Guion/3.Texto.md');
  Object.assign(Data, Texto);

  try {
    let Indice = CargarIndice(Direcion + '/1.Guion/4.Indice.md');
    Object.assign(Data, {
      'topics': Indice
    });
  } catch (e) {
    console.log("No encontrado /1.Guion/4.Indice.md");
  }

  let Link = CargarArchivoYAML(Direcion + '/1.Guion/5.Link.md');
  if (Link != null) {
    Data.links = [];
    Link.forEach(LinkTmp => {
      Data.links.push({
        "title": LinkTmp.Titulo,
        "url": LinkTmp.URL
      });
    });
  }

  let DataPiezas = CargarArchivoYAML(Direcion + '/1.Guion/6.Piesas.md');
  if (DataPiezas != null) {
    Data.Piesas = [];
    DataPiezas.forEach(PiesasTmp => {
      Data.Piesas.push({
        "title": PiesasTmp
      });
    });
  }


  let DataInfo = CargarArchivoYAML(__dirname + '/Data/1.info.md');
  if (DataInfo != null) {
    Object.assign(Data, {
      'DataIndo': DataInfo
    });
  }

  let DataLink = CargarArchivoYAML(__dirname + '/Data/2.link.md');
  if (DataLink != null) {
    Object.assign(Data, {
      'DataLink': DataLink
    });
  }

  // let TextoExtra = CargarArchivoYAML(__dirname + '/Data/TextoExtra.md');
  // Object.assign(Data, TextoExtra);
  // console.log(Data);
  return Data;

}

function BuscarFolderCon(directorio, texto) {
  let archivos = fs.readdirSync(directorio);
  for (var archivo of archivos) {
    if (archivo.match(texto + "_")) {
      console.log(archivo);
      return archivo;
    }
  }
}

function CrearArchivoNP(Folder) {
  if (Folder != null) {
    Folder = ".";
  }
  var Data = CargarData(Folder);
  var Titulo = ObtenerTitulo(Data);

  let Exportar = {};

  Exportar.title = Data.titulo;
  Exportar.video_number = Data.id;
  Exportar.date = Data.fecha.toISOString().split("T")[0];
  Exportar.video_id = Data.youtube_id;
  if (Data.codigo != null) {
    Exportar.repository = Data.codigo;
  }
  if (Data.topics != null) {
    Exportar.topics = Data.topics;
  }
  if (Data.links != null) {
    Exportar.links = Data.links;
  }
  if (Data.Piesas != null) {
    Exportar.piezas = Data.Piesas;
  }

  var ExportarD = "---\n" + yaml.safeDump(Exportar) + "---";

  if (Data.texto_np != null) {
    var Descripcion_corta = Data.texto_np;
    ExportarD = ExportarD + "\n\n" + Descripcion_corta;
  }
  fs.writeFileSync("1.Guion/" + Titulo + ".md", ExportarD, function(err, file) {
    if (err) throw err;
    console.log("Saved!");
  });
  let DirecionArchivos = HomeDirector + "/" + Data.DataIndo.nocheprogramacion;
  if (Data.id_Curso != null) {
    DirecionArchivos += "/_Cursos";
    let FolderFolder = BuscarFolderCon(DirecionArchivos, Data.id_Curso);
    DirecionArchivos += "/" + FolderFolder;
  } else {
    DirecionArchivos += "/_Tutoriales";
  }

  fs.writeFileSync(DirecionArchivos + "/" + Titulo + ".md", ExportarD, function(err, file) {
    if (err) throw err;
    console.log("Saved!");
  });
}

function CrearArchivoYT(Folder) {
  if (Folder != null) {
    Folder = ".";
  }
  var Data = CargarData(Folder);
  var Titulo = ObtenerTitulo(Data);
  var DataYT = "";
  DataYT += Data.texto_yt + "\n\n";
  if (Data.texto_yt_extra != null) {
    DataYT += Data.texto_yt_extra;
  }


  DataYT += "Link Referencia:\n" + Data.texto.link_np + "\n\n";


  if (Data.indice != null) {
    if (Data.indice.length > 0) {
      DataYT += "Indice: \n";
      for (let i = 0; i < Data.indice.length; i++) {
        DataYT += Data.indice[i][0] + " " + Data.indice[i][1] + "\n";
      }
    }
    DataYT += "\n\n";
  }

  if (Data.DataLink != null) {
    if (Data.DataLink.length > 0) {
      for (let i = 0; i < Data.DataLink.length; i++) {
        DataYT += Data.DataLink[i] + "\n";
      }
    }
    DataYT += "\n\n";
  }

  DataYT += Data.TextoExtra.Texto_final + "\n\n";

  if (Data.tags != null) {
    if (Data.tags.length > 0) {
      DataYT += "#ALSW ";
      for (let i = 0; i < Data.tags.length; i++) {
        DataYT += "#" + Data.tags[i] + " ";
      }
    }
  }

  console.log(DataYT);

  let SalidaDocumento = Folder + "/1.Guion/" + Titulo + 'YT.md';
  fs.writeFile(SalidaDocumento, DataYT,
    error => {
      if (error) {
        console.error(error);
      }
      console.log("Generated Archivo Youtube" + SalidaDocumento);
    }
  );
}

function CrearProxy() {
  bot.sendMessage(Contastes.IDChat, "[Blender] Empezando a crear Proxy");
  let Inicio = new Date();
  const {
    exec
  } = require("child_process");
  exec("$HOME/.local/bin/bpsproxy", (error, data, getter) => {
    if (error) {
      console.log("error", error.message);
      bot.sendMessage(Contastes.IDChat, "[Blender] Error creando Proxy");
      return;
    }
    if (getter) {
      var Tiempo = new Date() - Inicio;
      var Segundos = parseInt((Tiempo / (1000)) % 60);
      var Minutos = parseInt((Tiempo / (1000 * 60)) % 60);
      var Horas = parseInt(Tiempo / (1000 * 60 * 60));
      console.log("Crear el proxy tardo " + Horas + ":" + Minutos + ":" + Segundos);
      console.log("data-", data);
      bot.sendMessage(Contastes.IDChat, "[Blender] Termino de crear Proxy - " + Horas + "h:" + Minutos + "m:" + Segundos + "s");
      return;
    }
    console.log("data:", data);
  });

}

function RenderVideo(Archivo) {
  bot.sendMessage(Contastes.IDChat, "[Blender] Empezando a Renderizar el Video: " + Archivo);
  let Inicio = new Date();
  const {
    exec
  } = require("child_process");
  exec("$HOME/.local/bin/bpsrender " + Archivo, (error, data, getter) => {
    if (error) {
      console.log("error: ", error.message);
      console.log("data: ");
      bot.sendMessage(Contastes.IDChat, "[Blender] Error Renderizar el video " + Archivo);
      return;
    }
    if (getter) {
      var Tiempo = new Date() - Inicio;
      var Segundos = parseInt((Tiempo / (1000)) % 60);
      var Minutos = parseInt((Tiempo / (1000 * 60)) % 60);
      var Horas = parseInt(Tiempo / (1000 * 60 * 60));
      console.log("Crear el proxy tardo " + Horas + ":" + Minutos + ":" + Segundos);
      console.log("data-", data);
      bot.sendMessage(Contastes.IDChat, "[Blender] Ya esta listo el video " + Archivo + " en " + Horas + "h:" + Minutos + "m:" + Segundos + "s");
      return;
    }
    console.log("data:", data);
  });
}

function Trasformando60(Archivo) {
  var Parte = Archivo.split(".");
  var Archivo60 = Parte[0] + "_60fps." + Parte[1];
  var Comando = "ffmpeg -i " + Archivo + " -r 60 " + Archivo60;
  bot.sendMessage(Contastes.IDChat, "[ffmpeg] Trasformando a 60fps: " + Archivo);
  let Inicio = new Date();
  const {
    exec
  } = require("child_process");
  exec(Comando, (error, data, getter) => {
    if (error) {
      console.log("error: ", error.message);
      console.log("data: ");
      bot.sendMessage(Contastes.IDChat, "[ffmpeg] Error en ffmpeg " + Archivo);
      return;
    }
    if (getter) {
      var Tiempo = new Date() - Inicio;
      var Segundos = parseInt((Tiempo / (1000)) % 60);
      var Minutos = parseInt((Tiempo / (1000 * 60)) % 60);
      var Horas = parseInt(Tiempo / (1000 * 60 * 60));
      console.log("Crear el proxy tardo " + Horas + ":" + Minutos + ":" + Segundos);
      console.log("data-", data);
      bot.sendMessage(Contastes.IDChat, "[ffmpeg] Tarformacion lista " + Archivo + " en " + Horas + "h:" + Minutos + "m:" + Segundos + "s");
      return;
    }
    console.log("data:", data);
  });
}

function ActualizarDescripcion() {
  console.log("Actualizando Descripcion");
}

const opciones = yargs
  .command(
    'Heramientas para produccion contenido de ALSW'
  )
  // .example('$0 -p .', 'Crea proxy dentro del folder actual')
  .option("f", {
    alias: "folder",
    describe: "crea folde de proyecto",
    type: "string"
  })
  .option("p", {
    alias: "proxy",
    describe: "crear proxy",
  })
  .option("r", {
    alias: "render",
    describe: "crear render del video",
    type: "string"
  })
  .option("t", {
    alias: "trasformando",
    describe: "Trasformar video a 60fps",
    type: "string"
  })
  .option("n", {
    alias: "nocheprogramacion",
    describe: "crea archivo de nocheprogramacion"
  })
  .option("y", {
    alias: "youtube",
    describe: "crea archivo de youtube"
  })
  .option("d", {
    alias: "descripcion",
    describe: "actualizacion descripcion de video Youtube"
  })
  .help('h')
  .alias('h', 'help')
  .argv;

function main() {
  if (opciones.folder) {
    if (opciones.folder != null) {
      CrearFolder(opciones.folder);
    } else {
      CrearFolder("000_Nombre_Video");
    }
  } else if (opciones.proxy) {
    console.log("Empezando a crear Proxy");
    CrearProxy();
  } else if (opciones.render) {
    if (opciones.render != null) {
      console.log("Renderizar Video");
      RenderVideo(opciones.render);
    }
  } else if (opciones.trasformando) {
    console.log("Trasformando a 60 FPS");
    Trasformando60(opciones.trasformando);
  } else if (opciones.nocheprogramacion) {
    console.log("noche programacion ");
    CrearArchivoNP(opciones.nocheprogramacion);
  } else if (opciones.youtube) {
    CrearArchivoYT(opciones.youtube);
  } else if (opciones.descripcion) {
    console.log("Actualizacion de Descripcion de Youtube");
    ActualizarDescripcion();
  } else {
    console.log("sin opciones usar -h para opciones");
  }
}

main();
