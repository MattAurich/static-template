var fs = require('fs');
const Handlebars = require('handlebars');
const showdown = require('showdown');



function extractName (fileName) {
  if (fileName.charAt(0) === "_") {
    fileName = fileName.substring(1, fileName.length);
  }

  return fileName.replace(/\.[^/.]+$/, "");
}

const converter = new showdown.Converter({
  'noHeaderId': false,
  'strikethrough': true,
  'tables': true,
});

Handlebars.registerHelper('markdown', function(val) {
  return new Handlebars.SafeString(converter.makeHtml(val));
});

var partialDir = process.argv[2];
fs.readdirSync(partialDir).forEach(fileName => {
  var partial = fs.readFileSync(partialDir + '/' + fileName, "utf8", function read(err, data) {
    if (err) {
        throw err;
    };
  });

  Handlebars.registerPartial(extractName(fileName), partial);
});

const templateDir = process.argv[3];
fs.readdirSync(templateDir).forEach(fileName => {
  var file = fs.readFileSync(templateDir + '/' + fileName, "utf8", function read(err, data) {
    if (err) {
        throw err;
    };
  });

  const template = Handlebars.compile(file);
  const htmlFile = template();
  const distFolder = './dist/' + extractName(fileName);

  if (!fs.existsSync(distFolder)){
      fs.mkdirSync(distFolder);
  }

  fs.writeFile(distFolder + '/index.html', htmlFile , function(err) {
    if(err) {
        return console.log(err);
    }
  });
});
