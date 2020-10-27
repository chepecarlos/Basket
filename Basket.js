#!/usr/bin/env node

/*jshint esversion: 6 */

// https://www.npmjs.com/package/yaml
const YAML = require('yaml');
let fs = require('fs');
let fsExtra = require('fs-extra');
const TelegramBot = require('node-telegram-bot-api');
// const child_process = require('child_process');

var Contastes = require('./Token');

const bot = new TelegramBot(Contastes.token, {
  polling: false
});

function ObtenerTitulo(Data) {
  let Titulo = Data.titulo;
  // TODO id con tres digitos
  let Indice = Data.id;
  Titulo = Titulo.replace(/ /g, "_");
  Titulo = Indice + "_" + Titulo;
  return Titulo;
}

function CrearFolder(Titulo) {
  fsExtra.copy(__dirname + '/000_Nombre_Video', Titulo, err => {
    if (err) return console.error(err);
    console.log('Folde Creados con titulo: ' + Titulo);
  });
}

function CargarData(Direcion) {
  try {
    let InfoProyecto = YAML.parse(fs.readFileSync(Direcion + '/1.Guion/InfoProyecto.md', 'utf8'));
    let Indice = YAML.parse(fs.readFileSync(Direcion + '/1.Guion/Indice.md', 'utf8'));
    let Link = YAML.parse(fs.readFileSync(Direcion + '/1.Guion/Link.md', 'utf8'));
    let TextoParaCompartir = YAML.parse(fs.readFileSync(Direcion + '/1.Guion/TextoParaCompartir.md', 'utf8'));
    let DataLink = YAML.parse(fs.readFileSync(__dirname + '/Data/link.md', 'utf8'));
    let TextoExtra = YAML.parse(fs.readFileSync(__dirname + '/Data/TextoExtra.md', 'utf8'));
    let Data = InfoProyecto;
    Data.indice = Indice;
    Data.link = Link;
    Data.texto = TextoParaCompartir;
    Data.DataLink = DataLink;
    Data.TextoExtra = TextoExtra;
    return Data;
  } catch (e) {
    // Todo: Error mas bonito
    console.log(e);
  }
}

function CrearArchivoNP(Folder) {
  if (Folder == null) {
    Folder = ".";
  }
  var Data = CargarData(Folder);
  var Titulo = ObtenerTitulo(Data);
  var Descripcion_corta = Data.texto.texto;

  let DataNP = YAML.createNode({
    title: Data.titulo
  });

  DataNP.add({
    key: 'video_number',
    value: Data.id
  });
  DataNP.add({
    key: 'date',
    value: Data.fecha
  });
  DataNP.add({
    key: 'video_id',
    value: Data.youtube_id
  });

  if (Data.codigo != null) {
    DataNP.add({
      key: 'repository',
      value: Data.codigo
    });
  }

  if (Data.indice != null) {
    if (Data.indice.length > 0) {
      let indice = YAML.createNode([{
        title: Data.indice[0][1],
        time: Data.indice[0][0]
      }]);

      for (let i = 1; i < Data.indice.length; i++) {
        indice.add({
          title: Data.indice[i][1],
          time: Data.indice[i][0]
        });
      }
      DataNP.add({
        key: 'topics',
        value: indice
      });
    }

  }

  if (Data.link != null) {
    if (Data.link.length > 0) {
      let links = YAML.createNode([{
        title: Data.link[0][0],
        url: Data.link[0][1]
      }]);
      for (let i = 1; i < Data.link.length; i++) {
        links.add({
          title: Data.link[i][0],
          url: Data.link[i][1]
        });
      }
      DataNP.add({
        key: 'links',
        value: links
      });
    }
  }
  const Documento = new YAML.Document();
  Documento.contents = DataNP;

  let salida = Documento.toString();
  console.log(salida);
  let SalidaDocumento = Folder + "/1.Guion/" + Titulo + '.md';
  fs.writeFile(SalidaDocumento,
    '---\n' + salida + "\n---\n\n " + Descripcion_corta,
    error => {
      if (error) {
        console.error(error);
      }
      console.log("Generated Noche Programacion" + SalidaDocumento);
    }
  );
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

  DataYT += Data.TextoExtra.Texto_final + "\n\n"

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
      console.log("data: ")
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

function main() {
  console.log("Opcion: " + process.argv[2]);

  switch (process.argv[2]) {
    case '-d':
      if (process.argv[3] != null) {
        CrearFolder(process.argv[3]);
      } else {
        CrearFolder("000_Nombre_Video");
      }
      break;
    case '-np':
      CrearArchivoNP(process.argv[3]);
      break;
    case '-yt':
      CrearArchivoYT(process.argv[3]);
      break;
    case '-r': // Renderizando Video de Blender
      console.log("Renderizar Video");
      RenderVideo(process.argv[3]);
      break;
    case '-p': // Crear Proxy de Blender
      console.log("Creando Proxy");
      CrearProxy();
      break;
    case '-h': // Crear Proxy de Blender
      console.log("Opciones");
      console.log("-d [folder] : Crea directorio para video");
      console.log("-p : Crear proxy");
      console.log("-r [folder] : Crear render del video");
      console.log("-np : Crear archivo Noche Programacion");
      console.log("-yt : Crear archivo Youtube");
      break;
    default:
      console.log("Sin opcion");
      break;
  }
}

main();
