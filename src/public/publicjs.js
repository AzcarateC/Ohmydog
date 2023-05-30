
let lista = document.getElementById("lista");


let botones = document.getElementById("botones");

let nroDePublicacion = 0;
let respuesta;
let tablas =[
    ['','Lu','Ma','Mi','Ju','Vi','Sa','Do'],
    ['Mañana','lunesManiana','martesManiana','miercolesManiana','juevesManiana','viernesManiana','sabadoManiana','domingoManiana'],
    ['Tarde','lunesTarde','martesTarde','miercolesTarde','juevesTarde','viernesTarde','sabadoTarde','domingoTarde'],
    ['Noche','lunesNoche','martesNoche','miercolesNoche','juevesNoche','viernesNoche','sabadoNoche','sabadoNoche']]

function cargarLista() 
    {
    api='http://localhost:3000/paseadores' ;
    lista.innerHTML = "";
    botones.innerHTML = "";
    fetch(api)
        .then(res => res.json())
        .then(res => 
            {
            respuesta=res;
            actualizarLista(0);
            });
}

function actualizarLista(x) 
    {
    nroDePublicacion=x;
    lista.innerHTML = "";
    botones.innerHTML = "";
    nroDePublicacion=x;
    if (respuesta.data.length == 0){
        lista.innerHTML="No existen publicaciones de paseadores";
    }else {
        for (i=nroDePublicacion;i<nroDePublicacion+10 && i<respuesta.data.length;i++){
            console.log(respuesta);
            cargarPubli(respuesta.data[i]);
        }
        botones .innerHTML += ((nroDePublicacion!==0))? `<button onclick="actualizarLista(nroDePublicacion-10)">Atrás</button>`:'';  
        botones.innerHTML += ((nroDePublicacion+10)<respuesta.data.length)?`<button onclick="actualizarLista(nroDePublicacion+10)">Siguiente</button>`:'';

    }

    }
    function cargarPubli(publicacion)
    {lista.innerHTML+= "<div id=nombre"+publicacion.id+">"+publicacion.nombre+ "</div> <div id=zona"+publicacion.id+"> " + publicacion.zonas + "</div> <div id=rating"+publicacion.id+"> Calificaciones= "+Number(publicacion.puntos/publicacion.calificaciones).toFixed(1)+"/5  ("+publicacion.calificaciones+" calificaciones) </div> <div id=descripcion"+publicacion.id+"> "+publicacion.descripcion+"</div><div id=horarios"+publicacion.id+"> Horarios=</div><div id=contacto"+publicacion.id+"><button type='button' onclick='contactar("+publicacion.id+")'id=boton"+publicacion.id+">Contactar con "+publicacion.nombre+"</button></div>";
    tablaHorarios(publicacion)
    
}
    
    function tablaHorarios(publicacion){
        let horario = document.getElementById("horarios"+publicacion.id);
        horario.innerHTML
        var tabla   = document.createElement("table");
        var tblBody = document.createElement("tbody");
            // Crea las celdas
            for (var i = 0; i < 4; i++) {
              // Crea las hileras de la tabla
              var hilera = document.createElement("tr");
          
              for (var j = 0; j < 8; j++) {
                // Crea un elemento <td> y un nodo de texto, haz que el nodo de
                // texto sea el contenido de <td>, ubica el elemento <td> al final
                // de la hilera de la tabla
                var celda = document.createElement("td");
                if (i==0||j==0){
                    var textoCelda = document.createTextNode(tablas[i][j]);
                }else{ if (publicacion[tablas[i][j]]==0){
                    var textoCelda = document.createTextNode('t');
                     }else{
                        var textoCelda = document.createTextNode('v');
                     }
                 }
                celda.appendChild(textoCelda);
                hilera.appendChild(celda);
              }
          
              // agrega la hilera al final de la tabla (al final del elemento tblbody)
              tblBody.appendChild(hilera);
            }
          
            // posiciona el <tbody> debajo del elemento <table>
            tabla.appendChild(tblBody);
            // appends <table> into <body>
            horario.appendChild(tabla);
            // modifica el atributo "border" de la tabla y lo fija a "2";
            tabla.setAttribute("border", "2");
          }
