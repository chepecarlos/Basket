#!/usr/bin/env node

/*jshint esversion: 8 */

// https://www.npmjs.com/package/yaml
const yaml = require('js-yaml');
let fs = require('fs');
let fsExtra = require('fs-extra');
const TelegramBot = require('node-telegram-bot-api');
const yargs = require("yargs");

var Contastes = require('./Token');

const bot = new TelegramBot(Contastes.token, {
  polling: false
});

function ObtenerTitulo(Data) {
  let Titulo = Data.titulo;
  // TODO id con tres digitos
  let Indice = Data.id;
  Titulo = Titulo.replace(/ /g, "_");
  if (Data.id_Curso != null) {
    Indice = Data.id_Curso + "." + Indice
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


function CargarData(Direcion) {
  try {

    let Data = yaml.safeLoad(fs.readFileSync(Direcion + '/1.Guion/InfoProyecto.md', 'utf8'));

    let TextoExtra = yaml.safeLoad(fs.readFileSync(__dirname + '/Data/TextoExtra.md', 'utf8'));
    Object.assign(Data, TextoExtra);

    let TextoParaCompartir = yaml.safeLoad(fs.readFileSync(Direcion + '/1.Guion/TextoParaCompartir.md', 'utf8'));
    Object.assign(Data, TextoParaCompartir);

    try {
      let Indice = CargarIndice(Direcion + '/1.Guion/Indice.md');
      Object.assign(Data, {
        'topics': Indice
      });
    } catch (e) {
      console.log("No encontrado Indice.md");
    }

    try {
      let Link = yaml.safeLoad(fs.readFileSync(Direcion + '/1.Guion/Link.md', 'utf8'));
      Data.links = []
      Link.forEach(LinkTmp => {
        Data.links.push({
          "title": LinkTmp.Titulo,
          "url": LinkTmp.URL
        });
      });
    } catch (ex) {
      console.log("No Encontrado Link.md");
    }

    try {
      let DataLink = yaml.safeLoad(fs.readFileSync(__dirname + '/Data/link.md', 'utf8'));
      Object.assign(Data, {
        'DataLink': DataLink
      });
    } catch (ex) {
      // Show error
      console.log(ex);
    }
    try {
      let DataPiezas = yaml.safeLoad(fs.readFileSync(Direcion + '/1.Guion/Piesas.md', 'utf8'));
      Data.Piesas = []
      DataPiezas.forEach(PiesasTmp => {
        Data.Piesas.push({
          "title": PiesasTmp
        });
      });
    } catch (e) {
      console.log("No encontrada Piezas");
    } finally {

    }
    console.log(Data);
    return Data;
  } catch (e) {
    // Todo: Error mas bonito
    console.log(e);
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
    ExportarD = ExportarD + "\n\n" + Descripcion_corta
  }
  fs.writeFileSync("1.Guion/" + Titulo + ".md", ExportarD, function(err, file) {
    if (err) throw err;
    console.log("Saved!");
  });
}

function CrearArchivoYT(Folder) {
  if (Folder == null) {
    Folder = ".";
  }
  var Data = CargarData(Folder);
  var Titulo = ObtenerTitulo(Data);
  var DataYT = "";
  DataYT += Data.texto.texto + "\n\n";
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
    describe: "crea archivo de youtube",
    type: "string"
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
