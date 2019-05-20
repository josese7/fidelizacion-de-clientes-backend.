var mongoose = require('mongoose');

let Schema = mongoose.Schema;

var detallePuntosSchema = new mongoose.Schema({
    idCabecera: { type: Schema.Types.ObjectId, ref: 'CabeceraPuntos', required: true },
    puntajeUtilizado: Number,
    idBolsaPuntos: { type: Schema.Types.ObjectId, ref: 'BolsaPuntos', required: true },
});

module.exports = mongoose.model('DetallePuntos', detallePuntosSchema);