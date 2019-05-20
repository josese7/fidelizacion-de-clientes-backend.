var mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let reglaAsignacionSchema = new mongoose.Schema({
    limiteInf: {
        type: Number,
        required: [true, 'Limite inferior necesario']
    },
    limiteSup: {
        type: Number,
        required: [true, 'Limite superior necesario']
    },
    monto: {
        type: Number,
        required: [true, 'El monto de canjeo es necesario']
    },
    estado: {
        type: Boolean,
        default: true
    }
});

mongoose.model('ReglaAsignacion', reglaAsignacionSchema);
module.exports = mongoose.model('ReglaAsignacion', reglaAsignacionSchema);