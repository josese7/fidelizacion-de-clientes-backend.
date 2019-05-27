const express = require('express');

const BolsaPuntos = require('../models/bolsaPuntos');
const bolsaPuntosMW = require('../middlewares/bolsaPuntos');

const app = express();

/* ==============
    
    METODOS GETS

    ============= */

// Trae todos
app.get('/bolsaPuntos', bolsaPuntosMW.getBolsaPuntos);

// Buscar Bolsa por IDCliente

app.get('/bolsaPuntosCliente/:termino', bolsaPuntosMW.getBolsaPuntosIdCliente);
app.get(
    '/bolsaPuntosvencidas/:cliente',
    bolsaPuntosMW.getBolsaPuntosClienteVen
);
app.get(
    '/bolsaPuntosvigentes/:cliente',
    bolsaPuntosMW.getBolsaPuntosClienteVigentes
);

// Busca bolsas vencidas

app.get('/bolsaPuntosvencidas/', bolsaPuntosMW.getBolsaPuntosVen);

app.get('/bolsaPuntosvigentes/', bolsaPuntosMW.getBolsaPuntosVigentes);

app.get('/bolsaPuntosDias/:termino', bolsaPuntosMW.getBolsaPuntosDias);

app.post('/bolsaPuntos', bolsaPuntosMW.postBolsaPuntos);

module.exports = app;