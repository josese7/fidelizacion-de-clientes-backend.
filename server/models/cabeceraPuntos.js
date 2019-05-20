var mongoose = require('mongoose');
let Schema = mongoose.Schema;

var CabeceraPuntosSchema = new mongoose.Schema({
    idCliente: { type: Schema.Types.ObjectId, ref: 'Cliente', required: true },
    fecha: Date,
    puntajeUtilizado: Number,
    conceptoUso: { type: Schema.Types.ObjectId, ref: 'ConceptoPunto', required: true },
});

module.exports = mongoose.model('CabeceraPuntos', CabeceraPuntosSchema);