window.onload = function () {

    var tareas = [{
        nombre: "Mari",
        tarea: "Limpiar la casa"
    }, {
        nombre: "Manuel",
        tarea: "Fregar"
    }
    ];

    function cargarTareas(tareas) {
        document.getElementById("tabla").innerHTML ="";
        for (var indice in tareas) {
            var fila = `
            <tr>
                <td>[id]</td>
                <td>[nombre]</td>
                <td>[tarea]</td>
            </tr>
            `;
            fila = fila.replace("[id]", indice);
            fila = fila.replace("[nombre]", tareas[indice].nombre);
            fila = fila.replace("[tarea]", tareas[indice].tarea);
            document.getElementById("tabla").innerHTML += fila;
        }
    }

    function borrarcontenido(input){
        document.getElementsByName("id","nombre","tarea").reset();
    }
    

    this.document.getElementById("enviar").onclick = function (event) {
        // event.preventDefault();
        var nomb = document.getElementById("nombre").value;
        var tar = document.getElementById("tarea").value;
        tareas.push({nombre:nomb,tarea:tar});
        // cargarTareas(tareas);

    }

    prueba 
    // this.document.getElementById("formulario").onsubmit=function(){
    //     alert("formulario");
    // } 


}