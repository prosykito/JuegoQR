// Obtener el parámetro ?id= de la URL
const parametros = new URLSearchParams(window.location.search);
const id = parametros.get("id");

// Buscar la pregunta
const datos = preguntas[id];

if (datos) {

    document.getElementById("pregunta").textContent = datos.pregunta;

    let multimedia = "";

    if (datos.imagen && datos.imagen !== "") {

        multimedia +=
            `<img src="${datos.imagen}" style="max-width:100%;border-radius:10px;margin:20px 0;">`;

    }

    if (datos.video && datos.video !== "") {

        multimedia +=
            `<video controls style="width:100%;border-radius:10px;margin:20px 0;">
                <source src="${datos.video}" type="video/mp4">
            </video>`;

    }

    document.getElementById("multimedia").innerHTML = multimedia;

} else {
    document.getElementById("pregunta").textContent = "Pregunta no encontrada.";
    document.querySelector("button").disabled = true;
}

// Función para ignorar mayúsculas, acentos y espacios
function normalizar(texto) {

    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLowerCase();

}

function comprobar() {

    if (!datos)
        return;

    // Leer datos introducidos
    let codigoUsuario = normalizar(
        document.getElementById("codigo").value
    );

    let respuestaUsuario = normalizar(
        document.getElementById("respuesta").value
    );

    // Buscar el equipo que tenga ese código para esta prueba
    let equipoEncontrado = null;

    for (const equipo of Object.values(equipos)) {

        if (!equipo.pruebas[id])
            continue;

        if (
            normalizar(equipo.pruebas[id].codigoEntrada) === codigoUsuario
        ) {
            equipoEncontrado = equipo;
            break;
        }

    }

    // Comprobar respuesta
    let respuestaCorrecta = normalizar(datos.respuesta);

    if (equipoEncontrado && respuestaUsuario === respuestaCorrecta) {

        document.getElementById("resultado").innerHTML =
            "<span style='color:green;font-weight:bold;'>" +
            "✅ PRUEBA SUPERADA<br><br>" +
            "Siguiente coordenada:<br><b>" +
            equipoEncontrado.pruebas[id].coordenada +
            "</b><br><br>" +
            "Nuevo código:<br><b>" +
            equipoEncontrado.pruebas[id].codigoSalida +
            "</b>" +
            "</span>";

    } else {

        document.getElementById("resultado").innerHTML =

`<div style="
background:#1f4d1f;
border:3px solid #4CAF50;
padding:25px;
border-radius:12px;
margin-top:30px;">

<h2 style="margin-top:0;color:#8cff8c;">
✔ PRUEBA SUPERADA
</h2>

<p style="font-size:24px;">
<b>📍 Siguiente coordenada</b><br><br>
${equipoEncontrado.pruebas[id].coordenada}
</p>

<hr>

<p style="font-size:24px;">
<b>🔑 Nuevo código</b><br><br>
${equipoEncontrado.pruebas[id].codigoSalida}
</p>

</div>`;

}

// Pulsar Enter en el código
document
    .getElementById("codigo")
    .addEventListener("keypress", function (e) {

        if (e.key === "Enter") {
            comprobar();
        }

    });

// Pulsar Enter en la respuesta
document
    .getElementById("respuesta")
    .addEventListener("keypress", function (e) {

        if (e.key === "Enter") {
            comprobar();
        }

    });
