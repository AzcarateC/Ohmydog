const express = require('express')
const router = express.Router()
const controller = require('../controllers/rutasController')
const multer = require('multer')
const upload = multer({ dest: './src/public/data/uploads/' })

router.get('/',(req,res) =>{
    req.getConnection((err,conn)=>{
        msj=""
        conn.query('SELECT * FROM perrosadoptados',(err,rows)=>{
            if(err){
                res.json(err)
            }
            req.session.adoptados=rows
            user=req.session.mi_sesion
            console.log(rows);
            res.render('vistaContainer',{
                data: rows,msj,user
            });
        })
    })
})
router.post('/verTurnosDiaX',controller.verturnosdiax)
router.get('/solicitarVentanaTurno',controller.solicitarVentanaTurno)
router.get('/verSolicitudesTurnos',controller.verSolicitudesTurnoVentana)
router.get('/darTurnos',controller.darTurnos)
router.get('/calendarioTurnos',controller.calendarioTurnos)
router.get('/verTurnos',controller.Turnos)
router.get('/MisTurnos',controller.misTurnos)
router.get('/mis_datos',controller.misDatos)


router.post('/eliminarCliente',controller.eliminarCliente)
router.get('/listar',controller.listarClientes)
router.get('/buscarPorNombre',controller.buscarPorNombre)
router.post('/verPerrosCliente',controller.verPerrosCliente)
router.get('/publics',controller.PagePublicaciones)
router.get('/userPublics',controller.UserPublics)
router.get('/paseadores',controller.listarPaseadores)
router.get('/',controller.list)
router.get('/adopcion',controller.listarAdopcion)
router.get('/solicitudes',controller.listarSolicitudes)
router.get('/modificar',controller.modificar)
router.post('/eliminarSolicitudes',controller.eliminarSolicitud)
router.post('/solicitud',controller.solicitarPaseador)
router.post('/eliminarPaseador',controller.eliminarPaseador)
router.post('/agregarPaseador',controller.agregarPaseador)
router.post('/calificarPaseador',controller.calificarPaseador)
router.post('/modificarPaseador',controller.modificarPaseador)
router.get('/agregarPaseador',controller.agregarPaseadores)
router.get('/delete_adopcion/:id',controller.delete_adopcion)
router.get('/adoptado/:id',controller.adoptado)
router.post('/verificar',controller.verificar)
router.get('/verificar', (req, res) => {
        res.render('verificar')
})
router.get('/verMascotas',controller.verMascotas)
router.get('/modificarpass',(req, res )=>{
    res.render('verificar')
})







router.post('/eliminarPerroPerdido',controller.eliminarPerroPerdido)
router.get('/perrosPerdidos',controller.listarPerrosPerdidos)
router.get('/modificarPerroPerdido',controller.modificarPerroPerdido)
router.post('/agregarPerroPerdido',upload.single('imagen'),controller.agregarPerroPerdido)
router.get('/agregarPerroPerdido',controller.agregarPerrosPerdidos)
router.post('/modificarPerrosPerdidos',upload.single('imagen'),controller.modificarPerrosPerdidos)

router.post('/login',(req, res) => {
    req.getConnection((err,conn)=>{
        var msj=""
        var mail= req.body.email
        var pas = req.body.password
        var sql ="SELECT * FROM `clientes` WHERE email = ? AND password = ?"
        conn.query(sql,[mail,pas],(err,rows)=>{
            if(rows.length<1){ 
                msj = "Usuario y/o contraseña incorrectas"
                data= req.session.adoptados
                user= req.session.mi_sesion
                res.render('vistaContainer',{
                    msj,data,user

                })
                return
            }
            text=""
            text2=""
            req.session.mi_sesion=rows
            var data =req.session.adoptados
            res.render('vistaContainer',{
                user: rows,msj,data,text,text2
            })
    })
})
})
router.get('/close',(req, res)=>{
    delete req.session.mi_sesion
    msj="hasta pronto"
    user=""
    var data= req.session.adoptados
    res.render('vistaContainer', {data,msj,user})
})
router.get('/veterinaria_panel', (req, res)=>{
    var user= req.session.mi_sesion
    var data= req.session.adoptados
    text=""
    text2=""
    res.render('veterinaria_panel',{
        user,text,text2,data

    })
}
)

 router.get('/add_cliente',(req, res) => {
    var user= req.session.mi_sesion
    text=""
    text2=""
    res.render('add_cliente',{ 
     user,text,text2
    })
})

