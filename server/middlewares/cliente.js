const Cliente = require('../models/cliente');

function getClientes(req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);
    Cliente.find({ estado: true }, 'nombre apellido correo')
        .skip(desde)
        .limit(limite)
        .exec((err, cliente) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Cliente.countDocuments({ estado: true }, (err, total) => {
                res.json({
                    ok: true,
                    cliente,
                    total
                });
            });
        });
}

async function postCliente(req, res) {
    let body = req.body;

    /* res.json({
                                                                      cliente: body
                                                                  }); */

    let cliente = new Cliente({
        nombre: body.nombre,
        apellido: body.apellido,
        cedula: body.cedula,
        tipoDocumento: body.tipoDocumento,
        nacionalidad: body.nacionalidad,
        correo: body.correo,
        telefono: body.telefono,
        fechaNacimiento: body.fechaNacimiento
    });

    console.log(req.body.nombre, 'Req');

    cliente.save((err, clienteDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            cliente: clienteDB
        });
    });
}

function putCliente(req, res) {
    let id = req.params.id;
    let body = req.body;

    Cliente.findByIdAndUpdate(
        id,
        body, { new: true, runValidators: true },
        (err, clienteDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                cliente: clienteDB
            });
        }
    );
}

function deleteCliente(req, res) {
    let id = req.params.id;

    //Cliente.findByIdAndRemove(id, (err, clienteDel) => {
    let cambiaEstado = {
        estado: false
    };
    let clienteDel;

    Cliente.findByIdAndUpdate(
        id,
        cambiaEstado, { new: true },
        (err, clienteDel) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
        }
    );
    res.json({
        ok: true,
        cliente: clienteDel
    });
}
module.exports = {
    getClientes,
    postCliente,
    putCliente,
    deleteCliente
};