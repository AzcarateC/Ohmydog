const controller = {}

controller.list = (req,res)=>{
    req.getConnection((err,conn)=>{
        conn.query('SELECT * FROM clientes',(err,rows)=>{
            if(err){
                res.json(err)
            }
            res.render('vistas',{
                data: rows
            });
        })
    })
}




controller.iniciar_sesion = (req,res)=>{

   req.getConnection((err,conn)=>{
        
        var mail= req.body.email
        var pas = req.body.password
        var sql ="SELECT * FROM `clientes` WHERE email = ? AND password = ?"
        conn.query(sql,[mail,pas],(err,rows)=>{
            if(err){
                res.json(err)
            }
            res.send(rows)
        })
    })
        
    }


 
module.exports = controller;



