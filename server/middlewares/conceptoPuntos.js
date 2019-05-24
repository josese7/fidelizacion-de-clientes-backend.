const ConceptoPuntos = require('../models/conceptoPuntos');

function getConceptosPuntos(req, res) {
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
}

function getConceptoPuntos(req, res) {
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
}

function postConceptoPuntos(req, res) {
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
}

function putConceptoPuntos(req, res) {
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
}

function deleteConceptoPuntos(req, res) {
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
}
module.exports = {
    getConceptosPuntos,
    getConceptoPuntos,
    postConceptoPuntos,
    putConceptoPuntos,
    deleteConceptoPuntos
};