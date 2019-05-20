const express = require('express');

const Cliente = require('../models/cliente');

const app = express();

app.get('/cliente', function(req, res) {
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
});

app.post('/cliente', function(req, res) {
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
    /* 
                                                  if (body.nombre === undefined) {

                                                      res.status(400).json({
                                                          ok: false,
                                                          mensaje: 'El nombre es necesario'
                                                      });

                                                  } else {
                                                      res.json({
                                                          cliente: body
                                                      });
                                                  } */
});

app.put('/cliente/:id', function(req, res) {
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
});

app.delete('/cliente/:id', function(req, res) {
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
});

module.exports = app;