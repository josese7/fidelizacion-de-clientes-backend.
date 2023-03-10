const express = require('express');

const app = express();

app.use(require('./cliente'));
app.use(require('./reglaAsignacion'));
app.use(require('./vencimientoPuntos'));
app.use(require('./conceptoPuntos'));
app.use(require('./bolsaPuntos'));

module.exports = app;