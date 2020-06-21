'use strict';

require('dotenv').config()

const conn = require('./lib/connectMongoose');

const Anuncio = require('./models/Anuncio');

const Tag = require('./models/Tag');

const Usuario = require('./models/Usuario');

conn.once('open', async() => {
    try {
        await initAnuncios();
        await initTags();
        await initUsuarios();
        conn.close();
    } catch (err) {
        console.error('Hubo un error en la inicialización de las colecciones:', err);
        process.exit(1);
    }
});

async function initAnuncios() {
    const date = new Date();
    const detailLoren = "Si estás desarrollando un servicio que se va haciendo popular o los niveles de acceso a base de datos son cada vez más altos, empezarás a notar que tu base de datos está siendo atacada por un tráfico creciente y tu servidor esté sufriendo por los altos niveles de stress y te podrías ver en la necesidad de actualizar tu infraestructura para soportar la demanda";
    await Anuncio.deleteMany();
    await Anuncio.insertMany([
        { name: 'BicicletaW', sell: true, price: 230.15, photo: 'bicicleta-rodars-1000W.jpg', tags: ['lifestyle', 'motor'], detail: detailLoren, createdAt: date, updatedAt: date },
        { name: 'iPhone', sell: true, price: 50.00, photo: 'iPhone-11-pro.jpg', tags: ['lifestyle', 'mobile'], detail: detailLoren, createdAt: date, updatedAt: date },
        { name: 'Aston Martin', sell: true, price: 225630.55, photo: 'aston-martin-dbs.jpg', tags: ['lifestyle', 'motor'], detail: detailLoren, createdAt: date, updatedAt: date },
    ]);
}


async function initTags() {
    await Tag.deleteMany();
    await Tag.insertMany([
        { name: 'lifestyle' },
        { name: 'mobile' },
        { name: 'motor' },
    ]);
}


async function initUsuarios() {
    await Usuario.deleteMany();
    await Usuario.insertMany([{
        email: 'user@example.es',
        password: await Usuario.hashPassword('1234'),
    }, ]);
}