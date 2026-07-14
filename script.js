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


    // ===============================
    // Imagen
    // ===============================

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



    // ===============================
    // Vídeo con pantalla previa
    // ===============================

    if (datos.video && datos.video !== "") {

        multimedia += `

        <div id="avisoVideo"
            style="
                background:#222;
                border:3px solid #4CAF50;
                border-radius:12px;
                padding:25px;
                margin:20px 0;
                text-align:center;
            ">

            <h2 style="color:#8cff8c;">
                🎬 PRUEBA DE VÍDEO
            </h2>


            <p style="font-size:20px;">
                Cuando todo el equipo esté preparado,
                pulsa el botón para comenzar.
            </p>


            <button 
                onclick="mostrarVideo()"
                style="
                    font-size:22px;
                    padding:15px 30px;
                    border-radius:10px;
                    cursor:pointer;
                ">

                ▶ VER VÍDEO

            </button>


        </div>



        <video
            id="videoPrueba"
            controls
            style="
                display:none;
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

    document.getElementById("pregunta").textContent =
        "Pregunta no encontrada.";

    document.querySelector("button").disabled = true;

}



// ===============================
// Mostrar vídeo al pulsar botón
// ===============================

function mostrarVideo() {

    let aviso = document.getElementById("avisoVideo");
    let video = document.getElementById("videoPrueba");


    if (aviso)
        aviso.style.display = "none";


    if (video) {

        video.style.display = "block";
        video.play();

    }

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



    // ===============================
    // Buscar equipo por código
    // ===============================

    for (const equipo of Object.values(equipos)) {


        if (!equipo.pruebas[id])
            continue;



        if (
            normalizar(
                equipo.pruebas[id].codigoEntrada
            )
            === codigoUsuario
        ) {

            equipoEncontrado = equipo;
            break;

        }

    }



    let respuestaCorrecta = normalizar(
        datos.respuesta
    );



    // ===============================
    // Comprobaciones separadas
    // ===============================

    let codigoCorrecto = false;
    let respuestaCorrectaOK = false;



    if (equipoEncontrado) {

        codigoCorrecto = true;

    }



    if (
        respuestaUsuario === respuestaCorrecta
    ) {

        respuestaCorrectaOK = true;

    }




    // ===============================
    // TODO CORRECTO
    // ===============================

    if (
        codigoCorrecto &&
        respuestaCorrectaOK
    ) {

    // ===============================
    // Actualizar progreso en Firebase
    // ===============================

    actualizarEstadoEquipo(

    equipoEncontrado.nombre,

    "QR" + id,

    equipoEncontrado.pruebas[id].coordenada,

    equipoEncontrado.pruebas[id].codigoSalida

);
        document.getElementById("resultado").innerHTML = `

        <div style="
        background:#214221;
        border:3px solid #4CAF50;
        border-radius:12px;
        padding:25px;
        margin-top:30px;
        text-align:center;">


        <h2 style="color:#8cff8c;">
            🧠 DIAGNÓSTICO COMPLETADO
        </h2>


        <p style="font-size:24px;">
            📍<br>
            <b>Siguiente ubicación</b>
            <br><br>

            ${equipoEncontrado.pruebas[id].coordenada}

        </p>


        <hr>


        <p style="font-size:24px;">

            🔑<br>
            <b>Código de acceso</b>
            <br><br>

            ${equipoEncontrado.pruebas[id].codigoSalida}

        </p>


        </div>

        `;


    }



    // ===============================
    // Algún dato incorrecto
    // ===============================

    else {


        let mensajeError = "";



        if (
            !codigoCorrecto &&
            !respuestaCorrectaOK
        ) {


            mensajeError = `
            ❌ Código incorrecto
            <br><br>
            ❌ Respuesta incorrecta
            `;


        }


        else if (!codigoCorrecto) {


            mensajeError = `
            ❌ Código incorrecto
            `;


        }


        else if (!respuestaCorrectaOK) {


            mensajeError = `
            ❌ Respuesta incorrecta
            `;


        }



        document.getElementById("resultado").innerHTML = `


        <div style="
        background:#4a1b1b;
        border:3px solid #cc4444;
        border-radius:12px;
        padding:20px;
        margin-top:30px;
        text-align:center;
        font-weight:bold;
        font-size:22px;">


        ${mensajeError}


        </div>


        `;


    }


}



// ===============================
// ENTER EN EL CÓDIGO
// ===============================

document
    .getElementById("codigo")
    .addEventListener(
        "keypress",
        function(e) {

            if (e.key === "Enter")
                comprobar();

        }
    );



// ===============================
// ENTER EN LA RESPUESTA
// ===============================

document
    .getElementById("respuesta")
    .addEventListener(
        "keypress",
        function(e) {

            if (e.key === "Enter")
                comprobar();

        }
    );
