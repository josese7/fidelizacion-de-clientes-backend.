const express = require('express');

const reglaAsignacionMW = require('../middlewares/reglaAsignacion');

const app = express();

app.get('/reglaAsignacion', reglaAsignacionMW.getReglasAsignacion);
app.post('/reglaAsignacion', reglaAsignacionMW.postReglaAsignacion);
app.put('/reglaAsignacion/:id', reglaAsignacionMW.putReglaAsignacion);
app.delete('/reglaAsignacion/:id', reglaAsignacionMW.deleteReglaAsignacion);

module.exports = app;