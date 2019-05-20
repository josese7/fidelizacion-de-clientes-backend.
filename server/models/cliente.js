const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let tiposDocs = {
    values: ['Cedula', 'Pasaporte'],
    messages: '{VALUE} no es  válido'
};

let Schema = mongoose.Schema;

let clienteSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    apellido: {
        type: String
    },
    cedula: {
        type: String
    },
    tipoDocumento: {
        type: String,
        enum: tiposDocs
    },
    nacionalidad: {
        type: String
    },
    correo: {
        type: String
    },
    telefono: {
        type: String
    },
    fechaNacimiento: Date,
    estado: {
        type: Boolean,
        default: true
    }
});

clienteSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

module.exports = mongoose.model('Cliente', clienteSchema);