// ===============================
// Obtener la pregunta de la URL
// ===============================
console.log("script.js VERSION 1.7");
const parametros = new URLSearchParams(window.location.search);
const id = parametros.get("id");
const datos = preguntas[id];

// ===============================
// Mostrar pregunta
// ===============================
if (datos) {
    document.getElementById("pregunta").textContent =
        datos.pregunta;
    let multimedia = "";

    // ===============================
    // Imagen
    // ===============================

    if (datos.imagen && datos.imagen !== "") {


        multimedia += `

        <img
            src="${datos.imagen}">

        `;

    }




    // ===============================
    // Vídeo con pantalla previa
    // ===============================

    if (datos.video && datos.video !== "") {


        multimedia += `


        <div id="avisoVideo">


            <h2>
                🎬 PRUEBA DE VÍDEO
            </h2>


            <p>
                Cuando todo el equipo esté preparado,
                pulsa el botón para comenzar.
            </p>


            <button 
                onclick="mostrarVideo()">

                ▶ VER VÍDEO

            </button>


        </div>




        <video
            id="videoPrueba"
            controls
            style="display:none;">


            <source 
            src="${datos.video}" 
            type="video/mp4">


        </video>


        `;

    }



    document.getElementById("multimedia").innerHTML =
        multimedia;


}


else {


    document.getElementById("pregunta").textContent =
        "Pregunta no encontrada.";


    document.querySelector("button").disabled = true;


}




// ===============================
// Mostrar vídeo
// ===============================

function mostrarVideo() {


    let aviso =
        document.getElementById("avisoVideo");


    let video =
        document.getElementById("videoPrueba");



    if (aviso)
        aviso.style.display="none";



    if(video){

        video.style.display="block";

        video.play();

    }


}




// ===============================
// Normalizar texto
// ===============================

function normalizar(texto) {


    return texto

        .normalize("NFD")

        .replace(/[\u0300-\u036f]/g,"")

        .trim()

        .toLowerCase();

}




// ===============================
// Comprobar respuesta
// ===============================

function comprobar(){



    if(!datos)
        return;




    let codigoUsuario =
        normalizar(
            document.getElementById("codigo").value
        );



    let respuestaUsuario =
        normalizar(
            document.getElementById("respuesta").value
        );




    let equipoEncontrado=null;




    // ===============================
    // Buscar equipo por código
    // ===============================

    for(const equipo of Object.values(equipos)){



        if(!equipo.pruebas[id])
            continue;




        if(

            normalizar(
                equipo.pruebas[id].codigoEntrada
            )
            === codigoUsuario

        ){


            equipoEncontrado=equipo;

            break;

        }


    }





    let respuestaCorrecta =
        normalizar(datos.respuesta);




    let codigoCorrecto=false;

    let respuestaCorrectaOK=false;




    if(equipoEncontrado){

        codigoCorrecto=true;

    }




    if(respuestaUsuario===respuestaCorrecta){

        respuestaCorrectaOK=true;

    }

   // ===============================
// Mostrar validación
// ===============================

document.getElementById("expedienteResultado").innerHTML = `
<div class="expediente">

    <div class="expedienteTitulo">

        EXPEDIENTE CLÍNICO

    </div>

    <div class="expedienteCuerpo">

        <p style="text-align:center;font-size:24px;">

            🔍 VALIDANDO EXPEDIENTE...

        </p>

    </div>

</div>
`;

document.getElementById("resultado").innerHTML = `

<div class="resultado-ok">

    <h2>🔍 VALIDANDO EXPEDIENTE...</h2>

</div>

`;



// Esperar antes de mostrar el resultado
setTimeout(function () {

    // ===============================
    // TODO CORRECTO
    // ===============================

    if (codigoCorrecto && respuestaCorrectaOK) {

        actualizarEstadoEquipo(

            equipoEncontrado.nombre,

            "QR" + id,

            equipoEncontrado.pruebas[id].coordenada,

            equipoEncontrado.pruebas[id].codigoSalida

        );


        // Mostrar credencial

        /*document.getElementById("credencial").style.display = "block";

        document.getElementById("credencial").innerHTML = `
           
            <div class="tarjeta">

    <div class="cabecera">

        <h2>🏥 HOSPITAL PSIQUIÁTRICO</h2>

        <h2>SAN MARTÍN DE VALVENÍ</h2>

    </div>

    <div class="cuerpo">

        <p style="text-align:center;font-size:24px;font-weight:bold;">

            EXPEDIENTE RECUPERADO

        </p>

        <p>

            <b>Equipo</b>

            ${equipoEncontrado.nombre}

        </p>

        <p>

            <b>Expediente</b>

            SMV-QR${String(id).padStart(2,"0")}

        </p>

        <div class="sello">

            ✔ AUTORIZADO

        </div>

    </div>

</div>

        `;*/


        // Mostrar diagnóstico

       /* document.getElementById("resultado").innerHTML = `

            <div class="resultado-ok">

                <h2>🧠 DIAGNÓSTICO COMPLETADO</h2>

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

    }*/

        document.getElementById("expedienteResultado").innerHTML = `

<div class="expediente">

    <div class="expedienteTitulo">

        EXPEDIENTE CLÍNICO

    </div>

    <div class="expedienteCuerpo">

        <p>

            <b>Equipo</b>

            ${equipoEncontrado.nombre}

        </p>

        <p>

            <b>Expediente</b>

            SMV-QR${String(id).padStart(2,"0")}

        </p>

        <p>

            <b>Estado</b>

            AUTORIZADO

        </p>

        <div class="linea"></div>

        <div class="sello">

            ✔ AUTORIZADO

        </div>

        <div class="linea"></div>

        <p>

            <b>Destino</b>

            ${equipoEncontrado.pruebas[id].coordenada}

        </p>

        <p>

            <b>Código</b>

            ${equipoEncontrado.pruebas[id].codigoSalida}

        </p>

    </div>

</div>

`;

    // ===============================
    // ERROR
    // ===============================

    else {

        let mensajeError = "";


        if (!codigoCorrecto && !respuestaCorrectaOK) {

            mensajeError = `

                ⚠️ DIAGNÓSTICO FALLIDO

                <br><br>

                ❌ Código de acceso inválido

                <br>

                ❌ Diagnóstico incorrecto

            `;

        }

        else if (!codigoCorrecto) {

            mensajeError = `

                ⚠️ ACCESO DENEGADO

                <br><br>

                ❌ Código de acceso inválido

            `;

        }

        else {

            mensajeError = `

                ⚠️ DIAGNÓSTICO INCORRECTO

                <br><br>

                ❌ La evaluación no coincide

            `;

        }


        document.getElementById("resultado").innerHTML = `

            <div class="resultado-error">

                ${mensajeError}

            </div>

        `;

    }

}, 2000);

}

// ===============================
// ENTER EN CÓDIGO
// ===============================

document

.getElementById("codigo")

.addEventListener(

"keypress",

function(e){


    if(e.key==="Enter")

        comprobar();


}

);






// ===============================
// ENTER EN RESPUESTA
// ===============================

document

.getElementById("respuesta")

.addEventListener(

"keypress",

function(e){


    if(e.key==="Enter")

        comprobar();


}

);
