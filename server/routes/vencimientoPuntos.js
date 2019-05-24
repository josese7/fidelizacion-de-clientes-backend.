const express = require('express');

const vencimientoPuntosMW = require('../middlewares/vencimientoPuntos');

const app = express();

// Trae todos los conceptos disponibles
app.get('/vencimientoPuntos', vencimientoPuntosMW.getVencimientosPuntos);

//Busca por ID
app.get('/vencimientoPuntos/:id', vencimientoPuntosMW.getVencimientoPuntos);
app.post('/vencimientoPuntos', vencimientoPuntosMW.postVencimientoPuntos);
app.put('/vencimientoPuntos/:id', vencimientoPuntosMW.putVencimientoPuntos);
app.delete(
    '/vencimientoPuntos/:id',
    vencimientoPuntosMW.deleteVencimientoPuntos
);

module.exports = app;