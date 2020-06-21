var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/images');
    },
    filename: function(req, file, cb) {
        const projectRoute = `${__dirname}`.split('routes')[0];
        const imagesRoute = `${projectRoute}\\public\\images\\`;
        let auxFile = `${imagesRoute}\\${file.originalname}`;

        for (let i = 0; i < 10; i++) {
            auxFile = auxFile.replace("\\\\", "\\");
        }

        let image = '';
        const fs = require('fs');
        fs.access(auxFile, fs.constants.F_OK, (err) => {
            if (!err) {
                console.log(`Not valid (${auxFile}). The filename ${file.originalname} already exists`);
                const err = new Error(`Not valid (${file.originalname}). The filename already exists`);
                err.status = 422;
                image = 'noImage.jpg';
                cb(err, image);
            } else {
                image = file.originalname;
                cb(null, file.originalname);
            }

        });

    },
});

const upload = multer({ storage });

var app = express();

require('./lib/connectMongoose');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').__express);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.locals.title = 'NodePOP';
const i18n = require('./lib/i18nConfigure')();
app.use(i18n.init);
console.log(i18n.__('Welcome to'), app.locals.title);

const loginController = require('./routes/LoginController');
const jwtAuth = require('./lib/JwtAuth');
app.use('/api/v1/anuncios', upload.single('photo'), jwtAuth(), require('./routes/api/v1/anuncios'));
app.use('/api/v1/loginJWT', loginController.postJWT);

app.use('/api/v1/tags', require('./routes/api/v1/tags'));

app.use(session({
    name: 'nodepop-session',
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 2,
    }
}));

const sessionAuth = require('./lib/SessionAuth');


app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

app.get('/', sessionAuth(['admin']), require('./routes/index'));
app.use('/tags', require('./routes/tags'));
app.use('/users', require('./routes/users'));
app.use('/change-locale', require('./routes/change-locale'));

app.get('/login', loginController.index);
app.post('/login', loginController.post);
app.get('/logout', loginController.logout);

app.use(function(req, res, next) {
    next(createError(404));
});

app.use(function(err, req, res, next) {
    if (err.array) {
        err.status = 422;
        const errInfo = err.array({ onlyFirstError: true })[0];
        err.message = isAPIRequest(req) ? { message: 'Not valid', errors: err.mapped() } :
            `El parámetro ${errInfo.param} ${errInfo.msg}`;
    }

    res.status(err.status || 500);

    if (isAPIRequest(req)) {
        res.json({ error: err.message });
        return;
    }


    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.render('error');
});

function isAPIRequest(req) {

    return req.originalUrl.startsWith('/api/');
}

module.exports = app;