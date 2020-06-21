'use strict';

const mongoose = require('mongoose');

const conn = mongoose.connection;

const i18n = require('./i18nConfigure')();

conn.on('open', () => {
    console.log(i18n.__('Connected to MongoDB in'), conn.name);
});

conn.on('error', (err) => {
    console.error(i18n.__('Connection error'), err);

    process.exit(1);
});

mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

module.exports = conn;