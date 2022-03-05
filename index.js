// Se carga express y otras dependencias
const express = require('express');
const routes = require('./routes');
const path = require("path");
//const bodyparser = require('body-parser');

// Crear una app de express
const app = express();

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




