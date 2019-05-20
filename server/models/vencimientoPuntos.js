let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let vencimientoPuntosSchema = new mongoose.Schema({
    inicio: Date,
    fin: Date,
    duracion: Number,
    estado: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('VencimientoPunto', vencimientoPuntosSchema);