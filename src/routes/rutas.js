const express = require('express')
const router = express.Router()
const controller = require('../controllers/rutasController')

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
router.get('/publicacion_adopcion',controller.PagePublicacionesiController)
router.get('/darTurnoSolicitud',controller.darTurnoSolicitud)
router.get('/solicitarVentanaTurno',controller.solicitarVentanaTurno)
router.get('/verSolicitudesTurnos',controller.verSolicitudesTurnoVentana)
router.get('/darTurnos',controller.darTurnos)
router.get('/nuevoTurno',controller.nuevoTurno)
router.get('/calendarioTurnos',controller.calendarioTurnos)
router.get('/verTurnos',controller.Turnos)
router.get('/MisTurnos',controller.misTurnos)
router.post('/eliminarTurno',controller.eliminarTurno)
router.get('/listar',controller.listarClientes)
router.get('/publics',controller.PagePublicaciones)
router.get('/userPublics',controller.UserPublics)
router.get('/paseadores',controller.listarPaseadores)
router.get('/',controller.list)
router.get('/solicitudes',controller.listarSolicitudes)
router.get('/modificar',controller.modificar)
router.post('/eliminarSolicitudes',controller.eliminarSolicitud)
router.post('/solicitud',controller.solicitarPaseador)
router.post('/eliminarPaseador',controller.eliminarPaseador)
router.post('/agregarPaseador',controller.agregarPaseador)
router.post('/calificarPaseador',controller.calificarPaseador)
router.post('/modificarPaseador',controller.modificarPaseador)
router.get('/agregarPaseador',controller.agregarPaseadores)
router.get('/delete/:id',controller.delete_adopcion)
router.post('/add_adopcion',controller.add_adopcion)



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
router.get('/adopcion',(req,res)=>{
    req.getConnection((err,conn)=>{
        var user=req.session.mi_sesion
        console.log(user)
        conn.query('SELECT * FROM perrosenadopcion',(err,rows)=>{
            if(err){
                res.json(err)
            }
            req.session.adopcion=rows
            res.render('adopcion',{
                data: rows,user
            });
        })
    })
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
    var text2 = ""
    var text = ""
    const msj=""
    const data= req.session.adoptados
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
       /* cliente=rows
        if(rows.length > 0){
            sql2 = "SELECT * FROM `mascotas` WHERE cliente = ? AND nombre = ?";
            conn.query(sql2,[cliente[0].email,nombre],(err,mascota)=>{
                console.log(mascota)
                if(mascota){
                    text="Mascota ya registrada"
                    res.render('vistaContainer',{user,msj,text,text2,data})
                    
                }
                else{*/
                
                sql3="INSERT INTO `mascotas`(`nombre`, `edad`, `tamaño`, `cliente`, `foto`, `detalle`) VALUES ('"+nombre+"','"+edad+"','"+tamaño+"','"+mail+"','"+img+"','"+detalle+"')"
                    console.log(sql3)
                    conn.query(sql3,[],(err,rows)=>{
                    if(err){
                        text="Mascota ya registrada"
                        res.render('vistaContainer',{user,msj,text,text2,data})
                        
                    
                    }
                    else{
                        text2="Mascota registrada"    
                        res.render('vistaContainer',{
                        user,msj,text,text2,data
                    
                    })
                
    }})
                
                
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
        var esAdmin= 1
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
                console.log(data)
                res.render('lista_perros',{
                    user,text,data
            })
            }
            
        })
    })
})


module.exports=router