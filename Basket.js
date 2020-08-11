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
    let Data = InfoProyecto;
    Data.indice = Indice;
    Data.link = Link;
    Data.texto = TextoParaCompartir;
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
  let Data = CargarData(Folder);
  let Titulo = ObtenerTitulo(Data);
  let Descripcion_corta = Data.texto.texto;

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
        Titulo: Data.link[0][0],
        url: Data.link[0][1]
      }]);
      for (let i = 1; i < Data.link.length; i++) {
        links.add({
          Titulo: Data.link[i][0],
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
      console.log("Generated " + SalidaDocumento);
    }
  );
}

function CrearArchivoYT(Data, Titulo) {

  let Descripcion_corta = Data['Descripcion_corta'];
  let Descripcion_extra = Data['Descripcion_extra'];
  let Indice = Data['topics'];

  let Salida = Descripcion_corta;
  Salida = Salida + "\n" + Descripcion_extra
  Salida = Salida + "\n\nIndice: \n"
  for (var i in Indice) {
    Salida = Salida + Indice[i]['time'] + " " + Indice[i]['title'] + "\n";
  }
  fs.writeFileSync(Direcion + "/" + Titulo + '.md', Salida, 'utf8');

}

function CrearProxy() {
  bot.sendMessage(IDChat, "[Blender] Empezando a crear Proxy");
  let Inicio = new Date();
  const {
    exec
  } = require("child_process");
  exec("$HOME/.local/bin/bpsproxy", (error, data, getter) => {
    if (error) {
      console.log("error", error.message);
      bot.sendMessage(IDChat, "[Blender] Error creando Proxy");
      return;
    }
    if (getter) {
      var Tiempo = new Date() - Inicio;
      var Segundos = parseInt((Tiempo / (1000)) % 60);
      var Minutos = parseInt((Tiempo / (1000 * 60)) % 60);
      var Horas = parseInt(Tiempo / (1000 * 60 * 60));
      console.log("Crear el proxy tardo " + Horas + ":" + Minutos + ":" + Segundos);
      console.log("data-", data);
      bot.sendMessage(IDChat, "[Blender] Termino de crear Proxy - " + Horas + "h:" + Minutos + "m:" + Segundos + "s");
      return;
    }
    console.log("data:", data);
  });

}

function RenderVideo(Archivo) {
  bot.sendMessage(IDChat, "[Blender] Empezando a Renderizar el Video: " + Archivo);
  let Inicio = new Date();
  const {
    exec
  } = require("child_process");
  exec("$HOME/.local/bin/bpsrender " + Archivo, (error, data, getter) => {
    if (error) {
      console.log("error", error.message);
      bot.sendMessage(IDChat, "[Blender] Error Renderizar el video " + Archivo);
      return;
    }
    if (getter) {
      var Tiempo = new Date() - Inicio;
      var Segundos = parseInt((Tiempo / (1000)) % 60);
      var Minutos = parseInt((Tiempo / (1000 * 60)) % 60);
      var Horas = parseInt(Tiempo / (1000 * 60 * 60));
      console.log("Crear el proxy tardo " + Horas + ":" + Minutos + ":" + Segundos);
      console.log("data-", data);
      bot.sendMessage(IDChat, "[Blender] Ya esta listo el video " + Archivo + " en " + Horas + "h:" + Minutos + "m:" + Segundos + "s");
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
    case '-yb':
      let folderY;
      if (process.argv[3] != null) {
        folderY = process.argv[3];
      } else {
        folderY = ".";
      }
      let DataY = CargarData(folderY);
      let TituloY = ObtenerTitulo(Data);
      // CrearArchivoYT(Data, "DescripcionYB", folder);
      break;
    case '-r': // Renderizando Video de Blender
      console.log("Renderizar Video");
      RenderVideo(process.argv[3]);
      break;
    case '-p': // Crear Proxy de Blender
      console.log("Creando Proxy");
      CrearProxy();
      break;
    default:
      console.log("Sin opcion");
      break;
  }
}

main();
