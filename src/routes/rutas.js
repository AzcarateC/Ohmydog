const express = require('express')
const router = express.Router()
const controller = require('../controllers/rutasController')

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

router.post('/login',(req, res) => {
    req.getConnection((err,conn)=>{
        
        var mail= req.body.email
        var pas = req.body.password
        var sql ="SELECT * FROM `clientes` WHERE email = ? AND password = ?"
        conn.query(sql,[mail,pas],(err,rows)=>{
            if(rows.length<1){ 
                msj = "Usuario y/o contraseña incorrectas"
                
                res.render('vistas',{
                    msj 
                })
                return
            }
       
            req.session.mi_sesion=rows
            
           // req.flash('login',rows)
           //console.log(req.flash.login)
            if(rows[0] && rows[0].esAdmin === 0){

                res.redirect('/veterinaria_panel')
            }
            else 
                res.redirect('/cliente_panel')
        })
    })
})
router.get('/veterinaria_panel', (req, res)=>{
    var user= req.session.mi_sesion
    text=""
    text2=""
   // delete req.session.mi_sesion
    console.log(user[0])
    //const user = req.flash('login')
    //console.log(user)
    res.render('veterinaria_panel',{
        user,text,text2

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
   // delete req.session.mi_sesion
    
   // const user = req.flash('login')
   // console.log(user)
    res.render('cliente_panel',{
        
       user
    })
})

module.exports=router