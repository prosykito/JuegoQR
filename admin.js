// ==========================================
// Calcula cuántas pruebas lleva completadas
// ==========================================

function calcularPruebasCompletadas(datosEquipo, siguientePrueba) {

    let recorrido = [];

    // Construir el recorrido completo del equipo
    let actual = 1;

    while (true) {

        let prueba = datosEquipo.pruebas[actual];

        if (!prueba)
            break;

        recorrido.push(prueba.coordenada);

        actual++;

    }

    // Buscar hacia dónde se dirige
    let posicion = recorrido.indexOf(siguientePrueba);

    if (posicion === -1)
        return recorrido.length;

    return posicion;

}



// ==========================================
// Escuchar cambios en tiempo real
// ==========================================

db.collection("equipos")
.onSnapshot(function(snapshot){

    let listaEquipos = [];

    snapshot.forEach(function(doc){

        let equipo = doc.data();

        // Obtener el objeto del equipo desde equipos.js
        let claveEquipo = equipo.equipo
            .toLowerCase()
            .replace(" ", "");

        let datosEquipo = equipos[claveEquipo];

        let completadas = 0;

        if (datosEquipo) {

            completadas = calcularPruebasCompletadas(

                datosEquipo,
                equipo.siguientePrueba

            );

        }

        equipo.completadas = completadas;

        listaEquipos.push(equipo);

    });



    // ==========================================
    // Ordenar por pruebas completadas
    // ==========================================

    listaEquipos.sort(function(a,b){

        if (b.completadas !== a.completadas)
            return b.completadas - a.completadas;

        return a.ultimaActualizacion - b.ultimaActualizacion;

    });




    // ==========================================
    // Generar tabla
    // ==========================================

    let html = "";

    listaEquipos.forEach(function(equipo){

        let segundos = Math.floor(

            (Date.now() - equipo.ultimaActualizacion) / 1000

        );

        let minutos = Math.floor(segundos / 60);

        segundos = segundos % 60;

        let color = "verde";

        if (minutos >= 10)
            color = "rojo";

        else if (minutos >= 5)
            color = "amarillo";


        html += `

        <tr>

            <td>${equipo.equipo}</td>

            <td>${equipo.completadas}</td>

            <td>${equipo.ultimaPrueba}</td>

            <td>${equipo.siguientePrueba}</td>

            <td class="${color}">
                ${minutos}:${segundos.toString().padStart(2,"0")}
            </td>

        </tr>

        `;

    });

    document.getElementById("tablaEquipos").innerHTML = html;

});



// ==========================================
// Actualizar el tiempo cada segundo
// ==========================================

setInterval(function(){

    db.collection("equipos").get();

},1000);
