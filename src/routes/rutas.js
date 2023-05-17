const express = require('express')
const router = express.Router()
const controller = require('../controllers/rutasController')

router.get('/',controller.list)
router.post('/login',controller.iniciar_sesion)

module.exports=router