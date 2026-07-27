// ===============================
// Obtener la pregunta de la URL
// ===============================
console.log("script.js VERSION 1.5");
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

// ======================================
// Orden de las pruebas según el mapa
// ======================================

const progresoMapa = {

    1: {
        QR1:1,
        QR2:2,
        QR3:3,
        GRANDE1:4,
        QR4:5,
        QR5:6,
        QR6:7,
        GRANDE2:8,
        QR7:9,
        QR8:10,
        QR9:11,
        GRANDE3:12,
        FINAL:13
    },

    2: {
        QR2:1,
        QR3:2,
        GRANDE1:3,
        QR1:4,
        QR5:5,
        QR6:6,
        GRANDE2:7,
        QR4:8,
        QR8:9,
        QR9:10,
        GRANDE3:11,
        QR7:12,
        FINAL:13
    },

    3: {
        QR3:1,
        GRANDE1:2,
        QR1:3,
        QR2:4,
        QR6:5,
        GRANDE2:6,
        QR4:7,
        QR5:8,
        QR9:9,
        GRANDE3:10,
        QR7:11,
        QR8:12,
        FINAL:13
    },

    4: {
        GRANDE1:1,
        QR1:2,
        QR2:3,
        QR3:4,
        GRANDE2:5,
        QR4:6,
        QR5:7,
        QR6:8,
        GRANDE3:9,
        QR7:10,
        QR8:11,
        QR9:12,
        FINAL:13
    }

};


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

    let equipoEncontrado = null;

    // Buscar equipo
    for(const equipo of Object.values(equipos)){

        if(!equipo.pruebas[id])
            continue;

        if(
            normalizar(
                equipo.pruebas[id].codigoEntrada
            ) === codigoUsuario
        ){
            equipoEncontrado = equipo;
            break;
        }

    }

    let respuestaCorrecta =
        normalizar(datos.respuesta);

    let codigoCorrecto = equipoEncontrado != null;

    let respuestaCorrectaOK =
        respuestaUsuario === respuestaCorrecta;


    // ===============================
    // VALIDANDO...
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


    // ===============================
    // ESPERAR 2 SEGUNDOS
    // ===============================

    setTimeout(function(){

        // ===============================
        // CORRECTO
        // ===============================

        if(codigoCorrecto && respuestaCorrectaOK){

            actualizarEstadoEquipo(

                equipoEncontrado.nombre,

                "QR"+id,

                equipoEncontrado.pruebas[id].coordenada,

                equipoEncontrado.pruebas[id].codigoSalida

            );


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

        }

        // ===============================
        // ERROR
        // ===============================

        else{

            let mensajeError="";

            if(!codigoCorrecto && !respuestaCorrectaOK){

                mensajeError=`

                ⚠️ DIAGNÓSTICO FALLIDO

                <br><br>

                ❌ Código de acceso inválido

                <br>

                ❌ El diagnóstico no es correcto

                `;

            }

            else if(!codigoCorrecto){

                mensajeError=`

                ⚠️ ACCESO DENEGADO

                <br><br>

                ❌ Código de acceso inválido

                `;

            }

            else{

                mensajeError=`

                ⚠️ DIAGNÓSTICO INCORRECTO

                <br><br>

                ❌ El diagnóstico no es correcto

                `;

            }


            document.getElementById("expedienteResultado").innerHTML = `

            <div class="expediente">

                <div class="expedienteTitulo">

                    EXPEDIENTE CLÍNICO

                </div>

                <div class="expedienteCuerpo">

                    <p>

                        <b>Estado</b>

                        DENEGADO

                    </p>

                    <div class="linea"></div>

                    <div class="sello" style="border-color:#cc4444;color:#cc4444;">

                        ✖ DENEGADO

                    </div>

                    <div class="linea"></div>

                    <p style="text-align:center;">

                        ${mensajeError}

                    </p>

                </div>

            </div>

            `;

        }

    },2000);

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
