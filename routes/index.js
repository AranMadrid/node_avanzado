'use strict'

var express = require('express');
var router = express.Router();
const api = require('./../public/javascripts/apiCalls');
const { getAds, getTags } = api();

const Anuncio = require('../models/Anuncio');
const Tag = require('../models/Tag');


router.get('/', async function(req, res, next) {
    try {
        const name = req.query.name;
        const sell = req.query.sell;
        const price = req.query.price;
        const tags = req.query.tags;
        const limit = parseInt(req.query.limit || 100);
        const skip = parseInt(req.query.skip);
        const sort = req.query.sort;
        let fields = req.query.fields;
        let filter = {};
        let isIncorrect = false;

        (typeof fields === 'undefined') ? fields = '-__v': fields = '-__v';

        if (typeof name !== 'undefined') {
            filter.name = { $regex: '^' + name, $options: 'i' };
        }

        if (typeof sell !== 'undefined') {
            if (sell !== 'true' && sell !== 'false' && sell !== '1' && sell !== '0') {
                isIncorrect = true;
            }
            filter.sell = sell;
        }


        if (typeof price !== 'undefined') {
            const regExpNumbers = new RegExp(/^[0-9]+(.[0-9]+)?$/);
            const rango = price.split('-');
            if (rango.length === 1) {
                (regExpNumbers.test(price) && price.indexOf(',') === -1) ? filter.price = parseFloat(price): isIncorrect = true;
            } else if (rango.length === 2) {
                if (price.startsWith('-', 0)) {
                    (regExpNumbers.test(rango[1]) && rango[1].indexOf(',') === -1) ? filter.price = { $lte: parseFloat(rango[1]) }: isIncorrect = true;
                } else {
                    if (!rango[1]) {
                        (regExpNumbers.test(rango[0]) && rango[0].indexOf(',') === -1) ? filter.price = { $gte: parseFloat(rango[0]) }: isIncorrect = true;
                    } else {
                        ((regExpNumbers.test(rango[0]) && rango[0].indexOf(',') === -1) && (regExpNumbers.test(rango[1]) && rango[1].indexOf(',') === -1)) ? filter.price = { $gte: parseFloat(rango[0]), $lte: parseFloat(rango[1]) }: isIncorrect = true;
                    }
                }
            } else {
                isIncorrect = true;
            }
        }

        if (typeof tags !== 'undefined') {
            let arrayTags;
            if (tags.indexOf(' ') != -1)
                arrayTags = tags.split(' ');
            else if (tags.indexOf(',') != -1)
                arrayTags = tags.split(',');
            else
                arrayTags = tags;
            filter.tags = { "$in": arrayTags };
        }

        let ads;

        if (isIncorrect) {
            ads = [];
        } else {
            ads = await Anuncio.lista(filter, limit, skip, sort, fields);
        }

        filter = {};
        const tagss = await Tag.lista(filter, '', '', 'name', '', 'name');

        res.render('index', {
            title: 'NodePOP',
            data: [ads, tagss],
        });

    } catch (err) {
        next(err);
    }

});

module.exports = router;