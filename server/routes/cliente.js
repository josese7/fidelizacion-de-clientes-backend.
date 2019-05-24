const express = require('express');
const clienteMW = require('../middlewares/cliente');

const app = express();

app.get('/cliente', clienteMW.getClientes);
app.post('/cliente', clienteMW.postCliente);
app.put('/cliente/:id', clienteMW.putCliente);
app.delete('/cliente/:id', clienteMW.deleteCliente);

module.exports = app;