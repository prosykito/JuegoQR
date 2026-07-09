// Obtener el parámetro ?id= de la URL
const parametros = new URLSearchParams(window.location.search);
const id = parametros.get("id");

// Buscar la pregunta
const datos = preguntas[id];

if (datos) {
    document.getElementById("pregunta").textContent = datos.pregunta;
} else {
    document.getElementById("pregunta").textContent = "Pregunta no encontrada.";
    document.querySelector("button").disabled = true;
}

function comprobar() {

    if (!datos)
        return;

    let respuestaUsuario = document
        .getElementById("respuesta")
        .value
        .trim()
        .toLowerCase();

    let respuestaCorrecta = datos.respuesta
        .trim()
        .toLowerCase();

    if (respuestaUsuario === respuestaCorrecta) {

        document.getElementById("resultado").innerHTML =
            "<span style='color:green;font-weight:bold;'>" +
            datos.mensaje.replace(/\n/g, "<br>") +
            "</span>";

    } else {

        document.getElementById("resultado").innerHTML =
            "<span style='color:red;'>❌ Respuesta incorrecta.</span>";

    }

}

// Permite pulsar Enter
document
    .getElementById("respuesta")
    .addEventListener("keypress", function (e) {

        if (e.key === "Enter") {
            comprobar();
        }

    });