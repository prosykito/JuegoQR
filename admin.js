console.log("admin.js VERSION 1.4");

db.collection("equipos")
.onSnapshot(function(snapshot){

    let html = "";

    let lista = [];

    snapshot.forEach(function(doc){

        lista.push(doc.data());

    });

    // Ordenar por progreso (mayor a menor)
    lista.sort(function(a,b){

        return (b.progreso || 0) - (a.progreso || 0);

    });

    lista.forEach(function(equipo){

        let segundos = Math.floor(
            (Date.now() - equipo.ultimaActualizacion) / 1000
        );

        let minutos = Math.floor(segundos / 60);
        segundos %= 60;

        let color = "verde";

        if (minutos >= 10)
            color = "rojo";
        else if (minutos >= 5)
            color = "amarillo";

        html += `

        <tr>

            <td>${equipo.equipo}</td>

            <td>${equipo.progreso || 0}</td>

            //<td>${equipo.ultimaPrueba}</td>
            <td>${ubicaciones[equipo.ultimaPrueba] || equipo.ultimaPrueba}</td>

            //<td>${equipo.siguientePrueba}</td>
            <td>${ubicaciones[equipo.siguientePrueba] || equipo.siguientePrueba}</td>

            <td class="${color}">
                ${minutos}:${segundos.toString().padStart(2,"0")}
            </td>

        </tr>

        `;

    });

    document.getElementById("tablaEquipos").innerHTML = html;

});
