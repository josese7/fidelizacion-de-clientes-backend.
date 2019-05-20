var mongoose = require('mongoose');

var DetalleCabeceraPuntosSchema = new mongoose.Schema({
    idCabecera: Number,
    puntajeUtilizado: Number,
    idBolsaPuntos: Number
});

mongoose.model('DetalleCabeceraPuntos', DetalleCabeceraPuntosSchema);