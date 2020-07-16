let yaml = require('js-yaml');
let fs = require('fs');
let fsExtra = require('fs-extra');

function ObtenerTitulo(Data) {
  let Titulo = Data.title;
  let Indice = Data.video_numero;
  Titulo = Titulo.replace(/ /g, "_");
  Titulo = Indice + "_" + Titulo;
  return Titulo
}

function CrearFolder(Titulo) {
  fsExtra.copy('Guion', Titulo, err => {
    if (err) return console.error(err)
    console.log('Folde Creados con titulo: ' + Titulo)
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
    return Data;
  } catch (e) {
    console.log(e);
  }
}

function CrearArchivoNP(Data, Titulo, Direcion) {
  let Descripcion_corta = Data['Descripcion_corta'];
  let SalidaYaml = "---\n" + yaml.safeDump(Data, pattern = "yyyy-MM-dd") + "---\n\n" + Descripcion_corta;
  fs.writeFileSync(Direcion + "/" + Titulo + '.md', SalidaYaml, 'utf8');
}

function main() {
  console.log("Opcion: " + process.argv[2]);
  //
  //
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
    default:
      console.log("Sin opcion");
      break;
  }

}

main();
