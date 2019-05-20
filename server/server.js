require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(require('./routes/cliente'));
app.use(require('./routes/reglaAsignacion'));
app.use(require('./routes/vencimientoPuntos'));
app.use(require('./routes/conceptoPuntos'));
app.use(require('./routes/bolsaPuntos'));

mongoose.connect(
    'mongodb://localhost:27017/canjeodepuntos', { useNewUrlParser: true },
    (err, res) => {
        if (err) throw err;

        console.log('Base de datos funcionando');
    }
);

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});