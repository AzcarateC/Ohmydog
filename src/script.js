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
<<<<<<< HEAD
=======
function confirm_delete(){
    if (confirm ="¿Estas seguro de eliiminar esta publicación?")
        return true;
    else{
        return false;
    }    
           
   }
   
>>>>>>> 9207451a3944fbab5da923a322937d29396e99a7
