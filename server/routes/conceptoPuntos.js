const express = require('express');
const conceptoPuntosMW = require('../middlewares/conceptoPuntos');

const app = express();
/* ==============
    
    METODOS GETS

    ============= */

// Trae todos los conceptos disponibles
app.get('/conceptoPuntos', conceptoPuntosMW.getConceptosPuntos);

//Busca por ID
app.get('/conceptoPuntos/:id', conceptoPuntosMW.getConceptoPuntos);
app.post('/conceptoPuntos', conceptoPuntosMW.postConceptoPuntos);
app.put('/conceptoPuntos/:id', conceptoPuntosMW.putConceptoPuntos);
app.delete('/conceptoPuntos/:id', conceptoPuntosMW.deleteConceptoPuntos);

module.exports = app;