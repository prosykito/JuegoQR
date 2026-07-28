console.log("TESTADMIN VERSION 1.0");

db.collection("testConexion")
.orderBy("fecha", "desc")
.onSnapshot(function(snapshot){

    let html = "";

    snapshot.forEach(function(doc){

        let datos = doc.data();

        let fecha = new Date(datos.fecha);

        html += `

        <tr>

            <td>${datos.equipo}</td>

            <td>${fecha.toLocaleString("es-ES")}</td>

        </tr>

        `;

    });

    document.getElementById("tabla").innerHTML = html;

});
