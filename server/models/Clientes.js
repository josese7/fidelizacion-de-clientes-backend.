var mongoose = require('mongoose');

var ClienteSchema = new mongoose.Schema({
    nombre: String,
    apellido: String,
    cedula: String,
    tipoDocumento: String,
    nacionalidad: String,
    correo: String,
    telefono: String,
    fechaNacimiento: Date
});

mongoose.model('Cliente', ClienteSchema);