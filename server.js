var express = require('express');
var bodyParser = require('body-parser');
var fs = require("fs");

var app = express();

var listatareas = []

// create application/json parser
var jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(jsonParser);
app.use(urlencodedParser);

app.use(express.static('www/formulario'));

app.post('/', function (req, res) {
  console.log("petición recibida");

  console.log(listatareas);

  // var datos = req.body.nombre || "";
  var tar = req.body.tarea || "";
  var nomb = req.body.nombre || "";
  listatareas.push({ nombre: nomb, tarea: tar });
  fs.readFile("./www/formulario/index2.html", "utf8", function (err, text) {
    var fila = cargarTareas(listatareas);

    text = text.replace("[sustituir]", fila);
    res.send(text);

  });
  // res.send();
});

// app.get('/formulario', function (req, res) {
//   console.log("petición recibida en tareas");
//   fs.readFile("./www/formulario/index.html", "utf8", function (err, text) {
//     text = text.replace("[sustituir]", fila);
//     res.send(text);

app.get('/', function (req, res) {
  console.log("petición recibida en tareas");
  fs.readFile("./www/formulario/index2.html", "utf8", function (err, text) {
    // text = text.replace("[sustituir]", " ");
    var fila = cargarTareas(listatareas);
    text = text.replace("[sustituir]", fila);
    res.send(text);
  });
  // res.send();
});


app.get('/eliminar/:id?', function (req, res) {
  console.log('Eliminando registro ' + req.query.id);
  listatareas.splice(req.query.id, 1)
  // Eliminar registro de la colección;
  fs.readFile("./www/formulario/index2.html", "utf8", function (err, text) {
    var fila = cargarTareas(listatareas);
    text = text.replace("[sustituir]", fila);
    res.send(text);
  });
})


var server = app.listen(80, function () {
  console.log('Servidor web iniciado');
});

function cargarTareas(tareas) {
  var lista = "";
  for (var indice in tareas) {
    var fila = `
      <tr>
          <td>[id]</td>
          <td>[nombre]</td>
          <td>[tarea]</td>
          <td><a href="/eliminar?id=[id]">Eliminar</a></td>
      </tr>
      `;
    fila = fila.replace("[id]", indice);
    fila = fila.replace("[id]", indice);
    fila = fila.replace("[nombre]", tareas[indice].nombre);
    fila = fila.replace("[tarea]", tareas[indice].tarea);
    lista += fila;
  }
  return lista;
}