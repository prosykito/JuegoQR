/*function calcularPruebasCompletadas(nombreEquipo, siguientePrueba) {

    let equipo = null;

    // Buscar el equipo por su nombre
    for (const datos of Object.values(equipos)) {

        if (datos.nombre === nombreEquipo) {

            equipo = datos;
            break;

        }

    }

    if (!equipo)
        return 0;

    let contador = 0;

    for (let i = 1; i <= 9; i++) {

        const prueba = equipo.pruebas[i];

        if (prueba.coordenada === siguientePrueba)
            return contador;

        contador++;

    }

    if (siguientePrueba === "FINAL")
        return 9;

    return contador;

}*/

function calcularPruebasCompletadas(nombreEquipo, siguientePrueba) {

    console.log("Buscando:", nombreEquipo);
    console.log("Siguiente:", siguientePrueba);

    for (const [clave, datos] of Object.entries(equipos)) {

        console.log(clave, datos.nombre);

        if (datos.nombre === nombreEquipo) {

            console.log("¡¡ENCONTRADO!!");

            let contador = 0;

            for (let i = 1; i <= 9; i++) {

                console.log(
                    "Prueba",
                    i,
                    "->",
                    datos.pruebas[i].coordenada
                );

                if (datos.pruebas[i].coordenada === siguientePrueba)
                    return contador;

                contador++;

            }

        }

    }

    return 0;

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
