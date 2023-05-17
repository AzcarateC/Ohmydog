const express = require('express')
const path= require ('path')
const morgan = require('morgan')
const app = express()
const mysql = require('mysql')
const myConnection = require('express-myconnection')
//imports
const routes = require('./routes/rutas')
const bodyparser = require('body-parser')
const bodyParser = require('body-parser')
//seting
app.set('port', process.env.PORT || 3000)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))

// middlewares
app.use(morgan('dev'))
app.use(myConnection(mysql,{
    host:'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: 'ohmydog'
},'single'))

app.use(bodyParser.urlencoded({extended: false}))


//app.use(express.urlencoded({extended: false}))

// routes
app.use('/', routes)

//static files
app.use(express.static(path.join(__dirname,'public')))



//
app.listen(app.get('port'),() =>{
    console.log('Serven on port', app.get('port'))
})
