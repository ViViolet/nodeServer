
window.onload = function () {

    var teclas = document.getElementsByTagName("input");
    var num1 = "", num2 = "", OP = "";

    for (var i = 1; i < teclas.length; i++) {
        teclas[i].onclick = function () {
            var pantalla = document.getElementById("pantalla");

            if (num1 == "") {
                // leo numero 1
                if (this.value != '+' && this.value != '-' && this.value != '*' && this.value != '/' && this.value != "=") {
                    pantalla.value = pantalla.value + this.value;
                } else {
                    num1 = pantalla.value;
                    OP = this.value;
                    if (OP == "=") {
                        pantalla.value = num1;
                        num1 = "";
                        OP = "";
                    } else {
                        pantalla.value = "";
                    }


                }
            } else {
                // leo numero 2
                if (this.value != '+' && this.value != '-' && this.value != '*' && this.value != '/' && this.value != "=") {
                    pantalla.value = pantalla.value + this.value;
                } else {
                    if (this.value == "=")
                        num2 = parseInt(pantalla.value);
                    num1 = parseInt(num1);
                    var resultado

                    switch (OP) {
                        case "+":
                            resultado = num1 + num2
                            break;
                        case "-":
                            resultado = num1 - num2
                            break;
                        case "*":
                            resultado = num1 * num2
                            break;
                        case "/":
                            resultado = num1 / num2
                            break;

                        default:
                            // este apartado se refiere a la acción a realizar en caso de no encontrar ninguna de los condiciones de los casos en switch
                            // el "break" es imprescindible, no se ejecutan las acciones si este no existe
                            break;
                    }

                    pantalla.value = resultado;
                }

            }



        }
    }


};