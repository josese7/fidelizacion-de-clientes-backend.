const express = require('express');

const VencimientoPuntos = require('../models/vencimientoPuntos');

const app = express();
/* ==============
    
    METODOS GETS

    ============= */

// Trae todos los conceptos disponibles
app.get('/vencimientoPuntos', function(req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    VencimientoPuntos.find({ estado: true })
        .skip(desde)
        .sort('duracion')
        .limit(limite)
        .exec((err, vencimientoPuntos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            VencimientoPuntos.countDocuments({ estado: true }, (err, total) => {
                res.json({
                    ok: true,
                    vencimientoPuntos,
                    total
                });
            });
        });
});

//Busca por ID
app.get('/vencimientoPuntos/:id', function(req, res) {
    let id = req.params.id;

    VencimientoPuntos.findById(id, (err, vencimientoPuntosDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!vencimientoPuntosDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }
        res.json({
            ok: true,
            vencimientoPuntos: vencimientoPuntos
        });
    });
});

/* ==============
    
    METODO PUT

    ============= */

app.post('/vencimientoPuntos', function(req, res) {
    let body = req.body;

    let vencimientoPuntos = new VencimientoPuntos({
        inicio: body.inicio,
        fin: body.fin,
        duracion: body.duracion
    });

    vencimientoPuntos.save((err, vencimientoPuntosDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            vencimientoPuntoss: vencimientoPuntosDB
        });
    });
});

app.put('/vencimientoPuntos/:id', function(req, res) {
    let id = req.params.id;
    let body = req.body;

    VencimientoPuntos.findByIdAndUpdate(
        id,
        body, { new: true, runValidators: true },
        (err, vencimientoPuntosDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                vencimientoPuntos: vencimientoPuntosDB
            });
        }
    );
});

app.delete('/vencimientoPuntos/:id', function(req, res) {
    let id = req.params.id;

    //VencimientoPuntoss.findByIdAndRemove(id, (err, reglaDel) => {
    let cambiaEstado = {
        estado: false
    };
    let vencimientoPuntosDel;

    VencimientoPuntos.findByIdAndUpdate(
        id,
        cambiaEstado, { new: true },
        (err, vencimientoPuntosDel) => {
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
        vencimientoPuntos: vencimientoPuntosDel
    });
});

module.exports = app;