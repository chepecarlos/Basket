let yaml = require('js-yaml');
let fs = require('fs');
let fsExtra = require('fs-extra');

console.log("Opcion: " + process.argv[2]);

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
  let Data = CargarData('Guion');
  let Titulo = ObtenerTitulo(Data);
  CrearFolder(Titulo);
  CrearArchivoNP(Data, Titulo, 'Guion');
}

main();
