let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let conceptoPuntoSchema = new mongoose.Schema({
    concepto: String,
    puntosRequeridos: Number,
    estado: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('ConceptoPunto', conceptoPuntoSchema);