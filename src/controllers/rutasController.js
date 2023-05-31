const controller = {}

controller.list = (req,res)=>{
    req.getConnection((err,conn)=>{
        msj=""
        conn.query('SELECT * FROM clientes',(err,rows)=>{
            if(err){
                res.json(err)
            }
            res.render('vistaContainer',{
                data: rows,msj
            });
        })
    })
}
controller.listarPaseadores = (req, res) => {
    orderBy = req.query.orderBy;
    pagina = parseInt(req.query.pagina);
    if (!(Number(pagina) > 0)) {
        pagina = 1;
    }
    var sql = 'SELECT * FROM paseadores ORDER BY id DESC LIMIT ? ,10;'
    if (orderBy=='rating'){
        sql='SELECT * FROM paseadores ORDER BY puntos/calificaciones DESC LIMIT ? ,10;';
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
                siguiente: siguiente
            });
        })
    })
}
controller.listarSolicitudes = (req, res) => {

    var sql = "SELECT s.nombre as nombre, telefono,p.nombre as nombrePaseador, p.id as id FROM `solicitudescontacto` s INNER JOIN `paseadores` p ON s.idPaseador=p.id;"
    req.getConnection((err, conn) => {
        conn.query(sql, (err, rows) => {
            if (err) {
                res.json(err)
            }
            console.log(rows)
            res.render('listaSolicitudes', {
                data: rows
            });
        })
    })
}
controller.eliminarSolicitud = (req, res) => {
    req.getConnection((err, conn) => {

        var id = req.body.id;
        var telefono = req.body.telefono;
        var sql = "DELETE FROM `solicitudescontacto` WHERE idPaseador= ? AND telefono= ? "
        conn.query(sql, [id,telefono], (err, rows) => {
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
                res.json(err)
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
        var sql = 'INSERT INTO `paseadores`(`nombre`, `descripcion`, `zonas`) VALUES (?,?,?)'
        conn.query(sql, [nombre, descripcion, zonas], (err, rows) => {
            if (err) {
                res.json(err)
            }
            res.redirect('/paseadores')
        })
    })
}
controller.modificarPaseador = (req, res) => {
    var id= req.query.id
    var nombre = req.body.nombre;
    var descripcion = req.body.descripcion;
    var zonas = req.body.zonas;

    req.getConnection((err, conn) => {
        var sql = "UPDATE `paseadores` SET `nombre`= ?,`descripcion`=?,`zonas`=? WHERE id= ?"
        conn.query(sql, [nombre, descripcion, zonas,id], (err, rows) => {
            if (err) {
                res.json(err)
            }
            res.send(rows)
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
            res.redirect(req.get('referer'));
        })
    })
}
controller.agregarPaseadores = (req, res) => {
    res.render('agregarPaseador')
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
    id = req.query.id;
    console.log('id= '+id)
    var sql = 'SELECT * FROM paseadores WHERE id = ?';
    req.getConnection((err, conn) => {
        conn.query(sql, id, (err, rows) => {
            if (err) {
                res.json(err)
            }
            res.render('modificarPaseador', {
                data: rows
            });
        })
    })
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



