const BolsaPuntos = require('../models/bolsaPuntos');
const ReglasAsignacion = require('../models/reglaAsignacion');
const VencimientosPuntos = require('../models/vencimientoPuntos');

const moment = require('moment');

async function postBolsaPuntos(req, res) {
    let body = req.body;

    if (body.montoOperacion < 100000) {
        return res.status(400).json({
            ok: false,
            message: 'El monto minimo es 100000'
        });
    }

    /*============================================
                                                                                                           OBTENCION DE LA REGLA PARA CALCULAR LOS PUNTOS
                                                                                                            ==============================================
                                                                                                          */
    let reglas = await ReglasAsignacion.findOne({
        $and: [
            { limiteInf: { $lte: body.montoOperacion } },
            { limiteSup: { $gte: body.montoOperacion } }
        ]
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

    const puntaje = Math.round(body.montoOperacion / regla);
    let puntajeUtilizado = 0;

    /*============================================
                                                                                                                                                                            OBTENCION DE LA REGLA PARA CALCULAR EL VENCIMIENTO
                                                                                                                                                                            ==============================================
                                                                                                                                                                            */
    hoy = new Date().toISOString();
    let vencimiento = await VencimientosPuntos.findOne({
        $and: [{ inicio: { $lte: hoy } }, { fin: { $gte: hoy } }]
    });
    //se obtiene los dias de vencimiento, de acuerdo a la regla
    let dias;
    if (vencimiento) {
        dias = vencimiento._doc.duracion;
        message = 'OK';
    } else {
        dias = 30;
        message = 'Se aplico la regla por defaut';
    }

    let asignacion = moment().format('YYYY' - 'MM' - 'DD');
    let vence = moment()
        .add(dias, 'days')
        .format('YYYY' - 'MM' - 'DD');
    console.log(vence);
    /* console.log(dias);
                                                                                                                                                console.log(puntaje);
                                                                                                                                                console.log(vencimiento); */

    let bolsaPuntos = new BolsaPuntos({
        idCliente: body.idCliente,
        fechaAsignacion: asignacion,
        fechaCaducidad: vence,
        puntajeAsignado: puntaje,
        puntajeUtilizado: puntajeUtilizado,
        saldoPuntos: puntaje,
        montoOperacion: body.montoOperacion
    });
    console.log(Math.round(5 / 2));
    bolsaPuntos.save((err, bolsaPuntosDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            bolsaPuntos: bolsaPuntosDB,
            message
        });
    });
}

function getBolsaPuntos(req, res) {
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
}

async function getBolsaPuntosVen(req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);
    let hoy = new Date().toISOString();

    await BolsaPuntos.find({ fechaCaducidad: { $lt: hoy } })
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
            if (bolsaPuntos == null) {
                return res.status(204).json({
                    ok: true,
                    bolsaPuntos,
                    message: 'No hay bolsas vencidas'
                });
            }

            BolsaPuntos.countDocuments({ fechaCaducidad: { $lt: hoy } },
                (err, total) => {
                    res.json({
                        ok: true,
                        bolsaPuntos,
                        total
                    });
                }
            );
        });
}

async function getBolsaPuntosVigentes(req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);
    let hoy = new Date().toISOString();

    await BolsaPuntos.find({ fechaCaducidad: { $gte: hoy } })
        .sort({ fechaCaducidad: 1 })
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
            if (bolsaPuntos == null) {
                return res.status(204).json({
                    ok: true,
                    bolsaPuntos,
                    message: 'No hay bolsas vigentes'
                });
            }

            BolsaPuntos.countDocuments({ fechaCaducidad: { $gte: hoy } },
                (err, total) => {
                    res.json({
                        ok: true,
                        bolsaPuntos,
                        total
                    });
                }
            );
        });
}

function getBolsaPuntosIdCliente(req, res) {
    let termino = req.params.termino;

    let hoy = new Date();

    BolsaPuntos.find({
        idCliente: termino
    }).exec((err, bolsaPuntosDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
                message: 'No hay bolsa para ese cliente'
            });
        }
        res.json({
            ok: true,
            bolsaPuntos: bolsaPuntosDB
        });
    });
}

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
//NO FUNCIONA AUN
function getBolsaPuntosDias(req, res) {
    let termino = req.params.termino;

    console.log(termino);
    let hoy = new Date();

    let vence = addDays(hoy, termino);
    console.log(vence);
    //console.log('Vencimiento 1', hoy.getDate());

    //hoy.setDate(hoy.getDate() + termino);

    //hoy.toISOString();
    console.log('Vencimiento 2', hoy.getDate());

    BolsaPuntos.findOne({
        fechaCaducidad: { $eq: hoy }
    }).exec((err, bolsaPuntosDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
                message: 'No hay bolsa a vencer en el tiempo solicitado'
            });
        }
        res.json({
            ok: true,
            bolsaPuntos: bolsaPuntosDB
        });
    });
}

///POR CLIENTE

function getBolsaPuntosClienteVen(req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);
    let hoy = new Date().toISOString();

    let cliente = req.params.cliente;

    BolsaPuntos.find({ fechaCaducidad: { $lt: hoy }, idCliente: cliente })
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
            if (bolsaPuntos == null) {
                return res.status(204).json({
                    ok: true,
                    bolsaPuntos,
                    message: 'No hay bolsas vencidas'
                });
            }

            BolsaPuntos.countDocuments({ fechaCaducidad: { $lt: hoy } },
                (err, total) => {
                    res.json({
                        ok: true,
                        bolsaPuntos,
                        total
                    });
                }
            );
        });
}

async function getBolsaPuntosClienteVigentes(req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);
    let hoy = new Date().toISOString();

    let cliente = req.params.cliente;

    await BolsaPuntos.find({ fechaCaducidad: { $gte: hoy }, idCliente: cliente })
        .sort({ fechaCaducidad: 1 })
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
            if (bolsaPuntos == null) {
                return res.status(204).json({
                    ok: true,
                    bolsaPuntos,
                    message: 'No hay bolsas vigentes'
                });
            }

            BolsaPuntos.countDocuments({ fechaCaducidad: { $gte: hoy } },
                (err, total) => {
                    res.json({
                        ok: true,
                        bolsaPuntos,
                        total
                    });
                }
            );
        });
}

module.exports = {
    postBolsaPuntos,
    getBolsaPuntos,
    getBolsaPuntosVen,
    getBolsaPuntosVigentes,
    getBolsaPuntosIdCliente,
    getBolsaPuntosDias,
    // por cliente
    getBolsaPuntosClienteVen,
    getBolsaPuntosClienteVigentes
};