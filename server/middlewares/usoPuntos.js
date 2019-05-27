const ConceptoPuntos = require('../models/conceptoPuntos');
const BolsaPuntos = require('../models/bolsaPuntos');
const BolsaPut = require('../models/bolsaPuntos');
const CabeceraPuntos = require('../models/cabeceraPuntos');
const DetallePuntos = require('../models/detallesCabeceraPuntos');

const moment = require('moment');

async function postUsoPuntos(req, res) {
    let body = req.body;

    let id = body.conceptoUso;
    //Obtener concepto

    conceptoPuntosDB = await ConceptoPuntos.findById(
        id,
        (err, conceptoPuntosDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (conceptoPuntosDB == null) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'El ID de concepto no es correcto'
                    }
                });
            }
            console.log('ConceptoPuntos obtenido', conceptoPuntosDB);
        }
    );
    let idB = body.idCliente;
    //Obtener las bolsas vigentes
    let hoy = new Date().toISOString();

    let bolsaPuntos = await BolsaPuntos.find({
        idCliente: idB,
        estado: true,
        fechaCaducidad: { $gte: hoy }
    }).sort({ fechaCaducidad: 1 });
    //.populate('idCliente')

    if (!bolsaPuntos) {
        return res.status(204).json({
            ok: true,
            bolsaPuntos,
            message: 'No hay bolsas vigentes'
        });
    } else if (bolsaPuntos) console.log('Bolsas obtenidas', bolsaPuntos);
    else {
        return res.status(400).json({
            ok: false,
            err
        });
    }

    //Crear cabecera

    let fecha1 = moment().format('YYYY' - 'MM' - 'DD');

    let cabeceraPuntos = await new CabeceraPuntos({
        idCliente: body.idCliente,
        fecha: fecha1,
        puntajeUtilizado: conceptoPuntosDB.puntosRequeridos,
        conceptoUso: conceptoPuntosDB.id
    });
    var cabecera;
    cabeceraPuntosDB = cabeceraPuntos.save((err, cabeceraPuntosDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        console.log('Cabecera creada', cabeceraPuntosDB);

        cabecera = cabeceraPuntosDB.id;

        //Actualizar bolsa
        var romper = 0;
        setTimeout(function() {
            for (const bolsa of bolsaPuntos) {
                let puntos = conceptoPuntosDB.puntosRequeridos;
                //console.log(' holahola ', bolsa._doc.puntajeUtilizado);
                //let puntUtilizado = bolsa._doc.puntajeUtilizado;
                //console.log('hola si', puntUtilizado);
                let utilizado = bolsa._doc.puntajeUtilizado + puntos;
                let asignado = bolsa._doc.puntajeAsignado;
                let saldo = bolsa._doc.puntajeAsignado - utilizado;
                //console.log('puntos - utilizado - saldo', puntos, utilizado, saldo);

                //ACA ACA Obtenemos la bolsa

                //console.log('BOLSA ID PARA BUSCAR ', bolsa.id);
                let bolsaid = bolsa.id;
                //let bolsaDB = BolsaPut.findById(bolsaid);
                //console.log('BOLSA ENCONTRADA', bolsaDB);
                var bolsaNueva;
                BolsaPut.findById(bolsaid, (err, bolsaDB) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    }

                    //console.log('Bolsa encontrada', bolsaDB);
                    bolsaNueva = bolsaDB;
                    console.log('Bolsa Nueva ', bolsaNueva);
                    //SI LOS PUNTOS USADOS SON MAS QUE LOS DISPONIBLE
                    var bolsa_id;
                    if (saldo < 0) {
                        bolsaNueva.puntajeUtilizado = asignado;
                        bolsaNueva.saldoPuntos = 0;
                        bolsaNueva.estado = false;
                        let puntDetalle = utilizado - saldo;

                        console.log('SALDO 1: ', saldo);

                        bolsaNueva.save((err, bolsaGuardada) => {
                            if (err) {
                                return res.status(400).json({
                                    ok: false,
                                    err
                                });
                            } else {
                                bolsa_id = bolsaGuardada.id;
                                console.log('Bolsa Actualizada', bolsaGuardada);

                                //Crear detalle

                                let detallePuntos = new DetallePuntos({
                                    idCabecera: cabecera,
                                    puntajeUtilizado: puntDetalle,
                                    idBolsaPuntos: bolsa_id
                                });
                                detallePuntos.save((err, detallePuntosDB) => {
                                    if (err) {
                                        return res.status(500).json({
                                            ok: false,
                                            err
                                        });
                                    }
                                    console.log('Detalle creado : ', detallePuntosDB);
                                });
                            }
                        });
                    } else if (saldo >= 0) {
                        bolsaNueva.puntajeUtilizado = utilizado;
                        bolsaNueva.saldoPuntos = saldo;
                        if (saldo == 0) {
                            bolsaNueva.estado = false;
                        }
                        let puntDetalle = utilizado;

                        console.log('SALDO 2: ', saldo);

                        bolsaNueva.save((err, bolsaGuardada) => {
                            if (err) {
                                return res.status(400).json({
                                    ok: false,
                                    err
                                });
                            } else {
                                bolsa_id = bolsaGuardada.id;
                                console.log('Bolsa Actualizada', bolsaGuardada);
                                //Crear detalle
                                let detallePuntos = new DetallePuntos({
                                    idCabecera: cabecera,
                                    puntajeUtilizado: puntDetalle,
                                    idBolsaPuntos: bolsa_id
                                });
                                console.log('hola', cabecera);
                                console.log('hola', bolsa);
                                detallePuntos.save((err, detallePuntosDB) => {
                                    if (err) {
                                        return res.status(500).json({
                                            ok: false,
                                            err
                                        });
                                    }

                                    console.log('Detalle creado 2: ', detallePuntosDB);

                                    return;
                                });
                            }
                        });
                        romper = 1;
                    }
                    //fin de la busqueda bolsa flecha
                });
                if (romper == 1) break;
            }
        }, 4000);

        res.json({
            ok: true,
            cabecera: cabeceraPuntosDB
        });
    });
}
// Consultas de la cabecera
function getUsoPuntosIdCliente(req, res) {
    let termino = req.params.termino;
    CabeceraPuntos.find({
        idCliente: termino
    }).exec((err, cabeceraPuntosDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!cabeceraPuntosDB) {
            return res.status(204).json({
                ok: false,
                err,
                message: 'No se usaron puntos'
            });
        }
        res.json({
            ok: true,
            cabecera: cabeceraPuntosDB
        });
    });
}