router.get('/publicacion_adopcion',(req, res)=>{
    var user= req.session.mi_sesion
    res.render('adopcion_form',{user})
})

router.post('/add_adopcion', (req, res)=>{
        var user = req.session.mi_sesion
        var titulo = req.body.titulo
        var tama = req.body.tamaño
        var nombre = req.body.nombre
        var edad = req.body.edad
        var raza = req.body.raza
        var telefono = req.body.txtArea
        var texto = req.body.telefono
        req.getConnection((err,conn)=>{        
        sql = "INSERT INTO `perrosenadopcion`(`nombredepublicacion`, `id`,`nombre`, `texto`,`edad`, `raza`, `tamaño`, `cliente`, `telefono` ) VALUES (?,?,?,?,?,?,?,?,?)"
        conn.query(sql,[titulo,null,nombre,texto,edad,raza,tama,user[0].email],telefono, (err,rows)=>{
            if(err) {
                res.json(err)
                
            }
            console.log(rows)
            data=req.session.adoptados
          res.render('adopcion', {user,data})
        })
    })
    
})

router.post('/nuevot', (req, res) => {
    const cliente = req.body.cliente;
    const descripcion = req.body.descripcion;
    const tipo = req.body.tipo;
    const dia = req.body.dia;
    const hora = req.body.hora;
  
    console.log(cliente)
    console.log(descripcion)
    console.log(tipo)
    console.log(dia)
    console.log(hora)
    req.getConnection((err, conn) => {
      // Verificar si el cliente existe
      const sqlQuery = "SELECT * FROM clientes WHERE email = ?";
      conn.query(sqlQuery, [cliente], (err, result) => {
        if (err) {
          // Manejar el error si ocurre durante la consulta
          console.error(err);
          res.send('Hubo un error en la consulta');
        } else {
          if (result.length === 0) {
            // Cliente no válido, mostrar alerta y redireccionar
            res.send('<script>alert("El cliente proporcionado no es válido."); window.location.href = "/verTurnos";</script>');
          } else {
            // Cliente válido, realizar la inserción en la base de datos
            const sql = "INSERT INTO turnos (paciente, descripcion, tipo, dia, hora) VALUES (?, ?, ?, ?, ?)";
            conn.query(sql, [cliente, descripcion, tipo, dia, hora], (err, result) => {
              if (err) {
                // Manejar el error si ocurre durante la inserción
                console.error(err);
                res.send('Hubo un error al insertar el turno');
              } else {
                conn.query('DELETE FROM solicitudesturno WHERE usuario= ?',[cliente],(err,r)=>{
                    // Redireccionar a la página de visualización de turnos
                    res.redirect('/verTurnos');
                })                
              }
            });
          }
        }
      });
    });
  });
  

router.post('/cancelarTurno',(req, res) => {
    const usuario = req.body.usuario;
    
    const dia = req.body.dia
    const date = new Date(dia);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const fechaFinal = `${year}-${month}-${day}`;
   
    const hora = req.body.hora;
    console.log(usuario);
    console.log("Fecha formateada:", fechaFinal);
    console.log(hora);
    req.getConnection((err,conn) =>{
    const sql = "DELETE FROM turnos WHERE paciente=? AND dia=? AND hora=? "
    const user = req.session.mi_sesion
    conn.query(sql, [usuario,fechaFinal,hora], (err, result) => {        
      if (user[0].esAdmin ===0) {
        res.redirect('/verTurnos')
      } else{
      res.redirect("/MisTurnos")
      }
    });  
     }) 
  })  

router.post('/darTurnoSolicitud',(req,res) => {
    const user = req.session.mi_sesion
    const usuario= req.body.usuario
    const  tipo = req.body.tipo
    const  servicio = req.body.servicio
    console.log(servicio)
 req.getConnection((err,conn)=>{
      res.render('darTSolicitud',{
          user,usuario,servicio,tipo
      })

  })
})

