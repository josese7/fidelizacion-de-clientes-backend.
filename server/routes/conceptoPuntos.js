const express = require('express');

const ConceptoPuntos = require('../models/conceptoPuntos');

const app = express();
/* ==============
    
    METODOS GETS

    ============= */

// Trae todos los conceptos disponibles
app.get('/conceptoPuntos', function(req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    ConceptoPuntos.find({ estado: true })
        .skip(desde)
        .sort('concepto')
        .limit(limite)
        .exec((err, conceptoPuntos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            ConceptoPuntos.countDocuments({ estado: true }, (err, total) => {
                res.json({
                    ok: true,
                    conceptoPuntos,
                    total
                });
            });
        });
});

//Busca por ID
app.get('/conceptoPuntos/:id', function(req, res) {
    let id = req.params.id;

    ConceptoPuntos.findById(id, (err, conceptoPuntosDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!conceptoPuntosDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }
        res.json({
            ok: true,
            conceptoPuntos: conceptoPuntosDB
        });
    });
});

/* ==============
    
    METODO PUT

    ============= */

app.post('/conceptoPuntos', function(req, res) {
    let body = req.body;

    let conceptoPuntos = new ConceptoPuntos({
        concepto: body.concepto,
        puntosRequeridos: body.puntosRequeridos
    });

    conceptoPuntos.save((err, conceptoPuntosDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            conceptoPuntos: conceptoPuntosDB
        });
    });
});

app.put('/conceptoPuntos/:id', function(req, res) {
    let id = req.params.id;
    let body = req.body;

    ConceptoPuntos.findByIdAndUpdate(
        id,
        body, { new: true, runValidators: true },
        (err, conceptoPuntosDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                concepto: conceptoPuntosDB
            });
        }
    );
});

app.delete('/conceptoPuntos/:id', function(req, res) {
    let id = req.params.id;

    //ConceptoPuntos.findByIdAndRemove(id, (err, reglaDel) => {
    let cambiaEstado = {
        estado: false
    };
    let conceptoDel;

    ConceptoPuntos.findByIdAndUpdate(
        id,
        cambiaEstado, { new: true },
        (err, conceptoDel) => {
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
        concepto: conceptoDel
    });
});

module.exports = app;