function contactar(id){
    contacto = document.getElementById("contacto"+id);
    contacto.innerHTML = "";
    form= document.createElement("div");
    var tel = document.createElement("input");
    tel.setAttribute("type", "int");
    tel.setAttribute("id", "telefono"+id);
    tel.setAttribute("placeholder", "Ingrese su telefono");
    var nombre = document.createElement("input");
    nombre.setAttribute("type", "text");
    nombre.setAttribute("id", "nombreSolicitud"+id);
    nombre.setAttribute("placeholder", "Ingrese su nombre");
    var s = document.createElement("button");
    s.setAttribute("type", "button");
    s.setAttribute('id','boton'+id);
    s.setAttribute('onClick',"solicitarContacto("+id+")")
    s.innerHTML='solicitar contacto'
    

    // Append the nombre to the form
    form.appendChild(nombre);
     
    // Append the tel to the form
    form.appendChild(tel);
     
    // Append the boton  to the form
    form.appendChild(s);

    document.getElementById("contacto"+id).appendChild(form);
   }

   function solicitarContacto(id){
    telefono = document.getElementById("telefono"+id).value;
    if(Number.isInteger(Number(telefono))){
        nombre = document.getElementById("nombreSolicitud"+id).value;
    const options={
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },

        body:JSON.stringify({'telefono': telefono, 'nombre': nombre, 'id': id})
    };
    fetch('http://localhost:3000/solicitud',options)
        .then(res =>res.json())
        .then(solicitudExitosa(id))
    }else{
        alert("Ingrese un numero de telefono valido(solo números, sin caracteres especiales)")
    }
    

   }
function  solicitudExitosa(id){
    contacto = document.getElementById("contacto"+id);
    contacto.innerHTML = "Su solicitud de contacto ha sido realizada con exito";

}
function cambiarPagina(pagina){
    let url = new URL(window.location);
    pagina = parseInt(pagina)
    url.searchParams.set("pagina",pagina );
    console.log(url)
    location.href = url.href;
}
botonOrdenar();
function botonOrdenar(){
    let url = new URL(window.location);
    if(url.searchParams.get("orderBy" )=='rating'){
        document.getElementById('botonOrdenar').setAttribute('onclick',"ordenarPor('asd')")
        document.getElementById('botonOrdenar').innerHTML='Ordenar por fecha de publicación'

    }

}
function ordenarPor(criterio){
    let url = new URL(window.location);
    if(criterio=='rating'){
        url.searchParams.set("orderBy",criterio );
    }else{
        url.searchParams.delete("orderBy" ); 
    }
    location.href = url.href;
    
}


function calificar(id){
    calificacion = document.getElementById("calificacion"+id).value;
    if(calificacion==0||calificacion==1||calificacion==2||calificacion==3||calificacion==5||calificacion==4){
        const options={
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
    
            body:JSON.stringify({'id': id, 'calificacion': calificacion})
        };
        fetch('http://localhost:3000/calificarPaseador',options)
            .then(res =>res.json())
            .then(calificacionExitosa(id))
    }else{
        alert("Ingrese un numero del 0 al 5")
    }


   }
   function  calificacionExitosa(id){
    contacto = document.getElementById("calificar"+id);
    contacto.innerHTML = "Calificacion realizada";

}
function eliminar(id,nombre){
    confirma=window.confirm("Desea eliminar la publicacion del paseador"+nombre);
    if (confirma) {
        const options={
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
    
            body:JSON.stringify({'id': id})
        };
        fetch('http://localhost:3000/eliminarPaseador',options)
            .then(alert('publicacion borrada'))
            .then(location.href = window.location)

        
      }
   }

   function eliminarSolicitud(id, telefono){
    confirma=window.confirm("Desea eliminar la solicitud");
    if (confirma) {
        const options={
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
    
            body:JSON.stringify({'id': id,'telefono':telefono})
        };
        fetch('http://localhost:3000/eliminarSolicitudes',options)
            .then(alert('publicacion borrada'))
          //  .then(location.href = window.location)

        
      }
   }