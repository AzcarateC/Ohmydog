function Confirmar(){
    var retVal = confirm("¿Seguro desea eliminar?");
    if( retVal == true ){
        document.write ("Publicacion elminada");
        return true;
    }else{
        document.write ("No se elimino la publicacion");
        return false;
    }
}