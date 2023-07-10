function Confirmar(){
    var retVal = confirm("¿Seguro desea eliminar?");
    if( retVal == true ){
        alert ("Publicacion elminada");
        return true;
    }else{
        alert ("No se elimino la publicacion");
        return false;
    }
}

function Confirmar_adoptar(){
    var retVal = confirm("Se va a dar por terminada la publicacion de adopcion");
    if( retVal == true ){
        alert ("Publicacion cancelada");
        return true;
    }else{
        alert ("No se cancelo la publicacion");
        return false;
    }
}


