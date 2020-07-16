let yaml = require('js-yaml');
let fs = require('fs');
let fsExtra = require('fs-extra');

try {
  let General = yaml.safeLoad(fs.readFileSync('Guion/General.md', 'utf8', pattern = "yyyy-MM-dd"));
  let Indice = yaml.safeLoad(fs.readFileSync('Guion/Indice.md', 'utf8'));
  let Link = yaml.safeLoad(fs.readFileSync('Guion/Link.md', 'utf8'));
  let Compartir = yaml.safeLoad(fs.readFileSync('Guion/TextoParaCompartir.md', 'utf8'));
  let SalidaNP = {
    /* Same as above */
  };
  SalidaNP = General;
  // SalidaNP['Descripcion'] = data['Descripcion'];
  SalidaNP['topics'] = Indice['topics'];
  SalidaNP['link'] = Link['link'];
  // SalidaNP['link'] = Link['tools'];
  SalidaNP['tools'] = Link['tools'];
  SalidaNP['fecha2'] = SalidaNP['date'];
  let Descripcion_corta = Compartir['Descripcion_corta'];
  let SalidaYaml = "---\n" + yaml.safeDump(SalidaNP, pattern = "yyyy-MM-dd") + "---\n\n" + Descripcion_corta;
  let Titulo = ObtenerTitulo(SalidaNP)
  CrearFolder(Titulo)
  fs.writeFileSync('Salida.md', SalidaYaml, 'utf8');

} catch (e) {
  console.log(e);
}

function ObtenerTitulo(Data) {
  let Titulo = Data.title;
  let Indice = Data.video_numero;
  Titulo = Titulo.replace(/ /g, "_");
  Titulo = Indice + "_" + Titulo;
  return Titulo
}

function CrearFolder(Titulo){
  fsExtra.copy('Guion', Titulo, err => {
    if (err) return console.error(err)
    console.log('Folde Creados con titulo: '+Titulo)
  });

}
