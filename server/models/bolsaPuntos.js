var mongoose = require('mongoose');
let Schema = mongoose.Schema;

var bolsaPuntosSchema = new mongoose.Schema({
    idCliente: { type: Schema.Types.ObjectId, ref: 'Cliente', required: true },
    fechaAsignacion: Date,
    fechaCaducidad: Date,
    puntajeAsignado: Number,
    puntajeUtilizado: Number,
    saldoPuntos: Number,
    montoOperacion: Number,
    estado: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('BolsaPuntos', bolsaPuntosSchema);