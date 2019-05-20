var mongoose = require('mongoose');

var CabeceraPuntosSchema = new mongoose.Schema({
    idCliente: Number,
    fecha: Date,
    puntajeUtilizado: Number,
    conceptoUso: String
});

mongoose.model('CabeceraPuntos', CabeceraPuntosSchema);