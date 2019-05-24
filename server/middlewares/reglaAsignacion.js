const ReglaAsignacion = require('../models/reglaAsignacion');

function getReglasAsignacion(req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    ReglaAsignacion.find({ estado: true })
        .skip(desde)
        .limit(limite)
        .exec((err, reglaAsignacion) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            ReglaAsignacion.countDocuments({ estado: true }, (err, total) => {
                res.json({
                    ok: true,
                    reglaAsignacion,
                    total
                });
            });
        });
}

function postReglaAsignacion(req, res) {
    let body = req.body;

    let reglaAsignacion = new ReglaAsignacion({
        limiteInf: body.limiteInf,
        limiteSup: body.limiteSup,
        monto: body.monto
    });

    reglaAsignacion.save((err, reglaAsignacionDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            reglaAsignacion: reglaAsignacionDB
        });
    });
}

function putReglaAsignacion(req, res) {
    let id = req.params.id;
    let body = req.body;

    ReglaAsignacion.findByIdAndUpdate(
        id,
        body, { new: true, runValidators: true },
        (err, reglaDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                regla: reglaDB
            });
        }
    );
}

function deleteReglaAsignacion(req, res) {
    let id = req.params.id;

    //ReglaAsignacion.findByIdAndRemove(id, (err, reglaDel) => {
    let cambiaEstado = {
        estado: false
    };
    let reglaDel;

    ReglaAsignacion.findByIdAndUpdate(
        id,
        cambiaEstado, { new: true },
        (err, reglaDel) => {
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
        regla: reglaDel
    });
}
module.exports = {
    getReglasAsignacion,
    //getReglaAsignacion,
    postReglaAsignacion,
    putReglaAsignacion,
    deleteReglaAsignacion
};