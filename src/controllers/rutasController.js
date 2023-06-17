const { DATE } = require("mysql/lib/protocol/constants/types")

const controller = {}

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        msj = ""
        conn.query('SELECT * FROM clientes', (err, rows) => {
            if (err) {
                res.json(err)
            }
            res.render('vistaContainer', {
                data: rows, msj
            });
        })
    })
}
controller.misDatos = (req,res) => {
    req.getConnection((err,conn)=> {
        const user = req.session.mi_sesion
        conn.query('SELECT * FROM clientes WHERE email = ?',[user[0].email],(err,rows)=>{
            res.render('verInforPersonal',{
                rows,user
            });
        })
    })
}
controller.listarClientes = (req,res)=>{
    req.getConnection((err,conn)=>{
        msj=""
        user =req.session.mi_sesion
        conn.query('SELECT * FROM clientes',(err,clientes)=>{
            if(err){
                res.json(err)
            }
            console.log(clientes)
            res.render('listaClientes',{
                data1:clientes,user
            });
        })
    })
}
controller.PagePublicaciones = (req,res)=>{
    req.getConnection((err,conn)=>{
        user = req.session.mi_sesion
            res.render('publicaciones',{
               user
            });
        
    })
}

controller.UserPublics = (req,res) => {
    const user = req.session.mi_sesion
    const email = user[0].email
    console.log(email)
    req.getConnection((err,conn)=>{
        conn.query('SELECT * FROM perrosenadopcion WHERE perrosenadopcion.cliente = ? ',[email],(err,rows)=>{
            res.render('misPublics',{
                data:rows,user: user 
            });
        })
    })
}


