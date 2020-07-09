let yaml = require('js-yaml');
let fs = require('fs');

try {
  let General = yaml.safeLoad(fs.readFileSync('Guion/General.md', 'utf8'));
  let Indice = yaml.safeLoad(fs.readFileSync('Guion/Indice.md', 'utf8'));
  let Link = yaml.safeLoad(fs.readFileSync('Guion/Link.md', 'utf8'));
  let SalidaNP = {/* Same as above */};
  SalidaNP = General;
  // SalidaNP['Descripcion'] = data['Descripcion'];
  SalidaNP['topics'] = Indice['topics'];
  SalidaNP['link'] = Link['link'];
  SalidaNP['link'] = Link['tools'];
  let SalidaYaml = "---\n" + yaml.safeDump(SalidaNP) + "---";
  fs.writeFileSync('Salida.md', SalidaYaml, 'utf8');
} catch (e) {
  console.log(e);
}
