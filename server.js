var express = require('express');
var bodyParser = require('body-parser');
var fs = require("fs");

var listatareas = [];

fs.exists("tareas.json", function (encontrado) {
  if (encontrado) {
    console.log("cargando datos ...");
    var data = fs.readFileSync("tareas.json", "UTF-8");
    listatareas = JSON.parse(data);

  } else {
    listatareas = [];
  }
});

// console.log(data);

var app = express();

// create application/json parser
var jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(jsonParser);
app.use(urlencodedParser);

app.use(express.static('www/formulario'));

app.post('/', function (req, res) {
  console.log("petición recibida");
  console.log(listatareas);
  // var datos = req.body.nombre || "";
  var tar = req.body.tarea || "";
  var nomb = req.body.nombre || "";
  var nuevatarea = { nombre: nomb, tarea: tar };
  listatareas.push(nuevatarea);

 actualizarBD();
 
  res.redirect('/');
  // fs.readFile("./www/formulario/index2.html", "utf8", function (err, text) {
  //   var fila = cargarTareas(listatareas);

  //   text = text.replace("[sustituir]", fila);
  //   res.send(text);

  // });
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

});


app.get('/eliminar/:id?', function (req, res) {
  console.log('Eliminando registro ' + req.query.id);
  listatareas.splice(req.query.id, 1);
  // Eliminar registro de la colección;

  actualizarBD();
  res.redirect('/');

  // fs.readFile("./www/formulario/index2.html", "utf8", function (err, text) {
  //   var fila = cargarTareas(listatareas);
  //   text = text.replace("[sustituir]", fila);
  //   res.send(text);
  // });
})

app.get('/editar/:id?', function (req, res) {
  fs.readFile("./www/formulario/index2.html", "utf8", function (err, text) {
    var fila = cargarTareas(listatareas);
    var nombre = listatareas[req.query.id].nombre;
    var tarea = listatareas[req.query.id].tarea;
    text = text.replace("[sustituir]", fila);
    text = text.replace('action="/"', 'action="/editar"');
    text = text.replace("[id_editar]", req.query.id);
    text = text.replace('placeholder="Nombre de usuario"', 'value="' + nombre + '"');
    text = text.replace('placeholder="Nombre de la tarea"', 'value="' + tarea + '"')
    res.send(text);
  });

});

app.post('/editar', function (req, res) {
  var tar = req.body.tarea || "";
  var nomb = req.body.nombre || "";
  var id = req.body.id;
  listatareas[id].nombre = nomb;
  listatareas[id].tarea = tar;
  actualizarBD();
  res.redirect('/');
});

function actualizarBD(){
  fs.writeFile("tareas.json", JSON.stringify(listatareas), function () {
    console.log("fichero de datos OK");
  });
}



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
          <td>
          <a href="/eliminar?id=[id]">Eliminar</a>
          <a href="/editar?id=[id]">Editar</a>
          </td>
      </tr>
      `;

    fila = fila.split("[id]").join(indice);

    fila = fila.replace("[nombre]", tareas[indice].nombre);
    fila = fila.replace("[tarea]", tareas[indice].tarea);
    lista += fila;
  }
  return lista;
}