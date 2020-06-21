'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

class LoginController {

    index(req, res, next) {
        res.locals.email = '';
        res.locals.error = '';
        res.render('login');
    }

    async post(req, res, next) {
        try {

            const email = req.body.email;
            const password = req.body.password;

            console.log('ENTRO EN POST /login de LoginController.js');

            const usuario = await Usuario.findOne({ email: email });

            if (!usuario || !await bcrypt.compare(password, usuario.password)) {
                res.locals.email = email;
                res.locals.error = res.__('Invalid credentials');
                res.render('login');
                return;
            }

            req.session.authUser = {
                _id: usuario._id
            };

            res.redirect('/');

        } catch (err) {
            next(err);
        }
    }


    logout(req, res, next) {
        req.session.regenerate(err => {
            if (err) {
                next(err);
                return;
            }

            res.redirect('/login');
        });
    }

    async postJWT(req, res, next) {
        try {

            const email = req.body.email;
            const password = req.body.password;

            const usuario = await Usuario.findOne({ email: email });

            if (!usuario || !await bcrypt.compare(password, usuario.password)) {

                const error = new Error(res.__('Invalid credentials'));
                error.status = 401;
                next(error);
                return;
            }

            const token = jwt.sign({ _id: usuario._id }, process.env.JWT_SECRET, {
                expiresIn: '7d'
            });


            res.json({ token: token });

        } catch (err) {
            next(err);
        }
    }

}

module.exports = new LoginController();