const express = require('express');

const BolsaPuntos = require('../models/bolsaPuntos');

const app = express();

/* ==============
    
    METODOS GETS

    ============= */

// Trae todos
app.get('/bolsaPuntos', function(req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    BolsaPuntos.find({ estado: true })
        .skip(desde)
        .limit(limite)
        .populate('idCliente')
        .exec((err, bolsaPuntos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            BolsaPuntos.countDocuments({ estado: true }, (err, total) => {
                res.json({
                    ok: true,
                    bolsaPuntos,
                    total
                });
            });
        });
});

//Busca por ID
app.get('/bolsaPuntos/:id', function(req, res) {
    let id = req.params.id;

    BolsaPuntos.findById(id)
        .populate('idCliente')
        .exec((err, bolsaPuntosDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!bolsaPuntosDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El ID no es correcto'
                    }
                });
            }
            res.json({
                ok: true,
                bolsaPuntos: bolsaPuntosDB
            });
        });
});

// Buscar Bolsa por

app.get('/bolsaPuntos/buscar/:termino', (req, res) => {
    let termino = req.params.termino;

    let hoy = new Date();

    let regex = new RegExp(termino, 'i');

    BolsaPuntos.find({
        //idCliente: termino,
        fechaCaducidad: termino
    }).exec((err, bolsaPuntosDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            bolsaPuntos: bolsaPuntosDB
        });
    });
});
/* ==============
    
    METODO POST

    ============= */
app.post('/bolsaPuntos', function(req, res) {
    let body = req.body;

    let bolsaPuntos = new BolsaPuntos({
        idCliente: body.idCliente,
        fechaAsignacion: body.fechaAsignacion,
        fechaCaducidad: body.fechaCaducidad,
        puntajeAsignado: body.puntajeAsignado,
        puntajeUtilizado: body.puntajeUtilizado,
        saldoPuntos: body.saldoPuntos,
        montoOperacion: body.montoOperacion
    });

    bolsaPuntos.save((err, bolsaPuntosDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            bolsaPuntos: bolsaPuntosDB
        });
    });
});

/* ==============
    
    METODOS PUTS

    ============= */
app.put('/bolsaPuntos/:id', function(req, res) {
    let id = req.params.id;
    let body = req.body;

    BolsaPuntos.findByIdAndUpdate(
        id,
        body, { new: true, runValidators: true },
        (err, bolsaPuntosDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                bolsaPuntos: bolsaPuntosDB
            });
        }
    );
});

/* ==============
    
    METODOS DELETE

    ============= */
app.delete('/bolsaPuntos/:id', function(req, res) {
    let id = req.params.id;

    //BolsaPuntos.findByIdAndRemove(id, (err, reglaDel) => {
    let cambiaEstado = {
        estado: false
    };
    let bolsaPuntosDel;

    BolsaPuntos.findByIdAndUpdate(
        id,
        cambiaEstado, { new: true },
        (err, bolsaPuntosDel) => {
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
        bolsa: bolsaPuntosDel
    });
});

module.exports = app;