router.post('/solicitarTurno',(req, res) => {
    const tipo = req.body.tipoTurno;
    const servicio = req.body.tipoServicio;
    const usuario = req.body.usuario;
    req.getConnection((err,conn) =>{
    sql = "INSERT INTO `solicitudesturno`(`tipoTurno`, `tipoServicio`,`usuario`) VALUES (?,?,?)"
    conn.query(sql, [tipo,servicio,usuario], (err, result) => {
      if (err) {
        res.redirect('/')
      } else{
      res.redirect("/solicitarVentanaTurno")
      }
    });  
     }) 
  })
  
  router.post('/eliminarSolicitudTurno',(req, res) => {
    const usuario = req.body.usuario;  
    req.getConnection((err,conn) =>{
    var sql = "DELETE FROM `solicitudesturno` WHERE usuario= ? "
    conn.query(sql, [usuario], (err, result) => {
      if (err) {
        res.send('hubo un error')
        res.redirect('/')
      } else{
      var user = req.session.mi_sesion
      res.redirect('/solicitarVentanaTurno');
      }
    });  
     }) 
  })
 


router.get('/add_mascota',(req, res) => {
    var user= req.session.mi_sesion
    text=""
    text2=""
    res.render('add_mascota',{ 
     user,text,text2
    })

})
router.post('/add_mascota', (req, res)=>{
    const user = req.session.mi_sesion
    const text2 = "mascota ya registrada"
    const text = "mascota agregada"
    req.getConnection((err,conn)=>{
    var nombre= req.body.nombre
    var edad= req.body.edad
    var tamaño=req.body.tamaño
    var mail= req.body.cliente
    var img = ""
    var detalle= req.body.detalle
    var sql ="SELECT * FROM `clientes` WHERE email = ?"
    conn.query(sql,[mail],(err,rows)=>{
        if(err){
            res.json('Cliente no valido')
            return
        }
        cliente=rows
        if(rows.length > 0){
            sql2= "SELECT * FROM `mascotas` inner join clientes WHERE cliente = ? "
            conn.query(sql2,[cliente[0].email],(err,mascota)=>{
                if(err){
                    res.json(text2)
                    return
                }
                else{
                    sql3="INSERT INTO `mascotas`(`nombre`, `edad`, `tamaño`, `cliente`, `foto`, `detalle`) VALUES ('"+nombre+"','"+edad+"','"+tamaño+"','"+cliente[0].email+"','"+img+"','"+detalle+"')"
                    console.log(sql3)
                    conn.query(sql3,[],(err,rows)=>{
                        
                    res.render('veterinaria_panel',{
                        user,text
                    })
                })
                }
                
        })
    }
                
    })
})
})

router.post('/add_cliente', (req, res)=>{
        const user = req.session.mi_sesion
        const text = "email ya registrado"
        const text2 = "registo exitoso"
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
                return
            }
            if(rows.length > 0){
                res.render('veterinaria_panel',{
                    user,text
                })
            }
            else{
                var sql ="INSERT INTO `clientes` (`nombre`, `email`, `password`, `esAdmin`, `telefono`) VALUES (?,?,?,?,?)"
                conn.query(sql,[nombre,mail,pas,esAdmin,telefono],(err,rows)=>{
                    if(err){
                        res.json('registo exitoso')
                        return
                    }
                    else{
                        res.render('veterinaria_panel',{
                            user,text2
                        })
                    } 
                   
                })
            }
             
        })
    })
})

router.get('/cliente_panel', (req, res)=>{
    var user= req.session.mi_sesion
    var data= req.session.adoptados
    var data2 = req.session.adopcion
    res.render('cliente_panel',{
        
       user,data
    })
})


