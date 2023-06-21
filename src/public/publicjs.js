function contactar(id,lista) {
    contacto = document.getElementById("contacto" + id+lista);
    contacto.innerHTML = "";
    console.log('contactar')
    form = document.createElement("div");
    var tel = document.createElement("input");
    tel.setAttribute("type", "int");
    tel.setAttribute("id", "telefono" + id+lista);
    tel.setAttribute("placeholder", "Ingrese su telefono");
    var nombre = document.createElement("input");
    nombre.setAttribute("type", "text");
    nombre.setAttribute("id", "nombreSolicitud" + id+lista);
    nombre.setAttribute("placeholder", "Ingrese su nombre");
    var s = document.createElement("button");
    s.setAttribute("type", "button");
    s.setAttribute('id', 'boton' + id+lista);
    s.setAttribute('class',"btn btn-info-orange")
    s.setAttribute('onClick', "solicitarContacto(" + id+','+"'"+lista+"')")
    s.innerHTML = 'Contactar'


    // Append the nombre to the form
    form.appendChild(nombre);

    // Append the tel to the form
    form.appendChild(tel);

    // Append the boton  to the form
    form.appendChild(s);

    document.getElementById("contacto" + id+lista).appendChild(form);
}

function solicitarContacto(id,lista) {
    telefono = document.getElementById("telefono" + id+lista).value;
    if (Number.isInteger(Number(telefono))) {
        nombre = document.getElementById("nombreSolicitud" + id+lista).value;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({ 'telefono': telefono, 'nombre': nombre, 'id': id })
        };
        fetch('http://localhost:3000/solicitud', options)
            .then(res => {
                if (res.error) throw (res.mensaje);
                return res;
            })
            .then(res => res.json())
            .then(res => solicitudExitosa(id,lista, res))
    } else {
        alert("Ingrese un numero de telefono valido(solo números, sin caracteres especiales)")
    }


}
function solicitudExitosa(id,lista, res) {
    console.log("asd")
    if (res.errno && res.errno == 1062) {
        mensaje = "Ya existe una solicitud registrada en el sistema con ese número de teléfono"
    } else {
        if (res.affectedRows = 1) { mensaje = "Su solicitud de contacto ha sido realizada con exito" }
        else { mensaje = "Fallo al procesar la solicitudExitosa, intente nuevamente mas tarde." }
    }
    contacto = document.getElementById("mensaje" + id+lista);
    contacto.innerHTML = mensaje;

}
function calificar(id,lista) {
    calificacion = document.getElementById("calificacion"+id+lista).value;
    if (calificacion!=="" && calificacion == 0 || calificacion == 1 || calificacion == 2 || calificacion == 3 || calificacion == 5 || calificacion == 4) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({ 'id': id, 'calificacion': calificacion })
        };
        fetch('http://localhost:3000/calificarPaseador', options)
            .then(res => res.json())
            .then(calificacionExitosa(id,lista))
    } else {
        alert("Ingrese un numero del 0 al 5")
    }
}
function calificacionExitosa(id,lista) {
    contacto = document.getElementById("calificar" + id+lista);
    contacto.innerHTML = "Calificacion realizada";

}
function eliminar(id, nombre) {
    confirma = window.confirm("Desea eliminar la publicacion del paseador" + nombre);
    if (confirma) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({ 'id': id })
        };
        fetch('http://localhost:3000/eliminarPaseador', options)
            .then(alert('publicacion borrada'))
            .then(location.href = window.location)


    }
}

function eliminarSolicitud(id, telefono) {
    confirma = window.confirm("Desea eliminar la solicitud");
    if (confirma) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({ 'id': id, 'telefono': telefono })
        };
        fetch('http://localhost:3000/eliminarSolicitudes', options)
            .then(alert('solicitud borrada'))
              .then(location.href = window.location)


    }
}
lista = 'paseadores';
orden = 'recientes';
function cambiarLista(criterioNuevo) {
    switch (criterioNuevo) {
        case 'recientes':
            orden = criterioNuevo;
            console.log('asd');
            if (lista == 'paseadores') { listarPaseadoresRecientes() }
            else { listarCuidadoresRecientes() }
            break;

        case 'rating':
            console.log('asd');
            orden = criterioNuevo;
            if (lista == 'cuidadores') { listarCuidadoresPorRating() }
            else { listarPaseadoresPorRating() }
            break;

        case 'paseadores':
            lista = criterioNuevo;
            if (orden == 'rating') { listarPaseadoresPorRating() }
            else { listarPaseadoresRecientes() }
            break;
        case 'cuidadores':
            lista = criterioNuevo;
            if (orden == 'rating') { listarCuidadoresPorRating() }
            else { listarCuidadoresRecientes() }
            break;

    }
}
function listarPaseadoresPorRating() {
    document.getElementById("listaPaseadoresRating").style.display = "block";
    document.getElementById("listaCuidadoresRating").style.display = "none";
    document.getElementById("listaPaseadoresRecientes").style.display = "none";
    document.getElementById("listaCuidadoresRecientes").style.display = "none";
}
function listarCuidadoresPorRating() {
    document.getElementById("listaPaseadoresRating").style.display = "none";
    document.getElementById("listaCuidadoresRating").style.display = "block";
    document.getElementById("listaPaseadoresRecientes").style.display = "none";
    document.getElementById("listaCuidadoresRecientes").style.display = "none";

}
function listarCuidadoresRecientes() {
    document.getElementById("listaPaseadoresRating").style.display = "none";
    document.getElementById("listaCuidadoresRating").style.display = "none";
    document.getElementById("listaPaseadoresRecientes").style.display = "none";
    document.getElementById("listaCuidadoresRecientes").style.display = "block";
}
function listarPaseadoresRecientes() {
    document.getElementById("listaPaseadoresRating").style.display = "none";
    document.getElementById("listaCuidadoresRating").style.display = "none";
    document.getElementById("listaPaseadoresRecientes").style.display = "block";
    document.getElementById("listaCuidadoresRecientes").style.display = "none";
}
function checkAlert(evt) {
    switch (evt.target.value) {
        case "Paseadores":
            cambiarLista('paseadores');
            break;
        case "Cuidadores":
            cambiarLista('cuidadores');
            break;

        case "Mas recientes":
            cambiarLista('recientes');
            break;

        case "Mejores calificaciones":
            cambiarLista('rating');
            break;
    }
}
function checkPerros(evt) {
    switch (evt.target.value) {
        case "Perros perdidos":
            document.getElementById("listaPerdidos").style.display = "block";
            document.getElementById("listaEncontrados").style.display = "none";
            break;
        case "Perros encontrados":
            document.getElementById("listaPerdidos").style.display = "none";
            document.getElementById("listaEncontrados").style.display = "block";
            break
    }
}
function eliminarPerroPerdido(id){
    confirma = window.confirm("Desea eliminar la publicacion");
    if (confirma) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({ 'id': id })
        };
        fetch('http://localhost:3000/eliminarPerroPerdido', options)
            .then(alert('publicacion borrada'))
            .then(location.href = window.location)
    }
}