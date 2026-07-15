// ===============================
// Inicializar Firebase
// ===============================

const firebaseConfig = {

    apiKey: "AIzaSyDt4Y6mGL2nbUFNUTMpOP6cxyRnr3s2M2o",
    authDomain: "gymkana-5b9f5.firebaseapp.com",
    projectId: "gymkana-5b9f5",
    storageBucket: "gymkana-5b9f5.firebasestorage.app",
    messagingSenderId: "131301441295",
    appId: "1:131301441295:web:1be4f934c78cfc3c29087a"

};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

db.collection("test").doc("conexion").set({

    estado: "OK",

    fecha: Date.now()

});


/*// =====================================
// Actualizar estado del equipo
// =====================================

async function actualizarEstadoEquipo(

    nombreEquipo,
    ultimaPrueba,
    siguientePrueba,
    codigoSiguiente

) {

    await db
        .collection("equipos")
        .doc(nombreEquipo)
        .set({

            equipo: nombreEquipo,

            ultimaPrueba: ultimaPrueba,
            siguientePrueba: siguientePrueba,
            codigoSiguiente: codigoSiguiente,

            ultimaActualizacion: Date.now()

        });

}
// =====================================
// Actualizar estado del equipo
// =====================================

async function actualizarEstadoEquipo(

    nombreEquipo,
    ultimaPrueba,
    siguientePrueba,
    codigoSiguiente

) {

    await db
        .collection("equipos")
        .doc(nombreEquipo)
        .set({

            equipo: nombreEquipo,

            ultimaPrueba: ultimaPrueba,
            siguientePrueba: siguientePrueba,
            codigoSiguiente: codigoSiguiente,

            progreso: firebase.firestore.FieldValue.increment(1),

            ultimaActualizacion: Date.now()

        },
        {
            merge:true
        });

}*/
// =====================================
// Actualizar estado del equipo
// =====================================

async function actualizarEstadoEquipo(

    nombreEquipo,
    ultimaPrueba,
    siguientePrueba,
    codigoSiguiente

) {

    const ref = db.collection("equipos").doc(nombreEquipo);

    const documento = await ref.get();

    let datos = {

        equipo: nombreEquipo,

        ultimaPrueba: ultimaPrueba,
        siguientePrueba: siguientePrueba,
        codigoSiguiente: codigoSiguiente,

        ultimaActualizacion: Date.now()

    };

    // Si ya existe el documento
    if (documento.exists) {

        let actual = documento.data();

        // Solo incrementamos si realmente ha avanzado
        if (actual.ultimaPrueba !== ultimaPrueba) {

            datos.progreso =
                firebase.firestore.FieldValue.increment(1);

        }

    }
    else {

        // Primer registro del equipo
        datos.progreso = 1;

    }

    await ref.set(datos, { merge: true });

}
async function reiniciarGymkana(){

    let snapshot = await db.collection("equipos").get();

    snapshot.forEach(async function(doc){

        await doc.ref.delete();

    });

}
