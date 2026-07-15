// ======================================
// Calcula las pruebas completadas
// ======================================

function calcularPruebasCompletadas(nombreEquipo, siguientePrueba) {

    const equipo = equipos[nombreEquipo.toLowerCase().replace(" ", "")];

    if (!equipo)
        return 0;

    let contador = 0;

    // Recorremos las pruebas en orden
    for (let i = 1; i <= 9; i++) {

        const prueba = equipo.pruebas[i];

        // Si el siguiente destino es esta coordenada,
        // significa que ya ha completado las anteriores.
        if (prueba.coordenada === siguientePrueba)
            return contador;

        contador++;
    }

    // Si ya va al FINAL significa que ha completado las 9 QR
    if (siguientePrueba === "FINAL")
        return 9;

    return contador;

}



// ======================================
// Escuchar Firebase
// ======================================

db.collection("equipos")
.onSnapshot(function(snapshot){

    let listaEquipos = [];

    snapshot.forEach(function(doc){

        let equipo = doc.data();

        equipo.pruebasCompletadas = calcularPruebasCompletadas(
            equipo.equipo,
            equipo.siguientePrueba
        );

        listaEquipos.push(equipo);

    });



    // ======================================
    // Ordenar por pruebas completadas
    // ======================================

    listaEquipos.sort(function(a,b){

        if (b.pruebasCompletadas !== a.pruebasCompletadas)
            return b.pruebasCompletadas - a.pruebasCompletadas;

        return a.ultimaActualizacion - b.ultimaActualizacion;

    });



    // ======================================
    // Dibujar tabla
    // ======================================

    let html = "";

    listaEquipos.forEach(function(equipo){

        let segundos = Math.floor(
            (Date.now() - equipo.ultimaActualizacion) / 1000
        );

        let minutos = Math.floor(segundos / 60);

        segundos %= 60;

        let color = "verde";

        if(minutos >= 10)
            color = "rojo";
        else if(minutos >=5)
            color = "amarillo";


        html += `

        <tr>

            <td>${equipo.equipo}</td>

            <td>${equipo.pruebasCompletadas}</td>

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
