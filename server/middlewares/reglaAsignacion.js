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

async function getReglaConsulta(req, res) {
    let termino = req.params.termino;

    if (termino < 100000) {
        return res.status(400).json({
            ok: false,
            message: 'El monto minimo es 100000'
        });
    }
    let reglas = await ReglaAsignacion.findOne({
        $and: [{ limiteInf: { $lte: termino } }, { limiteSup: { $gte: termino } }]
    });
    console.log('BD :', reglas);

    let regla;
    if (reglas) {
        regla = reglas._doc.monto;
        message = 'OK';
    } else {
        regla = 100000;
        message = 'Se aplico la regla por defaut';
    }
    //regla obtenida

    const puntaje = Math.round(termino / regla);

    if (puntaje) {
        res.json({
            ok: true,
            puntaje,
            message
        });
    } else {
        return res.status(400).json({
            ok: false
        });
    }
}
module.exports = {
    getReglasAsignacion,
    //getReglaAsignacion,
    postReglaAsignacion,
    putReglaAsignacion,
    deleteReglaAsignacion,
    getReglaConsulta
};