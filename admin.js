db.collection("equipos")
.onSnapshot(function(snapshot){

    let html = "";

    snapshot.forEach(function(doc){

        let equipo = doc.data();

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

            <td>QR${equipo.ultimaPrueba}</td>

            <td>${equipo.siguientePrueba}</td>

            <td class="${color}">
                ${minutos}:${segundos.toString().padStart(2,"0")}
            </td>

        </tr>

        `;

    });

    document.getElementById("tablaEquipos").innerHTML = html;

});
