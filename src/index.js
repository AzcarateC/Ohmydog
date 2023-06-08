const express = require('express')
const path= require ('path')
const morgan = require('morgan')
const app = express()
const mysql = require('mysql')
const myConnection = require('express-myconnection')
const session = require('express-session')
const flash = require('connect-flash')
//imports
const routes = require('./routes/rutas')
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
    database: 'ohmydog',
    multipleStatements: true
},'single'))


app.use(express.json())
app.use(session({
    secret: 'ohmydog',
    resave: false,
    saveUninitialized: false,
}))


app.use(bodyParser.urlencoded({extended: false}))
app.use(flash())

//globar variables

app.use((req,res,next)=>{
    app.locals.user=req.flash('login')
    next()
})
// routes
app.use('/', routes)

//static files
app.use(express.static(path.join(__dirname,'public')))



//
app.listen(app.get('port'),() =>{
    console.log('Serven on port', app.get('port'))
})
