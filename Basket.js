#!/usr/bin/env node

/*jshint esversion: 6 */
let yaml = require('js-yaml');
let fs = require('fs');
let fsExtra = require('fs-extra');
const TelegramBot = require('node-telegram-bot-api');
// const child_process = require('child_process');

var Contastes =  require('./Token');

const bot = new TelegramBot(Contastes.token, {
  polling: false
});

function ObtenerTitulo(Data) {
  let Titulo = Data.title;
  let Indice = Data.video_numero;
  Titulo = Titulo.replace(/ /g, "_");
  Titulo = Indice + "_" + Titulo;
  return Titulo;
}

function CrearFolder(Titulo) {
  console.log(__filename);
  console.log(__dirname);
  fsExtra.copy(__dirname+'/Guion', Titulo, err => {
    if (err) return console.error(err);
    console.log('Folde Creados con titulo: ' + Titulo);
  });
}

function CargarData(Direcion) {
  try {
    let General = yaml.safeLoad(fs.readFileSync(Direcion + '/General.md', 'utf8'));
    let Indice = yaml.safeLoad(fs.readFileSync(Direcion + '/Indice.md', 'utf8'));
    let Link = yaml.safeLoad(fs.readFileSync(Direcion + '/Link.md', 'utf8'));
    let Compartir = yaml.safeLoad(fs.readFileSync(Direcion + '/TextoParaCompartir.md', 'utf8'));
    let Data = {
      /* Bacio */
    };
    Data = General;
    Data['topics'] = Indice['topics'];
    Data['link'] = Link['link'];
    Data['tools'] = Link['tools'];
    Data['Descripcion_corta'] = Compartir['Descripcion_corta'];
    Data['Descripcion_extra'] = Compartir['Descripcion_extra'];
    return Data;
  } catch (e) {
    console.log(e);
  }
}

function CrearArchivoNP(Data, Titulo, Direcion) {
  let Descripcion_corta = Data['Descripcion_corta'];
  let Salida = "---\n" + yaml.safeDump(Data, pattern = "yyyy-MM-dd") + "---\n\n" + Descripcion_corta;
  fs.writeFileSync(Direcion + "/" + Titulo + '.md', Salida, 'utf8');
}

function CrearArchivoYT(Data, Titulo, Direcion) {
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
      if (process.argv[3] != null) {
        let Data = CargarData(process.argv[3]);
        let Titulo = ObtenerTitulo(Data);
        CrearArchivoNP(Data, Titulo, process.argv[3]);
      } else {
        let Data = CargarData(".");
        let Titulo = ObtenerTitulo(Data);
        CrearArchivoNP(Data, Titulo, ".");
      }
      break;
    case '-yb':
      if (process.argv[3] != null) {
        let Data = CargarData(process.argv[3]);
        CrearArchivoYT(Data, "DescripcionYB", process.argv[3]);
      } else {
        let Data = CargarData(".");
        CrearArchivoYT(Data, "DescripcionYB", ".");
      }
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
