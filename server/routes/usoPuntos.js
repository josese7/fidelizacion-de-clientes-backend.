const express = require('express');
const usoPuntosMW = require('../middlewares/usoPuntos');

const app = express();

//CABECERAS
app.post('/usoPuntos', usoPuntosMW.postUsoPuntos);
app.get('/usoPuntos/cliente/:termino', usoPuntosMW.getUsoPuntosIdCliente);
app.get('/usoPuntos/concepto/:termino', usoPuntosMW.getUsoPuntosConcepto);
app.get('/usoPuntos/fecha/:desde/:hasta', usoPuntosMW.getUsoPuntosFecha);

//cliente

app.get(
    '/usoPuntos/concepto/:concepto/:cliente',
    usoPuntosMW.getUsoPuntosConceptoCliente
);
app.get(
    '/usoPuntos/fecha/:cliente/:desde/:hasta',
    usoPuntosMW.getUsoPuntosFechaCliente
);

//DETALLES

module.exports = app;