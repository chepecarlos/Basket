#!/usr/bin/env node

/*jshint esversion: 6 */
let yaml = require('js-yaml');
let fs = require('fs');
let fsExtra = require('fs-extra');
// const child_process = require('child_process');

function ObtenerTitulo(Data) {
  let Titulo = Data.title;
  let Indice = Data.video_numero;
  Titulo = Titulo.replace(/ /g, "_");
  Titulo = Indice + "_" + Titulo;
  return Titulo;
}

function CrearFolder(Titulo) {
  fsExtra.copy('Guion', Titulo, err => {
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
  for (i in Indice) {
    Salida = Salida + Indice[i]['time'] + " " + Indice[i]['title'] + "\n";
  }
  fs.writeFileSync(Direcion + "/" + Titulo + '.md', Salida, 'utf8');

}

function RenderVideo(Archivo) {

  const exec = require('child_process').exec;//, child;
  const myShellScript = exec('bpsrender');
  myShellScript.stdout.on('data', (data)=>{
      console.log(data);
      // do whatever you want here with data
  });
  myShellScript.stderr.on('data', (data)=>{
      console.error(data);
  });

  // var inicio = new Date();
  // var Comando = "ls -l"; //+ Archivo;
  // // Todo: No ejecuta el comando
  // var hijo = child_process.execSync(Comando, {
  //   // shell: "ls -ls"
  // });
  // // hijo.stdout.pipe(process.stdout);
  // hijo.on('exit', function() {
  //   console.log("Termino");
  //   // process.exit()
  // });
  // // Todo: Cuenta mal el tiempo
  // var tiempo = new Date() - inicio;
  // console.log('Tardo en procesarce: ' + tiempo + 'ms el archivo ' + Archivo + " :) ");

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
    case '-r':
      console.log("Render Video");
      RenderVideo(process.argv[3]);
      break;
    default:
      console.log("Sin opcion");
      break;
  }
}

main();
