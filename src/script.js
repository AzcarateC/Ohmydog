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
function confirm_delete(){
    if (confirm ="¿Estas seguro de eliiminar esta publicación?")
        return true;
    else{
        return false;
    }    
           
   }
   