controller.verTurnos = (req,res)=>{
    req.getConnection((err,conn)=>{
        msj=""
        conn.query('SELECT * FROM turnos',(err,clientes)=>{
            if(err){
                res.json(err)
            }
            res.render('turnos',{
                data:turnos,user
            });
        })
    })
}
controller.calendarioTurnos = (req,res)=>{
    req.getConnection((err,conn)=>{
        msj=""
        conn.query('SELECT * FROM turnos',(err,data)=>{
            if(err){
                res.json(err)
            }
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth();
            const currentYear = currentDate.getFullYear();
            const daysInMonth = new Date(currentYear, currentMonth , 0).getDate();
            // Crear el vector "conteoDias" con valores iniciales en cero
            const conteoDias = new Array(daysInMonth).fill(0);
          
            // Recorrer el vector "data" y actualizar el conteo de días
            for (const date of data) {
              if (date.dia.getMonth() === currentMonth && date.dia.getFullYear() === currentYear) {
                const day = date.dia.getDate();
                conteoDias[day] = conteoDias[day] + 1;
              }
            }
            res.render('calendarioTurnos',{
                data1:conteoDias,user,mesActual:currentMonth
            });
        })
    })
}
controller.verturnosdiax = (req,res) => {
    const dia = req.body.dia
    console.log(dia)
    const fechaActual = new Date();
    const añoActual = fechaActual.getFullYear();
    const mesActual = fechaActual.getMonth();
    const date = new Date(añoActual, mesActual, dia)

    const year = date.getFullYear();
    const month = String(date.getMonth()+1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const fechaFinal = `${year}-${month}-${day}`;
    console.log(fechaFinal)
    const user = req.session.mi_sesion
    req.getConnection((err,conn)=> {
        conn.query('SELECT * FROM turnos WHERE dia = ?',[fechaFinal],(err,rows)=>{
            res.render('turnos',{
                data: rows, user
            })
        })
    })
}





controller.listarPaseadores = (req, res) => {
    var user= req.session.mi_sesion
    orderBy = req.query.orderBy;
    pagina = parseInt(req.query.pagina);
    if (!(Number(pagina) > 0)) {
        pagina = 1;
    }
    var sql = 'SELECT * FROM paseadores ORDER BY id DESC LIMIT ? ,10;'
    if (orderBy == 'rating') {
        sql = 'SELECT * FROM paseadores ORDER BY puntos/calificaciones DESC LIMIT ? ,10;';
    }
    sql += 'SELECT COUNT(id) AS x FROM paseadores  WHERE id<(SELECT id FROM paseadores  LIMIT ? ,1 );'
    sql += 'SELECT COUNT(id) AS x FROM paseadores  WHERE id>(SELECT id FROM paseadores  LIMIT ? ,1 )'
    primero = ((pagina - 1) * 10);
    ultimo = ((pagina) * 10 - 1);
    req.getConnection((err, conn) => {
        conn.query(sql, [primero, primero, ultimo], (err, rows) => {
            if (err) {
                res.json(err)
            }
            var previo = -1;
            if (rows[1][0].x > 0) {
                previo = Number(pagina) - 1;
            }
            var siguiente = -1;
            if (rows[2][0].x > 0) {
                siguiente = Number(pagina) + 1;
            }
            res.render('listaPaseadores', {
                data: rows[0],
                previo: previo,
                siguiente: siguiente,
                user : user
            });
        })
    })
}
controller.listarSolicitudes = (req, res) => {
    // var sql = "SELECT s.nombre as nombre, telefono,p.nombre as nombrePaseador, p.id as id FROM `solicitudescontacto` s INNER JOIN `paseadores` p ON s.idPaseador=p.id;"
    // req.getConnection((err, conn) => {
    //     conn.query(sql, (err, rows) => {
    //         if (err) {
    //             res.json(err)
    //         }
    //         console.log(rows);
    //         res.render('listaSolicitudes', {
    //             data: rows
    //         });

    //     })
    // })
    var user= req.session.mi_sesion
    if ((!user) || (user.esAdmin==1)){
        res.redirect('/')
    }else{
        var sql = "SELECT s.nombre as nombre, telefono,p.nombre as nombrePaseador, p.id as id FROM `solicitudescontacto` s INNER JOIN `paseadores` p ON s.idPaseador=p.id;"
        req.getConnection((err, conn) => {
            conn.query(sql, (err, rows) => {
                if (err) {
                    res.json(err)
                } 
                res.render('listaSolicitudes', {
                    data: rows,
                       user:user,
                });
            })
        })
    }

}
 
 controller.solicitarVentanaTurno = (req,res) => {
     req.getConnection((err,conn)=>{
         user = req.session.mi_sesion
         conn.query('SELECT * FROM solicitudesturno WHERE solicitudesturno.usuario = ?',[user[0].email],(err,rows)=>{
            if(rows.length != 0 ){              
              var data = rows
              res.render('miSolicitud',{user,data})
             console.log(rows)
            }
            else{
            res.render('solicitarTurno',{
                user})
            }
        })
     })
 }

 controller.verSolicitudesTurnoVentana = (req,res) => {
     req.getConnection((err,conn)=>{
         user = req.session.mi_sesion
         conn.query('SELECT * FROM solicitudesturno',(err,rows)=>{
             if(err){
                 res.json(err)
             }
             res.render('verSolicitudesTurnos',{
                 data:rows,user
             });
         })
     })
 }
 
 controller.darTurnos = (req, res) => {
     req.getConnection((err, conn) => {
         user=req.session.mi_sesion
         usuario=" "
         servicio=" "
         tipo=" "            
         res.render('darTurno',{
             user,usuario,servicio,tipo
         });
     })
 }


 
  
 
 controller.Turnos= (req, res) => {
     req.getConnection((err,conn)=>{
         msj=""
         user =req.session.mi_sesion
         conn.query('SELECT * FROM turnos',(err,rows)=>{
             if(err){
                 res.json(err)
             }
             res.render('turnos',{                 
                 data: rows,user
             });
         })
     })
 }
 
 controller.misTurnos= (req, res) => {
     req.getConnection((err,conn)=>{
         user = req.session.mi_sesion
         email = user[0].email
         conn.query('SELECT * FROM turnos WHERE paciente = ?',[email],(err,rows)=>{
             res.render('misTurnos',{
                 data:rows,user           
             });
         })
     })
 }



controller.eliminarSolicitud = (req, res) => {
    req.getConnection((err, conn) => {

        var id = req.body.id;
        var telefono = req.body.telefono;
        var sql = "DELETE FROM `solicitudescontacto` WHERE idPaseador= ? AND telefono= ? "
        conn.query(sql, [id, telefono], (err, rows) => {
            console.log(rows)
            if (err) {
                res.json(err)
            }
            res.send(rows)
        })
    })
}
controller.solicitarPaseador = (req, res) => {
    req.getConnection((err, conn) => {
        var nombre = req.body.nombre
        var telefono = req.body.telefono
        var id = req.body.id

        var sql = "INSERT INTO `solicitudescontacto` (`telefono`, `idPaseador`, `nombre`) VALUES (?, ?, ?) "
        conn.query(sql, [telefono, id, nombre], (err, rows) => {
            if (err) {
                res.send(err)
            }
            res.send(rows)
        })
    })


}
controller.eliminarPaseador = (req, res) => {
    req.getConnection((err, conn) => {
        var id = req.body.id;
        var sql = "DELETE FROM `paseadores` WHERE id= ? "
        conn.query(sql, [id], (err, rows) => {
            if (err) {
                res.json(err)
            }
            res.send(rows)
        })
    })
}
controller.agregarPaseador = (req, res) => {
    req.getConnection((err, conn) => {
        var nombre = req.body.nombre;
        var descripcion = req.body.descripcion;
        var zonas = req.body.zonas;
        var lunesManiana = req.body.lunesManiana ? 1 : 0;
        console.log(lunesManiana);
        var martesManiana = req.body.martesManiana ? 1 : 0;
        var miercolesManiana = req.body.miercolesManiana ? 1 : 0;
        var juevesManiana = req.body.juevesManiana ? 1 : 0;
        var viernesManiana = req.body.viernesManiana ? 1 : 0;
        var sabadoManiana = req.body.sabadoManiana ? 1 : 0;
        var domingoManiana = req.body.domingoManiana ? 1 : 0;
        var lunesTarde = req.body.lunesTarde ? 1 : 0;
        var martesTarde = req.body.martesTarde ? 1 : 0;
        var miercolesTarde = req.body.miercolesTarde ? 1 : 0;
        var juevesTarde = req.body.juevesTarde ? 1 : 0;
        var viernesTarde = req.body.viernesTarde ? 1 : 0;
        var sabadoTarde = req.body.sabadoTarde ? 1 : 0;
        var domingoTarde = req.body.domingoTarde ? 1 : 0;
        var lunesNoche = req.body.lunesNoche ? 1 : 0;
        var martesNoche = req.body.martesNoche ? 1 : 0;
        var miercolesNoche = req.body.miercolesNoche ? 1 : 0;
        var juevesNoche = req.body.juevesNoche ? 1 : 0;
        var viernesNoche = req.body.viernesNoche ? 1 : 0;
        var sabadoNoche = req.body.sabadoNoche ? 1 : 0;
        var domingoNoche = req.body.domingoNoche ? 1 : 0;
        var sql = 'INSERT INTO `paseadores`(`nombre`, `descripcion`, `zonas`, `lunesManiana`, `lunesTarde`, `lunesNoche`, `martesManiana`, `martesTarde`, `martesNoche`, `miercolesManiana`, `miercolesTarde`, `miercolesNoche`, `juevesManiana`, `juevesTarde`, `juevesNoche`, `viernesManiana`, `viernesTarde`, `viernesNoche`, `sabadoManiana`, `sabadoTarde`, `sabadoNoche`, `domingoManiana`, `domingoTarde`, `domingoNoche`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
        conn.query(sql, [nombre, descripcion, zonas, lunesManiana, lunesTarde, lunesNoche, martesManiana, martesTarde, martesNoche, miercolesManiana, miercolesTarde, miercolesNoche, juevesManiana, juevesTarde, juevesNoche, viernesManiana, viernesTarde, viernesNoche, sabadoManiana, sabadoTarde, sabadoNoche, domingoManiana, domingoTarde, domingoNoche], (err, rows) => {
            if (err) {
                res.json(err)
            }
            res.redirect('/paseadores')
        })
    })
}
controller.modificarPaseador = (req, res) => {
    var id = req.query.id
    var nombre = req.body.nombre;
    var descripcion = req.body.descripcion;
    var zonas = req.body.zonas;
    var lunesManiana = req.body.lunesManiana ? 1 : 0;
    var martesManiana = req.body.martesManiana ? 1 : 0;
    var miercolesManiana = req.body.miercolesManiana ? 1 : 0;
    var juevesManiana = req.body.juevesManiana ? 1 : 0;
    var viernesManiana = req.body.viernesManiana ? 1 : 0;
    var sabadoManiana = req.body.sabadoManiana ? 1 : 0;
    var domingoManiana = req.body.domingoManiana ? 1 : 0;
    var lunesTarde = req.body.lunesTarde ? 1 : 0;
    var martesTarde = req.body.martesTarde ? 1 : 0;
    var miercolesTarde = req.body.miercolesTarde ? 1 : 0;
    var juevesTarde = req.body.juevesTarde ? 1 : 0;
    var viernesTarde = req.body.viernesTarde ? 1 : 0;
    var sabadoTarde = req.body.sabadoTarde ? 1 : 0;
    var domingoTarde = req.body.domingoTarde ? 1 : 0;
    var lunesNoche = req.body.lunesNoche ? 1 : 0;
    var martesNoche = req.body.martesNoche ? 1 : 0;
    var miercolesNoche = req.body.miercolesNoche ? 1 : 0;
    var juevesNoche = req.body.juevesNoche ? 1 : 0;
    var viernesNoche = req.body.viernesNoche ? 1 : 0;
    var sabadoNoche = req.body.sabadoNoche ? 1 : 0;
    var domingoNoche = req.body.domingoNoche ? 1 : 0;
    req.getConnection((err, conn) => {
        var sql = "UPDATE `paseadores` SET `nombre`=?,`descripcion`=?,`zonas`=?,`lunesManiana`=?,`lunesTarde`=?,`lunesNoche`=?,`martesManiana`=?,`martesTarde`=?,`martesNoche`=?,`miercolesManiana`=?,`miercolesTarde`=?,`miercolesNoche`=?,`juevesManiana`=?,`juevesTarde`=?,`juevesNoche`=?,`viernesManiana`=?,`viernesTarde`=?,`viernesNoche`=?,`sabadoManiana`=?,`sabadoTarde`=?,`sabadoNoche`=?,`domingoManiana`=?,`domingoTarde`=?,`domingoNoche`=? WHERE id=?"
        conn.query(sql, [nombre, descripcion, zonas, lunesManiana, lunesTarde, lunesNoche, martesManiana, martesTarde, martesNoche, miercolesManiana, miercolesTarde, miercolesNoche, juevesManiana, juevesTarde, juevesNoche, viernesManiana, viernesTarde, viernesNoche, sabadoManiana, sabadoTarde, sabadoNoche, domingoManiana, domingoTarde, domingoNoche, id], (err, rows) => {
            if (err) {
                res.json(err)
            }
            res.redirect('/paseadores')
        })
    })
}
controller.calificarPaseador = (req, res) => {
    req.getConnection((err, conn) => {
        var id = req.body.id;
        var calificacion = req.body.calificacion;
        var sql = 'UPDATE `paseadores` SET `puntos`=puntos+?,`calificaciones`=calificaciones+1 WHERE id=?'
        conn.query(sql, [calificacion, id], (err, rows) => {
            if (err) {
                res.json(err)
            }
            res.send(rows);
        })
    })
}
controller.agregarPaseadores = (req, res) => {
    var user= req.session.mi_sesion
    if ((!user) || (user.esAdmin==1)){
        res.redirect('/')
    }else{
        res.render('agregarPaseador',{user: user})
}
    }
    
controller.eliminarPaseador = (req, res) => {
    req.getConnection((err, conn) => {

        var id = req.body.id;

        var sql = "DELETE FROM `paseadores` WHERE id= ? "
        conn.query(sql, [id], (err, rows) => {
            if (err) {
                res.json(err)
            }
            res.send(rows)
        })
    })
}

controller.modificar = (req, res) => {
    var user= req.session.mi_sesion
    if ((!user) || (user.esAdmin==1)){
        res.redirect('/')
    }else{
        id = req.query.id;
        var sql = 'SELECT * FROM paseadores WHERE id = ?';
        req.getConnection((err, conn) => {
            conn.query(sql, id, (err, rows) => {
                if (err) {
                    res.json(err)
                }
                res.render('modificarPaseador', {
                    data:rows ,
                    user:user
                });
            })
        })
}
}
controller.delete_adopcion = (req, res) => {
    const {id} = req.params
    const user =req.session.mi_sesion
    const msj=""
    const data= req.session.adoptados
    req.getConnection((err, conn) => {
        conn.query('DELETE FROM  perrosenadopcion WHERE id = ?', [id],(err, rows) => {
            res.render('vistaContainer',{
                user,msj,data
            })
        })
    })
}
module.exports = controller;









/*-----------------------CODIGO LEGACY-----------------------------------------

controller.iniciar_sesion = (req,res)=>{

   req.getConnection((err,conn)=>{
        
        var mail= req.body.email
        var pas = req.body.password
        var sql ="SELECT * FROM `clientes` WHERE email = ? AND password = ?"
        conn.query(sql,[mail,pas],(err,rows)=>{
            if(err){
                res.json(err)
            }
            if(rows[0].esAdmin === 0){

                res.redirect('/veterinaria_panel',)
            }
            else 
                res.redirect('/cliente_panel')
        })
    })
        
    }




 controller.registro = (req,res)=>{
        req.getConnection((err,conn)=>{
            var nombre= req.body.nombre
            var mail= req.body.email
            var pas = req.body.password
            var esAdmin= false
            var telefono=req.body.telefono

            var sql ="SELECT * FROM `clientes` WHERE email = ?"
            conn.query(sql,[mail],(err,rows)=>{
                if(err){
                    res.json(err)
                }
                if(rows.length > 0){
                    res.json('email ya registrado')
                }
                else{
                    var sql ="INSERT INTO `clientes` (`nombre`, `email`, `password`, `esAdmin`, `telefono`) VALUES (?,?,?,?,?)"
                    conn.query(sql,[nombre,mail,pas,esAdmin,telefono],(err,rows)=>{
                        if(err){
                            res.json(err)
                        }
                        alert("usuario registrado con exito")
                        res.redirect('/')
                    })
                }
            })
        })
    }






*/



