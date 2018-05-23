var express = require('express');
var bodyParser = require('body-parser');
var fs = require("fs");
var mysql = require('mysql');


var connection = mysql.createConnection({
  host: 'localhost',
  user: 'master',
  password: '12345',
  database: 'tareasBD'
});
connection.connect(function (err) {
  if (err) {
    throw error;
  } else {
    console.log("Conexion correcta con el servidor")
  }
});

var app = express();
// create application/json parser
var jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(jsonParser);
app.use(urlencodedParser);


app.post('/', function (req, res) {
  console.log("petición recibida");
  var tar = req.body.tarea || "";
  var nomb = req.body.nombre || "";
  var nuevatarea = { nombre: nomb, tarea: tar };
  connection.query('INSERT INTO tareas (nombre, tarea) VALUES(?, ?)', [nomb, tar], function (error, result) {
    if (error) {
      throw error;
    } else {
      console.log(result);
      res.redirect('/');
    }
  });
});

app.get('/pruebas', function (req, res) {
  console.log("petición recibida en tareas");
  fs.readFile("./www/formulario/index2.html", "utf8", function (err, text) {
    var fila = cargarTareas(listatareas);
    text = text.replace("[sustituir]", fila);
    res.send(text);
  });
});

app.get('/eliminar/:id?', function (req, res) {
  console.log('Eliminando registro ' + req.query.id);
  connection.query("DELETE FROM tareas WHERE tareas.ID = ?", [req.query.id], function (error, result) {
    res.redirect('/');
  });
})

app.get('/editar/:id?', function (req, res) {
  connection.query("SELECT * FROM tareas", function (error, result) {
    var registroeditar;
    console.log(result);
    for (const tarea of result) {
      if (tarea.ID == req.query.id) {
        registroeditar = tarea;
      }
    }
    console.log(registroeditar);
    fs.readFile("./www/formulario/index2.html", "utf8", function (err, text) {
      var fila = cargarTareas(result);
      var nombre = registroeditar.nombre;
      var tarea = registroeditar.tarea;
      var id = registroeditar.id;
      text = text.replace("[sustituir]", fila);
      text = text.replace('action="/"', 'action="/editar"');
      text = text.replace("[id_editar]", req.query.id);
      text = text.replace('placeholder="Nombre de usuario"', 'value="' + nombre + '"');
      text = text.replace('placeholder="Nombre de la tarea"', 'value="' + tarea + '"')
      res.send(text);
    });
  });
});

app.post('/editar', function (req, res) {
  var tar = req.body.tarea || "";
  var nomb = req.body.nombre || "";
  var id = req.body.id;
  connection.query("UPDATE tareas SET nombre=?, tarea=? WHERE id=? ", [nomb, tar, id], function (error, resultado) {
    if (error) {
      console.log(error);
    } else {
      console.log(resultado);
      res.redirect('/');
    }
  })
});

app.get("/", function (req, res) {
  var nombre = "Pedro";
  connection.query('SELECT * FROM tareas', function (error, result) {
    if (error) {
      throw error;
    } else {
      nombre = result[0].nombre;
      var registros = cargarTareas(result);
      fs.readFile("./www/formulario/index2.html", "utf8", function (err, text) {
        text = text.replace("[sustituir]", registros);
        res.send(text);
      });
    }
  });
})

app.use(express.static('www/formulario'));

var server = app.listen(8080, function () {
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
    fila = fila.split("[id]").join(tareas[indice].ID);
    fila = fila.replace("[nombre]", tareas[indice].nombre);
    fila = fila.replace("[tarea]", tareas[indice].tarea);
    lista += fila;
  }
  return lista;
}