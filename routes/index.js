const express = require('express');
const router = express.Router();

const proyectoController = require('../controllers/proyectoController')

module.exports = function() {
    // Ruta para el home
    router.get('/', proyectoController.registerHome);
    router.get('/nosotros', proyectoController.nosotros);

    return router;
}