router.get('/list_perros', (req, res)=>{
    var user = req.session.mi_sesion
    req.getConnection((err,conn)=>{
        if(err){
            res.json({error:err})
        }

        sql ="SELECT clientes.nombre AS nombrecliente, mascotas.nombre AS nombre, detalle FROM mascotas inner join clientes on clientes.email=mascotas.cliente"
        conn.query(sql,(err,rows)=>{
            if(err){
                res.json(err)
                return
            }
            else{
                text=""
                const data = rows
                console.log(rows)
                res.render('lista_perros',{
                    user,text,data
            })
            }
            
        })
    })
})
router.get('/validarMail',(req,res) =>{
    req.getConnection((err,conn)=>{
        mail=req.query.mail;
        conn.query('SELECT * FROM paseadores WHERE mail=?',[mail],(err,rows)=>{
            if (rows[0]!=null){
                res.send('Mail ya registrado')}
            else{
                res.send('Mail valido')
            }
        })
    })
})
controller.modificarPerrosPerdidos = (req, res) => {
    req.getConnection((err, conn) => {
        console.log(req.file);
        var id=req.body.id;
        var nombre = req.body.nombre;
        var descripcion = req.body.descripcion;
        var zona = req.body.zona;
        var fecha = req.body.fecha;
        var emailpublicacion = req.body.emailpublicacion;
        var sexo = req.body.sexo;
        var perdidooencontrado = req.body.perdidooencontrado;
        var contacto = req.body.contacto;
        var foto = req.file?req.file.filename:req.body.imagenVieja;
        var sql = 'UPDATE `perrosperdidos` SET `nombre`=?,`descripcion`=?,`foto`=?,`contacto`=?,`zona`=?,`perdidooencontrado`=?,`sexo`=?,`fecha`=? WHERE id=?'
        conn.query(sql, [nombre, descripcion, foto, contacto, zona, perdidooencontrado, sexo, fecha, id], (err, rows) => {
            if (err) {
                res.json(err)
            } else {
                res.redirect('/perrosPerdidos')
            }
        })
    })
}
controller.eliminarPerroPerdido = (req, res) => {
    req.getConnection((err, conn) => {

        var id = req.body.id;
        var sql = "DELETE FROM `perrosperdidos` WHERE id= ? "
        conn.query(sql, [id], (err, rows) => {
            if (err) {
                res.json(err)
            }
            res.send(rows)
        })
    })
}
controller.agregarPerroPerdido = (req, res) => {
    req.getConnection((err, conn) => {
        console.log(req.file)
        var nombre = req.body.nombre;
        var descripcion = req.body.descripcion;
        var zona = req.body.zona;
        var fecha = req.body.fecha;
        var emailpublicacion = req.body.emailpublicacion;
        var sexo = req.body.sexo;
        var perdidooencontrado = req.body.perdidooencontrado;
        var contacto = req.body.contacto;
        var foto = req.file.filename;
        var sql = 'INSERT INTO `perrosperdidos` (`nombre`, `descripcion`, `foto`, `contacto`, `zona`, `emailpublicacion`, `perdidooencontrado`, `sexo`, `fecha` ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) '
        conn.query(sql, [nombre, descripcion, foto, contacto, zona, emailpublicacion, perdidooencontrado, sexo, fecha], (err, rows) => {
            console.log('s')
            if (err) {
                res.json(err)
            } else {
                res.redirect('/perrosPerdidos')
            }
        })
    })
}
controller.modificarPerroPerdido = (req, res) => {
    {
        var user = req.session.mi_sesion
        if ((!user) || (user.esAdmin == 1)) {
            res.redirect('/')
        } else {
            id = req.query.id;
            var sql = 'SELECT * FROM perrosperdidos WHERE id = ?';
            req.getConnection((err, conn) => {
                conn.query(sql, id, (err, rows) => {
                    if (err) {
                        res.json(err)
                    }
                    res.render('modificarPerroPerdido', {
                        data: rows,
                        user: user
                    });
                })
            })
        }
    }
}
controller.agregarPerrosPerdidos = (req, res) => {

    var user = req.session.mi_sesion
    if ((!user)) {
        res.redirect('/')
    } else {
        res.render('agregarPerroPerdido', { user: user })
    }
}

controller.listarPerrosPerdidos = (req, res) => {
    var user = req.session.mi_sesion
    var sql = 'SELECT * FROM `perrosperdidos` WHERE 1 ORDER BY id DESC'
    req.getConnection((err, conn) => {
        conn.query(sql, (err, rows) => {
            if (err) {
                res.json(err)
            }
            res.render('listaPerroPerdido', {
                data: rows,
                user: user
            });
        })
    })
}

module.exports=router