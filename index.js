/*  Este ejemplo viene de un tutorial de Youtube del profesor Juan Pablo de la Torre.
    Este proyecto le incluye Express y Node, renderiza viestas  a traves de PUG
    -- Trabajo con rutas
    -- Trabajo MVC
    -- Flash para mensajes
    -- Envío de correos por nodemailer
    -- Webpack

    Adicional a esto, se inicio el proyecto sobre la base de una aplicación web API
    conectada a MySQL
    
*/

// Se carga express y otras dependencias
/*
const express = require('express');
const routes = require('./routes');
const path = require("path");
//const bodyparser = require('body-parser');

// Crear una app de express
const app = express();

// Donde cargar los archivos estaticos
app.use(express.static('public'));

// Habilitar Pug
app.set('view engine', 'pug');

// Añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));

// Importaciones propias (Base de datos)
const conn = require('./server/connection');

app.use('/', routes() );
//app.use(bodyparser.json());

app.set("port", (process.env.PORT || 7000));
app.listen(app.get("port"), () => {
    console.log('Servidor Web iniciado');
});

conn.connect((err) =>
{
    if(!err)
    console.log('DB connection succeded.');
    else
    console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});

app.post('/', function(req, res) {
    // console.log(req.body);
    var name = req.body.name;
    var email = req.body.email;
    var code = req.body.code;

    var sql = "SET @id = 0;SET @name = ?;SET @email = ?;SET @code = ?; \
    call `AddStudent`(@id, @name, @email, @code)";

    conn.query(sql, [name, email, code],(err, rows, fields) => {

        if(!err)
            rows.forEach(element => {
                if(element.constructor == Array)
                res.send('Insert Student id: ' + element[0].StudentID);
            });
        else
            console.log(err);
    })    
});
*/

const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

// helpers con algunas funciones
const helpers = require('./helpers');

// Crear la conexión a la BD
const db = require('./config/db');

// Importar el modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
    .then(() => console.log('Conectado al Servidor'))
    .catch(error => console.log(error));

// crear una app de express
const app = express();

// Donde cargar los archivos estaticos
app.use(express.static('public'));

// Habilitar Pug
app.set('view engine', 'pug');

// habilitar bodyParser para leer datos del formulario

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Agregamos express validator a toda la aplicación
app.use(expressValidator());



// Añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));



app.use(cookieParser());

// sessiones nos permiten navegar entre distintas paginas sin volvernos a autenticar
app.use(session({ 
    secret: "keyboard cat", 
    resave: false, 
    saveUninitialized: false 
}));


app.use(passport.initialize());
app.use(passport.session());

// agregar flash messages
app.use(flash());

// Pasar var dump a la aplicación
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    next();
});


app.use('/', routes() );

app.listen(3000);



