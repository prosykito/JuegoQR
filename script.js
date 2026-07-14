// ===============================
// Obtener la pregunta de la URL
// ===============================

const parametros = new URLSearchParams(window.location.search);
const id = parametros.get("id");

const datos = preguntas[id];

// ===============================
// Mostrar pregunta
// ===============================

if (datos) {

    document.getElementById("pregunta").textContent = datos.pregunta;

    let multimedia = "";

    // Imagen
    if (datos.imagen && datos.imagen !== "") {

        multimedia += `
            <img
                src="${datos.imagen}"
                style="
                    width:100%;
                    border-radius:10px;
                    margin:20px 0;
                ">
        `;

    }

    // Vídeo
    if (datos.video && datos.video !== "") {

        multimedia += `
            <video
                controls
                style="
                    width:100%;
                    border-radius:10px;
                    margin:20px 0;
                ">
                <source src="${datos.video}" type="video/mp4">
            </video>
        `;

    }

    document.getElementById("multimedia").innerHTML = multimedia;

}
else {

    document.getElementById("pregunta").textContent = "Pregunta no encontrada.";
    document.querySelector("button").disabled = true;

}

// ===============================
// Normalizar texto
// ===============================

function normalizar(texto) {

    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLowerCase();

}

// ===============================
// Comprobar respuesta
// ===============================

function comprobar() {

    if (!datos)
        return;

    let codigoUsuario = normalizar(
        document.getElementById("codigo").value
    );

    let respuestaUsuario = normalizar(
        document.getElementById("respuesta").value
    );

    let equipoEncontrado = null;

    // Buscar el equipo correspondiente
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

    let respuestaCorrecta = normalizar(datos.respuesta);

    // ===========================
    // RESPUESTA CORRECTA
    // ===========================

    if (
        equipoEncontrado &&
        respuestaUsuario === respuestaCorrecta
    ) {

        document.getElementById("resultado").innerHTML = `

<div style="
background:#214221;
border:3px solid #4CAF50;
border-radius:12px;
padding:25px;
margin-top:30px;
text-align:center;">

<h2 style="color:#8cff8c;margin-top:0;">
🧠 DIAGNÓSTICO COMPLETADO
</h2>

<p style="font-size:24px;">
📍<br>
<b>Siguiente ubicación</b><br><br>
${equipoEncontrado.pruebas[id].coordenada}
</p>

<hr>

<p style="font-size:24px;">
🔑<br>
<b>Código de acceso</b><br><br>
${equipoEncontrado.pruebas[id].codigoSalida}
</p>

</div>

`;

    }

    // ===========================
    // RESPUESTA INCORRECTA
    // ===========================

    else {

        document.getElementById("resultado").innerHTML = `

<div style="
background:#4a1b1b;
border:3px solid #cc4444;
border-radius:12px;
padding:20px;
margin-top:30px;
text-align:center;
font-weight:bold;">

❌ Código o respuesta incorrectos.

</div>

`;

    }

}

// ===============================
// ENTER EN EL CÓDIGO
// ===============================

document
    .getElementById("codigo")
    .addEventListener("keypress", function (e) {

        if (e.key === "Enter")
            comprobar();

    });

// ===============================
// ENTER EN LA RESPUESTA
// ===============================

document
    .getElementById("respuesta")
    .addEventListener("keypress", function (e) {

        if (e.key === "Enter")
            comprobar();

    });