function getUsoPuntosConcepto(req, res) {
    let termino = req.params.termino;

    CabeceraPuntos.find({
        conceptoUso: termino
    }).exec((err, cabeceraPuntosDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!cabeceraPuntosDB) {
            return res.status(204).json({
                ok: false,
                err,
                message: 'No se usaron puntos en estos conceptos'
            });
        }
        console.log(cabeceraPuntosDB);
        res.json({
            ok: true,
            cabecera: cabeceraPuntosDB
        });
    });
}

function getUsoPuntosFecha(req, res) {
    let desde = req.params.desde;
    let hasta = req.params.hasta;

    fdesde = new Date(desde).toISOString();
    fhasta = new Date(hasta).toISOString();

    console.log(desde, hasta, fdesde);

    /*    { limiteInf: { $lte: body.montoOperacion } },
                    { limiteSup: { $gte: body.montoOperacion } } */

    CabeceraPuntos.find({
            $and: [{ fecha: { $gte: desde } }, { fecha: { $lte: hasta } }]
        })
        .populate('idCliente')
        .populate('conceptoUso')
        .exec((err, cabeceraPuntosDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!cabeceraPuntosDB) {
                return res.status(204).json({
                    ok: false,
                    err,
                    message: 'No se usaron puntos en estos conceptos'
                });
            }
            console.log(cabeceraPuntosDB);
            res.json({
                ok: true,
                cabecera: cabeceraPuntosDB
            });
        });
}

// Consultas de detalles

module.exports = {
    //cabecera
    postUsoPuntos,
    getUsoPuntosIdCliente,
    getUsoPuntosConcepto,
    getUsoPuntosFecha

    //detalles
};