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
    req.getConnection((err,conn)=>{
         user = req.session.mi_sesion 
         email = user[0].email
        conn.query('SELECT * FROM adopcion   JOIN clientes ON adopcion.nombre = clientes.email WHERE clientes.email = ?',[email],(err,rows)=>{
            res.render('misPublics',{
                data:rows,user 
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
        conn.query('SELECT * FROM turnos',(err,rows)=>{
            if(err){
                res.json(err)
            }
            res.render('calendarioTurnos',{
                data1:rows,user
            });
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

controller.solicitarTurno = (req,res) => {
    req.getConnection((err,conn)=>{
      tipoTurno = req.query['tipo-turno'];
      tipoServicio = req.query['tipo-servicio'];
      usuario = req.query['usuario'];
      sqlQuery = 'INSERT INTO solicitudesTurno (tipoTurno, tipoServicio, usuario) VALUES (?, ?, ?)';
     conn.query(sqlQuery, [tipoTurno, tipoServicio, usuario],(err,rows)=>{
         res.render('darTurno')
     })
    })
 }
 
 controller.solicitarVentanaTurno = (req,res) => {
     req.getConnection((err,conn)=>{
         user = req.session.mi_sesion
         res.render('solicitarTurno',{
             user
         })
     })
 }
 controller.verSolicitudesTurnoVentana = (req,res) => {
     req.getConnection((err,conn)=>{
         user = req.session.mi_sesion
         conn.query('SELECT * FROM solicitudesTurno',(err,rows)=>{
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
         res.render('darTurno',{
             user
         });
     })
 }
 
 
 controller.darTurnoSolicitud = (req,res) => {
     req.getConnection((err,conn)=>{
         user = req.session.mi_sesion
         usuario= req.body.usuario
         tipo = req.body.tipo
         servicio = req.body.servicio
         res.render('darTSolicitud',{
             usuario,servicio,tipo
         })
 
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
             console.log(rows)
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
         conn.query('SELECT * FROM turnos WHERE turnos.email = ?',[email],(err,rows)=>{
             res.render('misTurnos',{
                 data:rows           
             });
         })
     })
 }
 controller.nuevoTurno=((req, res) => {
     const cliente = req.body.cliente;
     const descripcion = req.body.descripcion;
     const tipo = req.body.tipo;
     const dia = req.body.dia;
     const hora = req.body.hora;
     const sqlQuery = 'INSERT INTO turnos (cliente, descripcion, tipo, dia, hora) VALUES (?, ?, ?, ?, ?)';
     const values = [cliente, descripcion, tipo, dia, hora]; 
     connection.query(sqlQuery, values, (err, result) => {
       if (err) {
         console.error('Error al guardar el turno: ', err);
         res.status(500).json({ error: 'Ocurrió un error al guardar el turno' });
       } else {
         res.redirect('/darTurno'); 
       }
     });
   });
 



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



