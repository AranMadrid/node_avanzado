'use strict';

const mongoose = require('mongoose');

const anuncioSchema = mongoose.Schema({
    name: { type: String, index: true },
    sell: { type: Boolean, index: true },
    price: { type: Number, index: true },
    photo: { type: String, unique: true },
    thumbnail: String,
    tags: { type: [String], index: true },
    detail: String,
    createdAt: Date,
    updatedAt: Date,

});

anuncioSchema.statics.lista = function(filter, limit, skip, sort, fields) {

    const query = Anuncio.find(filter);
    query.limit(limit);
    query.skip(skip);
    query.sort(sort);
    query.select(fields);
    return query.exec();
};

const Anuncio = mongoose.model('Anuncio', anuncioSchema);
module.exports = Anuncio;